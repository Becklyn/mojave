import QUnit from "qunitjs";
import {createElement} from "../../../../dom/manipulate";
import {on} from "../../../../dom/events";

QUnit.module("dom/events/on()");


QUnit.test(
    "on(click)",
    (assert) =>
    {
        assert.expect(1);
        const element = createElement("div");
        const done = assert.async();

        on(element, "click", () => {
            assert.step("event listener triggered");
            done();
        });

        element.click();
    }
);
