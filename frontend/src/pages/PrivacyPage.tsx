import { Card, Container } from "react-bootstrap";
import outerStyles from "../styles/app.module.scss";
import styles from "../styles/privacyInfo.module.css";

const PrivacyPage = () => {

    return (

        <Container className={`${outerStyles.outerContainer}`} >

            <Card className={`${styles.privacyCard} my-4`}>

                <Card.Body>
                    <p className="fw-light">Last updated: 12 October 2024</p>

                    <p>
                        All cookies are only related to user authentication, and no third party cookies are in use on
                        this app.
                    </p>

                    <p>
                        We have appropriate organizational safeguards and security measures in place to protect your 
                        personal data from being accidentally lost, used or accessed in an unauthorized way, altered, or 
                        disclosed.
                    </p>

                    <p>
                        The communication between your browser and our website uses a secure encrypted connection 
                        wherever any personal data is involved.
                    </p>
                </Card.Body>
            </Card>

        </Container>

    );
}

export default PrivacyPage;