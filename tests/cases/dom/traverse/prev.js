QUnit.module(
    "prev()",
    {
        beforeEach: function ()
        {
            document.getElementById("qunit-fixture").innerHTML =
                '<div class="test-element-prev element1"></div>' +
                '<div class="test-element-prev element2"></div>' +
                'Some text' +
                '<div class="test-element-prev element3"></div>';
        }
    }
);


QUnit.test(
    "prev() with an element in the middle, without selector",
    function (assert)
    {
        const prev = mojave.dom.traverse.prev;
        const element = document.querySelector(".test-element-prev.element2");

        const result = prev(element);

        assert.ok(result, "found 1 element");
        assert.ok(result.classList.contains("element1"), "contains .element1");
    }
);


QUnit.test(
    "prev() with an element at the start, without selector",
    function (assert)
    {
        const prev = mojave.dom.traverse.prev;
        const element = document.querySelector(".test-element-prev.element1");

        const result = prev(element);

        assert.notOk(result, "found 0 elements");
    }
);


QUnit.test(
    "prev() with an element at the end, with selector",
    function (assert)
    {
        const prev = mojave.dom.traverse.prev;
        const element = document.querySelector(".test-element-prev.element3");

        const result = prev(element, ".element1");

        assert.ok(result, "found 1 element");
        assert.ok(result.classList.contains("element1"), "contains .element1");
    }
);
