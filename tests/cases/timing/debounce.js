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
    (assert) =>
    {
        assert.expect(1);
        const done = assert.async();
        const debounced = debounce(
            () => {
                assert.step("debounce called");
                // it should only be called once, so the first call is the last one
                done();
            },
            100
        );

        debounced();
        debounced();
        debounced();
    }
);


QUnit.test(
    "debounced functions can be called multiple times if the time between the calls is long enough",
    (assert) =>
    {
        assert.expect(3);
        const done = assert.async();

        const debounced = debounce(
            (last = false) => {
                assert.step("debounce called");

                if (last)
                {
                    done();
                }
            },
            50
        );

        debounced();
        window.setTimeout(debounced, 300);
        window.setTimeout(() => debounced(true), 600);
    }
);


QUnit.test(
    "the debounce delay can be changed",
    (assert) =>
    {
        assert.expect(2);
        const done = assert.async();
        const debounced = debounce(
            (last = false) => {
                assert.step("debounce called");

                if (last)
                {
                    done();
                }
            },
            300
        );

        debounced();
        window.setTimeout(debounced, 50);
        window.setTimeout(() => debounced(true), 800);
    }
);
