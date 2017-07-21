import QUnit from "qunitjs";
import {createElement} from "../../../../dom/manipulate";
import {on, trigger} from "../../../../dom/events";

QUnit.module("dom/events/trigger()");


QUnit.test(
    "trigger() with an click event",
    (assert) =>
    {
        assert.expect(1);
        const element = createElement("div");

        on(element, "click", () => {
            assert.step("event listener was triggered");
        });

        trigger(element, "click");
    }
);


QUnit.test(
    "trigger() with a custom event",
    (assert) =>
    {
        assert.expect(1);
        const element = createElement("div");

        on(element, "customEvent", () => {
            assert.step("event listener was triggered");
        });

        trigger(element, "customEvent");
    }
);


QUnit.test(
    "trigger() with an invalid element",
    (assert) =>
    {
        assert.throws(
            () => {
                trigger(null, "click");
            },
            "function threw an error"
        );
    }
);


QUnit.test(
    "trigger() with an invalid event",
    (assert) =>
    {
        trigger(createElement("div"), null);
        assert.step("this should have worked because the behavior of the function in this case is not defined");
    }
);
