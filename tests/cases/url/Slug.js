import QUnit from "qunit";
import {Slug} from "../../../url/Slug";

QUnit.module("url/Slug");

QUnit.test(
    "Slug.transform() defaults",
    (assert) =>
    {
        // test defaults
        const instance = new Slug();
        [
            ["abc def", "abc-def"],
            ["ä-ö-ü-ß", "ae-oe-ue-ss"],
            ["ääää", "aeaeaeae"],
            ["        ", ""],
            ["a?&b", "a-b"],
            ["abc(test)", "abc(test)"],
            ["a&-&b", "a-b"],
            ["a---b", "a-b"],
            ["---a-b---", "a-b"],
            ["---a---b---c---", "a-b-c"],
        ]
            .forEach(
                ([raw, expected]) => assert.strictEqual(instance.transform(raw), expected)
            );
    }
);

QUnit.test(
    "Slug.transform() custom transforms",
    (assert) =>
    {
        // test defaults
        const instance = new Slug([
            [/z/, "a"],
        ]);
        [
            ["abc def", "abc-def"],
            ["abczdef", "abcadef"],
        ]
            .forEach(
                ([raw, expected]) => assert.strictEqual(instance.transform(raw), expected)
            );
    }
);

QUnit.test(
    "Slug.transform() custom sanitizer",
    (assert) =>
    {
        // test defaults
        const instance = new Slug([], /z/);
        [
            ["abc def", "abc def"],
            ["abczdef", "abc-def"],
        ]
            .forEach(
                ([raw, expected]) => assert.strictEqual(instance.transform(raw), expected)
            );
    }
);
