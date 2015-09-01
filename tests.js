/*
 * Error Message Templating Engine
 */

var _ = require("lodash");
var util = require("util");
var chai = require("chai");

chai.should();
var expect = chai.expect;

var ErrorEngine = require("./");


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Setup Data

var template1 = {
    "key1": "This is an error message for key1",
    "key2": _.template("This is an error message for <%= key %>")
};

function SampleError1(code, key, params) {
    ErrorEngine.call(this, {}, template1, key, params);

    this.code = code;

    Error.captureStackTrace(this, SampleError1);
}
util.inherits(SampleError1, ErrorEngine);

var template2 = {
    "key1": "This is an error message for key1",
    "key2": "This is an error message for <%= key %>"
};

function SampleError2(code, key, params) {
    ErrorEngine.call(this, {
        "auto_template": true
    }, template2, key, params);

    this.code = code;

    Error.captureStackTrace(this, SampleError2);
}
util.inherits(SampleError2, ErrorEngine);

var template3 = {
    "key1": function(obj) {
        return "This is an error message for " + obj.key;
    }
};

function SampleError3(code, key, params) {
    ErrorEngine.call(this, {
        "auto_template": true
    }, template3, key, params);

    this.code = code;

    Error.captureStackTrace(this, SampleError3);
}
util.inherits(SampleError3, ErrorEngine);

var template4 = {
    "key1": true
};

function BadError1(code, key, params) {
    ErrorEngine.call(this, {}, template4, key, params);
    Error.captureStackTrace(this, BadError1);
}
util.inherits(BadError1, ErrorEngine);

function BadError2(code, key, params) {
    ErrorEngine.call(this, {
        "auto_template": true
    }, template4, key, params);
    Error.captureStackTrace(this, BadError2);
}
util.inherits(BadError1, ErrorEngine);


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Tests

describe("ErrorEngine", function() {
    it("should generate a basic error message", function() {
        var err = new SampleError1(42, "key1");
        expect(err).to.be.an.instanceOf(SampleError1);
        expect(err).to.be.an.instanceOf(ErrorEngine);
        expect(err).to.be.an.instanceOf(Error);
        expect(err).to.have.property("code", 42);
        expect(err).to.have.property("message", "This is an error message for key1");
        expect(err).to.have.property("stack");
    });

    it("should generate a templated error message", function() {
        var err = new SampleError1(73, "key2", {
            "key": "key2"
        });
        expect(err).to.be.an.instanceOf(SampleError1);
        expect(err).to.be.an.instanceOf(ErrorEngine);
        expect(err).to.be.an.instanceOf(Error);
        expect(err).to.have.property("code", 73);
        expect(err).to.have.property("message", "This is an error message for key2");
        expect(err).to.have.property("stack");
    });

    it("should generate a basic error message with auto_template flag = true", function() {
        var err = new SampleError2(42, "key1");
        expect(err).to.be.an.instanceOf(SampleError2);
        expect(err).to.be.an.instanceOf(ErrorEngine);
        expect(err).to.be.an.instanceOf(Error);
        expect(err).to.have.property("code", 42);
        expect(err).to.have.property("message", "This is an error message for key1");
        expect(err).to.have.property("stack");
    });

    it("should generate a templated error message with auto_template flag = true", function() {
        var err = new SampleError2(73, "key2", {
            "key": "key2"
        });
        expect(err).to.be.an.instanceOf(SampleError2);
        expect(err).to.be.an.instanceOf(ErrorEngine);
        expect(err).to.be.an.instanceOf(Error);
        expect(err).to.have.property("code", 73);
        expect(err).to.have.property("message", "This is an error message for key2");
        expect(err).to.have.property("stack");
    });

    it("should generate a templated error message from non-lodash template with auto_template flag = true", function() {
        var err = new SampleError3(42, "key1", {
            "key": "key1"
        });
        expect(err).to.be.an.instanceOf(SampleError3);
        expect(err).to.be.an.instanceOf(ErrorEngine);
        expect(err).to.be.an.instanceOf(Error);
        expect(err).to.have.property("code", 42);
        expect(err).to.have.property("message", "This is an error message for key1");
        expect(err).to.have.property("stack");
    });

    it("should throw an error if the message type is invalid", function() {
        var msg = 'Unprocessable message "true" of type "boolean" for key "key1".';
        expect(function() {
            new BadError1(42, "key1");
        }).to.throw(Error, msg);
    });

    it("should throw an error if the message type is invalid", function() {
        var msg = 'Expected value to auto-template - "true" - to be type "string"';
        msg += ' but got "boolean".';
        expect(function() {
            new BadError2(42, "key1");
        }).to.throw(Error, msg);
    });
});