import { Table } from "@tanstack/react-table";
import { Button, Card, Navbar } from "react-bootstrap";
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight, MdOutlineKeyboardDoubleArrowLeft, MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import styles from "../../styles/bugTable.module.scss";

interface TablePaginationBarProps {
    table: Table<any>,
}

const TablePaginationBar = ({ table }: TablePaginationBarProps) => {

    return (

        <Navbar fixed="bottom" className={`${styles.paginationBar}`}>

            <Button
                className="btn btn-primary m-2 border-dark text-body-emphasis"
                title="First page"
                onClick={() => table.firstPage()}
                disabled={!table.getCanPreviousPage()}
            >
                <MdOutlineKeyboardDoubleArrowLeft size={23} />
            </Button>
            <Button
                className="btn btn-primary m-2 border-dark text-body-emphasis"
                title="Previous page"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
            >
                <MdOutlineKeyboardArrowLeft size={23} />
            </Button>
            <Card className="mx-1">
                <Card.Body>
                    {
                        `Page ${table.getState().pagination.pageIndex + 1}
                     of ${table.getPageCount().toLocaleString()}`
                    }
                </Card.Body>
            </Card>

            <Button
                className="btn btn-primary m-2 border-dark text-body-emphasis"
                title="Next page"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
            >
                <MdOutlineKeyboardArrowRight size={23} />
            </Button>
            <Button
                className="btn btn-primary m-2 border-dark text-body-emphasis"
                title="Last page"
                onClick={() => table.lastPage()}
                disabled={!table.getCanNextPage()}
            >
                <MdOutlineKeyboardDoubleArrowRight size={23} />
            </Button>

        </Navbar>
    )
}

export default TablePaginationBar;