import Promise from "promiscuous";

if (typeof window.Promise === "undefined")
{
    window.Promise = Promise;
}
