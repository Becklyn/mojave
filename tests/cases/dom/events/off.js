/* eslint-disable no-empty-function */

import {delegate, off} from "../../../../dom/events";
import QUnit from "qunit";
import {findOne} from "../../../../dom/traverse";


QUnit.module("dom/events/off()", {
    beforeEach ()
    {
        findOne("#qunit-fixture").innerHTML = `
            <div class="example">
                <button type="button" id="button"></button>
                <input type="text" id="input-element">
            </div>
        `;
    },
});


QUnit.test(
    "off()",
    (assert) =>
    {
        const done = assert.async(2);
        assert.expect(0);
        const element = findOne(".example");
        const button = findOne("#button");

        const intermediate = delegate(element, "*", "click", () => {
            done();
            off(element, "click", intermediate);
        });

        button.click();
        button.click();
        done();
    }
);


QUnit.test(
    "off() with null",
    (assert) =>
    {
        off(null, "click", () => {});
        assert.ok(true, "null is silently ignored");
    }
);


QUnit.test(
    "off() with an invalid event",
    (assert) =>
    {
        assert.throws(
            () => {
                off(findOne(".example"), null, () => {});
            },
            "function threw an error"
        );
    }
);
