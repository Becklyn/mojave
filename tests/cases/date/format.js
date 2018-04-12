import QUnit from "qunitjs";
import {formatRelative} from "../../../date/format";

QUnit.module("date/format");

QUnit.test(
    "relativeFormat() tests",
    (assert) =>
    {
        const referenceDate = new Date(2017, 11, 31, 12, 0, 0);

        // dates in the past
        assert.equal(formatRelative(new Date(2017, 11, 31, 11, 59, 50), referenceDate), "gerade eben", "10s ago");
        assert.equal(formatRelative(new Date(2017, 11, 31, 11, 59, 13), referenceDate), "gerade eben", "border of seconds-minutes slip: seconds, past");
        assert.equal(formatRelative(new Date(2017, 11, 31, 11, 59, 12), referenceDate), "vor einer Minute", "border of seconds-minutes slip: minutes, past");
        assert.equal(formatRelative(new Date(2017, 11, 31, 11, 59, 0), referenceDate), "vor einer Minute", "1 month ago");
        assert.equal(formatRelative(new Date(2017, 5, 31, 11, 59, 0), referenceDate), "vor 6 Monaten", "multiple months ago");
        assert.equal(formatRelative(new Date(2015, 5, 31, 11, 59, 0), referenceDate), "vor 3 Jahren", "multiple years ago");

        // dates in the future (use the same dates as in the "dates in the past" section, except the other way round)
        assert.equal(formatRelative(referenceDate, new Date(2017, 11, 31, 11, 59, 50)), "gerade eben", "in 10s");
        assert.equal(formatRelative(referenceDate, new Date(2017, 11, 31, 11, 59, 13)), "gerade eben", "border of seconds-minutes slip: seconds, future");
        assert.equal(formatRelative(referenceDate, new Date(2017, 11, 31, 11, 59, 12)), "in einer Minute", "border of seconds-minutes slip: minutes, future");
        assert.equal(formatRelative(referenceDate, new Date(2017, 11, 31, 11, 59, 0)), "in einer Minute", "in 1 month");
        assert.equal(formatRelative(referenceDate, new Date(2017, 5, 31, 11, 59, 0)), "in 6 Monaten", "in multiple months");
        assert.equal(formatRelative(referenceDate, new Date(2015, 5, 31, 11, 59, 0)), "in 3 Jahren", "in multiple years");

        // same date
        assert.equal(formatRelative(referenceDate, referenceDate), "gerade eben", "same date");

        // very far dates
        assert.equal(formatRelative(new Date(1917, 11, 31, 12, 0, 0), referenceDate), "vor 100 Jahren", "very far in the past");
        assert.equal(formatRelative(new Date(2117, 11, 31, 12, 0, 0), referenceDate), "in 100 Jahren", "very far in the future");

        // invalid call
        assert.equal(formatRelative(1, 2), "", "invalid types");

        // default reference date
        assert.equal(formatRelative(new Date()), "gerade eben", "default reference date");
    }
);
