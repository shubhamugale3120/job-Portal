import { Navigate } from "react-router-dom";//Navigate is a component from React Router that allows you to programmatically redirect users to a different route. In this case, it's used to redirect unauthenticated users to the login page.
import { useAuth } from "../../hooks/useAuth";
import Loader from './Loader';

const ProtectedRouter = ({ children }) => {
  const { user, loading } = useAuth();
    if (loading) {
        return <Loader message="Checking session..." />;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRouter;