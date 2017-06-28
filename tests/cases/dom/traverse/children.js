QUnit.module(
    "children()",
    {
        beforeEach: function ()
        {
            const child1 = document.createElement("div");
            child1.classList.add("element1");

            const child2 = document.createElement("div");
            child2.classList.add("element2");

            const fixture = document.getElementById("qunit-fixture");
            fixture.appendChild(child1);
            fixture.appendChild(child2);
            fixture.appendChild(document.createTextNode("Test123"));
        }
    }
);


QUnit.test(
    "children() without selector",
    function (assert)
    {
        const children = mojave.dom.traverse.children;
        const fixture = document.getElementById("qunit-fixture");


        const result = children(fixture);
        assert.equal(result.length, 2, "has 2 children");
        assert.ok(result[0].classList.contains("element1"), "contains .element1");
        assert.ok(result[1].classList.contains("element2"), "contains .element2");
    }
);


QUnit.test(
    "children() with selector",
    function (assert)
    {
        const children = mojave.dom.traverse.children;
        const fixture = document.getElementById("qunit-fixture");


        const result = children(fixture, ".element2");
        assert.equal(result.length, 1, "only one match");
        assert.ok(result[0].classList.contains("element2"), "the match has the correct class");
    }
);
