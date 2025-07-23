import { useContext, useEffect, useState } from "react";
import { Button, Stack, ToggleButton } from "react-bootstrap";
import { BiDice5 } from "react-icons/bi";
import { MdSearch, MdSearchOff } from "react-icons/md";
import { UserContext } from "../contexts/userContext";
import { User } from "../models/user";
import * as usersApi from "../network/users_api";
import { QuantumLoadingAnimation } from "./animation/QuantumLoadingAnimation";
import UserTable from "./table/UserTable";

const UserTableView = () => {

    const { loggedInUser } = useContext(UserContext);

    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showSearchFilter, setShowSearchFilter] = useState(false);

    useEffect(() => {
        async function loadUsers() {
            try {
                setIsLoading(true);
                const usersResponse = await usersApi.fetchUsers();
                setUsers(usersResponse);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }
        loadUsers();
    }, []);

    async function createRandomUser() {
        try {
            const createdUser = await usersApi.createRandomUser();
            setUsers([...users, createdUser]);
        } catch (error) {
            console.error(error);
        }
    }

    const userTable =

        <UserTable
            users={users}
            showSearchFilter={showSearchFilter}
        />

    return (

        <>

            <Stack direction="horizontal" className="justify-content-md-end gap-1">

                <div>
                    <ToggleButton
                        className="btn btn-primary my-2 border-dark text-black"
                        title={showSearchFilter ? "Search filters on" : "Search filters off"}
                        type="checkbox"
                        onChange={() => setShowSearchFilter(!showSearchFilter)}
                        id="showSearchFilter"
                        value=""
                    >
                        {
                            showSearchFilter &&
                            <MdSearch size="1.5em" />
                        }
                        {
                            !showSearchFilter &&
                            <MdSearchOff size="1.5em" />
                        }
                    </ToggleButton>
                </div>

                <div>
                    <Button className="btn btn-primary my-2 border-dark text-black"
                        title="Generate random ticket"
                        onClick={() => createRandomUser()}
                        disabled={!loggedInUser}
                    >
                        <BiDice5 size="1.5em" />
                    </Button>
                </div>

            </Stack>

            {
                isLoading &&
                <Stack className="d-flex justify-content-center align-items-center p-4">
                    <QuantumLoadingAnimation />
                    <div className="p-2">
                        Loading users...
                    </div>
                </Stack>
            }

            {
                !isLoading &&
                userTable
            }
        </>

    );
}

export default UserTableView;