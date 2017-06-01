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

    $module = "";

    if (1 === preg_match('~' . preg_quote(TESTS_DIRECTORY, '~') . '(?<module>.*?)/~', $file->getPathname(), $matches))
    {
        $module = $matches["module"];
    }

    $module = 'QUnit.module("' . addslashes($module) . '");' . "\n\n";

    $contents .= "(function () {\n" . $module . file_get_contents($file->getPathname()) . "\n})();\n\n";
}


header("Content-Type: application/javascript; charset=utf-8");
echo $contents;
