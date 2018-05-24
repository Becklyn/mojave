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


QUnit.test(
    "with an query string as an reference",
    (assert) =>
    {
        assert.throws(
            () => {
                replace(createElement("div"), "#test");
            },
            "function threw an error"
        );
    }
);


QUnit.test(
    "with an invalid reference",
    (assert) =>
    {
        assert.throws(
            () => {
                replace(createElement("div"), null);
            },
            "function threw an error"
        );
    }
);


QUnit.test(
    "with a html string as an replacement",
    (assert) =>
    {
        assert.throws(
            () => {
                replace(`<div class="replacement"></div>`, findOne("#test"));
            },
            "function threw an error"
        );
    }
);
