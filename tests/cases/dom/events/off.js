/* eslint-disable no-empty-function */


import {live, off} from "../../../../dom/events";
import QUnit from "qunitjs";
import {createElement} from "../../../../dom/manipulate";

QUnit.module("dom/events/off()");


QUnit.test(
    "off()",
    (assert) =>
    {
        assert.expect(2);
        const element = createElement("div");

        const intermediate = live(element, "*", "click", () => {
            assert.step("event listener was triggered");
            off(element, "click", intermediate);
        });

        element.click();
        element.click();
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
                off(createElement("div"), null, () => {});
            },
            "function threw an error"
        );
    }
);
