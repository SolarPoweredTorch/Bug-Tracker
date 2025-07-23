import { useContext } from "react";
import { Button, Form, Modal, Stack } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { UserContext } from "../../contexts/userContext";
import { Ticket } from "../../models/ticket";
import * as ticketsApi from "../../network/tickets_api";
import { TicketInput } from "../../network/tickets_api";
import SelectionBox from "../form/SelectionBox";
import TextInputField from "../form/TextInputField";

interface NewTicketViewProps {
    onDismiss: () => void,
    onTicketSaved: (ticket: Ticket) => void,
}

const NewTicketView = ({ onDismiss, onTicketSaved }: NewTicketViewProps) => {

    const { loggedInUser } = useContext(UserContext);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<TicketInput>({

        defaultValues: {
            summary: "",
            type: "",
            severity: "",
            status: "",
            description: "",
            author: loggedInUser!.username,
            authorId: loggedInUser!._id,
        }
    });

    async function onSubmit(input: TicketInput) {

        try {
            const ticketResponse = await ticketsApi.createTicket(input);
            onTicketSaved(ticketResponse);
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    return (

        <Modal className="modal-xl" centered show onHide={onDismiss}>

            <Modal.Header closeButton>
                <Modal.Title>
                    Create New Ticket
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>

                <Form id="addTicketForm" onSubmit={handleSubmit(onSubmit)}>

                    <TextInputField
                        name="summary"
                        label="Summary"
                        placeholder="Short summary here"
                        register={register}
                        registerOptions={{ required: "Required" }}
                        error={errors.summary}
                    />

                    <TextInputField
                        name="type"
                        label="Type"
                        placeholder="Type"
                        register={register}
                        registerOptions={{ required: "Required" }}
                        error={errors.type}
                    />

                    <Stack direction="horizontal" gap={3}>

                        <SelectionBox
                            name="severity"
                            label="Severity"
                            options={["Unknown", "Low", "Moderate", "High", "Critical"]}
                            placeholder="Unknown"
                            register={register}
                            registerOptions={{ required: "Required" }}
                            error={errors.severity}
                        />

                        <SelectionBox
                            name="status"
                            label="Status"
                            options={["New", "In progress", "Resolved", "Feedback needed", "Rejected", "On hold"]}
                            placeholder="New"
                            register={register}
                            registerOptions={{ required: "Required" }}
                            error={errors.status}
                        />

                    </Stack>

                    <TextInputField
                        name="description"
                        label="Description"
                        as="textarea"
                        rows={5}
                        placeholder="Detailed description here"
                        register={register}
                    />

                </Form>

            </Modal.Body>

            <Modal.Footer>
                <Button type="submit"
                    form="addTicketForm"
                    disabled={isSubmitting}
                >
                    Save new ticket
                </Button>
            </Modal.Footer>

        </Modal>
    );
}

export default NewTicketView;