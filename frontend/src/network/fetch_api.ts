import { BadRequestError, ConflictError, NotFoundError, UnauthorizedError } from "../errors/http_errors";

export async function fetchData(input: RequestInfo, init?: RequestInit) {

    const response = await fetch(input, init);

    if (response.ok) {
        return response;
    } else {

        const errorBody = await response.json();
        const errorMessage = errorBody.error;

        if (response.status === 400) {
            throw new BadRequestError(errorMessage);
        }
        else if (response.status === 401) {
            throw new UnauthorizedError(errorMessage);
        }
        else if (response.status === 404) {
            throw new NotFoundError(errorMessage);
        }
        else if (response.status === 409) {
            throw new ConflictError(errorMessage);
        }
        else {
            throw Error("Request has failed. " +
                "\nStatus: " + response.status +
                "\nMessage: " + errorMessage);
        }
    }
}