import {on, trigger} from "../../../../dom/events";
import QUnit from "qunit";
import {findOne} from "../../../../dom/traverse";


QUnit.module("dom/events/trigger()", {
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
    "trigger() with an click event",
    (assert) =>
    {
        const done = assert.async(1);
        assert.expect(0);
        const element = findOne(".example");

        on(element, "click", done);
        trigger(element, "click");
    }
);


QUnit.test(
    "trigger() with a custom event",
    (assert) =>
    {
        const done = assert.async(1);
        assert.expect(0);
        const element = findOne(".example");

        on(element, "customEvent", done);
        trigger(element, "customEvent");
    }
);


QUnit.test(
    "trigger() with null",
    (assert) =>
    {
        trigger(null, "click");
        assert.ok(true, "null is silently ignored");
    }
);


QUnit.test(
    "trigger() with an invalid event",
    (assert) =>
    {
        trigger(findOne(".example"), null);
        assert.ok(true, "this should have worked because the behavior of the function in this case is not defined");
    }
);
