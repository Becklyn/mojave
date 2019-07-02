import {findOne} from "../../../dom/traverse";
import QUnit from "qunit";
import {mount} from "../../../mount";
import {h} from "preact";


QUnit.module("mount()", {
    beforeEach: () =>
    {
        findOne("#qunit-fixture").innerHTML = `
            <div id="fixture-1" class="fixture"></div>
            <div id="fixture-2" class="fixture"></div>
            <div id="fixture-3" class="fixture"></div>
        `;
    },
});

QUnit.test(
    "with class: the correct parameters are passed",
    (assert) =>
    {
        let context = findOne("#qunit-fixture");
        let counter = 0;

        let expectedArguments = [
            {
                0: findOne("#fixture-1", context),
                1: 42,
            },
            {
                0: findOne("#fixture-2", context),
                1: 42,
            },
            {
                0: findOne("#fixture-3", context),
                1: 42,
            },
        ];

        let getExpectedArguments = () => {
            let args = expectedArguments[counter];
            counter++;
            return args;
        };

        class ExampleMountComponent
        {
            constructor (firstParam, secondParam)
            {
                assert.deepEqual(arguments, getExpectedArguments())
            }

            init () {}
        }

        mount(".fixture", ExampleMountComponent, {params: [42], context, type: "class"});
    }
);

QUnit.test(
    "with JSX",
    assert =>
    {
        assert.expect(2);

        let TestComponent = () =>
        {
            assert.ok(true, "render called");
            return <div className="test"/>;
        };

        let fixture = findOne("#qunit-fixture");
        fixture.innerHTML = `<div id="container"></div>`;
        mount("#container", TestComponent, {type: "jsx"});

        assert.strictEqual(
            document.getElementById("qunit-fixture").querySelectorAll(".test").length,
            1
        );
    }
);

QUnit.test(
    "with JSX: remove mount node if not hydrating",
    assert =>
    {
        assert.expect(2);
        let TestComponent = () =>
        {
            return <div className="test"/>;
        };

        let fixture = findOne("#qunit-fixture");
        fixture.innerHTML = `<div id="container"></div>`;
        let mountingPoint = fixture.firstElementChild;

        assert.strictEqual(mountingPoint.parentElement, fixture, "Parent is set beforehand");
        mount("#container", TestComponent, {type: "jsx"});
        assert.strictEqual(mountingPoint.parentElement, null, "Parent isn't set anymore, as the node has been removed from the DOM");
    }
);

QUnit.test(
    "with JSX: hydrate on mount",
    assert =>
    {
        assert.expect(4);
        let TestComponent = (props) =>
        {
            assert.strictEqual(props.a, undefined, "The JSON in the body has not been parsed.");
            return <div className="test"/>;
        };

        let fixture = findOne("#qunit-fixture");
        fixture.innerHTML = `<div id="container">{"a": 1}</div>`;
        let mountingPoint = fixture.firstElementChild;

        assert.strictEqual(mountingPoint.parentElement, fixture, "Parent is set beforehand");
        mount("#container", TestComponent, {type: "jsx", hydrate: true});
        // keep element in DOM
        assert.strictEqual(mountingPoint.parentElement, fixture, "Parent is set after, as the node hasn't been removed from the dom.");
        assert.strictEqual(fixture.childElementCount, 1, "The node was hydrated / reused and no new node was added.");
    }
);

QUnit.test(
    "with JSX: the correct parameters are passed",
    assert =>
    {
        assert.expect(3);
        let params = {
            a: 5,
            b: {c: "test"},
            d: 7.5
        };

        let TestComponent = (props) =>
        {
            assert.strictEqual(props.a, params.a);
            assert.strictEqual(props.b, params.b);
            assert.strictEqual(props.d, params.d);
            return <div className="test"/>;
        };

        findOne("#qunit-fixture").innerHTML = `<div id="container"></div>`;
        mount("#container", TestComponent, {type: "jsx", params});
    }
);


QUnit.test(
    "with function",
    assert =>
    {
        assert.expect(1);

        findOne("#qunit-fixture").innerHTML = `<div id="container"></div>`;
        let fixtures = document.getElementById("qunit-fixture");
        let container = fixtures.firstElementChild;

        mount(
            "#container",
            (element) => assert.strictEqual(element, container),
            {
                context: fixtures,
            }
        );
    }
);


QUnit.test(
    "with function: correct argument passing",
    assert =>
    {
        assert.expect(4);

        findOne("#qunit-fixture").innerHTML = `<div id="container"></div>`;
        let fixtures = document.getElementById("qunit-fixture");
        let container = fixtures.firstElementChild;
        let objectParam = {a: "a"};

        mount(
            "#container",
            (element, a, b, c) => {
                assert.strictEqual(element, container);
                assert.strictEqual(a, 1);
                assert.strictEqual(b, 2);
                assert.strictEqual(c, objectParam);
            },
            {
                context: fixtures,
                params: [1, 2, objectParam]
            }
        );
    }
);
