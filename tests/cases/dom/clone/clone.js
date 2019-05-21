import {children, findOne} from "../../../../dom/traverse";
import {on, trigger} from "../../../../dom/events";
import QUnit from "qunit";
import {clone} from "../../../../dom/clone";

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
        assert.notStrictEqual(clonedElement, element, "elements are not one and the same element");
        // endregion


        // region check if event handler were cloned
        assert.ok(triggered, `event was cloned to the new element`);
        // endregion


        // region check element attributes
        for (let i = 0; i < element.attributes.length; i++)
        {
            const attribute = element.attributes.item(i).name;

            assert.strictEqual(
                clonedElement.getAttribute(attribute),
                element.getAttribute(attribute),
                `${attribute}-attribute was cloned`
            );
        }
        // endregion


        // region check child elements
        for(let i = 0; i < children(element).length; i++)
        {
            assert.strictEqual(
                children(clonedElement)[i].className,
                children(element)[i].className,
                "children were all cloned"
            );
        }
        // endregion


        // region check HTML structure
        assert.strictEqual(clonedElement.outerHTML, element.outerHTML, `outerHTML was cloned`);
        // endregion
    }
);
