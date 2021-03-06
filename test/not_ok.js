var test = require('tape');
var parser = require('../');

var lines = [
    'TAP version 13',
    '# beep',
    'ok 1 should be equal',
    'not ok 2 should be equivalent',
    '# boop',
    'ok 3 should be equal',
    'ok 4 (unnamed assert)',
    '',
    '1..4',
    '# tests 4',
    '# pass  3',
    '# fail  1'
];

var expected = { asserts: [], comments: [] };

expected.comments = [ 'beep', 'boop', 'tests 4', 'pass  3', 'fail  1' ];

expected.asserts.push({
    ok: true,
    number: 1,
    name: 'should be equal',
    extra: ''
});
expected.asserts.push({
    ok: false,
    number: 2,
    name: 'should be equivalent',
    extra: '# boop\n'
});
expected.asserts.push({
    ok: true,
    number: 3,
    name: 'should be equal',
    extra: ''
});
expected.asserts.push({
    ok: true,
    number: 4,
    name: '(unnamed assert)',
    extra: '\n'
});


test('simple not ok', function (t) {
    t.plan(6 * 2 + 1 + 4 * 2 + 5);
    
    var p = parser(onresults);
    p.on('results', onresults);
    
    var asserts = [];
    p.on('assert', function (assert) {
        asserts.push(assert);
    });
    
    p.on('plan', function (plan) {
        t.same(plan, { start: 1, end: 4 });
    });
    
    p.on('comment', function (c) {
        t.equal(c, expected.comments.shift());
    });
    
    for (var i = 0; i < lines.length; i++) {
        p.write(lines[i] + '\n');
    }
    p.end();
    
    function onresults (results) {
        asserts.forEach(function(assert, index) {
            t.same(assert, expected.asserts[index]);
        });
        t.equal(results.ok, false);
        t.equal(results.asserts.length, 4);
        t.equal(results.pass.length, 3);
        t.equal(results.fail.length, 1);
        t.same(results.errors, []);
        t.same(results.asserts, asserts);
    }
});
