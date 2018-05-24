import QUnit from "qunit";
import {formatSize} from "../../../io/file";

QUnit.module("io/file");


QUnit.test(
    "formatSize() tests",
    (assert) =>
    {
        assert.strictEqual(formatSize(0), '0 B');
        assert.strictEqual(formatSize(-0), '0 B');

        assert.strictEqual(formatSize(20), '20 B');
        assert.strictEqual(formatSize(-20), '-20 B');
        assert.strictEqual(formatSize(123), '123 B');

        assert.strictEqual(formatSize(2000), '2 kB');

        assert.strictEqual(formatSize(2500), '2,5 kB');

        assert.strictEqual(formatSize(2512000000), '2,51 GB');
    }
);
