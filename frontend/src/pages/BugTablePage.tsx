import BugTableView from "../components/BugTableView";

import styles from "../styles/app.module.scss";

interface BugTablePageProps { }

const BugTablePage = ({ }: BugTablePageProps) => {

    return (

        <div className={` ${styles.outerContainer} ` } >

            <BugTableView />

        </div>

    );
}

export default BugTablePage;