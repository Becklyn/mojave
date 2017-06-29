QUnit.module(
    "nextAll()",
    {
        beforeEach: function ()
        {
            document.getElementById("qunit-fixture").innerHTML =
                '<div class="test-element-nextAll element1"></div>' +
                '<div class="test-element-nextAll test-class-nextAll element2">' +
                    '<div class="test-element-nextAll element2-1"></div>' +
                '</div>' +
                'Some text' +
                '<div class="test-element-nextAll test-class-nextAll element3"></div>' +
                '<div class="test-element-nextAll element4"></div>' +
                '<div class="test-element-nextAll element5"></div>' +
                '<div class="test-element-nextAll element6"></div>';
        }
    }
);


QUnit.test(
    "nextAll() with an element in the middle, without selector",
    function (assert)
    {
        const nextAll = mojave.dom.traverse.nextAll;
        const element = document.querySelector(".test-element-nextAll.element4");

        const result = nextAll(element);

        assert.equal(result.length, 2, "found 2 elements");
        assert.ok(result[0].classList.contains("element5"), "contains .element5");
        assert.ok(result[1].classList.contains("element6"), "contains .element6");
    }
);


QUnit.test(
    "nextAll() with an element at the start, without selector",
    function (assert)
    {
        const nextAll = mojave.dom.traverse.nextAll;
        const element = document.querySelector(".test-element-nextAll.element1");

        const result = nextAll(element);

        assert.equal(result.length, 5, "found 5 elements");
        assert.ok(result[0].classList.contains("element2"), "contains .element2");
        assert.ok(result[1].classList.contains("element3"), "contains .element3");
        assert.ok(result[2].classList.contains("element4"), "contains .element4");
        assert.ok(result[3].classList.contains("element5"), "contains .element5");
        assert.ok(result[4].classList.contains("element6"), "contains .element6");
    }
);


QUnit.test(
    "nextAll() with an element at the end, without selector",
    function (assert)
    {
        const nextAll = mojave.dom.traverse.nextAll;
        const element = document.querySelector(".test-element-nextAll.element6");

        const result = nextAll(element);

        assert.equal(result.length, 0, "found 0 elements");
    }
);



QUnit.test(
    "nextAll() with an element at the start, with selector",
    function (assert)
    {
        const nextAll = mojave.dom.traverse.nextAll;
        const element = document.querySelector(".test-element-nextAll.element1");

        const result = nextAll(element, ".test-class-nextAll");

        assert.equal(result.length, 2, "found 2 elements");
        assert.ok(result[0].classList.contains("element2"), "contains .element2");
        assert.ok(result[1].classList.contains("element3"), "contains .element3");
    }
);
