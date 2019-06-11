import {safeParseJson} from "../../../json";
import QUnit from "qunit";


QUnit.module("json/safeParseJson()");


QUnit.test(
    "Parse correctly",
    (assert) =>
    {
        assert.deepEqual(safeParseJson('{"a":1}'), {a: 1});
    }
);

QUnit.test(
    "Don't fail on invalid JSON",
    (assert) =>
    {
        assert.strictEqual(safeParseJson('{a:1}'), null);
    }
);
