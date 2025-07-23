import { useContext, useState } from "react";
import { Button, Col, Form, Row, Stack } from "react-bootstrap";
import { FieldError, RegisterOptions, UseFormHandleSubmit, UseFormRegister } from "react-hook-form";
import { UserContext } from "../contexts/userContext";
import { Ticket } from "../models/ticket";
import { TicketInput } from "../network/tickets_api";
import AssigneeListEditor from "./AssigneeListEditor";
import SelectionBox from "./form/SelectionBox";
import TextInputField from "./form/TextInputField";

interface FullTicketFieldsProps {
    ticket: Ticket,
    assignees: string[],
    setAssignees: (assignees: string[]) => void,
    register: UseFormRegister<any>,
    registerOptions?: RegisterOptions,
    onSubmit: (input: TicketInput) => void,
    handleSubmit: UseFormHandleSubmit<TicketInput, undefined>,
    dirtyFields: Partial<any>,
    error?: FieldError,
    errors?: Object,
    [x: string]: any,
}

const FullTicketFields = (
    {
        ticket,
        assignees,
        setAssignees,
        register,
        registerOptions,
        onSubmit,
        handleSubmit,
        dirtyFields,
        error,
        errors,
        ...props
    }: FullTicketFieldsProps) => {

    const [showAssigneeListEditor, setShowAssigneeListEditor] = useState(false);
    const isAssigneeListModified = JSON.stringify(ticket.assignees) !== JSON.stringify(assignees);

    const { loggedInUser } = useContext(UserContext);

    return (

        <Form.Group as={Row}>

            <Col height="100%">
                <Form id="editTicketForm" onSubmit={handleSubmit(onSubmit)}>

                    <TextInputField
                        name="summary"
                        label="Summary"
                        style={dirtyFields.summary ? { border: "1px solid grey" } : {}}
                        disabled={!loggedInUser}
                        placeholder="Summary"
                        register={register}
                        registerOptions={{ required: "Required" }}
                        error={error}
                    />

                    <TextInputField
                        name="type"
                        label="Type"
                        style={dirtyFields.type ? { border: "1px solid grey" } : {}}
                        disabled={!loggedInUser}
                        placeholder="Type"
                        register={register}
                        registerOptions={{ required: "Required" }}
                        error={error}
                    />

                    <Stack direction="horizontal" gap={3}>

                        <SelectionBox
                            name="severity"
                            label="Severity"
                            style={dirtyFields.severity ? { border: "1px solid grey" } : {}}
                            disabled={!loggedInUser}
                            options={["Unknown", "Low", "Moderate", "High", "Critical"]}
                            placeholder="Unknown"
                            register={register}
                            registerOptions={{ required: "Required" }}
                            error={error}
                        />

                        <SelectionBox
                            name="status"
                            label="Status"
                            style={dirtyFields.status ? { border: "1px solid grey" } : {}}
                            disabled={!loggedInUser}
                            options={["New", "In progress", "Resolved", "Feedback needed", "Rejected", "On hold"]}
                            placeholder="New"
                            register={register}
                            registerOptions={{ required: "Required" }}
                            error={error}
                        />

                    </Stack>

                    <TextInputField
                        name="description"
                        label="Description"
                        style={dirtyFields.description ? { border: "1px solid grey" } : {}}
                        as="textarea"
                        rows={5}
                        disabled={!loggedInUser}
                        placeholder="Detailed description here"
                        register={register}
                    />

                </Form>
            </Col>

            <Col className="">

                {
                    !showAssigneeListEditor &&
                    <>
                        <Form.Label>
                            Assigned to this ticket
                        </Form.Label>
                        <Form.Control
                            as="textarea"
                            style={isAssigneeListModified ? { border: "1px solid grey" } : {}}
                            rows={4}
                            disabled
                            value={assignees?.join(", ")}
                        />

                        <Button
                            className="my-2"
                            onClick={() => setShowAssigneeListEditor(true)}
                            disabled={!loggedInUser}
                        >
                            Edit
                        </Button>
                    </>
                }

                {
                    showAssigneeListEditor &&
                    <>
                        <AssigneeListEditor
                            assignees={assignees}
                            setAssignees={setAssignees}
                            modified={isAssigneeListModified}
                        />
                        <span>
                            <Button
                                className="my-2 w-auto"
                                onClick={() => setShowAssigneeListEditor(false)}
                            >
                                Close
                            </Button>
                        </span>
                    </>
                }

            </Col>

        </Form.Group>
    );
}

export default FullTicketFields;