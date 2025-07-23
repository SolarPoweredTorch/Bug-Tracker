import { Alert } from "react-bootstrap";

interface ClickAgainAlertProps {
    description: string,
    [x: string]: any,
}

const ClickAgainAlert = ({ description, ...props }: ClickAgainAlertProps) => {

    return (

        <Alert show={true} {...props}>
            <div>
                {`Click again to ${description}.`}
            </div>
        </Alert>
    );
}

export default ClickAgainAlert;