import { User } from "../models/user";
import { randomizeUser } from "../util/randomizeUser";
import { fetchData } from "./fetch_api";

export async function fetchUsers(): Promise<User[]> {

    const response = await fetchData("/api/users/list", { method: "GET" });
    return response.json();
}

export async function getUserById(userId: string): Promise<User> {

    const response = await fetchData(`/api/users/list/id/${userId}`, { method: "GET" });
    return response.json();
}

export async function getUserByName(username: string): Promise<User> { // Avoid using unless necessary

    const response = await fetchData(`/api/users/list/name/${username}`, { method: "GET" });
    return response.json();
}

export async function getLoggedInUser(): Promise<User> {

    const response = await fetchData("/api/users", { method: "GET" });
    return response.json();
}

export interface SignUpCredentials {
    username: string,
    email: string,
    password: string,
    autoLogin: boolean,
}

export async function signUp(credentials: SignUpCredentials): Promise<User> {

    const response = await fetchData("/api/users/signup",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        });

    return response.json();
}

export async function createRandomUser() {

    const response = await signUp(randomizeUser());
    return response;
}

export async function createOrLoginGuestUser(): Promise<User> {

    const response = await fetchData("/api/users/guest", { method: "GET" });
    return response.json();
}

export interface LoginCredentials {
    username: string,
    password: string,
}

export async function login(credentials: LoginCredentials): Promise<User> {

    const response = await fetchData("/api/users/login",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        });

    return response.json();
}

export async function logout() {
    await fetchData("/api/users/logout", { method: "POST" });
}

export interface UserInfoInput {
    realName?: string,
    location?: string,
}

export async function updateUserInfo(userId: string, updatedUserInfo: UserInfoInput) {
    const response = await fetchData("/api/users/" + userId, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUserInfo),
    });
    return response;
}