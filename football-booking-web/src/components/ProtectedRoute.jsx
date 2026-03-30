import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, role }) {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // decode JWT
    const payload = JSON.parse(atob(token.split(".")[1]));

    // n?u route yêu c?u role admin
    if (role && payload.role !== role) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;