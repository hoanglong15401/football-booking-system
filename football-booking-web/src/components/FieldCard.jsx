function FieldCard({ field, onBook }) {

    return (

        <div className="field-card">

            <img
                src={field.image}
                alt={field.name}
                className="field-image"
            />

            <h3>{field.name}</h3>

            <p>📍 {field.location}</p>

            <p>
                💰 {Number(field.pricePerHour).toLocaleString()} VNĐ / giờ
            </p>

            <p>⭐ {field.rating} / 5</p>

            <button
                className="btn-book"
                onClick={() => onBook(field)}
            >
                Đặt sân
            </button>

        </div>

    );

}

export default FieldCard;