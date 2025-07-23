import { useContext } from "react";
import { Card, ListGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/userContext";
import styles from "../styles/notificationsList.module.scss";
import { toElapsedTime } from "../util/toElapsedTime";

// interface NotificationListProps { }

const NotificationsList = () => {

    const navigate = useNavigate();
    const { loggedInUser } = useContext(UserContext);

    return (

        <>
            {
                !loggedInUser &&
                <p>You are logged out.</p>
            }

            {
                loggedInUser &&
                <Card className={`${styles.notificationsList} m-4`}>

                    <Card.Header className={`${styles.header}`}>
                        Notifications
                    </Card.Header>

                    <Card.Body>

                        <ListGroup>

                            {
                                (loggedInUser.notifications ?? [])
                                    .sort((a, b) => // Newest first
                                        new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf())
                                    .map(notification =>

                                        <ListGroup.Item
                                            className=""
                                            variant={notification.active ? "primary" : "light"}
                                            action
                                            key={notification.id}
                                            onClick={() => {
                                                if (notification.link) {
                                                    navigate(`${notification.link}`)
                                                }
                                            }}
                                        >

                                            <div className="text-muted">
                                                {toElapsedTime(notification.createdAt)}
                                            </div>
                                            <div className="text-black">
                                                {notification.message}
                                            </div>
                                        </ListGroup.Item>
                                    )
                            }

                        </ListGroup>

                    </Card.Body>

                </Card>
            }
        </>
    );

}

export default NotificationsList;