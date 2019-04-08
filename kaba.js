const Kaba = require("kaba");

module.exports = (new Kaba())
    .addJavaScriptEntries({
        "all-tests": "tests/build/all-tests.js",
    })
    .enableTypeScript()
    .setOutputPath("tests/dist")
    .disableChunkSplitting()
    .disableFileNameHashing()
    .disableModuleConcatenation()
;
