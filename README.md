# error-engine

This module provides a base class for easy Node error message templating. Use Node's native module
"util" to inherit from the ErrorEngine base class. See below for an example, and see the `tests.js`
file for more examples.

## Example

```
var _ = require("lodash");
var ErrorEngine = require("error-engine");

var dictionary = {
    "my_error_type": "This is my error message",
    "my_super_error_type": _.template("Wow! This is <% adjective %>!")
};

function MyNewError(code, key, params) {
    ErrorEngine.call(this, {}, dictionary, key, params);

    this.code = code;
}
util.inherits(MyNewError, ErrorEngine);

var err1 = new MyNewError(42, "my_error_type");
var err2 = new MyNewError(73, "my_super_error_type", {
    "adjective": "awesome"
});
```
