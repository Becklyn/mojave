<?php

const TESTS_DIRECTORY = __DIR__ . "/cases/";
const QUNIT_FILES = __DIR__ . "/../node_modules/qunitjs/qunit";

try {
    if (isset($_GET["file"]) && is_string($_GET["file"]))
    {
        displayFile($_GET["file"]);
    }
    else
    {
        throw new NotFoundException();
    }
}
catch (NotFoundException $e)
{
    header("HTTP/1.0 404 Not Found");
}

exit;


/**
 * Main entry point. Loads the file by key
 *
 * @param string $key
 *
 * @throws NotFoundException
 */
function displayFile (string $key) : void
{
    switch ($key)
    {
        case "qunit-js":
            renderFile(loadFile(QUNIT_FILES . "/qunit.js"), "js");
            break;

        case "qunit-css":
            renderFile(loadFile(QUNIT_FILES . "/qunit.css"), "css");
            break;

        case "test-cases":
            renderFile(loadTestCases(), "js");
            break;

        case "lib-build":
            renderFile(loadFile(__DIR__ . "/dist/complete-library-build.js"), "js");
            break;

        default:
            throw new NotFoundException();
            break;
    }
}


/**
 * Exception in case the loading of files failed
 */
class NotFoundException extends Exception {}


/**
 * Loads all tests
 */
function loadTestCases () : string
{
    $contents = "";

    $directory = new RecursiveDirectoryIterator(TESTS_DIRECTORY);
    $iterator = new RecursiveIteratorIterator($directory);

    /** @var SplFileInfo $file */
    foreach ($iterator as $file)
    {
        if (!$file->isFile() || "js" !== $file->getExtension())
        {
            continue;
        }

        $relativeName = substr($file->getPathname(), strlen(TESTS_DIRECTORY));
        $moduleName = addslashes($relativeName);
        $testContent = file_get_contents($file->getPathname());

        $contents .= <<<TEST
(function () { 
QUnit.module("{$moduleName}", function () {

// ----- MODULE START -----

{$testContent}

// ----- MODULE END -----

});
})();


TEST;
    }

    return $contents;
}

/**
 * Loads a qunit file
 *
 * @param string $filename
 *
 * @return string
 * @throws NotFoundException
 */
function loadFile (string $filename) : string
{
    if (!is_file($filename))
    {
        throw new NotFoundException();
    }

    return file_get_contents($filename);
}


/**
 * Renders the given file and exists the program
 *
 * @param string $content
 * @param string $type
 */
function renderFile (string $content, string $type) : void
{
    switch ($type)
    {
        case "js":
            header("Content-Type: application/javascript; charset=utf-8");
            break;

        case "css":
            header("Content-Type: text/css; charset=utf-8");
            break;
    }

    echo $content;

    exit;
}
