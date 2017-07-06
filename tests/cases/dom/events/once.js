import {createElement} from "../../../../dom/manipulate";
import {off, once} from "../../../../dom/events";

QUnit.module("dom/events/once()");


QUnit.test("once() callback only called once", (assert) => {
    assert.expect(1);
    const el = createElement("div");
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
    const el = createElement("div");
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
    const el = createElement("div");
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
    const el = createElement("div");

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
