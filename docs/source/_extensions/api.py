# -*- coding: utf-8 -*-

from os.path import dirname, join, isfile

from docutils import nodes
from docutils.statemachine import ViewList

from sphinx.util.compat import Directive
from sphinx.util.nodes import nested_parse_with_titles

from yaml import load, dump


# -- Helper functions --------------------------------------------------
def load_api(file_name):
    """Loads an YAML API file."""
    with open(file_name) as f:
        return load(f)

def flatmap(f, xs):
    return sum(map(f, xs), [])

def find_by_path(path, api):
    """Finds an object by path in an API object. Path names are separated by dots."""
    names = path.split('.')
    return reduce(lambda r, x: flatmap(lambda y: find_by_name(x, y.get('members', [])), r),
                  names,
                  [{"members":api}])

def find_by_name(name, members):
    """Finds an object by name in the API. May resolve to more than one."""
    return filter(lambda x: x['name'] == name, members)

def filter_by_type(kind, members):
    """Filters a list of members by type."""
    return filter(lambda x: x['type'] == kind, members)

def get_parent(path):
    new_path = '.'.join(path.split('.')[:-1])
    if new_path == '':
        return None
    else:
        return new_path

def group_by_category(members):
    """Groups members by their categories."""
    result = {}
    for item in members:
        key = item.get("category")
        xs = result.get(key, [])
        xs.append(item)
        result[key] = xs
    return result

def bool_option(arg):
    """Used to convert flag options in a directive."""
    return True

def qualify_name(kind, parent, name):
    prefix = 'prototype.' if kind in ['method', 'attribute'] else ''
    if parent is None:
        return name
    else:
        return parent + '.' + prefix + name

def without_nones(xs):
    return filter(lambda x: x is not None, xs)

def identity(a):
    return a

def maybe(v, t, f = identity):
    if v is None:
        return f(v)
    else:
        return t(v)
    
def normalise_options(data):
    return maybe(data.get('meta'),
                 lambda x: PrettyBlock([PrettyOptions(x), PrettyText('')]))

def normalise_signature(data):
    return maybe(data.get('signature'), rst_signature)

def normalise_data(data, parent):
    return {
        "name": qualify_name(data['type'], parent, data['name']),
        "meta": normalise_options(data),
        "signature": normalise_signature(data)
    }
    
def toc_name(data):
    kind = data['type']
    if kind == "staticmethod":
        return "." + data['name'] + "()"
    elif kind == "method":
        return "#" + data['name'] + "()"
    elif kind == "attribute":
        return "#" + data['name']
    elif kind == "function":
        return data['name'] + "()"
    else:
        return data['name']


# -- Pretty printing ---------------------------------------------------
class PrettyPrinter(object):
    pass

class PrettyText(PrettyPrinter):
    def __init__(self, value):
        self.value = value

    def render(self):
        return self.value

class PrettySeq(PrettyPrinter):
    def __init__(self, values):
        self.values = values

    def render(self):
        return ''.join(map(lambda x: x.render(), self.values))

class PrettyBlock(PrettyPrinter):
    def __init__(self, values, indent = 0):
        self.values = values
        self.indent = indent

    def render(self):
        content = '\n'.join(map(lambda x: x.render(), self.values)).split('\n')
        pad = (' ' * self.indent)
        return pad + ('\n' + pad).join(content)

class PrettyOptions(PrettyPrinter):
    def __init__(self, values):
        self.values = values

    def render(self):
        def isnt_empty(x):
            return x != ''

        def render_item(pair):
            (name, value) = pair
            if value == '':
                return ''
            else:
                values = value.split('\n')
                key = ':' + name + ':'
                padded_values = '\n'.join(map(lambda x: '  ' + x, values))
                return key + '\n' + padded_values

        return '\n'.join(filter(isnt_empty, map(render_item, self.values.items())))



# -- Rendering functions -----------------------------------------------
def rst_directive(name, arg = '', opts = None, content = PrettyText('')):
    return PrettyBlock([
        PrettySeq([
            PrettyText('.. '),
            PrettyText(name),
            PrettyText(':: '),
            PrettyText(arg)
        ]),
        PrettyBlock(without_nones([
            opts,
            PrettyText(''),             # We need a blank line between the two
            content,
            PrettyText('')
        ]), 3)
    ])

def rst_title(title, fill = '-'):
    return PrettyBlock([
        PrettyText(''),
        PrettyText(title),
        PrettyText(fill * len(title)),
        PrettyText('')
    ])

def rst_signature(sig):
    return rst_directive('code-block', 'haskell', content = PrettyText(sig))

def has_page(source, name):
    return isfile(join(dirname(source), name + '.rst'))

def rst_link(title, doc, source = None):
    link = rst_directive(
        'rst-class', 'detail-link',
        content = PrettyText(':doc:`' + title + ' <' + doc + '>`')
    )
    if source is not None:
        if isfile(join(dirname(source), doc + ".rst")):
            return link
        else:
            return None
    else:
        return link

def rst_module(data, parent = None, more_content = None, brief = False, **kwargs):
    x = normalise_data(data, parent)
    if more_content is not None:
        more_content = PrettyText(more_content + '\n\n')
    
    return PrettyBlock(without_nones([
        rst_directive(
            'module',
            x['name'],
            PrettyOptions({
                "synopsis": data.get('synopsis', ''),
                "platform": data.get('platform', '')
            })
        ),
        x['meta'],
        x['signature'],
        PrettyText(data.get('synopsis', '')),
        PrettyText(''),
        more_content,
        rst_members(x['name'], data.get('members'), **kwargs)
    ]))

def rst_class(data, parent = None, more_content = None, brief = True, **kwargs):
    x = normalise_data(data, parent)
    source = kwargs.get('source')
    if more_content is not None:
        more_content = PrettyText(more_content + '\n\n')
    if brief:
        meta = PrettyOptions({ "noindex": "" }) if has_page(source, data['name']) else None
        link = rst_link('+', data['name'], kwargs.get('source'))
        mems = None
    else:
        meta = None
        link = None
        mems = rst_members(data['name'], data.get('members'), **kwargs)
    
    return PrettyBlock(without_nones([
        rst_directive(
            'class',
            x['name'],
            meta,
            PrettyBlock(without_nones([
                x['meta'],
                x['signature'],
                PrettyText(data.get('synopsis', '')),
                PrettyText(''),
                more_content,
                link
            ]))
        ),
        PrettyText(''),
        mems
    ]))


def rst_object(data, parent = None, more_content = None, brief = True, **kwargs):
    x = normalise_data(data, parent)
    name = qualify_name(data['type'], parent, data.get('header', data['name']))
    if more_content is not None:
        more_content = PrettyText(more_content + '\n\n')
    if brief:
        meta = PrettyOptions({ "noindex": "" })
        link = rst_link('+', data['name'], kwargs.get('source'))
        mems = None
        preamble = PrettyBlock([
            PrettyText('.. rst-class:: hidden-heading'),
            PrettyText(''),
            rst_title(toc_name(data), '~')
        ])
    else:
        meta = None
        link = None
        mems = rst_members(x['name'], data.get('members'), **kwargs)
        preamble = None

    return PrettyBlock(without_nones([
        preamble,
        rst_directive(
            data['type'],
            name,
            meta,
            PrettyBlock(without_nones([
                x['meta'],
                x['signature'],
                PrettyText(data.get('synopsis', '')),
                PrettyText(''),
                more_content,
                link,
                mems
            ]))
        )
    ]))

def rst_members(parent, members, **kwargs):
    def render_category(pair):
        (cat, mems) = pair
        return PrettyBlock([
            rst_title(cat or "Uncategorised"),
            rst_dirlist(parent, mems, **kwargs)
        ])

    if members is not None:
        items = sorted(group_by_category(members).items(), key=lambda x: x[0])
        return PrettyBlock(map(render_category, items))
    else:
        return None

def rst_dirlist(parent, members, **kwargs):
    return PrettyBlock(map(lambda x: rst_object(x, parent, **kwargs), members))
    


# -- Directives --------------------------------------------------------
class ApiDirective(Directive):
    has_content = True
    required_arguments = 1
    optional_arguments = 0
    final_argument_whitespace = True
    
    handlers = {
        "module": rst_module,
        "function": rst_object,
        "method": rst_object,
        "staticmethod": rst_object,
        "attribute": rst_object,
        "data": rst_object,
        "class": rst_class
    }

    def run(self):
        config = self.state.document.settings.env.config
        reporter = self.state.document.reporter

        api = load_api(config['api_path'])

        obj_type = self.name[3:]
        objs = filter_by_type(obj_type, find_by_path(self.arguments[0], api))
        parent = get_parent(self.arguments[0])
        render_fn = self.get_writer(obj_type)

        text = '\n'.join(self.content)
        content = '\n\n'.join(map(lambda x: render_fn(x, parent=parent, more_content=text, brief=False, source = reporter.source).render(), objs))

        node = nodes.section()
        node.document = self.state.document
        nested_parse_with_titles(self.state, ViewList(content.split('\n')), node)

        return node.children

    def get_writer(self, obj_type):
        return ApiDirective.handlers[obj_type]

        
def setup(app):
    app.add_config_value('api_path', None, True)
    app.add_directive('apimodule', ApiDirective)
    app.add_directive('apiclass', ApiDirective)
    app.add_directive('apifunction', ApiDirective)
    app.add_directive('apimethod', ApiDirective)
    app.add_directive('apistaticmethod', ApiDirective)
    app.add_directive('apiattribute', ApiDirective)
    app.add_directive('apidata', ApiDirective)
