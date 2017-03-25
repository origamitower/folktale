//---------------------------------------------------------------------
//
// This source file is part of the Meta:Magical project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//---------------------------------------------------------------------

// --[ Dependencies ]--------------------------------------------------
const marked = require('marked');
const _      = require('hyperscript');
const path   = require('path');
const fs     = require('fs');


// --[ Helpers ]-------------------------------------------------------
const toId = (x) => x.toLowerCase().replace(/[^\w]+/g, '-');

const filename = (entity) => `${entity.path.join('.')}.html`;

const link = (from, to) => filename(to);

const entries = (object) => Object.keys(object).map(key => [key, object[key]]);

const read = (filename) => fs.readFileSync(filename);

const compact = (object) => {
  let result = Object.create(null);

  Object.keys(object).forEach(key => {
    if (object[key] != null)  result[key] = object[key];
  });

  return result;
};

const markdownToHtml = (text) => {
  let element = _('div');
  element.innerHTML = marked(text || '');
  return element;
};

const renderLocation = (location) => [
  'Defined in', location.filename,
  location.start ?  `at line ${location.start.line}, column ${location.start.column}` 
  : /* else */      null
].filter(x => x !== null).join(' ');

const source = (source, location) =>
  _('div.source-code',
    _('h2.section-title#source-code', 'Source Code'),
    _('div.source-location',
      location ? renderLocation(location) : ''),
    _('pre.source-code', _('code.language-javascript', source))
  );

const renderMember = (entity, member, references) => {
  const page = references.get(member.reference);
  const meta = member.meta;

  return _(`div.member${meta.deprecated ? '.deprecated' : ''}`,
    page          ? _('a.member-name', { href: link(entity, page) }, member.representation)
    : /* else */    _('div.member-name.no-link', member.representation),

    _('div.doc-summary', 
      meta.summary ? markdownToHtml(meta.summary) : ''),

    _('div.special-tags',
      meta.deprecated ? _('span.tagged.deprecated', 'Deprecated') : '',
      meta.isRequired ? _('span.tagged.required', 'Abstract') : '',
      meta.stability === 'experimental' ? _('span.tagged.experimental', 'Experimental') : '',
      member.isInherited ? _('span.tagged.inherited', 'Inherited') : ''
    )
  );
};

const renderMembers = (entity, references) =>
  entity.isClass ?  renderClassMembers(entity, references)
: /* otherwise */   renderObjectMembers(entity, references);


const renderClassMembers = (entity, references) =>
  [
    _('h2.section-title#properties', 'Static properties'),
    ...renderObjectMembers(entity, references, 4),
    _('h2.section-title#instance-properties', 'Instance (prototype) properties'),
    ...renderObjectMembers(entity.prototype, references, 4)
  ];


const renderObjectMembers = (entity, references, level = 3) =>
  entity.properties.map(({ category, members }) =>
    _('div.member-category',
      _(`h${level}.category`, { id: `cat-${toId(category)}` }, category),
      _('div.member-list',
        members.map(member => renderMember(entity, member, references))
      )
    )
  );

const renderDeprecation = ({ version, reason }) =>
  _('div.deprecation-section',
    _('strong.deprecation-title', `Deprecated since ${version}`),
    markdownToHtml(reason)
  );

const metaSection = (title, data) =>
  _('div.meta-section',
    title ? _('strong.meta-section-title', title) : '',
    entries(data).map(([key, value]) =>
      _('div.meta-field',
        _('strong.meta-field-title', key),
        _('div.meta-field-value', value)
      )
    )
  );

const documentationToc = (text) =>
  marked.lexer(text || '')
        .filter(x => x.type === 'heading' && x.depth === 2)
        .map(x => ({
          rawTitle: x.text,
          title: markdownToHtml(x.text),
          anchor: `#${toId(x.text)}`
        }));

const memberToc = (properties) =>
  properties.map(({ category }) => ({ 
    title: category, 
    anchor: `#cat-${toId(category)}`
  }));

const tableOfContents = (list, level = 1) =>
  _(`ul.toc-list.level-${level}`,
    list.map(item =>
      _('li.toc-item',
        item.anchor  ? _('a', { href: item.anchor, title: item.rawTitle }, item.title)
        : /* else */   _('span.no-anchor', item.title),

        item.children ? tableOfContents(item.children, level + 1) : ''
      )
    )
  );

const asList = (elements) =>
  _('ul.meta-list',
    elements.map(e => _('li', e))
  );

const typeDefinition = (type, { links = {} }) =>
  !type ?     ''
: /* else */ _('div.type-definition-container',
    _('div.type-title-container',
      _('strong.type-title', 'Type'),
      links.typeNotation ?  _('a.info', { href: links.typeNotation }, '(what is this?)')
      : /* else */                   ''
    ),
    _('pre.type', _('code.language-haskell', (type || '').trimRight()))
  )

// --[ Implementation ]------------------------------------------------
const render = (entity, references, options) => {
  return _('div#content-wrapper',
    _('div#content-panel',
      _('h1.entity-title', entity.name || '(Anonymous)'),
      _('div.highlight-summary', markdownToHtml(entity.summary)),
      entity.signature || entity.type ?
        _('div.definition',
          _('h2#signature.section-title', 'Signature'),
          _('div.signature', entity.signature || ''),
          _('div.type-definition',
            typeDefinition(entity.type, options)
          )
        )
      : '',
      entity.deprecated ? renderDeprecation(entity.deprecated) : '',
      _('h2.section-title', 'Documentation'),
      _('div.documentation',
        markdownToHtml(entity.documentation)
      ),
      _('div.members',
        entity.isClass ? '' : _('h2.section-title#properties', 'Properties'), 
        ...renderMembers(entity, references)),
      entity.source ? source(entity.source, entity.location) : ''
    ),
    _('div#meta-panel',
      metaSection(null, compact({
        'Stability': entity.stability,
        'Since':     entity.since,
        'Licence':   entity.licence,
        'Module':    entity.module,
        'Platforms': entity.platforms ? asList(entity.platforms) : null
      })),

      _('div.table-of-contents',
        _('div.meta-section-title', 'On This Page'),
        tableOfContents([
          entity.signature || entity.type ? {
            title: 'Signature',
            anchor: '#signature'
          } : null,
          {
            title: 'Documentation',
            children: documentationToc(entity.documentation)
          },
          {
            title: 'Properties',
            anchor: '#properties',
            children: memberToc(entity.properties)
          },
          entity.isClass ? { 
            title: 'Instance properties',
            anchor: '#instance-properties',
            children: memberToc(entity.prototype.properties)
          } : null,
          entity.source ? { title: 'Source Code', anchor: '#source-code' } : null
        ].filter(Boolean))
      ),

      metaSection('Authors', compact({
        'Copyright': entity.copyright,
        'Authors': entity.authors ? asList(entity.authors) : null,
        'Maintainers': entity.maintainers ? asList(entity.maintainers) : null
      }))
    )
  );
};

const wrapPage = (title, content, options) => {
  const titleElement = _('title', title);
  const docTitle = _('div.doc-title',
    _('a', { href: options.rootPage }, options.documentationTitle)
  );
  const cssElement = _('link', {
    rel:  'stylesheet',
    href: 'style.css'
  });

  return `
<!DOCTYPE html>
<html>
  <head>
    ${titleElement.outerHTML}
    <link rel="stylesheet" href="prism.css">
    ${cssElement.outerHTML}
  </head>
  <body>
    <div id="header">
      ${docTitle.outerHTML}
    </div>
    ${content.outerHTML}
    <script>
void function() {
  var xs = document.querySelectorAll('.documentation pre code');
  for (var i = 0; i < xs.length; ++i) {
    xs[i].className = 'language-javascript code-block';
  }
}()
    </script>
    <script src="prism.js"></script>
  </body>
</html>`;
};


const toHTML = (entities, options) => {
  const references = new Map(entities.map(x => [x.id, x]));
  const resources = path.join(__dirname, '../../resources/html');
  const css = read(options.cssPath || path.join(resources, 'default-theme.css'));

  return entities.map(entity => ({
    filename: filename(entity),
    content:  wrapPage(entity.name, render(entity, references, options), options)
  })).concat([
    {
      filename: 'style.css',
      content:  css
    },
    {
      filename: 'prism.css',
      content: read(path.join(resources, 'static/prism.css'))
    },
    {
      filename: 'prism.js',
      content: read(path.join(resources, 'static/prism.js'))
    }
  ]);
};

// --[ Exports ]-------------------------------------------------------
module.exports = toHTML;
