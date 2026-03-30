import { useState, useEffect } from "react";

function BookingModal({ field, onClose }) {
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [size, setSize] = useState("5");
    const [drink, setDrink] = useState("");
    const [note, setNote] = useState("");
    const [bookedSlots, setBookedSlots] = useState([]);
    const [currentTime, setCurrentTime] = useState(new Date());

    const timeSlots = [
        "05:00", "06:00", "07:00", "08:00", "09:00",
        "14:00", "15:00", "16:00", "17:00",
        "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"
    ];

    const priceMap = {
        5: 300000,
        7: 500000,
        11: 800000
    };

    const price = priceMap[size];

    // 🕒 realtime clock
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // ⛔ check giờ quá khứ
    const isPastTime = (slot) => {
        if (!date) return false;

        const now = new Date();
        const selected = new Date(date);

        const [hour, minute] = slot.split(":");
        selected.setHours(Number(hour));
        selected.setMinutes(Number(minute));
        selected.setSeconds(0);

        return selected < now;
    };

    // 📅 load slot đã đặt
    const loadBookedSlots = async (selectedDate) => {
        const res = await fetch(
            `http://localhost:5142/api/bookings/field/${field.id}?date=${selectedDate}`
        );

        if (res.ok) {
            const data = await res.json();

            // 🔥 đảm bảo format giống nhau
            const times = data.map(b => b.time.slice(0, 5)); // "18:00:00" -> "18:00"
            setBookedSlots(times);
        }
    };

    const handleDateChange = async (e) => {
        const selectedDate = e.target.value;
        setDate(selectedDate);

        if (!selectedDate) return;

        await loadBookedSlots(selectedDate);
    };

    // 🚀 booking
    const handleBooking = async () => {
        if (!date || !time) {
            alert("Vui lòng chọn ngày và giờ");
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            alert("Bạn chưa đăng nhập");
            return;
        }

        const response = await fetch(
            "http://localhost:5142/api/bookings",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({
                    footballFieldId: field.id,
                    bookingDate: date,
                    startTime: time + ":00",
                    drink: drink
                })
            }
        );

        const data = await response.json();

        if (response.ok) {
            alert("Đặt sân thành công");

            // 🔥 reload slot ngay
            await loadBookedSlots(date);

            setTime("");
        } else {
            alert(data.message || "Đặt sân thất bại");
        }
    };
    console.log("time:", time);
    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Đặt sân {field.name}</h2>

                <p className="clock">
                    🕒 {currentTime.toLocaleString()}
                </p>

                <label>Ngày</label>
                <input
                    type="date"
                    value={date}
                    onChange={handleDateChange}
                />

                <label>Chọn giờ (mỗi slot = 1 giờ)</label>
                <div className="time-slots">
                    {timeSlots.map(slot => {
                        const isBooked = bookedSlots.includes(slot);
                        const isPast = isPastTime(slot);

                        return (
                            <button
                                key={slot}
                                disabled={isBooked || isPast}
                                className={
                                    isBooked
                                        ? "slot booked"
                                        : isPast
                                            ? "slot past"
                                            : time === slot
                                                ? "slot selected"
                                                : "slot"
                                }
                                onClick={() => setTime(slot)}
                            >
                                {slot}
                            </button>
                        );
                    })}
                </div>

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

                <p>💰 Giá sân: {price.toLocaleString()} VNĐ / giờ</p>
                <p>Tổng tiền: <b>{price.toLocaleString()} VNĐ</b></p>

                <label>Ghi chú</label>
                <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                />

                <div className="modal-buttons">
                    <button
                        className="btn-primary"
                        onClick={handleBooking}
                    >
                        Xác nhận đặt sân
                    </button>

                    <button
                        className="btn-close"
                        onClick={onClose}
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}

export default BookingModal;