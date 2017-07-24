/* eslint-disable no-empty-function */


import {find, findOne} from "../../../../dom/traverse";
import {live, off, trigger} from "../../../../dom/events";
import QUnit from "qunitjs";

QUnit.module("dom/events/live()", {
    beforeEach: () =>
    {
        findOne("#qunit-fixture").innerHTML = `
            <div id="element">
                <div class="child"></div>
                <div class="child class-name"></div>
            </div>
        `;
    },
});


QUnit.test(
    "live()",
    (assert) =>
    {
        assert.expect(2);
        const element = findOne("#element");

        const intermediate = live(element, "*", "click", () => {
            assert.step("eventlistener could be removed after use");
            off(element, "click", intermediate);
        });

        assert.equal(typeof intermediate, "function", "function was returned");

        element.click();
        element.click();
    }
);


QUnit.test(
    "live() with matching selector",
    (assert) =>
    {
        assert.expect(2);

        live(findOne("#element"), ".child", "click", () => {
            assert.step("event triggered on child element");
        });

        find(".child").forEach((childElement) => {
            childElement.click();
        });
    }
);


QUnit.test(
    "live(custom event)",
    (assert) =>
    {
        assert.expect(1);
        const element = findOne("#element");

        live(element, "*", "customEvent", () => {
            assert.step("could call handler with a custom event");
        });

        trigger(element, "customEvent");
    }
);


QUnit.test(
    "live(custom event) parsing an arbitrary object",
    (assert) =>
    {
        assert.expect(1);
        const element = findOne("#element");
        const object = {some: "object"};

        live(element, "*", "customEvent", (event) => {
            assert.equal(event.detail, object, "arbitrary object was parsed");
        });

        trigger(element, "customEvent", object);
    }
);


QUnit.test(
    "live(custom event) multiple event handler triggered by one event",
    (assert) =>
    {
        const element = findOne("#element");
        const order = ["first handler", "second handler", "third handler", "fourth handler", "fifth handler"];

        order.forEach((value) => {
            live(element, "*", "customEvent", () => {
                assert.step(value);
            });
        });

        trigger(element, "customEvent");
        assert.verifySteps(order, "tests ran in the right order");
    }
);


QUnit.test(
    "live() with an invalid element",
    (assert) =>
    {
        assert.throws(() => {
            live(null, "*", "customEvent", () => {});
        });
    }
);


QUnit.test(
    "live() with an invalid selector",
    (assert) =>
    {
        live(findOne("#element"), null, "customElement", () => {});
        assert.step("this should have worked because the behavior of the function in this case is not defined");
    }
);


QUnit.test(
    "live() with an invalid event",
    (assert) =>
    {
        assert.throws(() => {
            live(findOne("#element"), "*", null, () => {});
        });
    }
);
