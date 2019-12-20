import {getCookie, setCookie, removeCookie} from "../../../cookie";
import QUnit from "qunit";

QUnit.module("cookie/set");

QUnit.test(
    "valid getCookie() variations",
    (assert) =>
    {
        /** @type {Array<{key: string, value: string, options: object, expected: RegExp}>} */
        let cases = [
            // test default values
            {
                key: 'test',
                value: 'value',
                options: {},
                expected: 'value',
            },
            {
                key: 'test',
                value: 5,
                options: {},
                expected: 5,
            },
            {
                key: 'test',
                value: true,
                options: {},
                expected: true,
            },
            {
                key: 'test',
                value: [],
                options: {},
                expected: [],
            },
            {
                key: 'test',
                value: {c: "c"},
                options: {},
                expected: {c: "c"},
            },
            {
                key: 'test',
                value: [1, 2, "", true, false, {}],
                options: {},
                expected: [1, 2, "", true, false, {}],
            },
        ];

        cases.forEach(
            (singleCase, index) => {
                setCookie(singleCase.key, singleCase.value);
                assert.deepEqual(singleCase.expected, getCookie(singleCase.key), `Test #${index}`);
                removeCookie(singleCase.key);
            }
        );
    }
);
