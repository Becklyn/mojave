QUnit.module("dom/traverse/find",
    {
        beforeEach: function ()
        {
            document.getElementById("qunit-fixture").innerHTML =
                '<div class="test-element-find element1"></div>' +
                '<div class="test-element-find element2">'+
                    '<div class="test-element-find element2-1"></div>' +
                '</div>' +
                'Some text' +
                '<div class="test-element-find element3"></div>';
        }
    }
);


QUnit.test(
    "global find()",
    function (assert)
    {
        const find = mojave.dom.traverse.find;

        const result = find(".test-element-find.element1");

        assert.equal(result.length, 1, "found 1 element");
        assert.ok(result[0].classList.contains("element1"), "contains .element1");
    }
);


QUnit.test(
    "global find() + find order",
    function (assert)
    {
        const find = mojave.dom.traverse.find;

        const result = find(".test-element-find");

        assert.equal(result.length, 4, "found 4 elements");
        assert.ok(result[0].classList.contains("element1"), "contains .element1");
        assert.ok(result[1].classList.contains("element2"), "contains .element2");
        assert.ok(result[2].classList.contains("element2-1"), "contains .element2-1");
        assert.ok(result[3].classList.contains("element3"), "contains .element3");
    }
);
