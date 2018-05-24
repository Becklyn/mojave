import QUnit from "qunit";
import {formatRelative} from "../../../date/format";

QUnit.module("date/format");

QUnit.test(
    "relativeFormat() tests",
    (assert) =>
    {
        const referenceDate = new Date(2017, 11, 31, 12, 0, 0);

        // dates in the past
        assert.strictEqual(formatRelative(new Date(2017, 11, 31, 11, 59, 50), referenceDate), "gerade eben", "10s ago");
        assert.strictEqual(formatRelative(new Date(2017, 11, 31, 11, 59, 13), referenceDate), "gerade eben", "border of seconds-minutes slip: seconds, past");
        assert.strictEqual(formatRelative(new Date(2017, 11, 31, 11, 59, 12), referenceDate), "vor einer Minute", "border of seconds-minutes slip: minutes, past");
        assert.strictEqual(formatRelative(new Date(2017, 11, 31, 11, 59, 0), referenceDate), "vor einer Minute", "1 month ago");
        assert.strictEqual(formatRelative(new Date(2017, 5, 31, 11, 59, 0), referenceDate), "vor 6 Monaten", "multiple months ago");
        assert.strictEqual(formatRelative(new Date(2015, 5, 31, 11, 59, 0), referenceDate), "vor 3 Jahren", "multiple years ago");

        // dates in the future (use the same dates as in the "dates in the past" section, except the other way round)
        assert.strictEqual(formatRelative(referenceDate, new Date(2017, 11, 31, 11, 59, 50)), "gerade eben", "in 10s");
        assert.strictEqual(formatRelative(referenceDate, new Date(2017, 11, 31, 11, 59, 13)), "gerade eben", "border of seconds-minutes slip: seconds, future");
        assert.strictEqual(formatRelative(referenceDate, new Date(2017, 11, 31, 11, 59, 12)), "in einer Minute", "border of seconds-minutes slip: minutes, future");
        assert.strictEqual(formatRelative(referenceDate, new Date(2017, 11, 31, 11, 59, 0)), "in einer Minute", "in 1 month");
        assert.strictEqual(formatRelative(referenceDate, new Date(2017, 5, 31, 11, 59, 0)), "in 6 Monaten", "in multiple months");
        assert.strictEqual(formatRelative(referenceDate, new Date(2015, 5, 31, 11, 59, 0)), "in 3 Jahren", "in multiple years");

        // same date
        assert.strictEqual(formatRelative(referenceDate, referenceDate), "gerade eben", "same date");

        // very far dates
        assert.strictEqual(formatRelative(new Date(1917, 11, 31, 12, 0, 0), referenceDate), "vor 100 Jahren", "very far in the past");
        assert.strictEqual(formatRelative(new Date(2117, 11, 31, 12, 0, 0), referenceDate), "in 100 Jahren", "very far in the future");

        // invalid call
        assert.strictEqual(formatRelative(1, 2), "", "invalid types");

        // default reference date
        assert.strictEqual(formatRelative(new Date()), "gerade eben", "default reference date");
    }
);


QUnit.test(
    "relativeFormat() localized tests",
    (assert) =>
    {
        const referenceDate = new Date(2017, 11, 31, 12, 0, 0);
        const labels = {
            past: [
                'just now',
                'one minute ago',
                '# minutes ago',
                'one hour ago',
                '# hours ago',
                'yesterday',
                'two days ago',
                '# days ago',
                'one week ago',
                '# weeks ago',
                'one month ago',
                '# months ago',
                'one year ago',
                '# years ago',
            ],
            future: [
                'right now',
                'in one minute',
                'in # minutes',
                'in one hour',
                'in # hours',
                'tomorrow',
                'day after tomorrow',
                'in # days',
                'in one week',
                'in # weeks',
                'in one month',
                'in # months',
                'in one year',
                'in # years',
            ],
        };


        const labelFormatter = (index, delta) => {
            const key = (delta < 0) ? "future" : "past";
            return labels[key][index];
        };

        assert.strictEqual(formatRelative(new Date(2017, 11, 31, 11, 59, 50), referenceDate, labelFormatter), "just now", "10s ago");
        assert.strictEqual(formatRelative(new Date(2017, 5, 31, 11, 59, 0), referenceDate, labelFormatter), "6 months ago", "multiple months ago");
        assert.strictEqual(formatRelative(referenceDate, new Date(2017, 11, 31, 11, 59, 12), labelFormatter), "in one minute", "border of seconds-minutes slip: minutes, future");
        assert.strictEqual(formatRelative(referenceDate, new Date(2015, 5, 31, 11, 59, 0), labelFormatter), "in 3 years", "in multiple years");
        assert.strictEqual(formatRelative(new Date(1917, 11, 31, 12, 0, 0), referenceDate, labelFormatter), "100 years ago", "very far in the past");
        assert.strictEqual(formatRelative(new Date(2117, 11, 31, 12, 0, 0), referenceDate, labelFormatter), "in 100 years", "very far in the future");
    }
);
