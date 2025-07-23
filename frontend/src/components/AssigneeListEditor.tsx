import { useEffect, useState } from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { FieldError } from "react-hook-form";
import { MdSearch } from "react-icons/md";
import { RiArrowLeftDoubleLine, RiArrowRightDoubleLine } from "react-icons/ri";
import * as usersApi from "../network/users_api";
import DebouncedInput from "./table/DebouncedInput";

interface AssigneeListEditorProps {
    assignees: string[],
    setAssignees: (assignees: string[]) => void,
    modified: boolean,
    error?: FieldError,
    [x: string]: any,
}

const AssigneeListEditor = (
    {
        assignees,
        setAssignees,
        error,
        modified,
        ...props
    }: AssigneeListEditorProps) => {

    const [userlist, setUserlist] = useState<string[]>([]);
    const [userlistFiltered, setUserlistFiltered] = useState<string[]>([]);
    const [assigneesListFiltered, setAssigneesListFiltered] = useState<string[]>([]);

    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);

    const [showSearchFilter, setShowSearchFilter] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function loadUserlist() {
            try {
                setIsLoading(true);
                const usersResponse = await usersApi.fetchUsers();
                setUserlist(usersResponse.map(user => user.username));
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }
        loadUserlist();
    }, []);

    const handleSelectedUsersChange = (e: React.ChangeEvent<any>) => {
        const selection = [...e.target.selectedOptions].map(name => name.value);
        setSelectedUsers(selection);
    }

    const handleSelectedAssigneesChange = (e: React.ChangeEvent<any>) => {
        const selection = [...e.target.selectedOptions].map(name => name.value);
        setSelectedAssignees(selection);
    }

    // replaced 11 Nov 2024

    // const userListOptions = userlist.map(name => {

    //     const isAssigned = assignees.includes(name);
    //     const isSelected = selectedUsers.includes(name);

    //     return <option
    //         key={name}
    //         value={name}
    //         selected={isSelected}
    //         disabled={isAssigned}
    //         title={isAssigned ? "Already assigned" : "Click to select"}
    //     >
    //         {name}
    //     </option>
    // });

    // const assigneeListOptions = assignees.map(name => (
    //     <option
    //         key={name}
    //         value={name}
    //         title="Click to select"
    //     >
    //         {name}
    //     </option>
    // ));

    const userListOptions = (list: string[]) =>

        list.map(name => {

            const isAssigned = assignees.includes(name);

            return <option
                key={name}
                value={name}
                disabled={isAssigned}
                title={isAssigned ? "Already assigned" : "Click to select"}
            >
                {name}
            </option>
        });

    const assigneeListOptions = (list: string[]) =>

        list.map(name => (
            <option
                key={name}
                value={name}
                title="Click to select"
            >
                {name}
            </option>
        ));

    return (

        <div>

            {
                isLoading &&
                <div className="d-flex justify-content-center align-items-center">
                    <Spinner animation="border" variant="primary" />
                </div>
            }

            {
                !isLoading &&
                <Form.Group as={Row}>
                    <Col style={{ flex: 1 }}>

                        {/* Userlist ------------------------------------------------------------------------------- */}

                        <Form.Group controlId="userlist-input">

                            <Form.Label>Userlist</Form.Label>
                            {
                                showSearchFilter &&
                                <DebouncedInput
                                    className="my-1 w-100 bg-light border rounded"
                                    value={""}
                                    onChange={(value) =>
                                        setUserlistFiltered(userlist.filter(name =>
                                            name.toLowerCase()
                                                .includes(value.toString().toLowerCase())))
                                    }
                                    placeholder={`Search...`}
                                    type="text"
                                />
                            }

                            <Form.Control
                                as="select"
                                value={selectedUsers}
                                multiple
                                onChange={handleSelectedUsersChange}
                                style={modified ?
                                    {
                                        height: '20em',
                                        border: "1px solid grey"
                                    } :
                                    {
                                        height: '20em',
                                    }
                                }
                            >

                                {
                                    !showSearchFilter &&
                                    userListOptions(userlist)
                                }

                                {
                                    showSearchFilter &&
                                    userListOptions(userlistFiltered)
                                }

                            </Form.Control>
                        </Form.Group>

                    </Col>

                    {/* center buttons ----------------------------------------------------------------------------- */}

                    <Col className="col-auto p-0">

                        <div className="d-flex flex-column justify-content-center h-100">

                            <Button
                                className="my-2 border-dark text-black"
                                title="Search"
                                onClick={() => setShowSearchFilter(!showSearchFilter)}
                            >
                                <MdSearch size="1.5em" />
                            </Button>

                            <Button
                                className="my-2 border-dark text-black"
                                title="Assign"
                                onClick={() => {
                                    setAssignees([...assignees, ...selectedUsers]);
                                    setSelectedUsers([]);
                                }}
                            >
                                <RiArrowRightDoubleLine size="1.5em" />
                            </Button>

                            <Button
                                className="my-2 border-dark text-black"
                                title="Remove"
                                onClick={() => {
                                    const newList = assignees.filter(name => !selectedAssignees.includes(name)); // problem?
                                    setAssignees(newList);
                                    setSelectedAssignees([]);
                                }}
                            >
                                <RiArrowLeftDoubleLine size="1.5em" />
                            </Button>

                        </div>

                    </Col>

                    {/* Assignees ---------------------------------------------------------------------------------- */}

                    <Col>

                        <Form.Group controlId="assignees-input" className="">
                            <Form.Label>Assigned to this ticket</Form.Label>

                            {
                                showSearchFilter &&
                                <DebouncedInput
                                    className="my-1 w-100 bg-light border rounded"
                                    value={""}
                                    onChange={(value) =>
                                        setAssigneesListFiltered(assignees.filter(name =>
                                            name.toLowerCase()
                                                .includes(value.toString().toLowerCase())))
                                    }
                                    placeholder={`Search...`}
                                    type="text"
                                />
                            }

                            <Form.Control
                                {...props}
                                as="select"
                                multiple
                                isInvalid={!!error}
                                onChange={handleSelectedAssigneesChange}
                                style={modified ?
                                    {
                                        height: '20em',
                                        border: "1px solid grey"
                                    } :
                                    {
                                        height: '20em',
                                    }
                                }
                            >

                                {
                                    !showSearchFilter &&
                                    assigneeListOptions(assignees)
                                }

                                {
                                    showSearchFilter &&
                                    assigneeListOptions(assigneesListFiltered)
                                }

                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                                {error?.message}
                            </Form.Control.Feedback>
                        </Form.Group>

                    </Col>
                </Form.Group>

            }

            {/* <Col>

                <div>
                    <strong>userlistFiltered:</strong> {JSON.stringify(userlistFiltered, null, "\t")}
                </div>
                <div>
                    <strong>assigneesListFiltered:</strong> {JSON.stringify(assigneesListFiltered, null, "\t")}
                </div>

                <div>
                    <strong>userlist:</strong> {JSON.stringify(userlist, null, "\t")}
                </div>
                <div>
                    <strong>selectedUsers:</strong> {JSON.stringify(selectedUsers, null, "\t")}
                </div>
                <div>
                    <strong>assignees:</strong> {JSON.stringify(assignees, null, "\t")}
                </div>
                <div>
                    <strong>selectedAssignees:</strong> {JSON.stringify(selectedAssignees, null, "\t")}
                </div>

            </Col> */}

        </div>
    );
}

export default AssigneeListEditor;