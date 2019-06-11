import {hasOwnProperty} from "../../../runtime";
import QUnit from "qunit";


QUnit.module("hasOwnProperty()");


QUnit.test(
    "Simple cases",
    (assert) =>
    {
        let a = {a: 1};
        let b = {};

        assert.strictEqual(true, hasOwnProperty(a, "a"));
        assert.strictEqual(false, hasOwnProperty(a, "b"));
        assert.strictEqual(false, hasOwnProperty(b, "a"));
    }
);


QUnit.test(
    "Explicit prototype",
    (assert) =>
    {
        let ancestor = {a: 11};
        let ExampleClass = function () {};
        ExampleClass.prototype = ancestor;

        let example = new ExampleClass();

        assert.strictEqual(11, example.a);
        assert.strictEqual(false, hasOwnProperty(example, "a"));
    }
);


QUnit.test(
    "Importing from JSON",
    (assert) =>
    {
        let example = JSON.parse('{"hasOwnProperty": 1}');
        assert.strictEqual(false, hasOwnProperty(example, "a"));
    }
);
