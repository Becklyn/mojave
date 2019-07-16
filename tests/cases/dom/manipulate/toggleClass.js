import {findOne} from "../../../../dom/traverse";
import QUnit from "qunit";
import {toggleClass} from "../../../../dom/manipulate";

QUnit.module("dom/manipulate/toggleClass()",
    {
        beforeEach: () =>
        {
            findOne("#qunit-fixture").innerHTML = `
                <div id="test"></div>
                <div id="has-class" class="bar"></div>
            `;
        },
    }
);


QUnit.test(
    "with no pre-existing classes on element",
    (assert) =>
    {
        let element = findOne("#test");

        assert.strictEqual(element.classList.length, 0, "element contains class before toggleClass() was executed");

        toggleClass(element, "foo", true);
        assert.strictEqual(element.classList.length, 1, "element doesn't have new class added by toggleClass()");
        assert.ok(element.classList.contains("foo"));

        toggleClass(element, "foo", true);
        assert.strictEqual(element.classList.length, 1, "adding the same class again with toggleClass() doesn't do anything");
        assert.ok(element.classList.contains("foo"));

        toggleClass(element, "foo", false);
        assert.strictEqual(element.classList.length, 0, "class wasn't removed with toggleClass");
    }
);


QUnit.test(
    "with existing classes on element",
    (assert) =>
    {
        let element = findOne("#has-class");

        assert.strictEqual(element.classList.length, 1, "element doesn't contain class before toggleClass() was executed");
        assert.notOk(element.classList.contains("foo"));

        toggleClass(element, "foo", true);
        assert.strictEqual(element.classList.length, 2, "element doesn't have new class added by toggleClass()");
        assert.ok(element.classList.contains("foo"));

        toggleClass(element, "foo", false);
        assert.strictEqual(element.classList.length, 1, "class wasn't removed with toggleClass");
        assert.notOk(element.classList.contains("foo"));
    }
);
