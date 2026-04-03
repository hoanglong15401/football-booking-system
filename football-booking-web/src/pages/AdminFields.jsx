import { useEffect, useState } from "react";
import FieldModal from "../admin/FieldModal";
import "./AdminFields.css";

function AdminFields() {
    const [fields, setFields] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingField, setEditingField] = useState(null);

    useEffect(() => {
        fetchFields();
    }, []);

    const fetchFields = async () => {
        try {
            const res = await fetch("https://football-booking-backend.onrender.com/api/footballfields");

            if (!res.ok) {
                console.error("API lỗi:", res.status);
                setFields([]);
                return;
            }

            const text = await res.text();
            const data = text ? JSON.parse(text) : [];

            setFields(data);
        } catch (error) {
            console.error("Lỗi fetchFields:", error);
            setFields([]);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn chắc chắn muốn xoá?")) return;

        try {
            await fetch(`https://football-booking-backend.onrender.com/api/footballfields/${id}`, {
                method: "DELETE",
            });

            fetchFields();
        } catch (error) {
            console.error("Lỗi xoá:", error);
        }
    };

    const handleEdit = (field) => {
        setEditingField(field);
        setShowModal(true);
    };

    const handleToggleActive = async (field) => {
        try {
            await fetch(
                `https://football-booking-backend.onrender.com/api/footballfields/${field.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        ...field,
                        isActive: !field.isActive,
                    }),
                }
            );

            fetchFields();
        } catch (error) {
            console.error("Toggle lỗi:", error);
        }
    };

    return (
        <div className="admin-fields">

            <div className="admin-header">
                <h2>Quản lý sân</h2>

                <button
                    className="add-btn"
                    onClick={() => {
                        setEditingField(null);
                        setShowModal(true);
                    }}
                >
                    + Thêm sân
                </button>
            </div>

            <div className="table-card">
                <table>
                    <thead>
                        <tr>
                            <th>Tên sân</th>
                            <th>Địa điểm</th>
                            <th>Loại sân</th>
                            <th>Giá / giờ</th>
                            <th>Trạng thái</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {fields.map((field) => (
                            <tr key={field.id}>
                                <td>{field.name}</td>
                                <td>{field.location}</td>
                                <td>{field.fieldType} người</td>
                                <td>{field.pricePerHour?.toLocaleString()}đ</td>

                                <td>
                                    <button
                                        className={`status-btn ${field.isActive
                                                ? "status-active"
                                                : "status-inactive"
                                            }`}
                                        onClick={() => handleToggleActive(field)}
                                    >
                                        {field.isActive ? "Hoạt động" : "Ngưng"}
                                    </button>
                                </td>

                                <td>
                                    <button
                                        className="edit-btn"
                                        onClick={() => handleEdit(field)}
                                    >
                                        Sửa
                                    </button>

                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(field.id)}
                                    >
                                        Xoá
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <FieldModal
                    field={editingField}
                    onClose={() => {
                        setShowModal(false);
                        setEditingField(null);
                    }}
                    onSuccess={fetchFields}
                />
            )}
        </div>
    );
}

export default AdminFields;