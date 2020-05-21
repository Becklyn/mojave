import QUnit from "qunit";
import {booleanParameter, numberParameter, stringParameter} from "../../../url/router-parameters";

QUnit.module("url/router-parameters");

QUnit.test(
    "stringParameter() valid cases",
    (assert) =>
    {
        // input, defaultValue, expected
        const cases = [
            ["test", null, "test"],
            [null, null, null],
            [undefined, null, null],
            [null, "default", "default"],
            [undefined, "default", "default"],
            [123, null, "123"],
            [123, undefined, "123"],
        ];

        cases.forEach(
            ([input, defaultValue, expected]) =>
            {
                assert.strictEqual(stringParameter(defaultValue)(input), expected);
            }
        );
    }
);

QUnit.test(
    "stringParameter() invalid cases",
    (assert) =>
    {
        // input, defaultValue
        const cases = [
            [null, undefined],
            [undefined, undefined],
        ];

        cases.forEach(
            ([input, defaultValue]) =>
            {
                assert.throws(() => stringParameter(defaultValue)(input));
            }
        );
    }
);

QUnit.test(
    "numberParameter() valid cases",
    (assert) =>
    {
        // input, defaultValue, expected
        const cases = [
            [123, null, 123],
            [123, undefined, 123],
            ["123", null, 123],
            ["123", undefined, 123],
            [null, null, null],
            [null, 432, 432],
            [undefined, null, null],
            [undefined, 432, 432],
        ];

        cases.forEach(
            ([input, defaultValue, expected]) =>
            {
                assert.strictEqual(numberParameter(defaultValue)(input), expected);
            }
        );
    }
);

QUnit.test(
    "numberParameter() invalid cases",
    (assert) =>
    {
        // input, defaultValue
        const cases = [
            [null, undefined],
            [undefined, undefined],
            ["abc", false],
            ["abc", true],
        ];

        cases.forEach(
            ([input, defaultValue]) =>
            {
                assert.throws(() => numberParameter(defaultValue)(input));
            }
        );
    }
);

QUnit.test(
    "booleanParameter() valid cases",
    (assert) =>
    {
        // input, defaultValue, expected
        const cases = [
            [true, null, true],
            [false, null, false],
            ["true", null, true],
            ["false", null, false],
            ["true", undefined, true],
            ["false", undefined, false],
            ["true", true, true],
            ["false", true, false],
            ["true", false, true],
            ["false", false, false],
            [undefined, true, true],
            [undefined, false, false],
            [null, true, true],
            [null, false, false],
        ];

        cases.forEach(
            ([input, defaultValue, expected]) =>
            {
                assert.strictEqual(booleanParameter(defaultValue)(input), expected);
            }
        );
    }
);

QUnit.test(
    "booleanParameter() invalid cases",
    (assert) =>
    {
        // input, defaultValue
        const cases = [
            ["", undefined],
            ["test", undefined],
            // invalid value should always throw
            ["test", true],
        ];

        cases.forEach(
            ([input, defaultValue]) =>
            {
                assert.throws(() => booleanParameter(defaultValue)(input));
            }
        );
    }
);
