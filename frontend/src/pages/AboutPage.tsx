import { Container } from "react-bootstrap";
import styles from "../styles/app.module.scss";

const AboutPage = () => {

    return (

        <Container className={`${styles.outerContainer}`} >

            <p>This is the about page.</p>

        </Container>

    );
}

export default AboutPage;