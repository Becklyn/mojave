QUnit.module(
    "filter()",
    {
        beforeEach: function ()
        {
            document.getElementById("qunit-fixture").innerHTML =
                '<div class="test-element element1"></div>' +
                '<div class="test-element element2">'+
                    '<div class="test-element element2-1"></div>' +
                '</div>' +
                'Some text' +
                '<div class="test-element element3"></div>' +
                '<div class="test-element element4"></div>';
        }
    }
);


QUnit.test(
    "filter() on element with specific class",
    function (assert)
    {
        const find = mojave.dom.traverse.find;
        const filter = mojave.dom.traverse.filter;
        const elements = find(".test-element");

        const result = filter(elements, ".element2");

        assert.equal(result.length, 1, "found 1 element");
        assert.ok(result[0].classList.contains("element2"), "found .element2");
    }
);
