import {formatCookieString} from "../../../cookie";
import QUnit from "qunit";

QUnit.module("cookie/set");

QUnit.test(
    "valid formatCookieString() variations",
    (assert) =>
    {
        /** @type {Array<{key: string, value: string, options: object, expected: RegExp}>} */
        let cases = [
            // test default values
            {
                key: 'test',
                value: 'value',
                options: {},
                expected: /^test=%22value%22;path=\/ ;expires=/,
            },

            // explicitly secure + insecure test
            {
                key: 'test',
                value: 'value',
                options: {
                    secure: true,
                },
                expected: /^test=%22value%22;path=\/ ;secure ;expires=/,
            },
            {
                key: 'test',
                value: 'value',
                options: {
                    secure: false,
                },
                expected: /^test=%22value%22;path=\/ ;expires=/,
            },
        ];

        cases.forEach(
            (singleCase, index) => {
                let actual = formatCookieString(singleCase.key, singleCase.value, singleCase.options);
                assert.ok(singleCase.expected.test(actual), `Test #${index}`);
            }
        );
    }
);

QUnit.test(
    "invalid cookie name",
    (assert) =>
    {
        assert.throws(
            () => formatCookieString(`a@b`, 5),
            /Invalid cookie name./,
            "Throws with invalid cookie names."
        );
    }
);
