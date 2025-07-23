import NotificationsList from "../components/NotificationsList";
import styles from "../styles/app.module.scss";

const NotificationsListPage = () => {

    return (

        <div className={`${styles.outerContainer}`} >

            <NotificationsList />

        </div>

    );
}

export default NotificationsListPage;