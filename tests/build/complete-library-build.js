import * as dateCompare from "../../date/compare";
import * as dateFormat from "../../date/format";
import * as ioFile from "../../io/file";
import * as timing from "../../timing/timing";

window.mojave = {
    timing: timing,
    date: {
        compare: dateCompare,
        format: dateFormat,
    },
    io: {
        file: ioFile,
    }
};
