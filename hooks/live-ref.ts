import {Inputs, useCallback} from "preact/hooks";

type LiveRefCleanup = () => void;
type LiveRefCallback = (node: HTMLElement) => LiveRefCleanup|null|undefined|void;

/**
 * A "live ref" hook, that is always updated if the ref is updated.
 */
export function useLiveRef (callback: LiveRefCallback, inputs: Inputs = []) : (node: HTMLElement|null) => void
{
    let cleanup: LiveRefCleanup|undefined|null;

    return useCallback((node: HTMLElement|null) =>
    {
        if (cleanup)
        {
            cleanup();
        }

        if (node)
        {
            cleanup = callback(node) as LiveRefCleanup;
        }
    }, inputs);
}
