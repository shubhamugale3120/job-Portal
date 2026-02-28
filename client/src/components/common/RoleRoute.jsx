import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Loader from './Loader';

const RoleRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
    if (loading) {
        return <Loader message="Checking permissions..." />;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const roleList = Array.isArray(allowedRoles) ? allowedRoles : [];
    if (!roleList.includes(user.role)) {
        return <Navigate to="/forbidden" replace />;
    }

    return children;
};

export default RoleRoute;