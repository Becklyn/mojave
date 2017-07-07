QUnit.module("timing/debounce");

import {debounce} from "../../../timing/timing";

/**
 * NOTE:
 *
 * as all these tests depend on timings, they are quite fragile.
 */

QUnit.test(
    "only call debounced function once if called in short order",
    function (assert)
    {
        const done = assert.async();
        let called = 0;
        const debounced = debounce(
        () => {
            assert.ok(true, "debounce called");
            called += 1;

            if (called === 3)
            {
                done();
            }
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
                assert.ok(true, "debounce called");
                called += 1;

                if (called === 3)
                {
                    done();
                }
            },
            50
        );

        debounced();
        window.setTimeout(debounced, 200);
        window.setTimeout(debounced, 400);
    }
);


QUnit.test(
    "the debounce delay can be changed",
    function (assert)
    {
        const done = assert.async();
        let called = 0;
        const debounced = debounce(
            () => {
                assert.ok(true, "debounce called");
                called += 1;

                if (called === 2)
                {
                    done();
                }
            },
            300
        );

        debounced();
        window.setTimeout(debounced, 100);
        window.setTimeout(debounced, 500);
    }
);
