var TapParser = require('tap-parser');
var inherits = require('inherits');


function ExtrasParser(cb) {
    if (!(this instanceof ExtrasParser)) return new ExtrasParser(cb);
    TapParser.apply(this, [].slice.call(arguments));

    this.on('assert', function(assert) { assert.extra = ''; });
    this.on('extra', this._onextra);
    this.on('comment', (function(text) {
        // Add the comment prefix back to restore the original line text:
        this._onextra('# ' + text);
    }).bind(this));
}
inherits(ExtrasParser, TapParser);

ExtrasParser.prototype._onextra = function (line) {
    //console.log('_onextra with', line);
    var results = this.results;
    if (results.plan) {
        // Check if there are no more extra lines to track
        var test_count = (results.plan.end - results.plan.start + 1);  // eg. 1..4 => 4 tests
        var is_end_comment = (results.asserts.length >= test_count) && (/^#/).test(line);
        if (this._plan_at_end || is_end_comment) this._done_asserts = true;
    } else {
        // Save a record of the plan being at the end, for handling edge cases
        // with extra lines at the end of the TAP output.
        this._plan_at_end = true;
    }

    var latest_assert = results.asserts[results.asserts.length - 1];
    if (latest_assert && !this._done_asserts) latest_assert.extra += (line + '\n');
};

module.exports = ExtrasParser;
