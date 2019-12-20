import {getCookie, setCookie, removeCookie} from "../../../cookie";
import QUnit from "qunit";

QUnit.module("cookie/get");

QUnit.test(
    "valid getCookie() variations",
    (assert) =>
    {
        /** @type {Array<{value: string, expected: RegExp}>} */
        let cases = [
            // test default values
            'value',
            5,
            true,
            [],
            {c: 'c'},
            [
                'value',
                0,
                true,
                [false, 1, 2, 3],
                {key: 'value'},
            ],
        ];

        cases.forEach(
            (singleCase, index) => {
                let key = 'test';

                assert.strictEqual(getCookie(key), null);

                setCookie(key, singleCase);
                assert.deepEqual(getCookie(key), singleCase, `Test #${index}`);
                removeCookie(key);

                assert.strictEqual(getCookie(key), null);
            }
        );
    }
);
