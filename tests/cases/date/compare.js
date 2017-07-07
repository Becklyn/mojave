import QUnit from "qunitjs";

QUnit.module("date/compare");

QUnit.test(
    "isSameDay() tests",
    function (assert)
    {
        const isSameDay = mojave.date.compare.isSameDay;

        assert.ok(isSameDay(new Date(2017, 11, 31, 12, 0, 0), new Date(2017, 11, 31, 12, 0, 0)), "exact same date");

        const instance = new Date();
        assert.ok(isSameDay(instance, instance), "exact same instance");

        // edge cases
        assert.ok(isSameDay(new Date(2017, 11, 31, 23, 59, 50), new Date(2017, 11, 31, 0, 0, 0)), "first and last second");

        // different dates
        assert.notOk(isSameDay(new Date(2017, 11, 30, 12, 0, 0), new Date(2017, 11, 31, 12, 0, 0)), "next day");
        assert.notOk(isSameDay(new Date(2017, 10, 31, 12, 0, 0), new Date(2017, 11, 31, 12, 0, 0)), "next month");
        assert.notOk(isSameDay(new Date(2016, 11, 31, 12, 0, 0), new Date(2017, 11, 31, 12, 0, 0)), "next year");
    }
);


QUnit.test(
    "isSameTimestamp() tests",
    function (assert)
    {
        const isSameTimestamp = mojave.date.compare.isSameTimestamp;

        assert.ok(isSameTimestamp(new Date(2017, 11, 31, 12, 0, 0), new Date(2017, 11, 31, 12, 0, 0)), "exact same date");

        const instance = new Date();
        assert.ok(isSameTimestamp(instance, instance), "exact same instance");

        // edge cases
        assert.notOk(isSameTimestamp(new Date(2017, 11, 31, 23, 59, 50), new Date(2017, 11, 31, 0, 0, 0)), "first and last second");

        // different dates
        assert.notOk(isSameTimestamp(new Date(2017, 11, 30, 12, 0, 0), new Date(2017, 11, 31, 12, 0, 0)), "next day");
        assert.notOk(isSameTimestamp(new Date(2017, 10, 31, 12, 0, 0), new Date(2017, 11, 31, 12, 0, 0)), "next month");
        assert.notOk(isSameTimestamp(new Date(2016, 11, 31, 12, 0, 0), new Date(2017, 11, 31, 12, 0, 0)), "next year");
    }
);
