/* eslint-disable no-underscore-dangle */

/**
 *
 * @param {HTMLElement|HTMLElement[]} element
 * @param {string|string[]} type
 * @param {function():*} handler
 */
export function on (element, type, handler)
{
    const list = Array.isArray(element) ? element : [element];
    const types = Array.isArray(type) ? type : [type];

    for (let i = 0; i < list.length; i++)
    {
        for (let j = 0; j < types.length; j++)
        {
            const node = list[i];
            const eventType = types[j];

            node.addEventListener(eventType, handler);

            if (typeof node._listeners === "undefined")
            {
                node._listeners = {};
            }

            if (typeof node._listeners[eventType] === "undefined")
            {
                node._listeners[eventType] = [];
            }

            node._listeners[eventType].push(handler);
        }
    }
}


/**
 *
 * @param {HTMLElement|HTMLElement[]} element
 * @param {string|string[]} type
 * @param {function():*} handler
 */
export function off (element, type, handler)
{
    const list = Array.isArray(element) ? element : [element];
    const types = Array.isArray(type) ? type : [type];

    for (let i = 0; i < list.length; i++)
    {
        for (let j = 0; j < types.length; j++)
        {
            const node = list[i];
            const eventType = types[j];

            node.removeEventListener(eventType, handler);

            if (typeof node._listeners !== "undefined" && typeof node._listeners[eventType] !== "undefined")
            {
                const index = node._listeners[eventType].indexOf(handler);

                if (-1 !== index)
                {
                    node._listeners[eventType].splice(index, 1);
                }
            }
        }
    }
}
