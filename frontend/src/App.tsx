import { useContext, useState } from 'react';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import LoginModal from './components/modal/LoginModal';
import SignUpModal from './components/modal/SignUpModal';
import NavBar from './components/NavBar';
import { UserContext } from './contexts/userContext';
import LandingPage from './pages/LandingPage';
import { outletRoutes } from './routes/outletRoutes';

function App() {

    const { loggedInUser, setLoggedInUser } = useContext(UserContext);
    const [theme, setTheme] = useState("default");

    if (theme) {
        require(`./styles/themes/${theme}.scss`);
    }

    const AppLayout = () => {

        const [showSignUpModal, setShowSignUpModal] = useState(false);
        const [showLoginModal, setShowLoginModal] = useState(false);

        return (
            <>
                <NavBar
                    onSignUpClicked={() => setShowSignUpModal(true)}
                    onLoginClicked={() => setShowLoginModal(true)}
                    onLogoutSuccessful={() => setLoggedInUser(null)}
                />

                <Outlet />

                {/* Modals */}

                {
                    showSignUpModal &&
                    <SignUpModal
                        onDismiss={() => { setShowSignUpModal(false) }}
                        onSignUpSuccessful={(user) => {
                            setLoggedInUser(user);
                            setShowSignUpModal(false);
                        }}
                    />
                }

                {
                    showLoginModal &&
                    <LoginModal
                        onDismiss={() => { setShowLoginModal(false) }}
                        onLoginSuccessful={(loggedInUser) => {
                            setLoggedInUser(loggedInUser);
                            setShowLoginModal(false);
                        }}
                    />
                }
            </>
        );
    }

    const routes = [
        {
            path: "/",
            element: <LandingPage />,
        },
        {
            element: <AppLayout />,
            children: outletRoutes,
        }
    ];

    const router = createBrowserRouter(routes);

    return (
        <RouterProvider router={router} />
    );
}

export default App;