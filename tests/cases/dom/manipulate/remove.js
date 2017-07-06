QUnit.module("dom/manipulate/remove()",
    {
        beforeEach: function ()
        {
            document.getElementById("qunit-fixture").innerHTML =
                '<div class="test-element element1"></div>' +
                '<div class="test-element element2">'+
                '<div class="test-element element2-1"></div>' +
                '</div>' +
                'Some text' +
                '<div class="test-element element3"></div>';
        }
    }
);


QUnit.test(
    "remove() on existent element",
    function (assert)
    {
        const find = mojave.dom.traverse.find;
        const element = document.querySelector(".element2");
        const remove = mojave.dom.manipulate.remove;

        remove(element);

        const result = find(".element2");

        assert.equal(result.length, 0, ".element2 successfully removed");
    }
);


QUnit.test(
    "remove() on non-existent element (fails)",
    function (assert)
    {
        const find = mojave.dom.traverse.find;
        const element = document.querySelector(".missing");
        const remove = mojave.dom.manipulate.remove;

        remove(element);

        const result = find(".missing");

        assert.equal(result.length, 0, ".missing not found");
    }
);
