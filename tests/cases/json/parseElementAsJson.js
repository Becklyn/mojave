import {findOne} from "../../../dom/traverse";
import {parseElementAsJson} from "../../../json";
import QUnit from "qunit";


QUnit.module("json/parseElementAsJson()");


QUnit.test("Parse correctly", assert => {
    let fixture = findOne("#qunit-fixture");
    fixture.innerHTML = `<script type="application/json">{"&lt;b&gt;":2,"&lt;a&amp;b&amp;c&gt;":3}</script>`;

    assert.deepEqual(parseElementAsJson(fixture.firstElementChild), {"<b>": 2, "<a&b&c>": 3});
});

QUnit.test("allow passing null", assert => {
    assert.strictEqual(null, parseElementAsJson(null));
});
