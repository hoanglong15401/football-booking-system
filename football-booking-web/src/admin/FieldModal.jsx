import { useState, useEffect } from "react";

function FieldModal({ field, onClose, onSuccess }) {
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [fieldType, setFieldType] = useState(5);
    const [pricePerHour, setPricePerHour] = useState("");

    useEffect(() => {
        if (field) {
            setName(field.name);
            setLocation(field.location);
            setFieldType(field.fieldType);
            setPricePerHour(field.pricePerHour);
        }
    }, [field]);

    const handleSubmit = async () => {
        const method = field ? "PUT" : "POST";
        const url = field
            ? `http://localhost:5142/api/footballfields/${field.id}`
            : "http://localhost:5142/api/footballfields";

        await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                location,
                fieldType,
                pricePerHour: Number(pricePerHour),
                isActive: true,
            }),
        });

        onSuccess();
        onClose();
    };

    return (
        <div className="modal">
            <h3>{field ? "Sửa sân" : "Thêm sân"}</h3>

            <input
                placeholder="Tên sân"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <input
                placeholder="Địa điểm"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
            />

            <select
                value={fieldType}
                onChange={(e) => setFieldType(Number(e.target.value))}
            >
                <option value={5}>Sân 5</option>
                <option value={7}>Sân 7</option>
            </select>

            <input
                placeholder="Giá / giờ"
                value={pricePerHour}
                onChange={(e) => setPricePerHour(e.target.value)}
            />

            <button onClick={handleSubmit}>Lưu</button>
            <button onClick={onClose}>Huỷ</button>
        </div>
    );
}

export default FieldModal;