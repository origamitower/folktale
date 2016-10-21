const Text = (value) => ({
  'fantasy-land/empty': () => Text(''),
  'fantasy-land/concat': (a) => Text(value + a),
  'fantasy-land/map': (f) => Text(f(value)),
  'fantasy-land/chain': (f) => f(value),
  'fantasy-land/of': Text,
  'fantasy-land/ap': (v) => Text(v.value(value)),
  'fantasy-land/equals': (a) => value === a.value,
  value,
  equals: (a) => value === a.value
});

Text.of = Text;

module.exports = { Text };