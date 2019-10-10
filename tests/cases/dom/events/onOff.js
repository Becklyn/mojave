import QUnit from "qunit";
import {onOff, trigger} from "../../../../dom/events";


QUnit.module("dom/events/onOff()", {
    beforeEach ()
    {
        document.getElementById("qunit-fixture").innerHTML = `<button type="button" id="button"></button>`;
    },
});


QUnit.test(
    "onOff basic functionality",
    (assert) =>
    {
        const done = assert.async(1);
        assert.expect(1);
        const element = document.getElementById("button");

        let remove = onOff(element, "click", () => {
            assert.ok(true, "callback called");
            done();
        });

        trigger(element, "click");
        remove();
        trigger(element, "click");
    }
);
