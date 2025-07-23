import { useContext, useState } from "react";
import { Button, Card, Container, Form, Modal, Stack, Toast } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { FaRegTrashAlt, FaUserCheck } from "react-icons/fa";
import { Link } from "react-router-dom";
import { UserContext } from "../contexts/userContext";
import { Comment } from "../models/comment";
import * as commentsApi from "../network/comments_api";
import { CommentInput } from "../network/comments_api";
import { formatDate } from "../util/formatDate";
import TextInputField from "./form/TextInputField";
import ClickAgainAlert from "./modal/ClickAgainAlert";

interface TicketCommentsAreaProps {
    comments: Comment[],
    ticketId: string,
    deleteComment: (ticketId: string, commentId: string) => void,
    onCommentSaved: (comment: Comment) => void,
    onCommentDeleted: (comment: Comment) => void,
}

const TicketCommentsArea = ({
    comments,
    ticketId,
    deleteComment,
    onCommentSaved,
    onCommentDeleted,
}: TicketCommentsAreaProps) => {

    const [showEditCommentArea, setShowEditCommentArea] = useState(false);
    const [isDisabled, setDisabled] = useState(false);
    const [deleteFlagId, setDeleteFlagId] = useState("");
    const [showClickAgainAlert, setShowClickAgainAlert] = useState(false);

    const { loggedInUser } = useContext(UserContext);

    const { register, handleSubmit, resetField, formState: { errors, isSubmitting } } = useForm<CommentInput>({

        defaultValues: {
            poster: loggedInUser?.username,
            posterId: loggedInUser?._id,
            content: "",
            ticketId: ticketId,
        }
    });

    const commentsList = comments
        .sort((a, b) =>
            new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf())
        .map(comment =>
            <Card className="m-1 p-2" key={comment.id}>

                <Card.Header className="d-flex justify-content-between">
                    <Link to={
                        loggedInUser?._id === comment.posterId
                            ? `/profile`
                            : `/users/list/id/${comment.posterId}`
                    }>
                        {comment.poster}
                    </Link>
                    <span className="fw-light">
                        {formatDate(comment.createdAt)}
                    </span>
                </Card.Header>

                <Card.Body>
                    {comment.content}
                </Card.Body>

                <Card.Body className="px-1 py-0 m-1">
                    <div className="d-flex justify-content-end">

                        {
                            showClickAgainAlert && (deleteFlagId === comment.id) &&
                            <ClickAgainAlert
                                className="p-1 mx-1 my-0"
                                variant="warning"
                                description="delete this comment"
                            />
                        }

                        {
                            (loggedInUser?.username === comment.poster) &&
                            <Button
                                size="sm"
                                variant="outline-dark"
                                disabled={isDisabled}
                                onClick={() => { // Overly complicated?
                                    if (showClickAgainAlert && deleteFlagId === comment.id) {
                                        setShowClickAgainAlert(false);
                                        setDisabled(true);
                                        try {
                                            onCommentDeleted(comment); // frontend clean-up called first
                                            deleteComment(ticketId, comment.id);
                                        }
                                        catch (error) {
                                            console.error(error);
                                        }
                                        finally {
                                            setDisabled(false);
                                            setDeleteFlagId("");
                                        }
                                    }
                                    else {
                                        setDeleteFlagId(comment.id);
                                        setShowClickAgainAlert(true);
                                        setTimeout(
                                            () => setShowClickAgainAlert(false), 2000
                                        );
                                    }
                                }}
                            >
                                <FaRegTrashAlt size={14} />
                            </Button>
                        }

                    </div>
                </Card.Body>

            </Card>
        );

    async function onSubmit(input: CommentInput) {

        try {
            const commentResponse = await commentsApi.postComment(input);
            onCommentSaved(commentResponse);
        } catch (error) {
            console.error(error);
            alert(error);
        } finally {
            setShowEditCommentArea(false);
            resetField("content");
        }
    }

    return (

        <>
            <Modal.Body>

                <Stack direction="horizontal" className="d-flex justify-content-between p-3">
                    <Modal.Title>
                        Comments ({comments.length})
                    </Modal.Title>
                    <div>
                        {
                            !showEditCommentArea && loggedInUser &&
                            <Button disabled={ticketId === ""} onClick={() => setShowEditCommentArea(true)}>
                                Add comment
                            </Button>
                        }

                        {
                            !showEditCommentArea && !loggedInUser &&
                            <div>Log in to comment.</div>
                        }
                    </div>
                </Stack>

                <Container>

                    {
                        showEditCommentArea &&
                        <>
                            <Form id="postComment" onSubmit={handleSubmit(onSubmit)}>

                                <TextInputField
                                    rows="3"
                                    name="content"
                                    as="textarea"
                                    register={register}
                                    registerOptions={{ required: "Required" }}
                                    error={errors.content}
                                />

                            </Form>

                            <Stack direction="horizontal" className="d-flex justify-content-between mb-5">

                                <Toast className="w-auto px-3 py-2">
                                    <FaUserCheck size={20} /> &nbsp;
                                    Posting as {loggedInUser?.username}
                                </Toast>

                                <div>

                                    <Button
                                        className="m-1"
                                        variant="danger"
                                        form="postComment"
                                        onClick={() => setShowEditCommentArea(false)}
                                    >
                                        Cancel
                                    </Button>

                                    <Button
                                        className="m-1"
                                        type="reset"
                                        variant="secondary"
                                        form="postComment"
                                        onClick={() => resetField("content")}
                                    >
                                        Clear
                                    </Button>

                                    <Button
                                        className="m-1"
                                        type="submit"
                                        form="postComment"
                                        disabled={isSubmitting}
                                    >
                                        Post
                                    </Button>
                                </div>

                            </Stack>
                        </>
                    }

                    {commentsList}

                </Container>

            </Modal.Body>
        </>
    );
}

export default TicketCommentsArea;