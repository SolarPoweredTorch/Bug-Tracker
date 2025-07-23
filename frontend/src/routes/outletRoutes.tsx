import AboutPage from '../pages/AboutPage';
import BugTablePage from "../pages/BugTablePage";
import DocsPage from '../pages/DocsPage';
import FullTicketPage from '../pages/FullTicketPage';
import NotFoundPage from '../pages/NotFoundPage';
import NotificationsListPage from '../pages/NotificationsListPage';
import PrivacyPage from '../pages/PrivacyPage';
import ProfilePage from '../pages/ProfilePage';
import UserInfoPage from '../pages/UserInfoPage';
import UserTablePage from '../pages/UserTablePage';

export const outletRoutes = [
    {
        path: "/issues",
        element: <BugTablePage />,
    },
    {
        path: "/tickets/:ticketId",
        element: <FullTicketPage />,
    },
    {
        path: "/users/list",
        element: <UserTablePage />,
    },
    {
        path: "/users/list/id/:userId",
        element: <UserInfoPage />,
    },
    {
        path: "/notifications",
        element: <NotificationsListPage />,
    },
    {
        path: "/profile",
        element: <ProfilePage />,
    },
    {
        path: "/docs",
        element: <DocsPage />,
    },
    {
        path: "/privacy",
        element: <PrivacyPage />,
    },
    {
        path: "/about",
        element: <AboutPage />,
    },
    {
        path: "/*",
        element: <NotFoundPage />,
    }
];
