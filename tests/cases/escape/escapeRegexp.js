import QUnit from "qunit";
import {escapeRegexp} from "../../../escape";

QUnit.module("escape/escapeRegexp()");


QUnit.test(
    "escape string",
    (assert) =>
    {
        const text = "How much $ for a 🦄?";
        const resultText = escapeRegexp(text);

        assert.strictEqual(resultText, "How much \\$ for a 🦄\\?", "string was successfully escaped.");
    }
);
