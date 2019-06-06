const glob = require("glob");
const path = require("path");
const fs = require("fs");

let compiledFiles = glob.sync("**/*.{d.ts,js}", {
    absolute: true,
    root: path.dirname(__dirname),
    ignore: [
        "@types/**/*",
        "node_modules/**/*",
        "tests/**/*",
        "kaba.js",
    ],
});

compiledFiles.forEach(file => fs.unlinkSync(file));

console.log(`Clean finished, cleaned ${compiledFiles.length} file(s)`);
console.log("");
