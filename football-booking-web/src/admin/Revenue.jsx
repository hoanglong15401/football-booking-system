import { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";
import "./Revenue.css";

function Revenue() {
    const [bookings, setBookings] = useState([]);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        const res = await fetch("https://football-booking-backend.onrender.com/api/bookings");
        const data = await res.json();

        data.sort(
            (a, b) => new Date(a.bookingDate) - new Date(b.bookingDate)
        );

        setBookings(data);
    };

    // filter
    const filtered = bookings.filter((b) => {
        if (!fromDate && !toDate) return true;
        const date = new Date(b.bookingDate);
        if (fromDate && date < new Date(fromDate)) return false;
        if (toDate && date > new Date(toDate)) return false;
        return true;
    });

    // tổng doanh thu
    const totalRevenue = filtered.reduce(
        (sum, b) => sum + Number(b.totalPrice),
        0
    );

    // hôm nay
    const today = new Date().toISOString().split("T")[0];
    const todayRevenue = bookings
        .filter((b) => b.bookingDate === today)
        .reduce((sum, b) => sum + Number(b.totalPrice), 0);

    // tháng này
    const now = new Date();
    const monthRevenue = bookings
        .filter((b) => {
            const d = new Date(b.bookingDate);
            return (
                d.getMonth() === now.getMonth() &&
                d.getFullYear() === now.getFullYear()
            );
        })
        .reduce((sum, b) => sum + Number(b.totalPrice), 0);

    const totalBookings = filtered.length;

    // tổng theo loại sân
    const fieldSummary = { 5: 0, 7: 0, 11: 0 };
    filtered.forEach((b) => {
        fieldSummary[b.fieldType] += Number(b.totalPrice);
    });

    // chart data
    const chartData = Object.values(
        filtered.reduce((acc, b) => {
            const date = new Date(
                b.bookingDate
            ).toLocaleDateString("vi-VN");

            if (!acc[date]) {
                acc[date] = { date, revenue: 0 };
            }

            acc[date].revenue += Number(b.totalPrice);
            return acc;
        }, {})
    );

    return (
        <div className="revenue">
            <h2>Doanh thu</h2>

            {/* CARDS */}
            <div className="cards">
                <div className="card">
                    <h4>Hôm nay</h4>
                    <p>{todayRevenue.toLocaleString()}đ</p>
                </div>

                <div className="card">
                    <h4>Tháng này</h4>
                    <p>{monthRevenue.toLocaleString()}đ</p>
                </div>

                <div className="card">
                    <h4>Tổng doanh thu</h4>
                    <p>{totalRevenue.toLocaleString()}đ</p>
                </div>

                <div className="card">
                    <h4>Số booking</h4>
                    <p>{totalBookings}</p>
                </div>
            </div>

            {/* FILTER */}
            <div className="filter">
                <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                />

                <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                />
            </div>

            {/* CHART */}
            <div className="chart-card">
                <h3>Doanh thu theo ngày</h3>

                <LineChart width={900} height={300} data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#3b82f6"
                        strokeWidth={3}
                    />
                </LineChart>
            </div>

            {/* TABLE */}
            <div className="table-card">
                <table>
                    <thead>
                        <tr>
                            <th>Ngày</th>
                            <th>Sân</th>
                            <th>Khách</th>
                            <th>Giờ</th>
                            <th>Nước</th>
                            <th>Giá</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filtered.map((b) => (
                            <tr key={b.id}>
                                <td>
                                    {new Date(
                                        b.bookingDate
                                    ).toLocaleDateString("vi-VN")}
                                </td>

                                <td>{b.fieldName}</td>
                                <td>{b.customerName}</td>

                                <td>
                                    {b.startTime} - {b.endTime}
                                </td>

                                <td>{b.drink || "Không"}</td>

                                <td>
                                    {Number(
                                        b.totalPrice
                                    ).toLocaleString()}đ
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* SUMMARY */}
            <div className="summary">
                <h3>Tổng theo loại sân</h3>

                <div className="summary-grid">
                    <div>
                        Sân 5: {fieldSummary[5].toLocaleString()}đ
                    </div>

                    <div>
                        Sân 7: {fieldSummary[7].toLocaleString()}đ
                    </div>

                    <div>
                        Sân 11: {fieldSummary[11].toLocaleString()}đ
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Revenue;