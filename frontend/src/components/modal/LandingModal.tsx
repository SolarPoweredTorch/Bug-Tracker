import { useContext } from "react";
import { Button, Modal, Stack } from "react-bootstrap";
import { UserContext } from "../../contexts/userContext";
import styles from "../../styles/userModal.module.css";

interface LandingModalProps {
    onSignUpClicked: () => void,
    onLoginlicked: () => void,
    onContinueAsUserClicked: () => void,
    onContinueAsGuest: () => void,
}

const LandingModal = ({ onSignUpClicked, onLoginlicked, onContinueAsUserClicked, onContinueAsGuest }: LandingModalProps) => {

    const { loggedInUser } = useContext(UserContext);

    return (

        <Modal show size="sm" backdrop={false} className={`${styles.userModal}`} enforceFocus={false}>
            <Modal.Header>
                <Modal.Title className="text-center w-100">
                    Sign Up or Login
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>

                <Stack direction="vertical" className="d-flex justify-content-around align-items-center">

                    <Button
                        className="m-2 w-100"
                        onClick={onSignUpClicked}
                    >
                        Sign Up
                    </Button>

                    {
                        !loggedInUser &&
                        <Button
                            className="m-2 w-100"
                            onClick={onLoginlicked}
                        >
                            Login
                        </Button>
                    }

                    {
                        loggedInUser &&
                        <Button
                            className="m-2 w-100"
                            variant="success"
                            onClick={onContinueAsUserClicked}
                        >
                            Continue as <b>{loggedInUser.username}</b>
                        </Button>
                    }

                    {
                        loggedInUser?.username !== "Guest" &&
                        <Button
                            className="m-2"
                            variant="link"
                            onClick={onContinueAsGuest}>
                            Or continue as a guest...
                        </Button>
                    }

                </Stack>

            </Modal.Body>
        </Modal>
    );
}

export default LandingModal;