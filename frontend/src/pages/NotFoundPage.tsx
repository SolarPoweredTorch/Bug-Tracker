import { Container } from "react-bootstrap";
import styles from "../styles/app.module.scss";

const NotFoundPage = () => {

    return (

        <Container className={`${styles.outerContainer}`} >

            <p>Here be dragons</p>

        </Container>

    );
}

export default NotFoundPage;