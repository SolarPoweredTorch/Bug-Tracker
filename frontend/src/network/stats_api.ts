import { fetchData } from "./fetch_api";

export async function getStats() {
    const response = await fetchData("/api/stats", { method: "GET", });
    return response.json();
}