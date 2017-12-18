# Seamlessly embed markdown into JSX
This library provides React component for embeding markdown into JSX using 
[tagged template literals](http://wesbos.com/tagged-template-literals) ES6 feature.

## Usage 
```jsx
import React from 'react'
import Markdown from 'jsx-markdown'

class MyComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = { counter: 0 }
  }

  render () {
    return Markdown`
      # Hello world

      This is markdown paragraph. You can 
      inline JavaScript variables as shown below.

      Counter is equal ${this.state.counter}
      
      You can even render React components:
      ${<button onClick={() => this.increment()}>
        +1
      </button>}
    `
  }

  increment () {
    this.setState({ 
      counter: this.state.counter + 1 
    })
  }
} 
```

## Remarks
1. HTML tags are not supported in markdown. If you need to render HTML use the following syntax:
```jsx
Markdown`
  This is markdown. ${<div> This is custom HTML</div>}
`
```
2. Indentation is removed automatically. It means the following two are equivalent:
```jsx
Markdown`
First line
Anothe line
`
```

```jsx
Markdown`
      First line
      Anothe line
`
```

3. Because backtick character has to be escaped in template literals the component introduces some special syntax for convenience. Two quotation marks in a row are replaced with single backtick and three quotatiom marks in a row are repaced with three backticks.

```jsx
Markdown`
  ''variable'' is equivalent to \`variable\`.
`
```

```jsx
Markdown`
  '''js
    console.log(1)
  '''

  is equivalent to

  \`\`\`js
    console.log(1)
  \`\`\`
`
```

## Project status
This component is used as a convenient markdown formatting in my another project. Functionalities are added as needed. It means at the current stage this component doesn't handle some basic markdown formatting.

If you miss some functionality feel free to raise an issue or create a pull request.

## License
https://opensource.org/licenses/MIT