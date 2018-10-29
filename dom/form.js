/**
 * Serializes the form data
 *
 * @deprecated Deprecated since 2.6, to be removed in 3.0. Inline the implementation instead.
 * @param {HTMLFormElement} form
 * @returns {FormData}
 */
export function serializeForm (form)
{
    return new FormData(form);
}
