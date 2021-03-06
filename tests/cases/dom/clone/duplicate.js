import QUnit from "qunit";
import {children} from "../../../../dom/traverse";
import {createElement} from "../../../../dom/manipulate";
import {duplicate} from "../../../../dom/clone";

QUnit.module("dom/clone/duplicate()");

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
        const duplicatedElement = duplicate(element);


        // region check whether the duplicated element is a DOM element on its own
        assert.notStrictEqual(duplicatedElement, element, "elements are not one and the same element");
        // endregion


        // region check element attributes
        for (let i = 0; i < element.attributes.length; i++)
        {
            const attribute = element.attributes.item(i).name;

            assert.strictEqual(
                duplicatedElement.getAttribute(attribute),
                element.getAttribute(attribute),
                `${attribute}-attribute was cloned`
            );
        }
        // endregion


        // region check child elements
        for(let i = 0; i < children(element).length; i++)
        {
            assert.strictEqual(
                children(duplicatedElement)[i].className,
                children(element)[i].className,
                "children were all duplicated"
            );
        }
        // endregion


        // region check HTML structure
        assert.strictEqual(duplicatedElement.outerHTML, element.outerHTML, `outerHTML was duplicated`);
        // endregion
    }
);


QUnit.test(
    "with (query) string",
    (assert) =>
    {
        assert.throws(
            () => {
                duplicate("#qunit-fixture");
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
                duplicate(null);
            },
            "function threw an error",
        );
    }
);
