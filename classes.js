/**
 * Combines all classnames in the map to a single class string
 *
 * @param {Object<string, boolean>} map
 * @returns {string}
 */
export function classes (map)
{
    let list = [];

    for (let key in map)
    {
        if (map.hasOwnProperty(key) && map[key])
        {
            list.push(key);
        }
    }

    return list.join(" ");
}
