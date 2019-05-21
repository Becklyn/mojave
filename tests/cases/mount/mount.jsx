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
    "mount() test that the correct parameters are passed, fixes #158",
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

        mount(".fixture", ExampleMountComponent, {params: [42], context});
    }
);

QUnit.test(
    "mount() with JSX component",
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

        mount("#container", Test, {jsx: true});

        assert.strictEqual(
            document.getElementById("qunit-fixture").querySelectorAll(".test").length,
            1
        );
    }
);

QUnit.test(
    "mount() test that the correct parameters are passed for JSX",
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
        mount("#container", Test, {jsx: true, params});
    }
);
