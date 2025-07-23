import { useState } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { ConflictError } from "../../errors/http_errors";
import { User } from "../../models/user";
import * as UsersApi from "../../network/users_api";
import { SignUpCredentials } from "../../network/users_api";
import styles from "../../styles/userModal.module.css";
import TextInputField from "../form/TextInputField";

interface SignUpModalProps {
    onDismiss: () => void,
    onSignUpSuccessful: (user: User) => void,
    [x: string]: any,
}

const SignUpModal = ({ onDismiss, onSignUpSuccessful, ...props }: SignUpModalProps) => {

    const [errorText, setErrorText] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignUpCredentials>();

    async function onSubmit(credentials: SignUpCredentials) {

        credentials.autoLogin = true;

        try {
            const newUser = await UsersApi.signUp(credentials);
            onSignUpSuccessful(newUser);
        } catch (error) {
            if (error instanceof ConflictError) {
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
                    Sign Up
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
                        name="email"
                        label="Email"
                        type="email"
                        placeholder="Email"
                        register={register}
                        registerOptions={{ required: "Required" }}
                        error={errors.email}
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
                        Sign Up
                    </Button>

                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default SignUpModal;