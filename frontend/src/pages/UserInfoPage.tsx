import { Container } from "react-bootstrap";
import { useParams } from "react-router-dom";
import UserInfo from "../components/UserInfo";
import styles from "../styles/app.module.scss";

const UserInfoPage = () => {

    const { userId } = useParams();

    return (

        <Container className={`${styles.outerContainer}`} >

            {
                userId &&
                <UserInfo userId={userId} />
            }

        </Container>

    );
}

export default UserInfoPage;