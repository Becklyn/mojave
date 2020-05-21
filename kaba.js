const Kaba = require("kaba");

module.exports = (new Kaba())
    .addJavaScriptEntries({
        "all-tests": "tests/build/all-tests.js",
    })
    .setOutputPath("tests/dist")
    .disableFileNameHashing()
    .disableModuleConcatenation()
;
