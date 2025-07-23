import { TicketInput } from "../network/tickets_api";

export function randomizeTicket(): TicketInput {

    const summaries: string[] = [
        "Crash to desktop",
        "Memory leak",
        "Viewing issues not showing list",
        "Allow HTML labels in graphs",
        "Refactoring and cleaning up API methods",
        "Upgrade to PHPUnit 9.6",
        "Add failed_login_count to user information",
        "Missing tooltip for graph_count column",
        "Update Parsedown library to 1.7.2",
        "Markdown processing code cleanup",
        "Allow disabling sorting functions",
        "Project data listings missing",
        "Use config API to access allow_browser_cache",
        "Increase minimum PHP requirement to 7.4",
        "Problems opening attachment in a new tab/window",
        "Error messages with displaying newlines",
    ];

    const types: string[] = [
        "Functional",
        "Logical",
        "Workflow",
        "Unit level",
        "Out of bounds",
        "Security issue",
        "Performance",
        "Compatibility",
        "Usability",
        "Concurrency",
        "Code cleanup",
        "System integration issue",
    ];

    const severities: string[] = [
        "Unknown", "Low", "Moderate", "High", "Critical"
    ];

    const statuses: string[] = [
        "New", "In progress", "Resolved", "Feedback needed", "Rejected", "On hold"
    ];

    function getRandomIndex(max: number) {
        return Math.floor(Math.random() * max);
    }

    const newRandomTicket: TicketInput = {
        summary: summaries[getRandomIndex(summaries.length)],
        type: types[getRandomIndex(types.length)],
        severity: severities[getRandomIndex(severities.length)],
        status: statuses[getRandomIndex(statuses.length)],
        author: "System",
        authorId: "000000000000000000000000",
    };

    return newRandomTicket;
}