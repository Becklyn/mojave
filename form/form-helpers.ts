import {after, append, createUnstyledElement, prepend, remove} from "../dom/manipulate";
import {closest, find, findOne} from "../dom/traverse";

export type FormErrorMapping = Record<string, string[]>;


/**
 * Applies the form errors to the given form
 */
export function applyFormErrors (
    form: HTMLFormElement,
    mapping: FormErrorMapping,
    errorPrefix: string = "Fehler: "
) : void
{
    resetFormErrors(form);
    let globalErrors: string[] = mapping.__global || [];

    for (const fieldId in mapping)
    {
        const errors = mapping[fieldId];

        if ("__global" !== fieldId)
        {
            const input = findOne(`#${fieldId}`, form);
            let errorsAdded = false;

            if (null !== input)
            {
                const row = closest(input, ".form-row");
                const element = closest(input, ".form-element");

                if (null !== element)
                {
                    after(element, renderFormErrors(errors, errorPrefix));
                    errorsAdded = true;
                }

                if (null !== row)
                {
                    row.classList.add("has-error");
                }
            }

            if (!errorsAdded)
            {
                globalErrors = globalErrors.concat(errors);
            }
        }
    }

    if (globalErrors.length)
    {
        prepend(form, renderFormErrors(globalErrors, errorPrefix));
    }
}


/**
 * Renders the form errors list
 */
function renderFormErrors (messages : string[], prefix: string) : HTMLElement
{
    const list = createUnstyledElement("ul", {
        class: "form-errors",
    });

    messages.forEach(
        message => {
            const element = createUnstyledElement("li", {
                text: prefix + message,
            });
            append(list, element);
        }
    );

    return list;
}

/**
 * Resets the form errors on the given form
 */
export function resetFormErrors (form: HTMLFormElement) : void
{
    find(".form-row.has-error", form).forEach(e => e.classList.remove("has-error"));
    find(".form-errors", form).forEach(el => remove(el));
}
