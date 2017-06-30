QUnit.module(
    "not()",
    {
        beforeEach: function ()
        {
            document.getElementById("qunit-fixture").innerHTML =
                '<div class="test-element-not element1"></div>' +
                'Some text' +
                '<div class="test-element-filter element2">'+
                    '<div class="test-element-filter element2-1"></div>' +
                '</div>' +
                '<div class="test-element-not element3">' +
                '<div class="test-element-not element4">';
        }
    }
);


QUnit.test(
    "global not()",
    function (assert)
    {
        const not = mojave.dom.traverse.not;
        const elements = Array.from(document.querySelectorAll(".test-element-not"));

        const result = not(elements, ".element2");

        assert.equal(result.length, 3, "found 3 element");
        assert.ok(result[0].classList.contains("element1"), "contains .element1");
        assert.ok(result[1].classList.contains("element3"), "contains .element3");
        assert.ok(result[2].classList.contains("element4"), "contains .element4");
    }
);
