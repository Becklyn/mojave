import {parseElementAsJson} from "../json";


/**
 * Generic data container, that loads data from a JSON script element and
 * provides a simple interface to load it.
 */
export class DataContainer
{
    private containerId: string;
    private data: Record<string, any>;

    public constructor (containerId: string)
    {
        this.containerId = containerId;
    }

    /**
     * Fetch data from the data container
     */
    public get <TData>(key: string): TData|undefined;
    public get <TData>(key: string, defaultValue: TData): TData;
    public get <TData>(key: string, defaultValue?: TData): TData|undefined
    {
        if (!this.data)
        {
            this.data = parseElementAsJson(document.getElementById(this.containerId)) || {};
        }

        return this.data[key] || defaultValue;
    }
}
