//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const Interface  = require('metamagical-interface');
const Folktale   = require('../packages/base/build/annotated');
const staticDocs = require('metamagical-static-docs');
const glob       = require('glob').sync;

const pkg  = require('../packages/base/package.json');
const _    = require('hyperscript');
const path = require('path');

if (process.argv.length < 3) {
  throw new Error(`Usage: node generate-docs.js <LANGUAGE>`);
}
const lang = process.argv[2];

// Load all docs of the current language
glob(path.join(__dirname, '../annotations/build', lang, '**/*.js')).forEach(file => require(file)(Interface, Folktale));


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
  skipUndocumented: false
});
const files = staticDocs.formatters.html(entities, {
  rootPage: 'folktale.html',
  documentationTitle: _('span.doc-title',
    _('span.product-name', 'Folktale'),
    _('span.version', `v${pkg.version}`)
  ),
  navigation: [
    {
      text: 'GitHub',
      url: 'https://github.com/origamitower/folktale'
    },
    {
      text: 'Support',
      url: '/docs/support/'
    },
    {
      text: 'Contributing',
      url: '/docs/v2.3.0/contributing/'
    }
  ],
  links: {
    typeNotation: '/docs/v2.3.0/misc/type-notation/'
  }
});
staticDocs.generate(files, {
  outputDirectory: path.join(__dirname, '../docs/api/master', lang),
  verbose: true
});
