import {mojaveIntegration} from "../@types/mojave";
import {find} from "../dom/traverse";
import {parseElementAsJson} from "../json";


interface DumpedToast {
    text: string;
    type: mojaveIntegration.Impact;
    action?: mojaveIntegration.ToastAction;
}

/**
 * Initializes dumped toasts (from Symfony) automatically in the given toast manager.
 *
 * Fully integrated into Mayd's toast system.
 */
export function initializeDumpedToasts (selector: string, manager: mojaveIntegration.ToastManagerInterface) : void
{
    find(selector).forEach(toastContainer =>
    {
        const data = parseElementAsJson<DumpedToast[]>(toastContainer);

        if (data && Array.isArray(data))
        {
            data.forEach(toast => manager.add(toast.text, toast.type, toast.action));
        }
    });
}
