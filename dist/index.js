'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _stripIndent = require('strip-indent');

var _stripIndent2 = _interopRequireDefault(_stripIndent);

var _remark = require('remark');

var _remark2 = _interopRequireDefault(_remark);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sanitiseHref = function sanitiseHref(href) {
  var parsed = _url2.default.parse(href);
  return parsed.protocol.indexOf('javascript') === -1 ? parsed.href : null;
};

exports.default = function (texts) {
  for (var _len = arguments.length, objects = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    objects[_key - 1] = arguments[_key];
  }

  var markup = '';
  for (var i = 0; i < Math.max(texts.length, objects.length); i++) {
    if (i < texts.length) markup += texts[i].replace(/'''/g, '```').replace(/''/g, '`');
    if (i < objects.length) markup += '<react-el-' + i + '/>';
  }
  markup = (0, _stripIndent2.default)(markup);

  function react() {
    this.Compiler = function (tree) {
      return transform(tree);
    };

    function transform(tree) {
      var children = function children() {
        if (!tree.children) {
          return;
        }

        return tree.children.map(function (child, i) {
          return _react2.default.createElement(
            _react2.default.Fragment,
            { key: i },
            transform(child)
          );
        });
      };

      switch (tree.type) {
        case 'root':
          return _react2.default.createElement(
            _react2.default.Fragment,
            null,
            children()
          );
        case 'text':
          return tree.value;
        case 'heading':
          return _react2.default.createElement('h' + tree.depth, {}, children());
        case 'paragraph':
          return _react2.default.createElement(
            'p',
            null,
            children()
          );
        case 'inlineCode':
          return _react2.default.createElement(
            'code',
            null,
            tree.value
          );
        case 'blockquote':
          return _react2.default.createElement(
            'blockquote',
            null,
            children()
          );
        case 'code':
          return _react2.default.createElement(
            'pre',
            { lang: tree.lang },
            tree.value
          );
        case 'html':
          {
            var match = tree.value.trim().match(/^<react-el-(\d+)\/>$/);
            return match ? objects[match[1]] : _react2.default.createElement(_react2.default.Fragment, null);
          }
        case 'list':
          return tree.ordered ? _react2.default.createElement(
            'ol',
            null,
            children()
          ) : _react2.default.createElement(
            'ul',
            null,
            children()
          );
        case 'listItem':
          return _react2.default.createElement(
            'li',
            null,
            children()
          );
        case 'break':
          return _react2.default.createElement('br', null);
        case 'thematicBreak':
          return _react2.default.createElement('hr', null);
        case 'emphasis':
          return _react2.default.createElement(
            'em',
            null,
            children()
          );
        case 'strong':
          return _react2.default.createElement(
            'strong',
            null,
            children()
          );
        case 'delete':
          return _react2.default.createElement(
            'del',
            null,
            children()
          );
        case 'link':
          return _react2.default.createElement(
            'a',
            { href: sanitiseHref(tree.url), title: tree.title },
            children()
          );
        case 'image':
          return _react2.default.createElement(
            'img',
            { src: sanitiseHref(tree.url), title: tree.title, alt: tree.alt },
            children()
          );
      }

      return _react2.default.createElement(
        'div',
        null,
        'Unknown type: ',
        tree.type,
        '. Contact ',
        _react2.default.createElement(
          'code',
          null,
          'jsx-markdown'
        ),
        ' authors to support it.'
      );
    }
  }

  return (0, _remark2.default)().use(react).processSync(markup).contents;
};