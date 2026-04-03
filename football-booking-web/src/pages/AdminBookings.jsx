import { useEffect, useState } from "react";
import "./AdminBookings.css";

function AdminBookings() {
    const [bookings, setBookings] = useState([]);
    const [filterDate, setFilterDate] = useState("");

    useEffect(() => {
        fetchBookings();
    }, []);

    // auto refresh trạng thái mỗi phút
    useEffect(() => {
        const interval = setInterval(() => {
            setBookings(prev => [...prev]);
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    const fetchBookings = async () => {
        try {
            const res = await fetch("https://football-booking-backend.onrender.com/api/bookings");
            const data = await res.json();

            data.sort((a, b) => {
                const dateA = new Date(`${a.bookingDate} ${a.startTime}`);
                const dateB = new Date(`${b.bookingDate} ${b.startTime}`);
                return dateA - dateB;
            });

            setBookings(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm("Huỷ booking này?")) return;

        await fetch(`https://football-booking-backend.onrender.com/api/bookings/${id}`, {
            method: "DELETE",
        });

        fetchBookings();
    };

    // ===== STATUS =====
    const getStatus = (booking) => {
        const now = new Date();

        const date = new Date(booking.bookingDate);

        const [startHour, startMinute] = booking.startTime.split(":");
        const [endHour, endMinute] = booking.endTime.split(":");

        const start = new Date(date);
        start.setHours(startHour, startMinute, 0);

        const end = new Date(date);
        end.setHours(endHour, endMinute, 0);

        if (now < start) return "booked";
        if (now >= start && now <= end) return "playing";
        return "done";
    };

    const getStatusText = (status) => {
        if (status === "booked") return "Đã đặt";
        if (status === "playing") return "Đang sử dụng";
        return "Hoàn tất";
    };

    // ===== CANCEL RULE =====
    const canCancel = (booking) => {
        const now = new Date();
        const start = new Date(`${booking.bookingDate}T${booking.startTime}`);
        const diff = (start - now) / (1000 * 60 * 60);
        return diff >= 2;
    };

    // ===== FILTER =====
    const filteredBookings = bookings.filter((b) => {
        if (!filterDate) return true;
        return b.bookingDate === filterDate;
    });

    return (
        <div className="admin-bookings">
            <h2>Quản lý đặt sân</h2>

            <div className="filter">
                <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                />
            </div>

            <div className="table-card">
                <table>
                    <thead>
                        <tr>
                            <th>Khách</th>
                            <th>Sân</th>
                            <th>Ngày</th>
                            <th>Giờ</th>
                            <th>Nước</th>
                            <th>Giá</th>
                            <th>Trạng thái</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredBookings.map((booking) => {
                            const status = getStatus(booking);

                            return (
                                <tr key={booking.id}>
                                    <td>{booking.customerName}</td>

                                    <td>
                                        <div>{booking.fieldName}</div>
                                        <small>{booking.fieldAddress}</small>
                                        <div>
                                            {booking.fieldType === 5 && "Sân 5"}
                                            {booking.fieldType === 7 && "Sân 7"}
                                            {booking.fieldType === 11 && "Sân 11"}
                                        </div>
                                    </td>

                                    <td>
                                        {new Date(
                                            booking.bookingDate
                                        ).toLocaleDateString("vi-VN")}
                                    </td>

                                    <td>
                                        {booking.startTime} - {booking.endTime}
                                    </td>

                                    <td>{booking.drink || "Không"}</td>

                                    <td>
                                        {booking.totalPrice?.toLocaleString()}đ
                                    </td>

                                    <td>
                                        <span className={`status ${status}`}>
                                            {getStatusText(status)}
                                        </span>
                                    </td>

                                    <td>
                                        {canCancel(booking) ? (
                                            <button
                                                className="delete-btn"
                                                onClick={() =>
                                                    handleCancel(booking.id)
                                                }
                                            >
                                                Huỷ
                                            </button>
                                        ) : (
                                            <span className="disabled">
                                                Không thể huỷ
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminBookings;