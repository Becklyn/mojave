import {off, on, trigger} from "../../../../dom/events";
import QUnit from "qunitjs";
import {findOne} from "../../../../dom/traverse";

QUnit.module("dom/events/on()", {
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
    "on(click) with existing DOM node",
    (assert) =>
    {
        assert.expect(1);
        const element = findOne("#button");
        const done = assert.async();

        on(element, "click", () => {
            assert.step("event listener triggered");
            done();
        });

        element.click();
    }
);


QUnit.test(
    "on(custom event) with existing DOM node",
    (assert) =>
    {
        assert.expect(1);
        const element = findOne("#button");

        on(element, "customEvent", () => {
            assert.step("event listener triggered");
        });

        trigger(element, "customEvent");
    }
);

QUnit.test(
    "on(custom event) parsing an arbitrary object",
    (assert) =>
    {
        assert.expect(1);
        const element = findOne(".example");
        const object = {some: "object"};

        on(element, "customEvent", (event) => {
            assert.equal(event.detail, object, "event listener triggered");
        });

        trigger(element, "customEvent", object);
    }
);


QUnit.test(
    "on(custom event) triggering the event multiple times",
    (assert) =>
    {
        assert.expect(5);
        const element = findOne(".example");

        on(element, "customEvent", () => {
            assert.step("event listener triggered");
        });

        for(let i = 0; i < 5; i++)
        {
            trigger(element, "customEvent");
        }
    }
);


QUnit.test(
    "on(custom event) multiple event handler triggered by one event",
    (assert) =>
    {
        const element = findOne(".example");
        const order = ["first handler", "second handler", "third handler", "fourth handler", "fifth handler"];

        order.forEach((value) => {
            on(element, "customEvent", () => {
                assert.step(value);
            });
        });

        trigger(element, "customEvent");
        assert.verifySteps(order, "tests ran in the right order");
    }
);


QUnit.test(
    "on(custom event) is not callable after removal",
    (assert) =>
    {
        assert.expect(1);
        const element = findOne(".example");
        const handler = () => {
            assert.step("handler is called once");
        };

        on(element, "customEvent", handler);
        trigger(element, "customEvent");
        off(element, "customEvent", handler);
        trigger(element, "customEvent");
    }
);


QUnit.test(
    "on() with null",
    (assert) =>
    {
        on(null, "click", () => {});
        assert.ok(true, "null is silently ignored");
    }
);


QUnit.test(
    "on() with an invalid event",
    (assert) =>
    {
        assert.throws(
            () => {
                on(findOne(".example"), null, () => {});
            },
            "function threw an error"
        );
    }
);
