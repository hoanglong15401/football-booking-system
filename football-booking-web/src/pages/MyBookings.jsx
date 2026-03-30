import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

function MyBookings() {

    const [bookings, setBookings] = useState([]);

    useEffect(() => {

        const token = localStorage.getItem("token");

        fetch("http://localhost:5142/api/bookings/my", {
            headers: {
                "Authorization": "Bearer " + token
            }
        })
            .then(res => res.json())
            .then(data => setBookings(data));

    }, []);

    return (

        <div>


            <div className="container">

                <h2>📅 Lịch sử đặt sân</h2>

                <div className="booking-list">

                    {bookings.map(b => (

                        <div key={b.id} className="booking-card">

                            <h3>{b.fieldName}</h3>

                            <p>📅 {b.date}</p>

                            <p>🕒 {b.time}</p>

                            <p>⚽ Sân {b.size}</p>

                            <p>💰 {b.price.toLocaleString()} VNĐ</p>

                        </div>

                    ))}

                </div>

            </div>

        </div>

    );
}

export default MyBookings;