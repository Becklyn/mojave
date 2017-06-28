import * as dateCompare from "../../date/compare";
import * as dateFormat from "../../date/format";
import * as domTraverse from "../../dom/traverse";
import * as ioFile from "../../io/file";
import * as timing from "../../timing/timing";
import UrlSlug from "../../url/Slug";

window.mojave = {
    timing: timing,
    date: {
        compare: dateCompare,
        format: dateFormat,
    },
    dom: {
        traverse: domTraverse,
    },
    io: {
        file: ioFile,
    },
    url: {
        Slug: UrlSlug,
    },
};
