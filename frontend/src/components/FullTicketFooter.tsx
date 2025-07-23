import { useContext, useState } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { UserContext } from "../contexts/userContext";
import { Ticket } from "../models/ticket";
import { formatDate } from "../util/formatDate";
import ClickAgainAlert from "./modal/ClickAgainAlert";

interface FullTicketFooterProps {
    ticket: Ticket,
    deleteTicket: (ticket: Ticket) => void,
    isSubmitting: boolean,
}

const FullTicketFooter = ({ ticket, deleteTicket, isSubmitting }: FullTicketFooterProps) => {

    const { loggedInUser } = useContext(UserContext);

    const [showClickAgainAlert, setShowClickAgainAlert] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);

    const createdAt: string = formatDate(ticket.createdAt);
    const updatedAt: string = formatDate(ticket.updatedAt);

    return (

        <>
            <span className="p-3 fw-light">

                <div>
                    Author:&nbsp;
                    <span title={`Id: ${ticket.authorId}`}>
                        <Link to={
                            loggedInUser?._id === ticket.authorId
                                ? `/profile`
                                : `/users/list/id/${ticket.authorId}`
                        }>
                            {ticket.author}
                        </Link>
                    </span>
                </div>

                <div>
                    Ticket created: {createdAt}
                </div>

                {
                    (createdAt !== updatedAt) &&
                    <div>
                        Last updated: {updatedAt}
                    </div>
                }

            </span>

            <span className="d-flex flex-row">

                {
                    showClickAgainAlert &&
                    <ClickAgainAlert
                        className="p-1 m-1"
                        variant="warning"
                        description="delete this ticket"
                    />
                }

                <Button type="button"
                    className="btn btn-danger m-1"
                    disabled={isDisabled || !loggedInUser || ticket.id === ""}
                    onClick={() => {
                        if (showClickAgainAlert) {
                            setShowClickAgainAlert(false);
                            setIsDisabled(true);
                            try {
                                deleteTicket(ticket);
                            }
                            catch (error) {
                                console.error(error);
                            }
                            finally {
                                setIsDisabled(false);
                            }
                        }
                        else {
                            setShowClickAgainAlert(true);
                            setTimeout(
                                () => setShowClickAgainAlert(false), 2000
                            );
                        }
                    }}
                >
                    Delete ticket
                </Button>

                <Button
                    type="submit"
                    className="btn btn-primary m-1"
                    form="editTicketForm"
                    disabled={isSubmitting || !loggedInUser || ticket.id === ""}
                >
                    Save changes
                </Button>

            </span>
        </>

    );
}

export default FullTicketFooter;