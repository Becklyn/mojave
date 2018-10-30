import {createElement, replace} from "../../../../dom/manipulate";
import QUnit from "qunit";
import {findOne} from "../../../../dom/traverse";

QUnit.module("dom/manipulate/replace()",
    {
        beforeEach: () =>
        {
            findOne("#qunit-fixture").innerHTML = `
                <div id="before"></div>
                <div id="test"></div>
                <div id="after"></div>
            `;
        },
    }
);


QUnit.test(
    "with valid node elements",
    (assert) =>
    {
        const children = findOne("#qunit-fixture").children;
        const replacement = createElement("p");
        const lengthBefore = children.length;
        replace(children[2], replacement);

        assert.strictEqual(children.length, lengthBefore, "the amount of elements did not change");
        assert.strictEqual(children[2], replacement, "element was replaced");
    }
);
