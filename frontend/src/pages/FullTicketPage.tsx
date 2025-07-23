import { useLocation, useParams } from "react-router-dom";
import FullTicketInfo from "../components/FullTicketInfo";
import styles from "../styles/app.module.scss";

const FullTicketPage = () => {

    const { ticketId } = useParams<{ ticketId: string }>();
    const cachedTicket = useLocation().state;

    return (

        <div className={`${styles.outerContainer}`} >

            <FullTicketInfo
                cachedTicket={cachedTicket}
                ticketId={ticketId!}    // From the URL
            />

        </div>

    );
}

export default FullTicketPage;