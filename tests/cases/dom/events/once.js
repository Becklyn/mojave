import {off, once} from "../../../../dom/events";
import QUnit from "qunitjs";
import {createElement} from "../../../../dom/manipulate";

QUnit.module("dom/events/once()");


QUnit.test("once() callback only called once", (assert) => {
    assert.expect(1);
    const element = createElement("div");
    const done = assert.async();

    once(element, "click", () => {
        assert.ok(true, "event listener triggered");
        done();
    });

    element.click();
    element.click();
});


QUnit.test("once() removes event listener after execution", (assert) => {
    assert.expect(3);
    const element = createElement("div");
    const done = assert.async();

    assert.equal(element._listeners, undefined, "listeners not defined");

    once(element, "click", () => {});

    assert.equal(element._listeners.click.length, 1, "1 listener registered");

    element.click();

    window.setTimeout(
        () => {
            assert.equal(element._listeners.click.length, 0, "listener was successfully removed");
            done();
        }
    );
});


QUnit.test("once removes event listener", (assert) => {
    assert.expect(3);
    const element = createElement("div");
    const done = assert.async();

    assert.equal(element._listeners, undefined, "listeners not defined");

    once(element, "click", () => {});

    assert.equal(element._listeners.click.length, 1, "1 listener registered");

    element.click();

    window.setTimeout(
        () => {
            assert.equal(element._listeners.click.length, 0, "listener was successfully removed");
            done();
        }
    );
});



QUnit.test("once() can be unregistered", (assert) => {
    assert.expect(3);
    const element = createElement("div");

    assert.equal(element._listeners, undefined, "listeners not defined");

    const token = once(element, "click", () => {
        assert.ok(false, "event listener triggered although it should have been removed");
        done();
    });

    assert.equal(element._listeners.click.length, 1, "1 listener registered");

    off(element, "click", token);
    assert.equal(element._listeners.click.length, 0, "listener was successfully removed");

    element.click();
});
