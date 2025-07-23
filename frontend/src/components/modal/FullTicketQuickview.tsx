import { useContext, useEffect, useState } from "react";
import { Alert, Modal, Stack } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { UserContext } from "../../contexts/userContext";
import { NotFoundError } from "../../errors/http_errors";
import { Comment } from "../../models/comment";
import { Ticket } from "../../models/ticket";
import * as commentsApi from "../../network/comments_api";
import * as ticketsApi from "../../network/tickets_api";
import { TicketInput } from "../../network/tickets_api";
import FullTicketFields from "../FullTicketFields";
import FullTicketFooter from "../FullTicketFooter";
import TicketCommentsArea from "../TicketCommentsArea";
import { QuantumLoadingAnimation } from "../animation/QuantumLoadingAnimation";

interface FullTicketQuickviewProps {
    ticket: Ticket,
    onDismiss: () => void,
    deleteTicket: (ticket: Ticket) => void,
    onTicketSaved: (ticket: Ticket) => void,
    updateCommentCount: (ticket: Ticket) => void,
}

const FullTicketQuickview = ({ ticket, onDismiss, deleteTicket, onTicketSaved, updateCommentCount }: FullTicketQuickviewProps) => {

    const [isLoadingComments, setIsLoadingComments] = useState(false);

    const [errorText, setErrorText] = useState<string | null>(null);

    const [comments, setComments] = useState<Comment[]>([]);
    const [assignees, setAssignees] = useState<string[]>(ticket.assignees ?? []);

    const { loggedInUser } = useContext(UserContext);

    useEffect(() => {
        async function loadComments() {
            try {
                setIsLoadingComments(true);
                const commentsResponse = await commentsApi.fetchComments(ticket.id);
                setComments(commentsResponse);
            } catch (error) {
                if (error instanceof Error) handleError(error);
            } finally {
                setIsLoadingComments(false);
            }
        }
        loadComments();
    }, [ticket.id]);

    const { register, handleSubmit, formState: { isSubmitting, dirtyFields } } = useForm<TicketInput>({

        defaultValues: {
            summary:
                ticket.summary
                || "",
            type:
                ticket.type
                || "",
            severity:
                ticket.severity
                || "",
            status:
                ticket.status
                || "",
            description:
                ticket.description
                || "",
        }
    });

    async function onSubmit(input: TicketInput) {

        try {
            if (loggedInUser) {
                input.assignees = assignees;    // No form register
                const ticketResponse = await ticketsApi.updateTicket(ticket.id, input, loggedInUser.username);
                onTicketSaved(ticketResponse);
            }
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

        <Modal className="modal-xl" centered show onHide={onDismiss}>

            {
                errorText &&
                <Alert variant="danger">
                    {errorText}
                </Alert>
            }

            {/* Ticket info ------------------------------------------------------------------------------------ */}

            <Modal.Header closeButton>
                <Modal.Title>
                    Detailed Quickview
                </Modal.Title>
            </Modal.Header>

            {
                !errorText &&
                <>

                    <Modal.Body>

                        <FullTicketFields
                            ticket={ticket}
                            assignees={assignees}
                            setAssignees={setAssignees}
                            register={register}
                            onSubmit={onSubmit}
                            handleSubmit={handleSubmit}
                            dirtyFields={dirtyFields}
                        />

                    </Modal.Body>

                    <Modal.Footer className="d-flex flex-row px-2 py-0 justify-content-between">

                        <FullTicketFooter
                            ticket={ticket}
                            deleteTicket={deleteTicket}
                            isSubmitting={isSubmitting}
                        />

                    </Modal.Footer>

                    <hr />
                </>
            }

            {/* Comments --------------------------------------------------------------------------------------- */}

            {
                !errorText &&
                <>
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
                                if (!ticket.commentCount || ticket.commentCount === 0) {
                                    ticket.commentCount = 1;
                                } else {
                                    ticket.commentCount += 1;
                                }
                                updateCommentCount(ticket);
                            }}
                            deleteComment={commentsApi.deleteComment} // Extract out to function above
                            onCommentDeleted={(deletedComment: Comment) => {
                                setComments(comments.filter((comment) => comment !== deletedComment));
                                if (!ticket.commentCount || ticket.commentCount === 0) {
                                    ticket.commentCount = 0;
                                } else {
                                    ticket.commentCount -= 1;
                                }
                                updateCommentCount(ticket);
                            }}
                        />
                    }
                </>
            }

        </Modal>
    );
}

export default FullTicketQuickview;