import React from 'react'
import stripIndent from 'strip-indent'
import remark from 'remark'
import url from 'url'

const sanitiseHref = href => {
  const parsed = url.parse(href)
  return parsed.protocol.indexOf('javascript') === -1 ? parsed.href : null
}

export default (texts, ...objects) => {
  let markup = ''
  for (var i = 0; i < Math.max(texts.length, objects.length); i++) {
    if (i < texts.length) markup += texts[i].replace(/'''/g, '```').replace(/''/g, '`')
    if (i < objects.length) markup += `<react-el-${i}/>`
  }
  markup = stripIndent(markup)

  function react () {
    this.Compiler = tree => transform(tree)

    function transform (tree) {
      const children = () => {
        if (!tree.children) {
          return
        }

        return tree.children.map((child, i) =>
          <React.Fragment key={i}>
            {transform(child)}
          </React.Fragment>
        )
      }

      switch (tree.type) {
        case 'root': return <React.Fragment>{children()}</React.Fragment>
        case 'text': return tree.value
        case 'heading': return React.createElement(`h${tree.depth}`, {}, children())
        case 'paragraph': return <p>{children()}</p>
        case 'inlineCode': return <code>{tree.value}</code>
        case 'blockquote': return <blockquote>{children()}</blockquote>
        case 'code': return <pre lang={tree.lang}>{tree.value}</pre>
        case 'html': {
          const match = tree.value.trim().match(/^<react-el-(\d+)\/>$/)
          return match ? objects[match[1]] : <React.Fragment />
        }
        case 'list': return tree.ordered ? <ol>{children()}</ol> : <ul>{children()}</ul>
        case 'listItem': return <li>{children()}</li>
        case 'break': return <br />
        case 'thematicBreak': return <hr />
        case 'emphasis': return <em>{children()}</em>
        case 'strong': return <strong>{children()}</strong>
        case 'delete': return <del>{children()}</del>
        case 'link': return <a href={sanitiseHref(tree.url)} title={tree.title}>{children()}</a>
        case 'image': return <img src={sanitiseHref(tree.url)} title={tree.title} alt={tree.alt}>{children()}</img>
      }

      return <div>Unknown type: {tree.type}. Contact <code>jsx-markdown</code> authors to support it.</div>
    }
  }

  return remark()
    .use(react)
    .processSync(markup)
    .contents
}
