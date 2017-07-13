import QUnit from "qunitjs";
import {replace} from "../../../../dom/manipulate";

QUnit.module("dom/manipulate/replace()",
    {
        beforeEach: () =>
        {
            document.getElementById("qunit-fixture").innerHTML = `
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
        const children = document.getElementById("qunit-fixture").children;
        const replacement = document.createElement("p");
        const lengthBefore = children.length;
        replace(children[2], replacement);

        assert.equal(children.length, lengthBefore, "the amount of elements did not change");
        assert.equal(children[2], replacement, "element was replaced");
    }
);


QUnit.test(
    "with an query string as an reference",
    (assert) =>
    {
        assert.throws(
            () => {
                replace(document.createElement("div"), "#test");
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
                replace(document.createElement("div"), null);
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
                replace(`<div class="replacement"></div>`, document.getElementById("test"));
            },
            "function threw an error"
        );
    }
);
