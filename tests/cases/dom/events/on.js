import {on} from "../../../../dom/events";
import QUnit from "qunitjs";
import {findOne} from "../../../../dom/traverse";

QUnit.module("dom/events/on()", {
    beforeEach ()
    {
        document.getElementById("qunit-fixture").innerHTML = `
            <div class="example">
                <button type="button" id="button"></button>
                <input type="text" id="input-element">
            </div>
        `;
    },
});


QUnit.test("on(click)", (assert) => {
    assert.expect(1);
    const button = findOne("#button");
    const done = assert.async();

    on(button, "click", () => {
        assert.ok(true, "event listener triggered");
        done();
    });

    button.click();
});
