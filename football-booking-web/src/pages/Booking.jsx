import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Booking() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [size, setSize] = useState("5");
    const [drink, setDrink] = useState("");
    const [note, setNote] = useState("");

    const handleBooking = async () => {
        const token = localStorage.getItem("token");

        // nếu không có token → về login
        if (!token) {
            alert("Bạn cần đăng nhập");
            navigate("/login");
            return;
        }

        try {
            const response = await fetch(
                "https://football-booking-backend.onrender.com/api/bookings",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        fieldId: id,
                        date,
                        time,
                        size,
                        drink,
                        note,
                    }),
                }
            );

            if (response.ok) {
                alert("Đặt sân thành công ⚽");
                navigate("/my-bookings");
            } else if (response.status === 401) {
                alert("Phiên đăng nhập hết hạn");
                localStorage.removeItem("token");
                navigate("/login");
            } else {
                const error = await response.text();
                alert("Đặt sân thất bại: " + error);
            }
        } catch (error) {
            console.error(error);
            alert("Lỗi kết nối server");
        }
    };

    return (
        <div>
            <Navbar />

            <div className="container booking-page">
                <h2>Đặt sân</h2>

                <label>Ngày</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />

                <label>Giờ</label>
                <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                />

                <label>Loại sân</label>
                <select
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                >
                    <option value="5">Sân 5</option>
                    <option value="7">Sân 7</option>
                    <option value="11">Sân 11</option>
                </select>

                <label>Nước uống</label>
                <select
                    value={drink}
                    onChange={(e) => setDrink(e.target.value)}
                >
                    <option value="">Không</option>
                    <option value="water">Nước suối</option>
                    <option value="sting">Sting</option>
                    <option value="redbull">Redbull</option>
                </select>

                <label>Ghi chú</label>
                <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                />

                <button
                    className="btn-primary"
                    onClick={handleBooking}
                >
                    Xác nhận đặt sân
                </button>
            </div>

            <Footer />
        </div>
    );
}

export default Booking;