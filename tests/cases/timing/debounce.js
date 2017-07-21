import QUnit from "qunitjs";
import {debounce} from "../../../timing";

QUnit.module("timing/debounce");

/**
 * NOTE:
 *
 * as all these tests depend on timings, they are quite fragile.
 */

QUnit.test(
    "only call debounced function once if called in short order",
    function (assert)
    {
        assert.expect(2);
        const done = assert.async();
        let called = 0;
        const debounced = debounce(
            () => {
                assert.step("debounce called");
                called += 1;
            },
            100
        );

        debounced();
        debounced();
        debounced();

        window.setTimeout(function () {
            assert.equal(called, 1, "the debounced function should only been called once");
            done();
        }, 600);
    }
);


QUnit.test(
    "debounced functions can be called multiple times if the time between the calls is long enough",
    function (assert)
    {
        assert.expect(3);
        const done = assert.async();
        let called = 0;

        const debounced = debounce(
            () => {
                assert.step("debounce called");
                called += 1;

                if (called === 3)
                {
                    done();
                }
            },
            50
        );

        debounced();
        window.setTimeout(debounced, 100);
        window.setTimeout(debounced, 200);
    }
);


QUnit.test(
    "the debounce delay can be changed",
    function (assert)
    {
        assert.expect(2);
        const done = assert.async();
        let called = 0;
        const debounced = debounce(
            () => {
                assert.step("debounce called");
                called += 1;

                if (called === 2)
                {
                    done();
                }
            },
            100
        );

        debounced();
        window.setTimeout(debounced, 50);
        window.setTimeout(debounced, 200);
    }
);
