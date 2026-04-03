import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {

    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleRegister = async () => {

        const response = await fetch(
            https://football-booking-backend.onrender.com/api/Auth/register
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    fullName: name,
                    phoneNumber: phoneNumber,
                    email: email,
                    password: password
                })
            }
        );

        const result = await response.text();

        if (response.ok) {

            alert("Đăng ký thành công!");
            navigate("/login");

        } else {

            alert(result);

        }

    };

    return (

        <div className="container">

            <h2>Đăng ký</h2>

            <input
                type="text"
                placeholder="Họ và tên"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <input
                type="text"
                placeholder="Số điện thoại"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
            />

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                type="password"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={handleRegister}>
                Đăng ký
            </button>

        </div>
    );
}

export default Register;