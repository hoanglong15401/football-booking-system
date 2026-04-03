import { useEffect, useState } from "react";
import "./AdminUsers.css";

function AdminUsers() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch("https://football-booking-backend.onrender.com/api/users");
            const data = await res.json();
            setUsers(data);
        } catch (error) {
            console.error("Lỗi load user:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Xoá user này?")) return;

        await fetch(`https://football-booking-backend.onrender.com/api/users/${id}`, {
            method: "DELETE",
        });

        fetchUsers();
    };

    const handleToggleRole = async (user) => {
        const newRole = user.role === "Admin" ? "User" : "Admin";

        await fetch(`https://football-booking-backend.onrender.com/api/users/${user.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...user,
                role: newRole,
            }),
        });

        fetchUsers();
    };

    return (
        <div className="admin-users">
            <h2>Quản lý người dùng</h2>

            <div className="table-card">
                <table>
                    <thead>
                        <tr>
                            <th>Tên</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Role</th>
                            <th>Đang đặt</th>
                            <th>Tổng đặt</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map((u) => (
                            <tr key={u.id}>
                                <td>{u.name || "-"}</td>
                                <td>{u.email}</td>
                                <td>{u.phone || "-"}</td>

                                <td>
                                    <button
                                        className={
                                            u.role === "Admin"
                                                ? "role-admin"
                                                : "role-user"
                                        }
                                        onClick={() => handleToggleRole(u)}
                                    >
                                        {u.role}
                                    </button>
                                </td>

                                <td>{u.activeBookings || 0}</td>
                                <td>{u.bookingCount || 0}</td>

                                <td>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(u.id)}
                                    >
                                        Xoá
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminUsers;