/**
 * Serializes the form data
 *
 * @param {HTMLElement|HTMLFormElement} form
 */
export function serializeForm (form)
{
    return new FormData(form);
}
