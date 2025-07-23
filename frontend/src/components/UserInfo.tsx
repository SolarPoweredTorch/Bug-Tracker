import { useEffect, useState } from "react";
import { Alert, Badge, Card, Col, Form, Row, Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { BadRequestError, NotFoundError } from "../errors/http_errors";
import { User } from "../models/user";
import * as usersApi from "../network/users_api";
import styles from "../styles/profileInfo.module.css";
import { formatDate } from "../util/formatDate";
import { QuantumLoadingAnimation } from "./animation/QuantumLoadingAnimation";

interface UserInfoProps {
    userId: string,
}

const UserInfo = ({ userId }: UserInfoProps) => {

    const [user, setUser] = useState<User>();
    const [isLoading, setIsLoading] = useState(false);
    const [errorText, setErrorText] = useState<string | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        async function loadUser() {
            try {
                setIsLoading(true);
                const userResponse = await usersApi.getUserById(userId);
                setUser(userResponse);
            } catch (error) {
                if (error instanceof BadRequestError) {
                    setErrorText(error.message);
                }
                else if (error instanceof NotFoundError) {
                    setErrorText(error.message);
                }
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }
        loadUser();
    }, [userId]);

    return (

        <>
            {
                isLoading &&
                <Stack className="d-flex justify-content-center align-items-center p-4">
                    <QuantumLoadingAnimation />
                    <div className="fw-light p-2">
                        Loading user data...
                    </div>
                </Stack>
            }

            {
                !isLoading &&
                errorText &&
                <Alert variant="danger">
                    {errorText}
                </Alert>
            }

            {
                !isLoading &&
                !errorText &&
                user &&
                <Card className={`${styles.profileCard} my-4`} border="gray">

                    <Card.Header className={`${styles.header}`}>
                        {user.username}
                    </Card.Header>

                    <Card.Body>

                        <Form>

                            <Form.Group as={Row} className="m-1">
                                <Form.Label column>
                                    Name
                                </Form.Label>
                                <Col>
                                    <Form.Control
                                        disabled
                                        value={user.realName}
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
                                        value={user.email}
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
                                        value={formatDate(user.createdAt)}
                                    />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="m-1">
                                <Form.Label column>
                                    Location
                                </Form.Label>
                                <Col>
                                    <Form.Control
                                        disabled
                                        value={user.location}
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
                                        (!user.assignments || user.assignments?.length === 0) &&
                                        <div>None</div>
                                    }
                                    {
                                        user.assignments &&
                                        user.assignments.length > 0 &&
                                        user.assignments?.map(assignment =>
                                            <Badge bg="primary" onClick={() => navigate(`/tickets/${assignment}`)} className="m-1 btn btn-primary">
                                                {assignment}
                                            </Badge>
                                        )
                                    }
                                </Col>
                            </Form.Group>

                        </Form>

                    </Card.Body>
                </Card>
            }
        </>
    );
}

export default UserInfo;