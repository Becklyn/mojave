QUnit.module(
    "find()",
    {
        beforeEach: function ()
        {
            const child1 = document.createElement("div");
            child1.classList.add("test-element-find", "element1");

            const child2 = document.createElement("div");
            child2.classList.add("test-element-find", "element2");

            const child2_1 = document.createElement("div");
            child2_1.classList.add("test-element-find", "element2-1");
            child2.appendChild(child2_1);

            const child3 = document.createElement("div");
            child3.classList.add("test-element-find", "element3");

            const fixture = document.getElementById("qunit-fixture");
            fixture.appendChild(child1);
            fixture.appendChild(child2);
            fixture.appendChild(document.createTextNode("Test123"));
            fixture.appendChild(child3);
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
