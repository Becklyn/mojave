//@ts-ignore
import Promise from "promiscuous";

let globalWindow = window as any;

if (globalWindow.Promise === undefined)
{
    globalWindow.Promise = Promise;
}
