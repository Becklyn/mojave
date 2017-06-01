/**
 * NOTE:
 *
 * as all these tests depend on timings, they are quite fragile.
 */

QUnit.test(
    "only call debounced function once if called in short order",
    function (assert)
    {
        var done = assert.async();
        var called = 0;
        var debounced = mojave.timing.debounce(
            function ()
            {
                called += 1;
            },
            100
        );


        debounced();
        debounced();
        debounced();

        window.setTimeout(
            function ()
            {
                assert.equal(called, 1, "the debounced function should only been called once");
                done();
            },
            1000
        );
    }
);


QUnit.test(
    "debounced functions can be called multiple times if the time between the calls is long enough",
    function (assert)
    {
        var done = assert.async();
        var called = 0;
        var debounced = mojave.timing.debounce(
            function ()
            {
                called += 1;
            },
            50
        );


        debounced();

        window.setTimeout(debounced, 200);
        window.setTimeout(debounced, 400);

        window.setTimeout(
            function ()
            {
                assert.equal(called, 3, "the debounced function should have been called three times");
                done();
            },
            1000
        );
    }
);


QUnit.test(
    "the debounce delay can be changed",
    function (assert)
    {
        var done = assert.async();
        var called = 0;
        var debounced = mojave.timing.debounce(
            function ()
            {
                called += 1;
            },
            300
        );


        debounced();
        window.setTimeout(debounced, 100);
        window.setTimeout(debounced, 500);

        window.setTimeout(
            function ()
            {
                assert.equal(called, 2, "the debounced function should have been called two times");
                done();
            },
            1000
        );
    }
);
