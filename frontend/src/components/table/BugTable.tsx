import { ColumnDef, ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, PaginationState, useReactTable } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { Stack } from "react-bootstrap";
import { VscCommentDiscussion } from "react-icons/vsc";
import { Ticket } from "../../models/ticket";
import styles from "../../styles/bugTable.module.scss";
import { formatDate } from "../../util/formatDate";
import Filter from "./Filter";
import PageSizeSelector from "./PageSizeSelector";
import SortButton from "./SortButton";
import TablePaginationBar from "./TablePaginationBar";

interface BugTableProps {
    tickets: Ticket[],
    onRowClicked: (row: string) => void,
    showSearchFilter: boolean,
    showColorized: boolean,
};

const severityColorTable: { [key: string]: JSX.Element } = {
    "Unknown": <span style={{ color: "DarkSlateGray" }}>Unknown</span>,
    "Low": <span style={{ color: "Green" }}>Low</span>,
    "Moderate": <span style={{ color: "Blue" }}>Moderate</span>,
    "High": <span style={{ color: "OrangeRed" }}>High</span>,
    "Critical": <span style={{ color: "Crimson" }}>Critical</span>,
}

const statusColorTable: { [key: string]: JSX.Element } = {
    "New": <span style={{ color: "Blue" }}>New</span>,
    "In progress": <span style={{ color: "Teal" }}>In progress</span>,
    "Resolved": <span style={{ color: "DarkGreen" }}>Resolved</span>,
    "Feedback needed": <span style={{ color: "OrangeRed" }}>Feedback needed</span>,
    "Rejected": <span style={{ color: "Crimson" }}>Rejected</span>,
    "On hold": <span style={{ color: "Orange" }}>On hold</span>,
}

const formatSeverity = (severity: string): JSX.Element => severityColorTable[severity];

const formatStatus = (status: string): JSX.Element => statusColorTable[status];

const BugTable = ({ tickets, onRowClicked, showSearchFilter, showColorized }: BugTableProps) => {

    const initialPagination = {
        pageIndex: Number(localStorage.getItem("pageIndex")) || 0,
        pageSize: Number(localStorage.getItem("pageSize")) || 20,
    };

    const [pagination, setPagination] = useState<PaginationState>(initialPagination);

    useEffect(() => {
        localStorage.setItem("pageIndex", pagination.pageIndex.toString());
    }, [pagination])

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const data = tickets;

    const columns: ColumnDef<Ticket>[] = [
        {
            header: "ID",
            accessorKey: "id",
            sortingFn: "textCaseSensitive",
        },
        {
            header: "Summary",
            accessorKey: "summary",
        },
        {
            header: "Type",
            accessorKey: "type",
        },
        {
            header: "Severity",
            accessorKey: "severity",
            cell: ({ row }) => (
                showColorized
                    ? formatSeverity(row.original.severity)
                    : row.original.severity
            ),
        },
        {
            header: "Status",
            accessorKey: "status",
            cell: ({ row }) => (
                showColorized
                    ? formatStatus(row.original.status)
                    : row.original.status
            ),
        },
        {
            header: "Created",
            accessorFn: row => formatDate(row.createdAt),
            sortingFn: (rowA, rowB) => new Date(rowA.original.createdAt).valueOf() - new Date(rowB.original.createdAt).valueOf(),
        },
        {
            header: "Last Updated",
            accessorFn: row => formatDate(row.updatedAt),
            sortingFn: (rowA, rowB) => new Date(rowA.original.createdAt).valueOf() - new Date(rowB.original.createdAt).valueOf(),
        },
        {
            header: () =>
                <div>
                    <VscCommentDiscussion size={22} title="Comments" />
                </div>,
            accessorKey: "commentCount",
            sortingFn: "auto",
        },
    ];

    const table = useReactTable({
        columns,
        data,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnFiltersChange: setColumnFilters,
        autoResetPageIndex: false,
        state: {
            pagination,
            columnFilters,
        },
    });

    return (

        <>

            {/* Table display */}

            <table className={`${styles.bugTable} table table-striped table-hover border table-sm`}>

                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th className={`${styles.bugTableHeader} bg-primary border border-dark`}
                                    key={header.id}>

                                    <Stack direction="horizontal" className="d-flex justify-content-between">

                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}

                                        <SortButton
                                            icon={header.column.getIsSorted() as string}
                                            onClick={header.column.getToggleSortingHandler()}
                                            title="Sort"
                                        />

                                    </Stack>

                                    {
                                        showSearchFilter &&
                                            header.column.getCanFilter() ? (
                                            <div>
                                                <Filter column={header.column} />
                                            </div>
                                        ) : null
                                    }

                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>

                <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id}
                            onClick={() => onRowClicked(row.getValue("id"))}
                        >
                            {row.getVisibleCells().map(cell => (
                                <td className={`${styles.bugTableCell} border`}
                                    key={cell.id}>
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>

            </table>

            {/* Pagination controls */}

            <div className={`${styles.pageSizeSelectorArea} d-flex justify-content-end`}>

                <PageSizeSelector
                    pageSize={pagination.pageSize}
                    onChange={(e: any) => {
                        table.setPageSize(e.target.value);
                        localStorage.setItem("pageSize", e.target.value)
                    }}
                />

            </div>

            <TablePaginationBar table={table} />

        </>
    );
}

export default BugTable;