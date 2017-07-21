import QUnit from "qunitjs";
import {on, trigger} from "../../../../dom/events";
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
    }
});


QUnit.test(
    "trigger() with an click event",
    (assert) =>
    {
        assert.expect(1);
        const element = findOne(".example");

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
        const element = findOne(".example");

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
        trigger(findOne(".example"), null);
        assert.step("this should have worked because the behavior of the function in this case is not defined");
    }
);
