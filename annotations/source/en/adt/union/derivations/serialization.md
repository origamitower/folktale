@annotate: folktale.adt.union.derivations.serialization
category: Derivations
---
Provides JSON serialisation and parsing for unions.

The `serialization` derivation bestows `.toJSON()` and `.fromJSON(value)`
upon unions constructed by `adt/union`. Both serialisation and parsing
are recursive, and `.fromJSON` can automatically reify values of
other types.


## Example::

    const { union, derivations } = require('folktale/adt/union');
    const Id = union('Id', {
      Id(value){ return { value } }
    }).derive(
      derivations.serialization,
      derivations.equality
    );

    Id.Id(1).toJSON();
    // ==> { '@@type': 'Id', '@@tag': 'Id', '@@value': { value: 1 } }

    Id.fromJSON(Id.Id(1).toJSON());
    // ==> Id.Id(1)


## JSON serialisation

This derivation provides JSON serialisation through the `.toJSON` method,
which converts rich unions into objects that can be safely serialised as
JSON. For example::

    const { union, derivations } = require('folktale/adt/union');
    
    const { Id } = union('Id', {
      Id(value){ return { value } }
    }).derive(derivations.serialization);

    Id(1).toJSON();
    // ==> { '@@type': 'Id', '@@tag': 'Id', '@@value': { value: 1 } }

During the transformation, if any of the values contains a `.toJSON`
method, that's called to serialise the structure. Otherwise the value is
just returned as-is::

    Id(Id(1)).toJSON();
    // ==> { '@@type': 'Id', '@@tag': 'Id', '@@value': { value: { '@@type': 'Id', '@@tag': 'Id', '@@value': { 'value': 1 } } } }

It's not necessary to call the `.toJSON()` method directly in most cases, since
`JSON.stringify` will already invoke that for you::

    JSON.stringify(Id(1));
    // ==> '{"@@type":"Id","@@tag":"Id","@@value":{"value":1}}'

    JSON.stringify(Id([Id(1)]));
    // ==> '{"@@type":"Id","@@tag":"Id","@@value":{"value":[{"@@type":"Id","@@tag":"Id","@@value":{"value":1}}]}}'


## JSON parsing

The reverse process of serialisation is parsing, and the `.fromJSON` method
provided by this derivation is able to reconstruct the proper union from
serialised data::

    const { union, derivations } = require('folktale/adt/union');
    
    const Id = union('Id', {
      Id(value){ return { value } }
    }).derive(
      derivations.serialization,
      derivations.equality
    );

    const json = Id.Id(1).toJSON();
    Id.fromJSON(json);
    // ==> Id.Id(1)

In general, as long as the values in an union are either union instances or simple
values supported by JSON, the following equivalence holds:

    Union.fromJSON(union.toJSON()) = union

Some unions instances may contain other union instances as values. Serialising them
is simple because JavaScript's dispatch takes care of selecting the correct
serialisation for us. With parsing we don't have that luck, so instead the
union takes a list of parsers as argument::

    const A = union('A', { 
      A(value) { return { value } }
    }).derive(
      derivations.serialization,
      derivations.equality
    );

    const B = union('B', {
      B(value) { return { value } }
    }).derive(
      derivations.serialization,
      derivations.equality
    );

    A.fromJSON(A.A(B.B(1)).toJSON(), [A, B]);
    // ==> A.A(B.B(1))


## The serialisation format

In order to support the serialisation and parsing of unions, this module
uses a specific format that encodes that information in the serialised
data. This way, `.toJSON()` produces values of this interface, and
`.fromJSON(value)` expects values of this interface:

    type JSONSerialisation = {
      "@@type":  String,
      "@@tag":   String,
      "@@value": Object Any
    }
