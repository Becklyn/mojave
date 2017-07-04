QUnit.module(
    "not()",
    {
        beforeEach: function ()
        {
            document.getElementById("qunit-fixture").innerHTML =
                '<div class="test-element element1"></div>' +
                '<div class="test-element element2">'+
                    '<div class="test-element element2-1"></div>' +
                '</div>' +
                'Some text' +
                '<div class="test-element element3">' +
                    '<div class="test-element element3-1"></div>' +
                '</div>' +
                '<div class="test-element element4"></div>';
        }
    }
);


QUnit.test(
    "not() on element with specific class",
    function (assert)
    {
        const find = mojave.dom.traverse.find;
        const not = mojave.dom.traverse.not;
        const elements = find(".test-element");

        const result = not(elements, ".element2");

        assert.equal(result.length, 5, "found 5 elements");
        assert.ok(result[0].classList.contains("element1"), "found .element1");
        assert.ok(result[1].classList.contains("element2-1"), "found .element2-1");
        assert.ok(result[2].classList.contains("element3"), "found .element3");
        assert.ok(result[3].classList.contains("element3-1"), "found .element3-1");
        assert.ok(result[4].classList.contains("element4"), "found .element4");
    }
);


QUnit.test(
    "not() on elements that are children",
    function (assert)
    {
        const find = mojave.dom.traverse.find;
        const not = mojave.dom.traverse.not;
        const elements = find(".test-element");
        const selector = ".test-element-not > :first-child";

        const result = not(elements, selector);

        assert.equal(result.length, 4, "found 4 elements");
        assert.ok(result[0].classList.contains("element1"), "found .element1");
        assert.ok(result[1].classList.contains("element2"), "found .element2");
        assert.ok(result[2].classList.contains("element3"), "found .element3");
        assert.ok(result[3].classList.contains("element4"), "found .element4");
    }
);
