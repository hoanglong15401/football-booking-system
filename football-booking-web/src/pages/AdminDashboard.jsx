import { useEffect, useState } from "react";
import "./AdminDashboard.css";

function AdminDashboard() {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const res = await fetch("http://localhost:5142/api/dashboard");

            if (!res.ok) {
                console.error("API lỗi:", res.status);
                return;
            }

            const text = await res.text();
            const data = text ? JSON.parse(text) : null;

            setData(data);
        } catch (error) {
            console.error("fetchDashboard lỗi:", error);
        }
    };

    if (!data) return <div>Loading...</div>;

    return (
        <div className="dashboard">
            <h2>Dashboard</h2>

            <div className="cards">
                <div className="card">
                    <h3>Hôm nay</h3>
                    <p>{data.todayBookings} sân</p>
                    <span>{data.todayRevenue.toLocaleString()}đ</span>
                </div>

                <div className="card">
                    <h3>Tuần</h3>
                    <p>{data.weekBookings} sân</p>
                    <span>{data.weekRevenue.toLocaleString()}đ</span>
                </div>

                <div className="card">
                    <h3>Tháng</h3>
                    <p>{data.monthBookings} sân</p>
                    <span>{data.monthRevenue.toLocaleString()}đ</span>
                </div>

                <div className="card active">
                    <h3>Đang hoạt động</h3>
                    <p>{data.activeFields} sân</p>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;