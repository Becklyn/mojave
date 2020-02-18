import {RefObject} from "preact";
import {useEffect} from "preact/hooks";
import Sortable, {SortableConfig, SortableOnChangedData} from "./Sortable";


/**
 * Hook to easily implement a sortable element.
 *
 * @param ref {RefObject<HTMLElement>}  the reference
 * @param sortableOptions
 * @param onChange
 * @param idFetcher
 */
export function useSortable (
    ref: RefObject<HTMLElement>,
    sortableOptions: SortableConfig,
    onChange: (item: number, before: number|null) => void,
    idFetcher?: (element: HTMLElement) => number,
) : void
{
    let fetcher = idFetcher || (element => parseInt(element.dataset.id || "", 10));

    useEffect(() => {
        if (!ref.current)
        {
            return;
        }

        let sortable = new Sortable(ref.current, sortableOptions);

        sortable.init();
        sortable.on("changed", (result: SortableOnChangedData) =>
        {
            let before = result.result.before;
            onChange(
                fetcher(result.result.item),
                before ? fetcher(before) : null
            );
        });

        return () => sortable.destroy();
    }, [ref.current]);
}
