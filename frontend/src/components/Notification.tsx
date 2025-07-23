import { Toast, ToastContainer } from "react-bootstrap";

interface NotificationProps {
    message: string,
}

const Notification = ({ message }: NotificationProps) => {

    return (

        <ToastContainer position="bottom-end" className="p-3 position-fixed">
            <Toast bg="success">
                <Toast.Body>{message}</Toast.Body>
            </Toast>
        </ToastContainer>

    );
}

export default Notification;