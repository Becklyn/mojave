QUnit.module(
    "filter()",
    {
        beforeEach: function ()
        {
            document.getElementById("qunit-fixture").innerHTML =
                '<div class="test-element-filter element1"></div>' +
                '<div class="test-element-filter element2">'+
                    '<div class="test-element-filter element2-1"></div>' +
                '</div>' +
                'Some text' +
                '<div class="test-element-filter element3"></div>' +
                '<div class="test-element-filter element4"></div>';
        }
    }
);


QUnit.test(
    "filter() on element with specific class",
    function (assert)
    {
        const filter = mojave.dom.traverse.filter;
        const elements = Array.from(document.querySelectorAll(".test-element-filter"));

        const result = filter(elements, ".element2");

        assert.equal(result.length, 1, "found 1 element");
        assert.ok(result[0].classList.contains("element2"), "contains .element2");
    }
);
