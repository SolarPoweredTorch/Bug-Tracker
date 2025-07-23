import { useContext, useState } from "react";
import { Container } from "react-bootstrap";
import { FaReact } from "react-icons/fa6";
import { SiExpress, SiMongodb, SiNodedotjs, SiReactbootstrap, SiTypescript } from "react-icons/si";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/userContext";
import * as UsersApi from "../network/users_api";
import styles from "../styles/landing.module.scss";
import LandingModal from "./modal/LandingModal";
import LoginModal from "./modal/LoginModal";
import SignUpModal from "./modal/SignUpModal";

const Landing = () => {

    const navigate = useNavigate();

    const { loggedInUser, setLoggedInUser } = useContext(UserContext);

    const [showLandingModal, setShowLandingModal] = useState(true);
    const [showSignUpModal, setShowSignUpModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    return (
        <Container className={`${styles.landingContainer}`}>

            {
                showLandingModal &&
                <LandingModal
                    onSignUpClicked={() => {
                        setShowSignUpModal(true)
                        setShowLandingModal(false);
                    }}
                    onLoginlicked={() => {
                        setShowLoginModal(true)
                        setShowLandingModal(false);
                    }}
                    onContinueAsUserClicked={() => {
                        navigate("/issues", { replace: true });
                    }}
                    onContinueAsGuest={async () => {
                        const loggedInGuest = await UsersApi.createOrLoginGuestUser();
                        setLoggedInUser(loggedInGuest);
                        navigate("/issues", { replace: true });
                    }}
                />
            }

            {
                showSignUpModal &&
                <SignUpModal
                    onDismiss={() => {
                        setShowSignUpModal(false);
                        setShowLandingModal(true);
                    }}
                    onSignUpSuccessful={(user) => {
                        setLoggedInUser(user);
                        navigate("/issues", { replace: true });
                    }}
                    backdrop={false}
                />
            }

            {
                showLoginModal &&
                <LoginModal
                    onDismiss={() => {
                        setShowLoginModal(false);
                        setShowLandingModal(true);
                    }}
                    onLoginSuccessful={(loggedInUser) => {
                        setLoggedInUser(loggedInUser);
                        navigate("/issues", { replace: true });
                    }}
                    backdrop={false}
                />
            }

            <div className={`${styles.techInfo} text-white d-flex align-items-center`}>
                <div className="m-1">Powered by:</div>
                <div>
                    <SiTypescript className="m-1" size={20} />
                    <FaReact className="m-1" size={20} />
                    <SiReactbootstrap className="m-1" size={20} />
                    <SiMongodb className="m-0" size={20} />
                    <SiNodedotjs className="m-1" size={20} />
                    <SiExpress className="m-1" size={20} />
                </div>
            </div>

        </Container>
    )
}

export default Landing;