import { useContext, useEffect, useState } from "react";
import { Button, Card, Stack, ToggleButton } from "react-bootstrap";
import { BiDice5, BiExpand, BiPieChartAlt2, BiSpreadsheet } from "react-icons/bi";
import { MdOutlineAdd, MdSearch, MdSearchOff } from "react-icons/md";
import { RiColorFilterFill, RiColorFilterLine } from "react-icons/ri";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/userContext";
import { Ticket } from "../models/ticket";
import * as ticketsApi from "../network/tickets_api";
import { QuantumLoadingAnimation } from "./animation/QuantumLoadingAnimation";
import FullTicketQuickview from "./modal/FullTicketQuickview";
import NewTicketView from "./modal/NewTicketView";
import StatsModal from "./modal/StatsModal";
import Notification from "./Notification";
import BugTable from "./table/BugTable";

const BugTableView = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const { loggedInUser } = useContext(UserContext);

    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const [fullTicketQuickview, setFullTicketQuickview] = useState<Ticket | null>(null);
    const [newTicketView, setNewTicketView] = useState(false);

    const [showSaveSuccess, setShowSaveSuccess] = useState(false);
    const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

    const [showStats, setShowStats] = useState(false);
    const [showSearchFilter, setShowSearchFilter] = useState(false);
    const [showColorized, setShowColorized] = useState(localStorage.getItem("showColorized") === "true");
    const [showQuickview, setShowQuickview] = useState(localStorage.getItem("showQuickview") === "true");

    useEffect(() => {
        async function loadTickets() {
            try {
                setIsLoading(true);
                const ticketsResponse = await ticketsApi.fetchTickets();
                setTickets(ticketsResponse);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }
        loadTickets();
        if (location.state === "deleteSuccess") {
            window.history.replaceState({}, "")
            showDeleteSuccessFn();
        }
    }, [location.state]);

    async function deleteTicket(discardedTicket: Ticket) {
        try {
            await ticketsApi.deleteTicket(discardedTicket.id);
            setTickets(tickets.filter(ticket => ticket.id !== discardedTicket.id));
        } catch (error) {
            console.error(error);
            alert(error);
        } finally {
            setFullTicketQuickview(null);
            showDeleteSuccessFn();
        }
    }

    async function createRandomTicket() {
        try {
            const createdTicket = await ticketsApi.createRandomTicket();
            setTickets([...tickets, createdTicket]);
        } catch (error) {
            console.error(error);
        }
    }

    const showDeleteSuccessFn = () => { // Avoiding code duplication
        setShowDeleteSuccess(true);
        setTimeout(
            () => setShowDeleteSuccess(false), 2000
        );
    }

    const bugTable =

        <BugTable
            tickets={tickets}
            onRowClicked={(ticketId) => {
                const ticket: Ticket = tickets.find(ticket => ticket.id === ticketId)!; // Can't click on ticket that doesn't exist...
                if (showQuickview)
                    setFullTicketQuickview(ticket);
                else
                    navigate(`/tickets/${ticketId}`, {
                        state: ticket,
                    });
            }}
            showSearchFilter={showSearchFilter}
            showColorized={showColorized}
        />

    return (

        <>
            <Stack direction="horizontal" className="justify-content-md-end gap-1">

                <Card className="p-1 mb-2">

                    <div>
                        <Button
                            className="btn btn-primary border-dark text-black"
                            title="Show statistics"
                            onClick={() => setShowStats(true)}
                        >
                            <BiPieChartAlt2 size="1.5em" />
                        </Button>
                    </div>

                </Card>

                <Card className="p-1 mb-2">

                    <Stack direction="horizontal" className="gap-1">
                        <div>
                            <ToggleButton
                                className="btn btn-primary border-dark text-black"
                                title={showSearchFilter ? "Search filters on" : "Search filters off"}
                                type="checkbox"
                                onChange={() => setShowSearchFilter(!showSearchFilter)}
                                id="showSearchFilter"
                                value=""
                            >
                                {
                                    showSearchFilter &&
                                    <MdSearch size="1.5em" />
                                }
                                {
                                    !showSearchFilter &&
                                    <MdSearchOff size="1.5em" />
                                }
                            </ToggleButton>
                        </div>

                        <div>
                            <ToggleButton
                                className="btn btn-primary border-dark text-black"
                                title={showColorized ? "Table colors on" : "Table colors off"}
                                type="checkbox"
                                onChange={() => {
                                    localStorage.setItem("showColorized", String(!showColorized));
                                    setShowColorized(!showColorized)
                                }}
                                id="showColorized"
                                value=""
                            >
                                {
                                    showColorized &&
                                    <RiColorFilterFill size="1.5em" />
                                }
                                {
                                    !showColorized &&
                                    <RiColorFilterLine size="1.5em" />
                                }
                            </ToggleButton>
                        </div>

                        <div>
                            <ToggleButton
                                className="btn btn-primary border-dark text-black"
                                title={showQuickview ? "Quickview" : "Full page view"}
                                type="checkbox"
                                onChange={() => {
                                    localStorage.setItem("showQuickview", String(!showQuickview));
                                    setShowQuickview(!showQuickview);
                                }}
                                id="showQuickview"
                                value=""
                            >
                                {
                                    showQuickview &&
                                    <BiSpreadsheet size="1.5em" />
                                }
                                {
                                    !showQuickview &&
                                    <BiExpand size="1.5em" />
                                }
                            </ToggleButton>
                        </div>
                    </Stack>

                </Card >

                <Card className="p-1 mb-2 justify-content-right">

                    <Stack direction="horizontal" className="gap-1">
                        <div>
                            <Button
                                className="btn btn-primary border-dark text-black"
                                title="Generate random ticket"
                                onClick={() => createRandomTicket()}
                                disabled={!loggedInUser}
                            >
                                <BiDice5 size="1.5em" />
                            </Button>
                        </div>

                        <div>
                            <Button
                                className="btn btn-primary border-dark text-black"
                                title="Create new ticket"
                                onClick={() => setNewTicketView(true)}
                                disabled={!loggedInUser}
                            >
                                <MdOutlineAdd size="1.5em" />
                            </Button>
                        </div>
                    </Stack>

                </Card>

            </Stack >

            {
                isLoading &&
                <Stack className="d-flex justify-content-center align-items-center p-4">
                    <QuantumLoadingAnimation />
                    <div className="p-2">
                        Loading tickets...
                    </div>
                </Stack>
            }

            {
                !isLoading &&
                bugTable
            }

            <hr />

            {
                newTicketView &&
                <NewTicketView
                    onDismiss={() => setNewTicketView(false)}
                    onTicketSaved={(createdTicket) => {
                        setTickets([...tickets, createdTicket]);
                        setNewTicketView(false);
                    }}
                />
            }

            {
                fullTicketQuickview &&
                <FullTicketQuickview
                    ticket={fullTicketQuickview}
                    onDismiss={() => setFullTicketQuickview(null)}
                    deleteTicket={deleteTicket}
                    onTicketSaved={(updatedTicket) => {
                        setTickets(tickets.map(ticket => ticket.id === updatedTicket.id
                            ? updatedTicket
                            : ticket
                        ));
                        setFullTicketQuickview(null);
                        setShowSaveSuccess(true);
                        setTimeout(
                            () => setShowSaveSuccess(false), 2000
                        );
                    }}
                    updateCommentCount={(updatedTicket) => {
                        setTickets(tickets.map(ticket => ticket.id === updatedTicket.id
                            ? updatedTicket
                            : ticket
                        ));
                    }}

                />
            }

            {
                showStats &&
                <StatsModal
                    onDismiss={() => setShowStats(false)}
                />
            }

            {
                showSaveSuccess &&
                <Notification message="Successfully saved." />
            }

            {
                showDeleteSuccess &&
                <Notification message="Successfully deleted." />
            }

        </>
    )
}

export default BugTableView;