import { Container } from "react-bootstrap";
import ProfileInfo from "../components/ProfileInfo";
import styles from "../styles/app.module.scss";

const ProfilePage = () => {

    return (

        <Container className={`${styles.outerContainer}`} >

            <ProfileInfo />

        </Container>

    );
}

export default ProfilePage;