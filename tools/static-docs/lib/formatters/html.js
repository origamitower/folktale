'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

//---------------------------------------------------------------------
//
// This source file is part of the Meta:Magical project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//---------------------------------------------------------------------

// --[ Dependencies ]--------------------------------------------------
var marked = require('marked');
var _ = require('hyperscript');
var path = require('path');
var fs = require('fs');

// --[ Helpers ]-------------------------------------------------------
var toId = function toId(x) {
  return x.toLowerCase().replace(/[^\w]+/g, '-');
};

var filename = function filename(entity) {
  return entity.path.join('.') + '.html';
};

var link = function link(from, to) {
  return filename(to);
};

var entries = function entries(object) {
  return Object.keys(object).map(function (key) {
    return [key, object[key]];
  });
};

var read = function read(filename) {
  return fs.readFileSync(filename);
};

var compact = function compact(object) {
  var result = Object.create(null);

  Object.keys(object).forEach(function (key) {
    if (object[key] != null) result[key] = object[key];
  });

  return result;
};

var markdownToHtml = function markdownToHtml(text) {
  var element = _('div');
  element.innerHTML = marked(text || '');
  return element;
};

var renderLocation = function renderLocation(location) {
  return ['Defined in', location.filename, location.start ? 'at line ' + location.start.line + ', column ' + location.start.column : /* else */null].filter(function (x) {
    return x !== null;
  }).join(' ');
};

var source = function source(_source, location) {
  return _('div.source-code', _('h2.section-title#source-code', 'Source Code'), _('div.source-location', location ? renderLocation(location) : ''), _('pre.source-code', _('code.language-javascript', _source)));
};

var renderMember = function renderMember(entity, member, references) {
  var page = references.get(member.reference);
  var meta = member.meta;

  return _('div.member' + (meta.deprecated ? '.deprecated' : ''), page ? _('a.member-name', { href: link(entity, page) }, member.representation) : /* else */_('div.member-name.no-link', member.representation), _('div.doc-summary', meta.summary ? markdownToHtml(meta.summary) : ''), _('div.special-tags', meta.deprecated ? _('span.tagged.deprecated', 'Deprecated') : '', meta.isRequired ? _('span.tagged.required', 'Abstract') : '', meta.stability === 'experimental' ? _('span.tagged.experimental', 'Experimental') : '', member.isInherited ? _('span.tagged.inherited', 'Inherited') : ''));
};

var renderMembers = function renderMembers(entity, references) {
  return entity.isClass ? renderClassMembers(entity, references) : /* otherwise */renderObjectMembers(entity, references);
};

var renderClassMembers = function renderClassMembers(entity, references) {
  return [_('h2.section-title#properties', 'Static properties')].concat(_toConsumableArray(renderObjectMembers(entity, references, 4)), [_('h2.section-title#instance-properties', 'Instance (prototype) properties')], _toConsumableArray(renderObjectMembers(entity.prototype, references, 4)));
};

var renderObjectMembers = function renderObjectMembers(entity, references) {
  var level = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 3;
  return entity.properties.map(function (_ref) {
    var category = _ref.category,
        members = _ref.members;
    return _('div.member-category', _('h' + level + '.category', { id: 'cat-' + toId(category) }, category), _('div.member-list', members.map(function (member) {
      return renderMember(entity, member, references);
    })));
  });
};

var renderDeprecation = function renderDeprecation(_ref2) {
  var version = _ref2.version,
      reason = _ref2.reason;
  return _('div.deprecation-section', _('strong.deprecation-title', 'Deprecated since ' + version), markdownToHtml(reason));
};

var metaSection = function metaSection(title, data) {
  return _('div.meta-section', title ? _('strong.meta-section-title', title) : '', entries(data).map(function (_ref3) {
    var _ref4 = _slicedToArray(_ref3, 2),
        key = _ref4[0],
        value = _ref4[1];

    return _('div.meta-field', _('strong.meta-field-title', key), _('div.meta-field-value', value));
  }));
};

var documentationToc = function documentationToc(text) {
  return marked.lexer(text || '').filter(function (x) {
    return x.type === 'heading' && x.depth === 2;
  }).map(function (x) {
    return {
      rawTitle: x.text,
      title: markdownToHtml(x.text),
      anchor: '#' + toId(x.text)
    };
  });
};

var memberToc = function memberToc(properties) {
  return properties.map(function (_ref5) {
    var category = _ref5.category;
    return {
      title: category,
      anchor: '#cat-' + toId(category)
    };
  });
};

var tableOfContents = function tableOfContents(list) {
  var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  return _('ul.toc-list.level-' + level, list.map(function (item) {
    return _('li.toc-item', item.anchor ? _('a', { href: item.anchor, title: item.rawTitle }, item.title) : /* else */_('span.no-anchor', item.title), item.children ? tableOfContents(item.children, level + 1) : '');
  }));
};

var asList = function asList(elements) {
  return _('ul.meta-list', elements.map(function (e) {
    return _('li', e);
  }));
};

// --[ Implementation ]------------------------------------------------
var render = function render(entity, references, options) {
  return _('div#content-wrapper', _('div#content-panel', _('h1.entity-title', entity.name || '(Anonymous)'), _('div.highlight-summary', markdownToHtml(entity.summary)), entity.signature || entity.type ? _('div.definition', _('h2#signature.section-title', 'Signature'), _('div.signature', entity.signature || ''), _('div.type-definition', entity.type ? _('strong.type-title', 'Type') : '', _('pre.type', _('code.language-haskell', (entity.type || '').trimRight())))) : '', entity.deprecated ? renderDeprecation(entity.deprecated) : '', _('h2.section-title', 'Documentation'), _('div.documentation', markdownToHtml(entity.documentation)), _.apply(undefined, ['div.members', entity.isClass ? '' : _('h2.section-title#properties', 'Properties')].concat(_toConsumableArray(renderMembers(entity, references)))), entity.source ? source(entity.source, entity.location) : ''), _('div#meta-panel', metaSection(null, compact({
    'Stability': entity.stability,
    'Since': entity.since,
    'Licence': entity.licence,
    'Module': entity.module,
    'Platforms': entity.platforms ? asList(entity.platforms) : null
  })), _('div.table-of-contents', _('div.meta-section-title', 'On This Page'), tableOfContents([entity.signature || entity.type ? {
    title: 'Signature',
    anchor: '#signature'
  } : null, {
    title: 'Documentation',
    children: documentationToc(entity.documentation)
  }, {
    title: 'Properties',
    anchor: '#properties',
    children: memberToc(entity.properties)
  }, entity.isClass ? {
    title: 'Instance properties',
    anchor: '#instance-properties',
    children: memberToc(entity.prototype.properties)
  } : null, entity.source ? { title: 'Source Code', anchor: '#source-code' } : null].filter(Boolean))), metaSection('Authors', compact({
    'Copyright': entity.copyright,
    'Authors': entity.authors ? asList(entity.authors) : null,
    'Maintainers': entity.maintainers ? asList(entity.maintainers) : null
  }))));
};

var wrapPage = function wrapPage(title, content, options) {
  var titleElement = _('title', title);
  var docTitle = _('div.doc-title', _('a', { href: options.rootPage }, options.documentationTitle));
  var cssElement = _('link', {
    rel: 'stylesheet',
    href: 'style.css'
  });

  return '\n<!DOCTYPE html>\n<html>\n  <head>\n    ' + titleElement.outerHTML + '\n    <link rel="stylesheet" href="prism.css">\n    ' + cssElement.outerHTML + '\n  </head>\n  <body>\n    <div id="header">\n      ' + docTitle.outerHTML + '\n    </div>\n    ' + content.outerHTML + '\n    <script>\nvoid function() {\n  var xs = document.querySelectorAll(\'.documentation pre code\');\n  for (var i = 0; i < xs.length; ++i) {\n    xs[i].className = \'language-javascript code-block\';\n  }\n}()\n    </script>\n    <script src="prism.js"></script>\n  </body>\n</html>';
};

var toHTML = function toHTML(entities, options) {
  var references = new Map(entities.map(function (x) {
    return [x.id, x];
  }));
  var resources = path.join(__dirname, '../../resources/html');
  var css = read(options.cssPath || path.join(resources, 'default-theme.css'));

  return entities.map(function (entity) {
    return {
      filename: filename(entity),
      content: wrapPage(entity.name, render(entity, references, options), options)
    };
  }).concat([{
    filename: 'style.css',
    content: css
  }, {
    filename: 'prism.css',
    content: read(path.join(resources, 'static/prism.css'))
  }, {
    filename: 'prism.js',
    content: read(path.join(resources, 'static/prism.js'))
  }]);
};

// --[ Exports ]-------------------------------------------------------
module.exports = toHTML;