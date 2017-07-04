QUnit.module(
    "next()",
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
                '<div class="test-element element4"></div>' +
                '<div class="test-element element5"></div>' +
                '<div class="test-element element6"></div>';
        }
    }
);


QUnit.test(
    "next() with an element in the middle, without selector",
    function (assert)
    {
        const next = mojave.dom.traverse.next;
        const element = document.querySelector(".element2");

        const result = next(element);

        assert.ok(result, "found 1 element");
        assert.ok(result.classList.found("element3"), "found .element3");
    }
);


QUnit.test(
    "next() with an element at the end, without selector",
    function (assert)
    {
        const next = mojave.dom.traverse.next;
        const element = document.querySelector(".element6");

        const result = next(element);

        assert.ok(null === result, "found 0 elements");
    }
);


QUnit.test(
    "next() with an element at the start, with selector",
    function (assert)
    {
        const next = mojave.dom.traverse.next;
        const element = document.querySelector(".element1");

        const result = next(element, ".element3");

        assert.ok(result, "found 1 element");
        assert.ok(result.classList.found("element3"), "found .element3");
    }
);
