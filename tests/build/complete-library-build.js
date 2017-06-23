import * as dateCompare from "../../date/compare";
import * as dateFormat from "../../date/format";
import * as ioFile from "../../io/file";
import * as timing from "../../timing/timing";
import UrlSlug from "../../url/Slug";

window.mojave = {
    timing: timing,
    date: {
        compare: dateCompare,
        format: dateFormat,
    },
    io: {
        file: ioFile,
    },
    url: {
        Slug: UrlSlug,
    },
};
