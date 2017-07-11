import QUnit from "qunitjs";
import {remove} from "../../../../dom/manipulate";

QUnit.module("dom/manipulate/remove()",
    {
        beforeEach: function ()
        {
            document.getElementById("qunit-fixture").innerHTML = `
                <div id="parent">
                    <div id="first"></div>
                    <div id="second"></div>
                    <div id="third"></div>
                </div>
            `;
        }
    }
);


QUnit.test(
    "remove() on existent element",
    function (assert)
    {
        const id = "first";
        remove(document.getElementById(id));

        assert.ok(document.getElementById("parent"), "parent still exists");
        assert.notOk(document.getElementById(id), "has no occurrence");


    }
);


QUnit.test(
    "remove() on non-existent element (fails)",
    function (assert)
    {



        assert.throws(
            () => {
                remove(null);
            },
            "function threw an error"
        );
    }
);
