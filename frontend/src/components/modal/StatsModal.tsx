import { useEffect, useState } from "react";
import { Alert, Card, Modal, Stack } from "react-bootstrap";
import { Cell, Pie, PieChart } from "recharts";
import { NotFoundError } from "../../errors/http_errors";
import * as statsApi from "../../network/stats_api";
import { QuantumLoadingAnimation } from "../animation/QuantumLoadingAnimation";

interface StatsModalProps {
    onDismiss: () => void,
}

const StatsModal = ({ onDismiss }: StatsModalProps) => {

    interface StatisticsData {
        ticketCount: number,
        userCount: number,
        commentCount: number,
        ticketsNew: number,
        ticketsInProgress: number,
        ticketsResolved: number,
        ticketsFeedbackNeeded: number,
        ticketsRejected: number,
        ticketsOnHold: number,
        ticketsUnknown: number,
        ticketsLow: number,
        ticketsModerate: number,
        ticketsHigh: number,
        ticketsCritical: number,
    }

    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState<StatisticsData | null>(null);
    const [errorText, setErrorText] = useState<string | null>(null);

    const pieChartWidth = 380;
    const pieChartHeight = 320;

    useEffect(() => {

        async function loadStats() {
            try {
                const statsResponse = await statsApi.getStats();
                if (statsResponse) {
                    setStats(statsResponse);
                }
            } catch (error) {
                if (error instanceof Error) handleError(error);
            } finally {
                setIsLoading(false);
            }
        }
        loadStats();
    }, [])

    const ticketStatusData = [
        {
            "name": "New",
            "value": stats?.ticketsNew,
        },
        {
            "name": "In progress",
            "value": stats?.ticketsInProgress,
        },
        {
            "name": "Resolved",
            "value": stats?.ticketsResolved,
        },
        {
            "name": "Feedback needed",
            "value": stats?.ticketsFeedbackNeeded,
        },
        {
            "name": "Rejected",
            "value": stats?.ticketsRejected,
        },
        {
            "name": "On hold",
            "value": stats?.ticketsOnHold,
        },
    ]

    const ticketSeverityData = [
        {
            "name": "Unknown",
            "value": stats?.ticketsUnknown,
        },
        {
            "name": "Low",
            "value": stats?.ticketsLow,
        },
        {
            "name": "Moderate",
            "value": stats?.ticketsModerate,
        },
        {
            "name": "High",
            "value": stats?.ticketsHigh,
        },
        {
            "name": "Critical",
            "value": stats?.ticketsCritical,
        },
    ]

    const toPercentageOfTickets = (n: number) =>
        stats !== null ? (n / stats.ticketCount * 100).toFixed(1) : 0

    const handleError = (error: Error) => {
        if (error instanceof NotFoundError) {
            setErrorText(error.message);
        }
        else {
            alert(error);
        }
        console.error(error);
    }

    return (

        <Modal className="modal-xl" centered show onHide={onDismiss}>

            <Modal.Header closeButton>
                <Modal.Title>
                    Statistics
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>

                {
                    isLoading &&
                    <Stack className="d-flex justify-content-center align-items-center p-4">
                        <QuantumLoadingAnimation />
                        <div className="fw-light p-2">
                            Loading statistics...
                        </div>
                    </Stack>
                }

                {
                    !isLoading && errorText &&
                    <Alert variant="danger" dismissible onClose={() => setErrorText(null)}>
                        {errorText}
                    </Alert>
                }

                {
                    !isLoading && stats &&
                    <Card>
                        <Card.Body>
                            <Stack direction="horizontal" className="justify-content-evenly">
                                <PieChart width={pieChartWidth} height={pieChartHeight}>
                                    <text x={pieChartWidth / 2} y={16} fill="black" textAnchor="middle">
                                        <tspan fontSize="16" fontWeight={"bold"}>Tickets by status</tspan>
                                    </text>
                                    <Pie data={ticketStatusData} dataKey="value" nameKey="name" fontSize={12} outerRadius={90} label={payload => payload.name} labelLine={true}>
                                        {ticketStatusData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={["Blue", "Teal", "DarkGreen", "OrangeRed", "Crimson", "Orange"][index]} />
                                        ))}
                                    </Pie>
                                </PieChart>

                                <PieChart width={pieChartWidth} height={pieChartHeight}>
                                    <text x={pieChartWidth / 2} y={16} fill="black" textAnchor="middle">
                                        <tspan fontSize="16" fontWeight={"bold"}>Tickets by severity</tspan>
                                    </text>
                                    <Pie data={ticketSeverityData} dataKey="value" nameKey="name" fontSize={12} outerRadius={90} label={payload => payload.name} labelLine={true}>
                                        {ticketSeverityData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={["DarkSlateGray", "Green", "Blue", "OrangeRed", "Crimson"][index]} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </Stack>

                            <hr />

                            <Stack direction="horizontal" className="justify-content-around">
                                <div>
                                    <div>New: {stats.ticketsNew} ({toPercentageOfTickets(stats.ticketsNew)}%)</div>
                                    <div>In progress: {stats.ticketsInProgress} ({toPercentageOfTickets(stats.ticketsInProgress)}%)</div>
                                    <div>Resolved: {stats.ticketsResolved} ({toPercentageOfTickets(stats.ticketsResolved)}%)</div>
                                    <div>Feedback needed: {stats.ticketsFeedbackNeeded} ({toPercentageOfTickets(stats.ticketsFeedbackNeeded)}%)</div>
                                    <div>Rejected: {stats.ticketsRejected} ({toPercentageOfTickets(stats.ticketsRejected)}%)</div>
                                    <div>On hold: {stats.ticketsOnHold} ({toPercentageOfTickets(stats.ticketsOnHold)}%)</div>
                                </div>
                                <div>
                                    <div>Unknown: {stats.ticketsUnknown} ({toPercentageOfTickets(stats.ticketsUnknown)}%)</div>
                                    <div>Low: {stats.ticketsLow} ({toPercentageOfTickets(stats.ticketsLow)}%)</div>
                                    <div>Moderate: {stats.ticketsModerate} ({toPercentageOfTickets(stats.ticketsModerate)}%)</div>
                                    <div>High: {stats.ticketsHigh} ({toPercentageOfTickets(stats.ticketsHigh)}%)</div>
                                    <div>Critical: {stats.ticketsCritical} ({toPercentageOfTickets(stats.ticketsCritical)}%)</div>
                                </div>
                                <div>
                                    <div>Total tickets: {stats.ticketCount}</div>
                                    <div>Total registered users: {stats.userCount}</div>
                                    <div>Total comments: {stats.commentCount}</div>
                                </div>
                            </Stack>

                            {/* <div>
                                {JSON.stringify(stats)}
                            </div> */}

                        </Card.Body>

                    </Card>
                }

            </Modal.Body>

        </Modal>
    );

}

export default StatsModal;