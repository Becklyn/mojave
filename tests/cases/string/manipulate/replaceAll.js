import QUnit from "qunit";
import {replaceAll} from "../../../../string/manipulate";

QUnit.module("string/manipulate/replaceAll()");


QUnit.test(
    "replace string with 1 occurrence of 1 replacement string",
    (assert) =>
    {
        let text = "foobar";
        text = replaceAll(text, {
            foo: "a",
        });

        assert.strictEqual(text, "abar", `string was successfully replaced`);
    }
);


QUnit.test(
    "replace string with 1 occurrence of each replacement sting",
    (assert) =>
    {
        let text = "foobar";
        text = replaceAll(text, {
            foo: "a",
            bar: "b",
        });

        assert.strictEqual(text, "ab", `string was successfully replaced`);
    }
);


QUnit.test(
    "replace string with multiple occurrences of each replacement sting",
    (assert) =>
    {
        let text = "foobarbarfoofoobarfoobar";
        text = replaceAll(text, {
            foo: "a",
            bar: "b",
        });

        assert.strictEqual(text, "abbaabab", `string was successfully replaced`);
    }
);


QUnit.test(
    "replace string without matching replacement strings",
    (assert) =>
    {
        let text = "farboo";
        text = replaceAll(text, {
            foo: "a",
            bar: "b",
        });

        assert.strictEqual(text, "farboo", `string is unaltered`);
    }
);


QUnit.test(
    "replace string without replacement strings",
    (assert) =>
    {
        let text = "farboo";
        text = replaceAll(text, {});

        assert.strictEqual(text, "farboo", `string is unaltered`);
    }
);


QUnit.test(
    "replace string with null as replacement strings",
    (assert) =>
    {
        let text = "foobar";
        text = replaceAll(text, {bar: null});

        assert.strictEqual(text, "foonull", `string was successfully replaced`);
    }
);


QUnit.test(
    "replace string with null as replacement strings",
    (assert) =>
    {
        let text = "foobar";
        text = replaceAll(text, {null: null});

        assert.strictEqual(text, "foobar", `string is unaltered`);
    }
);


QUnit.test(
    "replace string with empty string as matching string",
    (assert) =>
    {
        let text = "foo";
        text = replaceAll(text, {"": "x"});

        assert.strictEqual(text, "fxoxo", `string was successfully replaced. The result has a the replacement string after every character`);
    }
);


QUnit.test(
    "replace string with regex as matching string",
    (assert) =>
    {
        let text = "foobar";
        const regx = /(foo)/g;
        text = replaceAll(text, {[regx]: "x"});

        assert.strictEqual(text, "foobar", `string is unaltered`);
    }
);


QUnit.test(
    "replace string with matching string, which matches after first iteration",
    (assert) =>
    {
        let text = "fooar";
        text = replaceAll(text, {
            foo: "b",
            bar: "a",
        });

        assert.strictEqual(text, "a", `string was successfully replaced. The result is a string, which matched only after the first alteration, which lead the string to be replaced although it wouldn't have been replaced if the original string was matched against.`);
    }
);
