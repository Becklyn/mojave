5.x to 5.15.3
=============

*   The order of the constructor arguments in `FetchClient` has changed.


4.x to 5.0
==========


## `mount` and `mountLazy`

### Mounting `function`s

There were two notable changes to the way a `function` will be mounted:
- the `{type: "func"}` property has been removed from the `mojave.FunctionMountOptions`
- `mountLazy` now requires to pass in a generic type parameter of your `function` that you want to mount in order
  to get support for `mojave.FunctionMountOptions::params` to be of the required `function` parameters.

Old:

```typescript
import {mount, mountLazy} from "mojave/mount";
import {myFunction} from "./my-function";

// Eager
mount(".selector", myFunction);
mount(".selector", myFunction, { type: "func" });
mount(".selector", myFunction, { type: "func", params: ["…"]});
mount(".selector", myFunction, { params: ["…"]});

// Lazy
mountLazy(".selector", () => import("./my-function"));
mountLazy(".selector", () => import("./my-function"), { type: "func" });
mountLazy(".selector", () => import("./my-function"), { type: "func", params: ["…"]});
mountLazy(".selector", () => import("./my-function"), { params: ["…"]});
```

New:

```typescript
import {mount, mountLazy} from "mojave/mount";
import {myFunction} from "./my-function";

// Eager
mount(".selector", myFunction);
mount(".selector", myFunction, { params: ["…"]});

// Lazy
mountLazy<typeof myFunction>(".selector", () => import("./my-function"));
mountLazy<typeof myFunction>(".selector", () => import("./my-function"), { params: ["…"]});
```


### Mounting `StandaloneComponent`s

There were two notable changes to the way a `StandaloneComponent` will be mounted:
- the `{type: "class"}` property has been removed from the `mojave.ClassMountOptions`
- `mountLazyClass` now requires to pass in a generic type parameter of your `StandaloneComponent` that you want to mount in order
  to get support for `mojave.ClassMountOptions::params` to be of the required `StandaloneComponent` constructor parameters.

Old:

```typescript
import {mount, mountLazy} from "mojave/mount";
import {MyStandaloneComponent} from "./MyStandaloneComponent";

// Eager
mount(".selector", MyStandaloneComponent);
mount(".selector", MyStandaloneComponent, { type: "class" });
mount(".selector", MyStandaloneComponent, { type: "class", params: ["…"]});
mount(".selector", MyStandaloneComponent, { params: ["…"]});

// Lazy
mountLazy(".selector", () => import("./MyStandaloneComponent"));
mountLazy(".selector", () => import("./MyStandaloneComponent"), { type: "class" });
mountLazy(".selector", () => import("./MyStandaloneComponent"), { type: "class", params: ["…"]});
mountLazy(".selector", () => import("./MyStandaloneComponent"), { params: ["…"]});
```

New:

```typescript
import {mountClass, mountLazyClass} from "mojave/mount";
import {MyStandaloneComponent} from "./MyStandaloneComponent";

// Eager
mountClass(".selector", MyStandaloneComponent);
mountClass(".selector", MyStandaloneComponent, { params: ["…"]});

// Lazy
mountLazyClass<MyStandaloneComponent>(".selector", () => import("./MyStandaloneComponent"));
mountLazyClass<MyStandaloneComponent>(".selector", () => import("./MyStandaloneComponent"), { params: ["…"]});
```


### Mounting Preact components (functional and class)

There were two notable changes to the way a Preact `function` or `Component<TProps, TState>` component will be mounted:
- the `{type: "jsx"}` property has been removed from the `mojave.ComponentMountOptions`
- `mountLazyJsx` now requires to pass in a generic type parameter of your Preact component that you want to mount in order
  to get support for `mojave.ComponentMountOptions::params` to be of the required `StandaloneComponent` constructor parameters.
  
Please note that `mojave.ComponentMountOptions::params` is either a `Tuple` or an `Object`, depending on the Preact component that you want to mount.
For `function`s the type will be `Tuple`, for `Component<TProps, TState>` it'll be `TProps`.

Old:

```typescript
import {mount, mountLazy} from "mojave/mount";
import {MyPreactComponent} from "./MyPreactComponent";
import {MyPreactFunction} from "./MyPreactFunction";

// Eager
mount(".selector", MyPreactFunction);
mount(".selector", MyPreactFunction, { type: "jsx" });
mount(".selector", MyPreactFunction, { type: "jsx", params: {"…": "…"}});
mount(".selector", MyPreactFunction, { params: {"…": "…"}});
mount(".selector", MyPreactComponent);
mount(".selector", MyPreactComponent, { type: "jsx" });
mount(".selector", MyPreactComponent, { type: "jsx", params: {"…": "…"}});
mount(".selector", MyPreactComponent, { params: {"…": "…"}});

// Lazy
mountLazy(".selector", () => import("./MyPreactFunction"));
mountLazy(".selector", () => import("./MyPreactFunction"), { type: "jsx" });
mountLazy(".selector", () => import("./MyPreactFunction"), { type: "jsx", params: {"…": "…"}});
mountLazy(".selector", () => import("./MyPreactFunction"), { params: {"…": "…"}});
mountLazy(".selector", () => import("./MyPreactComponent"));
mountLazy(".selector", () => import("./MyPreactComponent"), { type: "jsx" });
mountLazy(".selector", () => import("./MyPreactComponent"), { type: "jsx", params: {"…": "…"}});
mountLazy(".selector", () => import("./MyPreactComponent"), { params: {"…": "…"}});
```

New:

```typescript
import {mountJsx, mountLazyJsx} from "mojave/mount";
import {MyPreactComponent} from "./MyPreactComponent";
import {MyPreactFunction} from "./MyPreactFunction";

// Eager
mountJsx(".selector", MyPreactFunction);
mountJsx(".selector", MyPreactFunction, { params: {"…": "…"}});
mountJsx(".selector", MyPreactComponent);
mountJsx(".selector", MyPreactComponent, { params: {"…": "…"}});

// Lazy
mountLazyJsx<typeof MyPreactFunction>(".selector", () => import("./MyPreactFunction"));
mountLazyJsx<typeof MyPreactFunction>(".selector", () => import("./MyPreactFunction"), { params: {"…": "…"}});
mountLazyJsx<MyPreactComponent>(".selector", () => import("./MyPreactComponent"));
mountLazyJsx<MyPreactComponent>(".selector", () => import("./MyPreactComponent"), { params: {"…": "…"}});
```



3.x to 4.0
==========

*   **IE 10 support was dropped.** 
*   The previous `mount()` and `mountJsx()` were removed and replaced with a new `mount()`.
*   `getData(element)` and `setData(element)` were removed. Use `element.dataset` directly instead.
*   `getAttr(element)` was removed. Use `element.getAttribute()` directly instead.
*   `addClass()` and `removeClass()` were removed. Use `element.classList` directly instead.
*   `preact` was bumped to 10.x
