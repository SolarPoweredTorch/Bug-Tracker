import { useContext, useState } from "react";
import { Badge, Button, Card, Col, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/userContext";
import * as UsersApi from "../network/users_api";
import { UserInfoInput } from "../network/users_api";
import styles from "../styles/profileInfo.module.css";
import { formatDate } from "../util/formatDate";
import Notification from "./Notification";

const ProfileInfo = () => {

    const { loggedInUser } = useContext(UserContext);

    const navigate = useNavigate();

    const [showSubmitSuccess, setShowSubmitSuccess] = useState(false);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<UserInfoInput>();

    async function onSubmit(input: UserInfoInput) {
        try {
            if (loggedInUser) {
                const response = await UsersApi.updateUserInfo(loggedInUser._id, input);
                if (response.ok) {
                    setShowSubmitSuccess(true);
                    setTimeout(
                        () => setShowSubmitSuccess(false), 2000
                    );
                }
            }

        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    return (

        <>
            {
                !loggedInUser &&
                <p>You are logged out.</p>
            }

            {
                loggedInUser &&

                <Card className={`${styles.profileCard} my-4`} border="gray">

                    <Card.Header className={`${styles.header}`}>
                        {loggedInUser.username}
                    </Card.Header>

                    <Card.Body>

                        <Form id="editProfileForm" onSubmit={handleSubmit(onSubmit)}>

                            <Form.Group as={Row} className="m-1">
                                <Form.Label column>
                                    Name
                                </Form.Label>
                                <Col>
                                    <Form.Control
                                        {...register("realName")}
                                        defaultValue={loggedInUser.realName}
                                    />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="m-1">
                                <Form.Label column>
                                    Email address
                                </Form.Label>
                                <Col>
                                    <Form.Control
                                        disabled
                                        value={loggedInUser.email}
                                    />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="m-1">
                                <Form.Label column>
                                    Signup date
                                </Form.Label>
                                <Col>
                                    <Form.Control
                                        disabled
                                        value={loggedInUser ? formatDate(loggedInUser.createdAt) : "Unknown"}
                                    />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="m-1">
                                <Form.Label column>
                                    Location
                                </Form.Label>
                                <Col>
                                    <Form.Control
                                        {...register("location")}
                                        defaultValue={loggedInUser.location}
                                    />
                                </Col>
                            </Form.Group>

                            <br />

                            <Form.Group as={Row} className="m-1">
                                <Form.Label column>
                                    Assigned tickets
                                </Form.Label>
                                <Col>
                                    {
                                        (!loggedInUser.assignments || loggedInUser.assignments?.length === 0) &&
                                        <div>None</div>
                                    }
                                    {
                                        loggedInUser.assignments &&
                                        loggedInUser.assignments.length > 0 &&
                                        loggedInUser.assignments?.map(assignment =>
                                            <Badge bg="primary" onClick={() => navigate(`/tickets/${assignment}`)} className="m-1 btn btn-primary">
                                                {assignment}
                                            </Badge>
                                        )
                                    }
                                </Col>
                            </Form.Group>

                        </Form>

                    </Card.Body>

                    <Card.Body className="d-flex justify-content-end" >

                        <Button
                            type="reset"
                            form="editProfileForm"
                            className="btn btn-secondary m-1"
                        >
                            Reset changes
                        </Button>

                        <Button
                            type="submit"
                            form="editProfileForm"
                            className="btn btn-primary m-1"
                            disabled={isSubmitting}
                        >
                            Submit changes
                        </Button>

                    </Card.Body>

                </Card>
            }

            {
                showSubmitSuccess &&
                <Notification message="Successfully saved." />
            }

            {/* <p>Debug info: {JSON.stringify(user)}</p> */}
        </>
    );

}

export default ProfileInfo;