import QUnit from "qunit";
import {debounce} from "../../../timing";

QUnit.module("timing/debounce");

/**
 * NOTE:
 *
 * as all these tests depend on timings, they are quite fragile.
 * That's why they are all skipped for now
 */

QUnit.skip(
    "only call debounced function once if called in short order",
    (assert) =>
    {
        const done = assert.async(1);
        assert.expect(0);

        const debounced = debounce(done, 100);
        debounced();
        debounced();
        debounced();
    }
);


QUnit.skip(
    "debounced functions can be called multiple times if the time between the calls is long enough",
    (assert) =>
    {
        const done = assert.async(3);
        assert.expect(0);

        const debounced = debounce(done, 50);
        debounced();
        window.setTimeout(debounced, 300);
        window.setTimeout(debounced, 600);
    }
);


QUnit.skip(
    "the debounce delay can be changed",
    (assert) =>
    {
        const done = assert.async(2);
        assert.expect(0);

        const debounced = debounce(done, 300);
        debounced();
        window.setTimeout(debounced, 50);
        window.setTimeout(debounced, 800);
    }
);
