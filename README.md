tap-extras
==========

A small wrapper module for [tap-parser](https://github.com/substack/tap-parser)
that adds extra lines to the parsed TAP output.


Usage
-----

Use this module just like you would use `tap-parser`:

```
var parser = require('tap-extras');
var p = parser(function (results) {
    console.dir(results);
});

process.stdin.pipe(p);
```

This might give you output like the following. The only difference
from `tap-parser`'s outputs is that each assertion
will have an `"extra"` attribute. This will point to any extra lines
emitted by your tests (TAP comments, stack traces, or any other
diagnostic information):

```
{ ok: true,
  asserts:
   [ { ok: true, number: 1, name: 'should be equal', extra: ''},
     { ok: true, number: 2, name: 'should be equivalent' , extra: ''},
     { ok: false, number: 3, name: 'should be equal' , extra: '   ---\n    $extra_test_context\n   ...'},
     { ok: true, number: 4, name: '(unnamed assert)', extra: ''} ],
  pass: 
   [ { ok: true, number: 1, name: 'should be equal', extra: '' },
     { ok: true, number: 2, name: 'should be equivalent', extra: '' },
     { ok: true, number: 4, name: '(unnamed assert)', extra: '' } ],
  fail: [
     { ok: false, number: 3, name: 'should be equal' , extra: '   ---\n    $extra_test_context\n   ...'},
  ],
  todo: [],
  errors: [],
  plan: { start: 1, end: 4 } }
```


Background
----------

This feature was [suggested](https://github.com/substack/tap-parser/issues/7)
for integration into the tap-parser module. Since it wasn't accepted, it lives
on in this wrapper module instead.
