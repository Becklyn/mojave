import QUnit from "qunit";
import {children} from "../../../../dom/traverse";
import {wireSourceTargetLists} from "../../../../dom/wire";

QUnit.module("dom/wire/wireSourceTargetLists()",
    {
        beforeEach: () =>
        {
            document.getElementById("qunit-fixture").innerHTML = `
                <div id="sources">
                    <div id="sources-1" data-key="1"></div>
                    <div id="sources-2" data-key="2"></div>
                    <div id="sources-orphan" data-key="sources-orphan"></div>
                    <div id="sources-missing"></div>
                </div>
                <div id="targets">
                    <div id="target-1" data-key="1"></div>    
                    <div id="target-2" data-key="2"></div>    
                    <div id="target-orphan" data-key="target-orphan"></div>    
                    <div id="target-missing"></div>    
                </div>
            `;
        },
    }
);


QUnit.test("wireSourceTargetLists() basic functionality", assert => {
    let sources = children(document.getElementById("sources"));
    let targets = children(document.getElementById("targets"));

    let map = wireSourceTargetLists(sources, targets, "key");
    assert.strictEqual(map.get(document.getElementById("sources-1")), document.getElementById("target-1"), "Elements 1 should be in the list");
    assert.strictEqual(map.get(document.getElementById("sources-2")), document.getElementById("target-2"), "Elements 2 should be in the list");
    assert.notOk(map.get(document.getElementById("sources-orphan")), "Orphan should be missing.");
    assert.notOk(map.get(document.getElementById("sources-missing")), "Element without data should be missing.");
});
