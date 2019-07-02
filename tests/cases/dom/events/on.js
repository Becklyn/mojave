import {off, on, trigger} from "../../../../dom/events";
import QUnit from "qunit";
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
        const done = assert.async(1);
        assert.expect(0);
        const element = findOne("#button");

        on(element, "click", done);
        element.click();
    }
);


QUnit.test(
    "on(custom event) with existing DOM node",
    (assert) =>
    {
        const done = assert.async(1);
        assert.expect(0);
        const element = findOne("#button");

        on(element, "customEvent", done);
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
            assert.strictEqual(event.detail, object, "event listener triggered");
        });

        trigger(element, "customEvent", object);
    }
);


QUnit.test(
    "on(custom event) triggering the event multiple times",
    (assert) =>
    {
        const done = assert.async(5);
        assert.expect(0);
        const element = findOne(".example");

        on(element, "customEvent", done);

        for (let i = 0; i < 5; i++)
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
        const done = assert.async(1);
        assert.expect(0);
        const element = findOne(".example");

        on(element, "customEvent", done);
        trigger(element, "customEvent");
        off(element, "customEvent", done);
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
    "on() with array of null",
    (assert) =>
    {
        assert.expect(1);

        on([null, null, null], "click", () => {});
        assert.ok(true);
    }
);

QUnit.test(
    "on() with array of mixed entries (null and existing element)",
    (assert) =>
    {
        assert.expect(1);

        on([null, findOne(".example"), null], "click", () => {});
        assert.ok(true);
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

QUnit.test(
    "on() with an array of elements and an invalid event",
    (assert) =>
    {
        assert.throws(
            () => {
                on([findOne(".example")], null, () => {});
            },
            "function threw an error"
        );
    }
);

QUnit.test(
    "on() with an array of null and an invalid event",
    (assert) =>
    {
        assert.throws(
            () => {
                on([null, null, null], null, () => {});
            },
            "function threw an error"
        );
    }
);

QUnit.test(
    "on() with an array of mixed entries (null and existing element) and an invalid event",
    (assert) =>
    {
        assert.throws(
            () => {
                on([null, findOne(".example"), null], null, () => {});
            },
            "function threw an error"
        );
    }
);
