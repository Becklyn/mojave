/* eslint-disable no-empty-function */

import {delegate, off} from "../../../../dom/events";
import QUnit from "qunit";
import {findOne} from "../../../../dom/traverse";


QUnit.module("dom/events/off()", {
    beforeEach ()
    {
        findOne("#qunit-fixture").innerHTML = `
            <div class="example">
                <button type="button" id="button"></button>
                <input type="text" id="input-element">
            </div>
        `;
    },
});


QUnit.test(
    "off()",
    (assert) =>
    {
        const done = assert.async(2);
        assert.expect(0);
        const element = findOne(".example");
        const button = findOne("#button");

        const intermediate = delegate(element, "*", "click", () => {
            done();
            off(element, "click", intermediate);
        });

        button.click();
        button.click();
        done();
    }
);


QUnit.test(
    "off() with null",
    (assert) =>
    {
        off(null, "click", () => {});
        assert.ok(true, "null is silently ignored");
    }
);


QUnit.test(
    "off() with array of null",
    (assert) =>
    {
        assert.expect(1);

        off([null, null, null], "click", () => {});
        assert.ok(true);
    }
);

QUnit.test(
    "off() with array of mixed entries (null and existing element)",
    (assert) =>
    {
        assert.expect(1);

        off([null, findOne(".example"), null], "click", () => {});
        assert.ok(true);
    }
);


QUnit.test(
    "off() with an invalid event",
    (assert) =>
    {
        assert.expect(1);

        off(findOne(".example"), "", () => {});
        assert.ok(true);
    }
);

QUnit.test(
    "off() with an array of elements and an invalid event",
    (assert) =>
    {
        assert.expect(1);

        off([findOne(".example")], "", () => {});
        assert.ok(true);
    }
);

QUnit.test(
    "off() with an array of null and an invalid event",
    (assert) =>
    {
        assert.expect(1);

        off([null, null, null], "", () => {});
        assert.ok(true);
    }
);

QUnit.test(
    "off() with an array of mixed entries (null and existing element) and an invalid event",
    (assert) =>
    {
        assert.expect(1);

        off([null, findOne(".example"), null], "", () => {});
        assert.ok(true);
    }
);
