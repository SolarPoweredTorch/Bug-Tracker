import { useContext, useEffect, useState } from "react";
import { Badge, Button, Card, ListGroup, Nav, Navbar, OverlayTrigger, Popover, ToggleButton } from "react-bootstrap";
import { GiSpottedBug } from "react-icons/gi";
import { PiEnvelopeLight } from "react-icons/pi";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/userContext";
import { UserNotification } from "../models/userNotification";
import * as NotificationsApi from "../network/notifications_api";
import * as UsersApi from "../network/users_api";
import styles from "../styles/app.module.scss";
import { toElapsedTime } from "../util/toElapsedTime";

interface NavBarProps {
    onSignUpClicked: () => void,
    onLoginClicked: () => void,
    onLogoutSuccessful: () => void,
}

const NavBar = ({ onSignUpClicked, onLoginClicked, onLogoutSuccessful }: NavBarProps) => {

    const navigate = useNavigate();
    const { loggedInUser } = useContext(UserContext);

    const [notifications, setNotifications] = useState<UserNotification[]>(
        loggedInUser?.notifications ?? []
    );

    const filterActive = (notifications: UserNotification[]) => {
        const activeIds: string[] = [];
        notifications.forEach(n => {
            if (n.active === true)
                activeIds.push(n.id);
        })
        return activeIds;
    }

    const [activeNotificationIds, setActiveNotificationIds] = useState<string[]>(filterActive(notifications));

    useEffect(() => {
        setActiveNotificationIds(filterActive(notifications));
    }, [notifications])

    const closePopover = () => document.body.click(); // Kludge

    /* Server-sent notifications ------------------------------------------------------------------------------------ */

    useEffect(() => {

        const sse = new EventSource("/api/notifications/");

        sse.addEventListener("open", () => {
            // console.log("SSE connection opened");
        });

        sse.addEventListener("close", () => {
            // console.log("SSE connection closed");
        });

        sse.addEventListener("error", (event) => {
            console.error("SSE error: ", event);
            setTimeout(() => {
                if (sse.readyState === EventSource.CONNECTING) {
                    sse.close();
                    // console.log("SSE connection closed via error");
                }
            }, 60 * 1000);
        });

        sse.onmessage = event => {
            console.log(event.data);
        };

        sse.addEventListener("newNotifications", ({ data }) => {
            // console.log("New notification: " + data);
            const newNotifications: UserNotification[] = JSON.parse(data);

            newNotifications.forEach(newNotification => {
                if (!(notifications.find(notification => notification.id === newNotification.id))) {
                    // console.log("Adding " + newNotification.id + " to notifications");
                    setNotifications([...notifications, newNotification]);
                }
            });
        });

        return () => {
            sse.close();
            // console.log("SSE connection closed via unmount");
        }

    }, [notifications]);

    /* -------------------------------------------------------------------------------------------------------------- */

    async function logout() { // Move later?

        try {
            await UsersApi.logout();
            onLogoutSuccessful();
        } catch (error) {
            alert(error);
            console.error(error);
        }
    }

    const notificationsPopdown = (
        <Popover id="">

            <Popover.Header className="d-flex justify-content-between">
                <span className="fw-medium p-1">
                    Notifications
                </span>
                <button
                    className="btn btn-link fw-light p-0"
                    onClick={() => {
                        closePopover();
                        navigate(`/notifications`);
                    }}
                >
                    View all...
                </button>
            </Popover.Header>
            <Popover.Body className="m-0 p-0">

                <ListGroup>

                    {
                        notifications.length === 0 &&
                        <ListGroup.Item className="m-1">
                            Nothing here yet.
                        </ListGroup.Item>
                    }

                    {
                        notifications.length > 0 &&
                        notifications
                            .sort((a, b) => // Newest first
                                new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf())
                            .slice(0, 10)
                            .map(notification =>

                                <ListGroup.Item
                                    variant={notification.active ? "primary" : "light"}
                                    action
                                    key={notification.id}
                                    onClick={() => {
                                        closePopover();
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

            </Popover.Body>
        </Popover >
    );

    return (

        <>
            <Navbar
                bg="primary"
                expand="lg"
                sticky="top"
                className="w-100 d-flex justify-content-center"
            >
                <div className={`${styles.navContainer} d-flex flex-row align-items-center justify-content-between`}>

                    <Navbar.Brand as={Link} to="/">
                        <GiSpottedBug className="m-1" size={30} />
                        <strong>
                            Bug Tracker
                        </strong>
                    </Navbar.Brand>

                    {/* Middle tabs ------------------------------------------------------------------------------------ */}

                    <Nav variant="pills" activeKey="/" className="d-flex flex-row">
                        <Nav.Item>
                            <NavLink
                                to="/issues"
                                className={({ isActive }) => isActive ? styles.navLinkActive : styles.navLinkInactive}
                            >
                                View Issues
                            </NavLink>
                        </Nav.Item>
                        <Nav.Item>
                            <NavLink
                                to="/users/list"
                                className={({ isActive }) => isActive ? styles.navLinkActive : styles.navLinkInactive}
                            >
                                Users
                            </NavLink>
                        </Nav.Item>
                        <Nav.Item>
                            <NavLink
                                to="/profile"
                                className={({ isActive }) => isActive ? styles.navLinkActive : styles.navLinkInactive}
                            >
                                Profile
                            </NavLink>
                        </Nav.Item>
                        <Nav.Item>
                            <NavLink
                                to="/docs"
                                className={({ isActive }) => isActive ? styles.navLinkActive : styles.navLinkInactive}
                            >
                                Docs
                            </NavLink>
                        </Nav.Item>
                        <Nav.Item>
                            <NavLink
                                to="/privacy"
                                className={({ isActive }) => isActive ? styles.navLinkActive : styles.navLinkInactive}
                            >
                                Privacy
                            </NavLink>
                        </Nav.Item>
                        <Nav.Item>
                            <NavLink
                                to="/about"
                                className={({ isActive }) => isActive ? styles.navLinkActive : styles.navLinkInactive}
                            >
                                About
                            </NavLink>
                        </Nav.Item>
                    </Nav>

                    {/* User account area ------------------------------------------------------------------------------ */}

                    <div className="d-flex justify-content-center align-items-center">

                        <Card bg="primary">
                            <Nav className="d-flex flex-row align-items-center">

                                {/* <Button className="text-black"
                                    onClick={() => {

                                        if (loggedInUser) {

                                            const newNotification: NotificationInput = {
                                                userId: loggedInUser._id,
                                                message: "New notification sent from the add button",
                                                link: "/profile",
                                            };
                                            NotificationsApi.addNewNotification(newNotification);
                                        }
                                    }}

                                >
                                    Add! -{">"}
                                </Button> */}

                                {/* Notifications button ------------------------------------------------------------------------------ */}

                                {
                                    loggedInUser &&
                                    <OverlayTrigger
                                        rootClose
                                        trigger="click"
                                        placement="bottom"
                                        overlay={notificationsPopdown}
                                        onExited={() => { // Set all notifications to inactive
                                            setNotifications(notifications.map(n => {
                                                return { ...n, active: false }
                                            }));
                                            NotificationsApi.setNotificationsToInactive();
                                        }}
                                    >
                                        <ToggleButton
                                            className="btn btn-primary p-0 mx-2 text-black position-relative"
                                            id={""}
                                            value={""}
                                        >

                                            <PiEnvelopeLight size="1.9em" className="m-0" />

                                            {
                                                activeNotificationIds.length > 0 &&
                                                <Badge bg="danger" className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: "0.7em" }}>
                                                    {activeNotificationIds.length < 99 ? activeNotificationIds.length : "99+"}
                                                </Badge>
                                            }

                                        </ToggleButton>
                                    </OverlayTrigger>
                                }

                                {/* -------------------------------------------------------------------------------------------------- */}

                                {
                                    loggedInUser &&
                                    <div className="text-black px-3">
                                        Logged in as: {loggedInUser?.username}
                                    </div>
                                }

                                {
                                    !loggedInUser &&
                                    <Button className="text-black" onClick={onSignUpClicked}>
                                        Sign up
                                    </Button>
                                }

                                {
                                    !loggedInUser &&
                                    <Button className="text-black" onClick={onLoginClicked}>
                                        Log in
                                    </Button>
                                }

                                {
                                    loggedInUser &&
                                    <Button className="text-black" onClick={logout}>
                                        Log out
                                    </Button>
                                }

                            </Nav>
                        </Card>
                    </div>

                </div>

            </Navbar >

            {/* <Card className="m-2 p-2">
                notifications:
                <br />
                    {JSON.stringify(notifications)}
                <br />

                activeNotifications:
                <br />
                {JSON.stringify(activeNotificationIds)}
            </Card> */}
        </>
    );
}

export default NavBar;