mojave
======

A library of commonly used JavaScript tools and helpers by Becklyn Studios.

UI Components
-------------


### Overlay Loader

A global loader, that adds an overlay to your app until the loading is finished.

#### Usage

1.  import the SCSS via `@import("~mojave/scss/overlay-loader/component")` into your project

2.  add the positioning SCSS into your default theme:

    ```scss
    @import "~mojave/scss/overlay-loader/positioning";
    
    .my-app {
        @include position-overlay-loader(10 /* <- this is the z-index */);
    }
    ```
    
3.  Use the JS component:

    ```js
    import {OverlayLoader} from "mojave/ui/OverlayLoader";
    
    export class FrontendLoader extends OverlayLoader
    {
        public constructor () {
            super(`<div class="loader-icon">My SVG</div>`);
        }
    }
    ```

 




Contributing / Development
--------------------------

To run the tests, first install all dependencies:

```js
npm install
```

Then run the [kaba](https://github.com/Becklyn/kaba) default task:

```bash
npx kaba
```

You need to run this task after every change in the library.
You can also start a watcher to continuously build the library:

```bash
npx kaba -d
```


Now open the file in `tests/index.html` in a web browser.


### Test case files

Place all test case files under `tests/cases/` as regular `.js` files.

The tests files are built using `tests/build/all-tests.js`, so if you add a new test case file, you must add an import there.
This build is compiled using kaba, so you can use regular modern JS.


### Working on the project

1. Make your changes in the library
2. If you added a new file, update the bundle build in `tests/build/all-tests.js`
3. Bundle the library via `kaba`
4. Write your tests in `tests/cases/`
5. Open the QUnit page in your browser and check whether all tests work correctly.
