import { setAttrs } from "../../../../dom/attr";
import QUnit from "qunit";

QUnit.module("dom/attr/setAttrs()");


QUnit.test(
    "correctly set attributes even after special setter",
    (assert) =>
    {
        const element = document.createElement("div");

        setAttrs(element, {
            css: {
                color: "red",
            },
            test: "test-val",
            "data-test": "data-test-val",
        });

        assert.strictEqual(element.getAttribute("test"), "test-val");
        assert.strictEqual(element.getAttribute("data-test"), "data-test-val");
        assert.strictEqual(element.dataset["test"], "data-test-val");

        // the css was just skipped
        assert.strictEqual(element.style.color, "");
    }
);

