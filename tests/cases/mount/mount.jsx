import {findOne} from "../../../dom/traverse";
import QUnit from "qunit";
import {mount} from "../../../mount";
import {h, Component} from "preact";


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
    "with class: the correct parameters are passed, fixes #158",
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

        class Test extends Component
        {
            render ()
            {
                assert.ok(true, "render called");
                return <div className="test"/>;
            }
        }

        findOne("#qunit-fixture").innerHTML = `<div id="container"></div>`;

        mount("#container", Test, {type: "jsx"});

        assert.strictEqual(
            document.getElementById("qunit-fixture").querySelectorAll(".test").length,
            1
        );
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

        class Test extends Component
        {
            render (props)
            {
                assert.strictEqual(props.a, params.a);
                assert.strictEqual(props.b, params.b);
                assert.strictEqual(props.d, params.d);
                return <div className="test"/>;
            }
        }

        findOne("#qunit-fixture").innerHTML = `<div id="container"></div>`;
        mount("#container", Test, {type: "jsx", params});
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
        assert.expect(3);

        findOne("#qunit-fixture").innerHTML = `<div id="container"></div>`;
        let fixtures = document.getElementById("qunit-fixture");
        let container = fixtures.firstElementChild;

        mount(
            "#container",
            (element, a, b) => {
                assert.strictEqual(element, container);
                assert.strictEqual(a, 1);
                assert.strictEqual(b, 2);
            },
            {
                context: fixtures,
                params: [1, 2]
            }
        );
    }
);
