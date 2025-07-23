import { useState } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { UnauthorizedError } from "../../errors/http_errors";
import { User } from "../../models/user";
import * as UsersApi from "../../network/users_api";
import { LoginCredentials } from "../../network/users_api";
import styles from "../../styles/userModal.module.css";
import TextInputField from "../form/TextInputField";

interface LoginModalProps {
    onDismiss: () => void,
    onLoginSuccessful: (user: User) => void,
    [x: string]: any,
}

const LoginModal = ({ onDismiss, onLoginSuccessful, ...props }: LoginModalProps) => {

    const [errorText, setErrorText] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginCredentials>();

    async function onSubmit(credentials: LoginCredentials) {

        try {
            const loggedInUser = await UsersApi.login(credentials);
            onLoginSuccessful(loggedInUser);
        } catch (error) {
            if (error instanceof UnauthorizedError) {
                setErrorText(error.message);
            }
            else {
                alert(error);
            }
            console.error(error);
        }
    }

    return (

        <Modal show onHide={onDismiss} className={`${styles.userModal}`} {...props}>
            <Modal.Header closeButton>
                <Modal.Title>
                    Log in
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>

                {
                    errorText &&
                    <Alert variant="danger">
                        {errorText}
                    </Alert>
                }

                <Form onSubmit={handleSubmit(onSubmit)}>

                    <TextInputField
                        name="username"
                        label="Username"
                        type="text"
                        placeholder="Username"
                        register={register}
                        registerOptions={{ required: "Required" }}
                        error={errors.username}
                    />

                    <TextInputField
                        name="password"
                        label="Password"
                        type="password"
                        placeholder="Password"
                        register={register}
                        registerOptions={{ required: "Required" }}
                        error={errors.password}
                    />

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        onClick={() => setErrorText(null)}
                    >
                        Log in
                    </Button>

                </Form>
            </Modal.Body>
        </Modal>
    );

}

export default LoginModal;