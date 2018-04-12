/* eslint-disable no-empty-function */

import {getAllListeners, off, once, trigger} from "../../../../dom/events";
import QUnit from "qunitjs";
import {findOne} from "../../../../dom/traverse";


QUnit.module("dom/events/once()", {
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
    "once() callback only called once",
    (assert) =>
    {
        assert.expect(1);
        const element = findOne(".example");
        const done = assert.async();

        once(element, "click", () => {
            assert.step("event listener triggered");
            done();
        });

        element.click();
        element.click();
    }
);


QUnit.test(
    "once() called with custom event",
    (assert) =>
    {
        assert.expect(1);
        const element = findOne(".example");
        const done = assert.async();

        once(element, "customEvent", () => {
            assert.step("event listener triggered");
            done();
        });

        trigger(element, "customEvent");
        trigger(element, "customEvent");
    }
);


QUnit.test(
    "once() removes event listener after execution",
    (assert) =>
    {
        assert.expect(3);
        const element = findOne(".example");
        const done = assert.async();

        assert.equal(getAllListeners(element).click, undefined, "listeners not defined");

        once(element, "click", () => {});

        assert.equal(getAllListeners(element).click.length, 1, "1 listener registered");

        element.click();

        window.setTimeout(
            () => {
                assert.equal(getAllListeners(element).click.length, 0, "listener was successfully removed");
                done();
            }
        );
    }
);


QUnit.test(
    "once() can be unregistered",
    (assert) =>
    {
        assert.expect(3);
        const element = findOne(".example");

        assert.equal(getAllListeners(element).click, undefined, "listeners not defined");

        const token = once(element, "click", () => {
            assert.step("event listener triggered although it should have been removed");
        });

        assert.equal(getAllListeners(element).click.length, 1, "1 listener registered");

        off(element, "click", token);
        assert.equal(getAllListeners(element).click.length, 0, "listener was successfully removed");

        element.click();
    }
);


QUnit.test(
    "once(custom event) parsing an arbitrary object",
    (assert) =>
    {
        assert.expect(1);
        const element = findOne(".example");
        const object = {some: "object"};

        once(element, "customEvent", (event) => {
            assert.equal(event.detail, object, "event listener triggered");
        });

        trigger(element, "customEvent", object);
    }
);


QUnit.test(
    "once(custom event) multiple event handler triggered by one event",
    (assert) =>
    {
        assert.expect(6);
        const element = findOne(".example");
        const order = ["first handler", "second handler", "third handler", "fourth handler", "fifth handler"];

        order.forEach((value) => {
            once(element, "customEvent", () => {
                assert.step(value);
            });
        });

        trigger(element, "customEvent");
        assert.verifySteps(order, "tests ran in the right order");
    }
);


QUnit.test(
    "once() with an invalid element",
    (assert) =>
    {
        const intermediate = once(null, "customEvent", () => {});
        assert.equal(intermediate, null, "intermediate token should be null");
    }
);


QUnit.test(
    "once() with an invalid event",
    (assert) =>
    {
        assert.throws(
            () => {
                once(findOne(".example"), null, () => {});
            },
            "function throws an error"
        );
    }
);
