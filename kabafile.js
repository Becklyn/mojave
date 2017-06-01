const kaba = require("kaba");

kaba.task("js", kaba.shelf.js({
    input: "tests/build",
    output: "../dist"
}));

kaba.task("", kaba.parallel("js"));
