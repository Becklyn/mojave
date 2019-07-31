export interface InitializableHandler
{
    init (data: any): any;
}


/**
 * Initializes a handler from the global scope (like from a JSONP context).
 *
 * The initialization must look like this:
 *
 *     window.SomeKey = {data: {}, init: function (data) { this.data = data; }};
 *
 * Then call this function with your handler that should fetch this data like this:
 *
 * initFromGlobalData("SomeKey", yourHandler)
 *
 * The handler will be initialized for the initial data and for every update as well.
 */
export function initFromGlobalData<TInitializer extends InitializableHandler> (key: string, initializable: TInitializer) : TInitializer
{
    let global = window as any;
    let init = global[key];

    if (!init || !init.data || !init.init)
    {
        if (init)
        {
            // only show error message if the key is not completely missing.
            console.error(`Can't initialize on key ${key}, as the structure is invalid.`);
        }

        return initializable;
    }

    let previous = init.init.bind(global);
    init.init = (data: any) => {
        previous(data);
        initializable.init(data);
    };
    initializable.init(init.data);
    return initializable;
}
