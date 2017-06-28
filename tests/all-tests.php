<?php

$contents = "";
const TESTS_DIRECTORY = __DIR__ . "/cases/";

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


header("Content-Type: application/javascript; charset=utf-8");
echo $contents;
