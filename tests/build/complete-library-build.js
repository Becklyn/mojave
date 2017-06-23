/* eslint global-require: 0 */

window.mojave = {
    timing: require("../../timing/timing"),
    date: {
        compare: require("../../date/compare"),
        format: require("../../date/format"),
    },
    io: {
        file: require("../../io/file"),
    },
};
