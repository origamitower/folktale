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
var uuid = require('node-uuid').v4;
var marked = require('marked');
var Maybe = require('../../..').data.maybe;

var hasOwnProperty = Object.prototype.hasOwnProperty;
var prototypeOf = Object.getPrototypeOf;
var ownProperties = Object.getOwnPropertyNames;
var descriptor = Object.getOwnPropertyDescriptor;

// --[ Helpers ]-------------------------------------------------------
var isObject = function isObject(value) {
  return Object(value) === value;
};

var dasherise = function dasherise(name) {
  return name.replace(/\W/g, '-');
};

var countNonInherentPrototypeProperties = function countNonInherentPrototypeProperties(value) {
  return ownProperties(value.prototype).filter(function (k) {
    return k !== 'constructor' || descriptor(value.prototype, k).value !== value;
  }).length;
};

var isClass = function isClass(value) {
  return typeof value === 'function' && isObject((descriptor(value, 'prototype') || {}).value) // we don't care about getters
  && countNonInherentPrototypeProperties(value) > 0;
};

var isDocumented = function isDocumented(meta) {
  return meta.get(meta.fields.documentation).map(function (_) {
    return true;
  }).getOrElse(false);
};

var paragraphOrHeading = function paragraphOrHeading(node) {
  return node.type === 'paragraph' || node.type === 'heading';
};

var summary = function summary(text) {
  var maybeParagraph = marked.lexer(text).filter(paragraphOrHeading)[0];
  if (maybeParagraph && maybeParagraph.type === 'paragraph') {
    return maybeParagraph.text;
  } else {
    return '';
  }
};

var compact = function compact(object) {
  var result = Object.create(null);

  Object.keys(object).forEach(function (key) {
    var value = object[key];
    if (!value.isNothing) {
      result[key] = value.get();
    }
  });

  return result;
};

var serialiseMeta = function serialiseMeta(meta) {
  var _ = meta.fields;

  return compact({
    copyright: meta.get(_.copyright),
    authors: meta.get(_.authors),
    maintainers: meta.get(_.maintainers),
    licence: meta.get(_.licence),
    since: meta.get(_.since),
    deprecated: meta.get(_.deprecated),
    repository: meta.get(_.repository),
    stability: meta.get(_.stability),
    homepage: meta.get(_.homepage),
    category: meta.get(_.category),
    tags: meta.get(_.tags),
    npmPackage: meta.get(_.npmPackage),
    module: meta.get(_.module),
    isModule: meta.get(_.isModule),
    isRequired: meta.get(_.isRequired),
    name: meta.get(_.name),
    location: meta.get(_.location),
    source: meta.get(_.source),
    documentation: meta.get(_.documentation),
    summary: meta.get(_.documentation).map(summary),
    signature: meta.get(_.signature),
    type: meta.get(_.type),
    throws: meta.get(_.throws),
    parameters: meta.get(_.parameters),
    returns: meta.get(_.returns),
    complexity: meta.get(_.complexity),
    platforms: meta.get(_.platforms),
    portable: meta.get(_.portable)
  });
};

var startsWith = function startsWith(substring, text) {
  return text.indexOf(substring) === 0;
};

var propertySignature = function propertySignature(name, signature) {
  return startsWith(name + '(', signature) ? signature : /* otherwise */name + ': ' + signature;
};

var propertyRepresentation = function propertyRepresentation(meta, _ref) {
  var name = _ref.name,
      value = _ref.value,
      kind = _ref.kind;
  return kind === 'getter' ? 'get ' + name : kind === 'setter' ? 'set ' + name : typeof value === 'function' ? meta.for(value).get(meta.fields.signature).map(function (sig) {
    return propertySignature(name, sig);
  }).getOrElse(name + '()') : /* otherwise */name;
};

var findDefinition = function findDefinition(object, property) {
  return hasOwnProperty.call(object, property) ? object : prototypeOf(object) != null ? findDefinition(prototypeOf(object), property) : /* otherwise */null;
};

// --[ Implementation ]------------------------------------------------
var makeStatic = function makeStatic(meta, root, name) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  var references = new Map(options.references ? options.references.entries() : []);
  var skip = options.skip || new Set();
  var skipProps = options.skipProperties || new Set();
  var result = new Map();

  var shouldSkip = function shouldSkip(object) {
    return !isObject(object) || skip.has(object) || options.skipUndocumented && !isDocumented(meta.for(object)) || references.has(object);
  };

  var shouldSkipProperty = function shouldSkipProperty(object, property) {
    return skip.has(findDefinition(object, property)) || typeof object === 'function' && ['name', 'length'].includes(property) || !isClass(object) && property === 'prototype';
  };

  var allowsPopping = function allowsPopping(path) {
    return path[0] === '(unknown module)' && path.length > 1 || path.length > 0;
  };

  var computeIndexPath = function computeIndexPath(object, path) {
    return meta.for(object).get(meta.fields.module).chain(Maybe.fromNullable).map(function (modulePath) {
      return modulePath.split('/');
    }).getOrElse(['(unknown module)'].concat(_toConsumableArray(path)));
  };

  var isModule = function isModule(object) {
    return meta.for(object).get(meta.fields.isModule).getOrElse(false);
  };

  var truePath = function truePath(object, name, path) {
    var parentPath = computeIndexPath(object, path);
    if (isModule(object) && allowsPopping(parentPath)) {
      name = parentPath.pop();
    }

    return [].concat(_toConsumableArray(parentPath), [name]).map(dasherise);
  };

  var serialise = function serialise(object, name, path) {
    var id = uuid();
    references.set(object, id);
    return Object.assign({
      id: id,
      path: truePath(object, name, path),
      isClass: isClass(object)
    }, serialiseMeta(meta.for(object)));
  };

  var go = function go(object, name, path) {
    if (shouldSkip(object)) return;

    var data = serialise(object, name, path);
    result.set(data.id, data);
    data.properties = meta.for(object).allProperties().map(function (group) {
      var members = group.members.filter(function (m) {
        return !shouldSkipProperty(object, m.name);
      });

      members.forEach(function (p) {
        return go(p.value, p.name, [].concat(_toConsumableArray(path), [name]));
      });
      return {
        category: group.category,
        members: members.map(function (member) {
          return {
            name: member.name,
            reference: references.get(member.value),
            kind: member.kind,
            representation: propertyRepresentation(meta, member),
            meta: serialiseMeta(meta.for(member.value)),
            isInherited: !hasOwnProperty.call(object, member.name)
          };
        })
      };
    }).filter(function (group) {
      return group.members.length > 0;
    });
  };

  go(root, name, []);
  [].concat(_toConsumableArray(references.entries())).forEach(function (_ref2) {
    var _ref3 = _slicedToArray(_ref2, 2),
        object = _ref3[0],
        id = _ref3[1];

    if (isClass(object)) {
      var entity = result.get(id);
      var prototype = result.get(references.get(object.prototype));
      if (!prototype) {
        entity.isClass = false;
      } else {
        entity.prototype = prototype;
      }
    }
  });

  return [].concat(_toConsumableArray(result.values()));
};

// --[ Exports ]-------------------------------------------------------
module.exports = {
  makeStatic: makeStatic
};