QUnit.test(
    "Slug.transform() defaults",
    function (assert)
    {
        const Slug = mojave.url.Slug;

        // test defaults
        const instance = new Slug();
        [
            ["abc def", "abc-def"],
            ["ä-ö-ü-ß", "ae-oe-ue-ss"],
            ["ääää", "aeaeaeae"],
            ["        ", ""],
            ["a?&b", "a-b"],
            ["abc(test)", "abc(test)"],
        ]
            .forEach(
                ([raw, expected]) => assert.equal(instance.transform(raw), expected)
            );
    }
);

QUnit.test(
    "Slug.transform() custom transforms",
    function (assert)
    {
        const Slug = mojave.url.Slug;

        // test defaults
        const instance = new Slug([
            [/z/, "a"],
        ]);
        [
            ["abc def", "abc-def"],
            ["abczdef", "abcadef"],
        ]
            .forEach(
                ([raw, expected]) => assert.equal(instance.transform(raw), expected)
            );
    }
);

QUnit.test(
    "Slug.transform() custom sanitizer",
    function (assert)
    {
        const Slug = mojave.url.Slug;

        // test defaults
        const instance = new Slug([], /z/);
        [
            ["abc def", "abc-def"],
            ["abczdef", "abc-def"],
        ]
            .forEach(
                ([raw, expected]) => assert.equal(instance.transform(raw), expected)
            );
    }
);
