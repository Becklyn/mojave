/**
 * Serializes the form data
 *
 * @param {HTMLFormElement} form
 * @returns {FormData}
 */
export function serializeForm (form)
{
    return new FormData(form);
}
