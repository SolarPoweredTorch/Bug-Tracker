import UserTableView from "../components/UserTableView";
import styles from "../styles/app.module.scss";

const UserTablePage = () => {

    return (

        <div className={`${styles.outerContainer}`} >

            <UserTableView />

        </div>

    );
}

export default UserTablePage;