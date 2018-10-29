import {GhostHandler} from "./GhostHandler";
import {find} from "../../../dom/traverse";
import {setStyles} from "../../../dom/css";

export default class TrHandler implements GhostHandler
{
    private readonly cells : HTMLTableCellElement[];

    /**
     */
    constructor (tableRow : HTMLTableRowElement)
    {
        this.cells = find("td", tableRow) as HTMLTableCellElement[];
    }


    /**
     * @inheritDoc
     */
    onStart ()
    {
        for (let i = 0; i < this.cells.length; i++)
        {
            const cell = this.cells[i];

            setStyles(cell, {
                width: cell.getBoundingClientRect().width,
            });
        }
    }


    /**
     * @inheritDoc
     */
    onEnd ()
    {
        setStyles(this.cells, {
            width: "",
        });
    }
}
