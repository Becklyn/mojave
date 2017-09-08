/* eslint-disable no-empty-function */

import {delegate, off} from "../../../../dom/events";
import QUnit from "qunitjs";
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
    }
});


QUnit.test(
    "off()",
    (assert) =>
    {
        assert.expect(2);
        const element = findOne(".example");
        const button = findOne("#button");

        const intermediate = delegate(element, "*", "click", () => {
            assert.step("event listener was triggered");
            off(element, "click", intermediate);
        });

        button.click();
        button.click();
        assert.step("event listener could be removed after use");
    }
);


QUnit.test(
    "off() with an invalid element",
    (assert) =>
    {
        assert.throws(
            () => {
                off(null, "click", () => {});
            },
            "function threw an error"
        );
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
