import QUnit from "qunit";
import {DateFormatter, EXTENDED_FORMATS} from "../../../date/DateFormatter";

QUnit.module("date/DateFormatter");

QUnit.test(
    "all core formats",
    assert =>
    {
        let formatter = new DateFormatter("de", EXTENDED_FORMATS);
        let date = new Date(2017, 11, 31, 7, 4, 5);

        // the only outlier is IE 11, so as soon as the support is dropped, these can be refactored to perfect string matches.
        /** @type {Object<string,RegExp>} formats */
        let formats = {
            "date": /^31\.12\.2017$/,
            "time": /^07:04:05$/,
            "full": /^31\.12\.2017,? 07:04:05$/,
            "date.short": /^31\.\s?12\.?$/,
            "date.text": /^31\. Dezember 2017$/,
            "date.text.short": /^31\. Dez\. 2017$/,
            "date.month": /^31\. Dezember$/,
            "date.month.short": /^31\. Dez\.?$/,
        };

        for (let format in formats)
        {
            let pattern = formats[format];
            let actual = formatter.format(format, date);
            assert.ok(pattern.test(actual), `${format} matches ${pattern} (is '${actual}')`);
        }
    }
);


QUnit.test(
    "adding a custom format",
    assert =>
    {
        let formatter = new DateFormatter("de", {
            custom: {year: "2-digit"}
        });
        let date = new Date(2017, 11, 31, 7, 4, 5);

        assert.strictEqual(formatter.format("custom", date), "17");
    }
);



QUnit.test(
    "using an unknown format",
    assert =>
    {
        assert.throws(
            () =>
            {
                let formatter = new DateFormatter("de");
                formatter.format("unknown", new Date());
            },
            /Unknown format.*'unknown'/
        );
    }
);
