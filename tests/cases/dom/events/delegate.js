/* eslint-disable no-empty-function */

import {delegate, off, trigger} from "../../../../dom/events";
import {find, findOne} from "../../../../dom/traverse";
import QUnit from "qunitjs";

QUnit.module("dom/events/delegate()", {
    beforeEach: () =>
    {
        findOne("#qunit-fixture").innerHTML = `
            <div id="element">
                <div class="child first-child"></div>
                <div class="child class-name"></div>
            </div>
        `;
    },
});


QUnit.test(
    "delegate()",
    (assert) =>
    {
        assert.expect(2);
        const element = findOne("#element");
        const child = findOne(".first-child");

        const intermediate = delegate(element, "*", "click", () => {
            assert.step("eventlistener could be removed after use");
            off(element, "click", intermediate);
        });

        assert.equal(typeof intermediate, "function", "function was returned");

        child.click();
        child.click();
    }
);


QUnit.test(
    "delegate() with matching selector",
    (assert) =>
    {
        assert.expect(2);

        delegate(findOne("#element"), ".child", "click", () => {
            assert.step("event triggered on child element");
        });

        find(".child").forEach((childElement) => {
            childElement.click();
        });
    }
);


QUnit.test(
    "delegate() with non-matching selector",
    (assert) =>
    {
        delegate(findOne("#element"), ".not-matching-class", "click", () => {
            assert.step("event triggered on child element");
        });

        find(".child").forEach((childElement) => {
            childElement.click();
        });

        assert.verifySteps([], "no handler was triggered on the non-matching children");
    }
);


QUnit.test(
    "delegate(custom event)",
    (assert) =>
    {
        assert.expect(1);
        const element = findOne("#element");
        const child = findOne(".first-child");

        delegate(element, "*", "customEvent", () => {
            assert.step("could call handler with a custom event");
        });

        trigger(child, "customEvent");
    }
);


QUnit.test(
    "delegate(custom event) parsing an arbitrary object",
    (assert) =>
    {
        assert.expect(1);
        const element = findOne("#element");
        const child = findOne(".first-child");
        const object = {some: "object"};

        delegate(element, "*", "customEvent", (event) => {
            assert.equal(event.detail, object, "arbitrary object was parsed");
        });

        trigger(child, "customEvent", object);
    }
);


QUnit.test(
    "delegate(custom event) multiple event handler triggered by one event",
    (assert) =>
    {
        const element = findOne("#element");
        const child = findOne(".first-child");
        const order = ["first handler", "second handler", "third handler", "fourth handler", "fifth handler"];

        order.forEach((value) => {
            delegate(element, "*", "customEvent", () => {
                assert.step(value);
            });
        });

        trigger(child, "customEvent");
        assert.verifySteps(order, "tests ran in the right order");
    }
);


QUnit.test(
    "delegate() with an invalid element",
    (assert) =>
    {
        const intermediate = delegate(null, "*", "customEvent", () => {});
        assert.equal(intermediate, null, "intermediate token should be null");
    }
);


QUnit.test(
    "delegate() with an invalid selector",
    (assert) =>
    {
        delegate(findOne("#element"), null, "customElement", () => {});
        assert.step("this should have worked because the behavior of the function in this case is not defined");
    }
);


QUnit.test(
    "delegate() with an invalid event",
    (assert) =>
    {
        assert.throws(() => {
            delegate(findOne("#element"), "*", null, () => {});
        });
    }
);
