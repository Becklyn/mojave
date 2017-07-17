import {on, trigger} from "../../../../dom/events";
import QUnit from "qunitjs";
import {children} from "../../../../dom/traverse";
import {clone} from "../../../../dom/clone";
import {createElement} from "../../../../dom/manipulate";
import {getAttr} from "../../../../dom/attr";

QUnit.module("dom/clone/clone()");

QUnit.test(
    "with created node element",
    (assert) =>
    {
        const element = createElement(`
            <div id="id" class="className.test.test2" style="display: none; visibility: hidden;" data-test="test">
                <p class="child-1">
                    content
                </p>
                <p class="child-2">
                    other content
                </p>
            </div>
        `);
        let triggered = false;

        on(element, "eventTrigger", () => {
            triggered = true;
        });


        const clonedElement = clone(element);
        trigger(clonedElement, "eventTrigger");


        // region check whether the cloned element is a DOM element on its own
        assert.notEqual(clonedElement, element, "elements are not one and the same element");
        // endregion


        // region check if event handler were cloned
        assert.ok(triggered, `event was cloned to the new element`);
        // endregion


        // region check element attributes
        for(const attribute of element.attributes)
        {
            assert.equal(
                getAttr(clonedElement, attribute),
                getAttr(element, attribute),
                `${attribute.name}-attribute was cloned`
            );
        }
        // endregion


        // region check child elements
        for(let i = 0; i < children(element).length; i++)
        {
            assert.equal(
                children(clonedElement)[i].className,
                children(element)[i].className,
                "children were all cloned"
            );
        }
        // endregion


        // region check HTML structure
        assert.equal(clonedElement.outerHTML, element.outerHTML, `outerHTML was cloned`);
        // endregion
    }
);


QUnit.test(
    "with (query) string",
    (assert) =>
    {
        assert.throws(
            () => {
                const element = clone("#qunit-fixture");
            },
            "function threw an error",
        );
    }
);


QUnit.test(
    "with an invalid parameter",
    (assert) =>
    {
        assert.throws(
            () => {
                const element = clone(null);
            },
            "function threw an error",
        );
    }
);
