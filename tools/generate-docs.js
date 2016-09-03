const Interface  = require('metamagical-interface');
const Folktale   = require('../');
const staticDocs = require('metamagical-static-docs');

const pkg  = require('../package.json');
const _    = require('hyperscript');
const path = require('path');

const entities = staticDocs.makeStatic(Interface, Folktale, 'Folktale', {
  skip: new Set([
    Function.prototype,
    Object.prototype,
    RegExp.prototype
  ]),
  skipProperties: new Set([
    Function.prototype,
    Object.prototype
  ]),
  skipUndocumented: true
});
const files = staticDocs.formatters.html(entities, {
  rootPage: 'folktale.html',
  documentationTitle: _('span.doc-title',
    _('span.product-name', 'Folktale'),
    _('span.version', `v${pkg.version}`)
  )
});
staticDocs.generate(files, {
  outputDirectory: path.join(__dirname, '../docs'),
  verbose: true
});
