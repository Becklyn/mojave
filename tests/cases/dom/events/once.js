import {off, once} from "../../../../dom/events";
import QUnit from "qunitjs";
import {findOne} from "../../../../dom/traverse";

QUnit.module("dom/events/once()", {
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


QUnit.test("once() callback only called once", (assert) => {
    assert.expect(1);
    const el = findOne("#button");
    const done = assert.async();

    once(el, "click", () => {
        assert.ok(true, "event listener triggered");
        done();
    });

    el.click();
    el.click();
});


QUnit.test("once() removes event listener after execution", (assert) => {
    assert.expect(3);
    const el = findOne("#button");
    const done = assert.async();

    assert.equal(el._listeners, undefined, "listeners not defined");

    once(el, "click", () => {});

    assert.equal(el._listeners.click.length, 1, "1 listener registered");

    el.click();

    window.setTimeout(
        () => {
            assert.equal(el._listeners.click.length, 0, "listener was successfully removed");
            done();
        }
    );
});


QUnit.test("once removes event listener", (assert) => {
    assert.expect(3);
    const el = findOne("#button");
    const done = assert.async();

    assert.equal(el._listeners, undefined, "listeners not defined");

    once(el, "click", () => {});

    assert.equal(el._listeners.click.length, 1, "1 listener registered");

    el.click();

    window.setTimeout(
        () => {
            assert.equal(el._listeners.click.length, 0, "listener was successfully removed");
            done();
        }
    );
});



QUnit.test("once() can be unregistered", (assert) => {
    assert.expect(3);
    const el = findOne("#button");

    assert.equal(el._listeners, undefined, "listeners not defined");

    const token = once(el, "click", () => {
        assert.ok(false, "event listener triggered although it should have been removed");
        done();
    });

    assert.equal(el._listeners.click.length, 1, "1 listener registered");

    off(el, "click", token);
    assert.equal(el._listeners.click.length, 0, "listener was successfully removed");

    el.click();
});
