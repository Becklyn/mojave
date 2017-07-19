import QUnit from "qunitjs";
import {createElement} from "../../../../dom/manipulate";
import {isElement} from "../../../../dom/utils";

QUnit.module("dom/utils/isElement()");


QUnit.test(
    "with element as parameter",
    (assert) =>
    {
        assert.ok(isElement(createElement("div")), "recognised element");
    }
);


QUnit.test(
    "with an (query) string as parameter",
    (assert) =>
    {
        assert.notOk(isElement("#quint-fixture"), "recognised non-element");
    }
);


QUnit.test(
    "with an null as parameter",
    (assert) =>
    {
        assert.throws(
            () => {
                isElement(null);
            },
            "function threw an error"
        );
    }
);
