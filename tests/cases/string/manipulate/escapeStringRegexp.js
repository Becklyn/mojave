import QUnit from "qunit";
import {escapeStringRegexp} from "../../../../string/manipulate";

QUnit.module("string/manipulate/escapeStringRegexp()");


QUnit.test(
    "escape string",
    (assert) =>
    {
        const text = "How much $ for a 🦄?";
        const resultText = escapeStringRegexp(text);

        assert.strictEqual(resultText, "How much \\$ for a 🦄\\?", "string was successfully escaped.");
    }
);
