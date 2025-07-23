import { Container } from "react-bootstrap";
import styles from "../styles/app.module.scss";

const DocsPage = () => {

    return (

        <Container className={`${styles.outerContainer}`} >

            <p>This is the documentation page.</p>

        </Container>

    );
}

export default DocsPage;