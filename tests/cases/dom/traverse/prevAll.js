QUnit.module(
    "prevAll()",
    {
        beforeEach: function ()
        {
            document.getElementById("qunit-fixture").innerHTML =
                '<div class="test-element-prevAll element1"></div>' +
                '<div class="test-element-prevAll test-class-prevAll element2">' +
                    '<div class="test-element-prevAll element2-1"></div>' +
                '</div>' +
                'Some text' +
                '<div class="test-element-prevAll test-class-prevAll element3"></div>' +
                '<div class="test-element-prevAll element4"></div>' +
                '<div class="test-element-prevAll element5"></div>' +
                '<div class="test-element-prevAll element6"></div>';
        }
    }
);


QUnit.test(
    "prevAll() with an element in the middle, without selector",
    function (assert)
    {
        const prevAll = mojave.dom.traverse.prevAll;
        const element = document.querySelector(".test-element-prevAll.element2");

        const result = prevAll(element);

        assert.equal(result.length, 1, "found 1 element");
        assert.ok(result[0].classList.contains("element1"), "contains .element1");
    }
);


QUnit.test(
    "prevAll() with an element at the end, without selector",
    function (assert)
    {
        const prevAll = mojave.dom.traverse.prevAll;
        const element = document.querySelector(".test-element-prevAll.element6");

        const result = prevAll(element);

        assert.equal(result.length, 5, "found 5 elements");
        assert.ok(result[0].classList.contains("element5"), "contains .element5");
        assert.ok(result[1].classList.contains("element4"), "contains .element4");
        assert.ok(result[2].classList.contains("element3"), "contains .element3");
        assert.ok(result[3].classList.contains("element2"), "contains .element2");
        assert.ok(result[4].classList.contains("element1"), "contains .element1");
    }
);


QUnit.test(
    "prevAll() with an element at the start, without selector",
    function (assert)
    {
        const prevAll = mojave.dom.traverse.prevAll;
        const element = document.querySelector(".test-element-prevAll.element1");

        const result = prevAll(element);

        assert.equal(result.length, 0, "found 0 elements");
    }
);



QUnit.test(
    "prevAll() with an element at the end, with selector",
    function (assert)
    {
        const prevAll = mojave.dom.traverse.prevAll;
        const element = document.querySelector(".test-element-prevAll.element4");

        const result = prevAll(element, ".test-class-prevAll");

        assert.equal(result.length, 2, "found 2 elements");
        assert.ok(result[0].classList.contains("element3"), "contains .element3");
        assert.ok(result[1].classList.contains("element2"), "contains .element2");
    }
);
