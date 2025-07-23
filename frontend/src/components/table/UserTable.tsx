import { ColumnDef, ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, PaginationState, useReactTable } from "@tanstack/react-table";
import { useState } from "react";
import { Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { User } from "../../models/user";
import styles from "../../styles/userTable.module.css";
import { formatDate } from "../../util/formatDate";
import Filter from "./Filter";
import PageSizeSelector from "./PageSizeSelector";
import SortButton from "./SortButton";
import TablePaginationBar from "./TablePaginationBar";

interface UserTableProps {
    users: User[],
    showSearchFilter: boolean,
}

const UserTable = ({ users, showSearchFilter }: UserTableProps) => {

    const navigate = useNavigate();

    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 20,
    });

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const data = users;

    const columns: ColumnDef<User>[] = [
        {
            accessorKey: "_id",
        },
        {
            header: "Username",
            accessorKey: "username",
        },
        {
            header: "Email",
            accessorKey: "email",
        },
        {
            header: "Signup Date",
            accessorFn: row => formatDate(row.createdAt)
        },
    ];

    const initialState = {
        columnVisibility: {
            "_id": false,
        },
    };

    const table = useReactTable({
        columns,
        data,
        initialState,
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

            <table className={`${styles.userTable} table table-striped table-hover border table-sm`}>

                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th className={`${styles.userTableHeader} bg-primary border border-dark`}
                                    key={header.id}>

                                    <Stack direction="horizontal" className="d-flex justify-content-between">

                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}

                                        <SortButton
                                            icon={header.column.getIsSorted() as string}
                                            onClick={header.column.getToggleSortingHandler()}
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
                            onClick={() => {
                                const userId: string = row.getValue("_id");
                                navigate(`/users/list/id/${userId}`);
                            }}
                        >
                            {
                                row.getVisibleCells().map(cell => (
                                    <td className={`${styles.userTableCell} border`}
                                        key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </td>
                                ))
                            }
                        </tr>
                    ))}
                </tbody>

            </table >

            {/* Pagination controls */}

            < div className={`${styles.pageSizeSelectorArea} d-flex justify-content-end`
            }>

                <PageSizeSelector
                    pageSize={pagination.pageSize}
                    onChange={(e: any) => {
                        table.setPageSize(e.target.value);
                    }}
                />

            </div >

            <TablePaginationBar table={table} />

        </>
    );
}

export default UserTable;