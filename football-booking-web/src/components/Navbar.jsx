import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Navbar.css";

function Navbar() {
    const navigate = useNavigate();
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [userName, setUserName] = useState("");
    const [role, setRole] = useState("");

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        setToken(storedToken);

        if (storedToken) {
            try {
                const payload = JSON.parse(atob(storedToken.split(".")[1]));

                const name =
                    payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];

                setUserName(name);
                setRole(payload.role); // lấy role
            } catch (e) {
                console.error("Token decode error", e);
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
        window.location.reload();
    };

    return (
        <nav className="navbar">
            <h2 className="logo">⚽ Football Booking</h2>

            <div className="nav-links">
                <Link to="/">Trang chủ</Link>

                {!token ? (
                    <>
                        <Link to="/login">Đăng nhập</Link>
                        <Link to="/register">Đăng ký</Link>
                    </>
                ) : (
                    <>
                        <Link to="/my-bookings">Sân đã đặt</Link>

                        {/* ADMIN MENU */}
                        {role === "Admin" && (
                            <>
                                <Link to="/admin/fields">Quản lý sân</Link>
                                <Link to="/admin/bookings">Quản lý đặt sân</Link>
                                <Link to="/admin/revenue">Doanh thu</Link>
                                <Link to="/admin/users">Người dùng</Link>
                                <Link to="/admin/dashboard">Dashboard</Link>
                            </>
                        )}

                        <span className="welcome">
                            Xin chào, <b>{userName}</b>
                        </span>

                        <button
                            className="logout-btn"
                            onClick={handleLogout}
                        >
                            Đăng xuất
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;