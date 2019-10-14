/**
 * Wires two lists of HTMLElements.
 *
 * All elements of both lists are supposed to have a data attribute named `data-${dataKey}` and based on this
 * the items from the sources list are mapped to the items of the targets list.
 *
 * Duplicate keys in the sources list are supported.
 * Duplicate keys in the targets list are resolved, so that the last item with the key is used.
 *
 * Missing data attributes and orphan keys are just omitted from the map.
 */
export function wireSourceTargetLists (sources: HTMLElement[], targets: HTMLElement[], dataKey: string) : WeakMap<HTMLElement, HTMLElement>
{
    let targetMap: { [key: string]: HTMLElement } = {};
    let map = new WeakMap<HTMLElement, HTMLElement>();

    targets.forEach(target => {
        let key = target.dataset[dataKey];
        if (key)
        {
            targetMap[key] = target;
        }
    });

    sources.forEach(source => {
        let key = source.dataset[dataKey];
        if (!key)
        {
            return;
        }

        let target = targetMap[key];
        if (target)
        {
            map.set(source, target);
        }
    });

    return map;
}
