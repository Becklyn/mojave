import QUnit from "qunitjs";

QUnit.module("io/file");


QUnit.test(
    "formatSize() tests",
    function (assert)
    {
        const formatSize = mojave.io.file.formatSize;

        assert.equal(formatSize(0), '0 B');
        assert.equal(formatSize(-0), '0 B');

        assert.equal(formatSize(20), '20 B');
        assert.equal(formatSize(-20), '-20 B');
        assert.equal(formatSize(123), '123 B');

        assert.equal(formatSize(2000), '2 kB');

        assert.equal(formatSize(2500), '2,5 kB');

        assert.equal(formatSize(2512000000), '2,51 GB');
    }
);
