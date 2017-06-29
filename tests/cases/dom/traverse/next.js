QUnit.module(
    "next()",
    {
        beforeEach: function ()
        {
            document.getElementById("qunit-fixture").innerHTML =
                '<div class="test-element-next element1"></div>' +
                '<div class="test-element-next element2">'+
                    '<div class="test-element-next element2-1"></div>' +
                '</div>' +
                'Some text' +
                '<div class="test-element-next element3"></div>' +
                '<div class="test-element-next element4"></div>' +
                '<div class="test-element-next element5"></div>' +
                '<div class="test-element-next element6"></div>';
        }
    }
);


QUnit.test(
    "next() with an element in the middle, without selector",
    function (assert)
    {
        const next = mojave.dom.traverse.next;
        const element = document.querySelector(".test-element-next.element2");

        const result = next(element);

        assert.ok(result, "found 1 element");
        assert.ok(result.classList.contains("element3"), "contains .element3");
    }
);


QUnit.test(
    "next() with an element at the end, without selector",
    function (assert)
    {
        const next = mojave.dom.traverse.next;
        const element = document.querySelector(".test-element-next.element6");

        const result = next(element);

        assert.notOk(result, "found 0 elements");
    }
);


QUnit.test(
    "next() with an element at the start, with selector",
    function (assert)
    {
        const next = mojave.dom.traverse.next;
        const element = document.querySelector(".test-element-next.element1");

        const result = next(element, ".element3");

        assert.ok(result, "found 1 element");
        assert.ok(result.classList.contains("element3"), "contains .element3");
    }
);
