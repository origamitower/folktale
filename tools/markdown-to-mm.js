//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

// This tool converts special Markdown files to the JS files that
// provide documentation information for Meta:Magical. This allows
// documentation to stay out of source files, and also allows us to
// support translating documentation to other languages.
const yaml = require('js-yaml');
const marked = require('marked');
const template = require('babel-template');
const parseJs = require('babylon').parse;
const t = require('babel-types');
const generateJs = require('babel-generator').default;
const fs = require('fs');
const path = require('path');


// --[ Helpers ]-------------------------------------------------------
const match = ([tag, payload], pattern) => pattern[tag](payload);

const append = (list, item) =>
  item != null ? [...list, item]
: /* _ */        list;

const parseJsExpr = (source) => {
  const ast = parseJs(source);
  t.assertExpressionStatement(ast.program.body[0]);
  return ast.program.body[0].expression;
};

const pairs = (object) =>
  Object.keys(object).map(key => [key, object[key]]);

const raise = (error) => {
  throw error;
};

const isString = (value) => typeof value === 'string';

const isBoolean = (value) => typeof value === 'boolean';

const isNumber = (value) => typeof value === 'number';

const isObject = (value) => Object(value) === value;

// --[ Parser ]--------------------------------------------------------
const classifyLine = (line) =>
  /^\@annotate:/.test(line) ? ['Entity', line.match(/^\@annotate:\s*(.+)/m)[1]]
: /^---+\s*$/.test(line)    ? ['Separator']
: /* otherwise */             ['Line', line];


const parse = (source) =>
  append(source.split(/\r\n|\n\r|\r|\n/).map(classifyLine), ['EOF'])
    .reduce((ctx, node, i) => match(node, {
      Entity(ref) {
        return {
          annotation: true,
          current: { ref, meta: '', doc: '' },
          ast: append(ctx.ast, ctx.current)
        };
      },

      Separator() {
        if (!ctx.current) {
          throw new Error(`Annotation separator found without a matching entity at line ${i + 1}`);
        }
        return {
          annotation: false,
          current: ctx.current,
          ast: ctx.ast
        };
      },

      EOF() {
        return {
          annotation: false,
          current: null,
          ast: append(ctx.ast, ctx.current)
        };
      },

      Line(line) {
        if (!ctx.current) {
          throw new Error(`Documentation found before an entity annotation at line ${i + 1}`);
        }
        if (ctx.annotation) {
          const { ref, meta, doc } = ctx.current;
          return {
            annotation: true,
            current: { ref, meta: meta + '\n' + line, doc },
            ast: ctx.ast
          };
        } else {
          const { ref, meta, doc } = ctx.current;
          return {
            annotation: false,
            current: { ref, meta, doc: doc + '\n' + line },
            ast: ctx.ast
          };
        }
      }
    }), { 
      current: null, 
      annotation: false, 
      ast: [] 
    }).ast;


// --[ Compiler transformations ]--------------------------------------
const analyse = (entities) =>
  entities.map(parseMeta);


const parseMeta = (entity) => {
  let meta = yaml.safeLoad(entity.meta) || {};
  meta.documentation = entity.doc;
  return {
    ref: entity.ref,
    meta
  };
};


// --[ Code generation ]-----------------------------------------------
const annotateEntity = template(
  `meta.for(ENTITY).update(OBJECT)`
);


class Raw {
  constructor(value) {
    this.value = value;
  }
}

const lazy = (expr) => 
  t.functionExpression(
    null,
    [],
    t.blockStatement([
      t.returnStatement(expr)
    ])
  );

const specialParsers = {
  '~belongsTo'(value) {
    const ast = parse(value);
    t.assertExpressionStatement(ast.program.body[0]);

    return lazy(ast.program.body[0].expression);
  }
};

const parseSpecialProperty = (value, key) =>
  specialParsers[key](value);

const isSpecial = (value, key) => key && key in specialParsers;

const objectToExpression = (object) =>
  t.objectExpression(
    pairs(object).map(pairToProperty)
  );

const pairToProperty = ([key, value]) =>
  t.objectProperty(
    t.stringLiteral(key),
    valueToLiteral(value, key)
  );

const valueToLiteral = (value, key) =>
  value instanceof Raw  ?  value.value
: Array.isArray(value)  ?  t.arrayExpression(value.map(x => valueToLiteral(x)))
: isSpecial(value, key) ?  parseSpecialProperty(value, key)
: isString(value)       ?  t.stringLiteral(value)
: isBoolean(value)      ?  t.booleanLiteral(value)
: isNumber(value)       ?  t.numericLiteral(value)
: isObject(value)       ?  objectToExpression(value)
: /* otherwise */          raise(new TypeError(`Type of property not supported: ${value}`));


const generate = (entities) =>
  generateJs(
    t.program(
      entities.map(generateEntity)
    )
  ).code;

const generateEntity = (entity) =>
  annotateEntity({
    ENTITY: parseJsExpr(entity.ref),
    OBJECT: valueToLiteral(entity.meta)
  });


// --[ Main ]----------------------------------------------------------
if (process.argv.length < 3) {
  throw new Error('Usage: node markdown-to-mm.js <INPUT>');
}
const input = process.argv[2];
const source = fs.readFileSync(input, 'utf8');
console.log(generate(analyse(parse(source))));
