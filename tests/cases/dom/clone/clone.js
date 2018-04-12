import {children, findOne} from "../../../../dom/traverse";
import {on, trigger} from "../../../../dom/events";
import QUnit from "qunit";
import {clone} from "../../../../dom/clone";
import {getAttr} from "../../../../dom/attr";

QUnit.module("dom/clone/clone()", {
    beforeEach: () =>
    {
        findOne("#qunit-fixture").innerHTML = `
            <div id="id" class="className test test2" style="display: none; visibility: hidden;" data-test="test">
                <p class="child-1">
                    content
                </p>
                <p class="child-2">
                    other content
                </p>
            </div>
        `;
    },
});

QUnit.test(
    "with created node element",
    (assert) =>
    {
        const element = findOne("#id");
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
        for (let i = 0; i < element.attributes.length; i++)
        {
            const attribute = element.attributes.item(i).name;

            assert.equal(
                getAttr(clonedElement, attribute),
                getAttr(element, attribute),
                `${attribute}-attribute was cloned`
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
                clone("#qunit-fixture");
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
                clone(null);
            },
            "function threw an error",
        );
    }
);
