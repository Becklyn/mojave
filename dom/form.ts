/**
 * Serializes the form data
 */
export function serializeForm (form : HTMLFormElement) : FormData
{
    return new FormData(form);
}
