//@ts-ignore
import Promise from "promise-polyfill";

let globalWindow = window as any;

if (globalWindow.Promise === undefined)
{
    globalWindow.Promise = Promise;
}
