/*
 * Error Message Templating Engine
 */

var _ = require("lodash");
var util = require("util");


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Local Functions

function compose(auto_template, dictionary, key, params) {
    var composer = dictionary[key];

    // If auto_template is set to true, make dictionary value
    if (auto_template) {
        if (typeof composer === "string") {
            composer = _.template(composer);
        } else if (typeof composer !== "function" ) {
            var msg = 'Expected value to auto-template - "' + composer + '" - to be type "string"';
            msg += ' but got "' + typeof composer + '".';
            throw new Error(msg);
        }
    }

    switch (typeof composer) {
        case "string": return composer;
        case "function": return composer(params);
        default:
            {
                var msg = 'Unprocessable message "' + composer + '" of type "' + typeof composer;
                msg += '" for key "' + key + '".'
                throw new Error(msg);
            }
    }
}

/**
 * @summary A base class for templating node error messages.
 *
 * @constructor
 * @param {object} options - The options object.
 * @param {boolean} [auto_template=false] - Indicates whether the error messages should be templated
 *   using the lodash template function.
 * @param {object} dictionary - The dictionary of error messages mapping keys to values.
 * @param {string} key - The key to use to construct the error message.
 * @param {object} [params] - The parameters used when compiling an error message.
 */
function ErrorEngine(options, dictionary, key, params) {
    var auto_template = typeof options.auto_template === "boolean" ? options.auto_template : false;
    this.message = compose(auto_template, dictionary, key, params);

    Error.captureStackTrace(this, ErrorEngine);
}
util.inherits(ErrorEngine, Error);

module.exports = ErrorEngine;