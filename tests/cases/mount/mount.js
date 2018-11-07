import {findOne} from "../../../dom/traverse";
import QUnit from "qunit";
import {mount} from "../../../mount";

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

        mount(".fixture", ExampleMountComponent, [42], context);
    }
);
