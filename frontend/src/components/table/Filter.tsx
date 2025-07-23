import { Column } from "@tanstack/react-table";
import DebouncedInput from "./DebouncedInput";

function Filter({ column }: { column: Column<any, unknown> }) {

    const columnFilterValue = column.getFilterValue()
    //const { filterVariant } = column.columnDef.meta ?? {}

    return (
        <DebouncedInput
            className="w-100 bg-light border shadow rounded"
            onChange={value => column.setFilterValue(value)}
            placeholder={`Search...`}
            type="text"
            value={(columnFilterValue ?? '') as string}
        />
    );
}

export default Filter;
