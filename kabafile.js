const kaba = require("kaba");

kaba.task("js", kaba.shelf.js({
    input: "tests/build",
    output: "../dist",
    externals: {
        "qunitjs": "window.QUnit",
    },
}));

kaba.task("", kaba.parallel("js"));
