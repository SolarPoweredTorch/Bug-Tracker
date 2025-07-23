import { useContext, useEffect, useState } from "react";
import { Alert, Card, Stack } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/userContext";
import { NotFoundError } from "../errors/http_errors";
import { Comment } from "../models/comment";
import { Ticket } from "../models/ticket";
import * as commentsApi from "../network/comments_api";
import * as ticketsApi from "../network/tickets_api";
import { TicketInput } from "../network/tickets_api";
import styles from "../styles/profileInfo.module.css";
import FullTicketFields from "./FullTicketFields";
import FullTicketFooter from "./FullTicketFooter";
import Notification from "./Notification";
import TicketCommentsArea from "./TicketCommentsArea";
import { QuantumLoadingAnimation } from "./animation/QuantumLoadingAnimation";

interface FullTicketInfoProps {
    cachedTicket: Ticket,
    ticketId: string,   // Fallback in case of no cached ticket
}

const FullTicketInfo = ({ cachedTicket, ticketId }: FullTicketInfoProps) => {

    const dummyTicket: Ticket = {   // Used for initial loading purposes
        id: "",
        summary: "",
        type: "",
        severity: "",
        status: "",
        commentCount: 0,
        author: "",
        authorId: "",
        assignees: [],
        createdAt: "",
        updatedAt: ""
    };

    const [ticket, setTicket] = useState<Ticket>(cachedTicket || dummyTicket);
    const [errorText, setErrorText] = useState<string | null>(null);

    let values: Ticket = ticket; // Passed to useForm

    const [isLoadingTicket, setIsLoadingTicket] = useState(true);
    const [isLoadingComments, setIsLoadingComments] = useState(true);

    const navigate = useNavigate();

    const [comments, setComments] = useState<Comment[]>([]);
    const [assignees, setAssignees] = useState<string[]>([]);

    const [showSaveSuccess, setShowSaveSuccess] = useState(false);

    const { loggedInUser } = useContext(UserContext);

    useEffect(() => {
        
        async function loadTicket() {

            let ticketResponse: Ticket;

            try {
                if (ticket.id === "") {
                    ticketResponse = await ticketsApi.getTicket(ticketId);
                    if (ticketResponse) {
                        setTicket(ticketResponse);
                    }
                    if (ticketResponse.assignees) {
                        setAssignees(ticketResponse.assignees);
                    }
                    const commentsResponse = await commentsApi.fetchComments(ticketResponse.id);
                    setComments(commentsResponse);
                }
                else {
                    if (ticket.assignees) {
                        setAssignees(ticket.assignees);
                    }
                    const commentsResponse = await commentsApi.fetchComments(ticket.id);
                    setComments(commentsResponse);
                }
            } catch (error) {
                if (error instanceof Error) handleError(error);
            } finally {
                setIsLoadingTicket(false);
                setIsLoadingComments(false);
            }
        }
        loadTicket();
    }, [navigate, ticket.assignees, ticket.id, ticketId]);

    values = ticket;

    const { register, handleSubmit, reset, formState: { isSubmitting, dirtyFields, errors } } = useForm<TicketInput>({

        defaultValues: {
            summary: ticket?.summary ?? "",
            type: ticket?.type ?? "",
            severity: ticket?.severity ?? "",
            status: ticket?.status ?? "",
            description: ticket?.description ?? "",
            assignees: ticket?.assignees ?? [],
        },
        values,
    });

    async function onSubmit(input: TicketInput) {

        try {
            if (ticket && loggedInUser) {
                input.assignees = assignees;    // No form register
                const ticketResponse = await ticketsApi.updateTicket(ticket.id, input, loggedInUser.username);
                if (ticketResponse) {
                    navigate(".", { replace: true, state: ticketResponse })
                    reset(ticketResponse);          // Updates form defaultValues
                    ticket.assignees = assignees;   // Updates default values without form register
                }
                setShowSaveSuccess(true);
                setTimeout(
                    () => setShowSaveSuccess(false), 2000
                );
            }
        } catch (error) {
            if (error instanceof Error) handleError(error);
        }
    }

    async function deleteTicket(discardedTicket: Ticket) {

        try {
            await ticketsApi.deleteTicket(discardedTicket.id);
            navigate(`/issues`, {
                replace: true,
                state: "deleteSuccess"
            });
        } catch (error) {
            if (error instanceof Error) handleError(error);
        }
    }

    const handleError = (error: Error) => {
        if (error instanceof NotFoundError) {
            setErrorText(error.message);
        }
        else {
            alert(error);
        }
        console.error(error);
    }

    return (

        <>
            {
                errorText &&
                <Alert variant="danger" dismissible onClose={() => setErrorText(null)}>
                    {errorText}
                </Alert>
            }

            {/* Ticket info ------------------------------------------------------------------------------------ */}

            {
                <Card className={`${styles.profileCard} my-4`} border="gray">

                    <>
                        {
                            isLoadingTicket &&
                            <Stack className="d-flex justify-content-center align-items-center p-4">
                                <QuantumLoadingAnimation />
                                <div className="fw-light p-2">
                                    Loading ticket...
                                </div>
                            </Stack>
                        }

                        {
                            !isLoadingTicket &&
                            !errorText &&

                            <>
                                <Card.Header className={`${styles.header}`}>
                                    Ticket ID: {ticket.id}
                                </Card.Header>

                                <Card.Body>

                                    <FullTicketFields
                                        ticket={ticket}
                                        assignees={assignees}
                                        setAssignees={setAssignees}
                                        register={register}
                                        onSubmit={onSubmit}
                                        handleSubmit={handleSubmit}
                                        dirtyFields={dirtyFields}
                                        errors={errors}
                                    />

                                </Card.Body>

                                <Card.Footer className="d-flex flex-row px-2 py-0 justify-content-between align-items-center">

                                    <FullTicketFooter
                                        ticket={ticket}
                                        deleteTicket={deleteTicket}
                                        isSubmitting={isSubmitting}
                                    />

                                </Card.Footer>
                            </>
                        }
                    </>

                </Card>
            }

            {/* Comments ------------------------------------------------------------------------------------------- */}

            {
                !errorText &&
                <Card className={`${styles.profileCard} my-4`} border="gray">

                    {
                        isLoadingComments &&
                        <Stack className="d-flex justify-content-center align-items-center p-4">
                            <QuantumLoadingAnimation />
                            <div className="fw-light p-2">
                                Loading comments...
                            </div>
                        </Stack>
                    }

                    {
                        !isLoadingComments &&
                        <TicketCommentsArea
                            comments={comments}
                            ticketId={ticket.id}
                            onCommentSaved={(commentResponse: Comment) => {
                                setComments([commentResponse, ...comments]);
                            }}
                            deleteComment={commentsApi.deleteComment} // Extract out to function above
                            onCommentDeleted={(deletedComment: Comment) => {
                                setComments(comments.filter((comment) => comment !== deletedComment));
                            }}
                        />
                    }

                </Card>
            }

            {
                showSaveSuccess &&
                <Notification message="Successfully saved." />
            }
        </>
    );
}

export default FullTicketInfo;