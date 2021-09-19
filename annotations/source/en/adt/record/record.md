@annotate: folktale.adt.record.record
category: Modelling data
---
Constructs a type product data structure.

## Using the `adt/record` module::
  
    const record = require('folktale/adt/record/record');
    
    const Person = record('Person', {
      firstName: String,
      lastName: String,
      age: Number,
    });

    const tarantino = Person({
      firstName: 'Quentin',
      lastName: 'Tarantino',
      age: 55,
    });
    // ==> Person { firstName: 'Quentin', lastName: 'Tarantino', age: 55 }



## Why use record?

Record is a implementation of type product concept same as Object and Array, but with simple type checking and immutable state.
Record pattern is presented in many functional programming language such as Haskell, OCaml/ReasonML, Scala and etc.

Haskell example:


    data Person = Person { firstName :: String  
                     , lastName :: String  
                     , age :: Int  
                     } deriving (Show) 


Record same as class in object-oriented programming but pure. We have only value like number and can't change his state. To change some property inside record instance we need to create new instane with changed fields.

It can be derived like Haskell records and Folktale union:


    const record = require('folktale/adt/record/record');
    const Show = require('folktale/adt/record/derivations/debug-representation');

    const Person = record('Person', {
      firstName: String,
      lastName: String,
      age: Number,
    }).derive(Show);

    const tarantino = Person({
      firstName: 'Quentin',
      lastName: 'Tarantino',
      age: 55,
    });

    console.log(tarantino);
    // ==> Person({ firstName: "Quentin", lastName: "Tarantino", age: 55 }) 
