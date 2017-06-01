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

Now open the directory `tests/` in a web browser. You need to have a working PHP installation (as it is used to bundle all test files).


### Test case files

Place all test case files under `tests/cases/` as regular `.js` files.

You have all [QUnit](https://qunitjs.com/) globals available.
Also the library itself is loaded in the `window.mojave` global. For details, please take a look at `tests/build/complete-library-build.js`.

Please note that all test case files need to work in all supported browsers, so ES2015 features are not supported.


### Working on the project

1. Make your changes in the library
2. If you added a new file, update the bundle build in `tests/build/complete-library-build.js`
3. Bundle the library via `kaba`
4. Write your tests in `tests/cases/`
5. Open the QUnit page under `/tests/` and check whether all tests work correctly.
