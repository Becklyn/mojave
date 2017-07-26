mojave
======

A library of commonly used JavaScript tools and helpers by Becklyn Studios.



Contributing / Development
--------------------------

To run the tests, first install all dependencies:

```js
npm install
```

Then run the [kaba](https://github.com/Becklyn/kaba) default task:

```bash
kaba
```

You need to run this task after every change in the library.
You can also start a watcher to continuously build the library:

```bash
kaba -d
```


Now open the file in `tests/index.html` in a web browser.


### Test case files

Place all test case files under `tests/cases/` as regular `.js` files.

You have all [QUnit](https://qunitjs.com/) globals available.

The tests files are built using `tests/build/all-tests.js`, so if you add a new test case file, you must add an import there.
This build is compiled using kaba, so you can use regular modern JS.


### Working on the project

1. Make your changes in the library
2. If you added a new file, update the bundle build in `tests/build/complete-library-build.js`
3. Bundle the library via `kaba`
4. Write your tests in `tests/cases/`
5. Open the QUnit page in your browser and check whether all tests work correctly.
