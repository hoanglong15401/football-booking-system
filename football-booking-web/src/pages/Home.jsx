import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FieldCard from "../components/FieldCard";
import BookingModal from "../components/BookingModal";

function Home() {

    const [fields, setFields] = useState([]);
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState("all");

    const [showModal, setShowModal] = useState(false);
    const [selectedField, setSelectedField] = useState(null);

    useEffect(() => {

        //fetch("http://localhost:5142/api/FootballFields")
        fetch(`${process.env.REACT_APP_API_URL}/FootballFields`)
            .then(res => res.json())
            .then(data => {

                const fieldsWithExtra = data.map(field => ({
                    ...field,
                    rating: Math.floor(Math.random() * 2) + 4,
                    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018"
                }));

                setFields(fieldsWithExtra);
            });

    }, []);

    const filteredFields = fields
        .filter(field =>
            field.location.toLowerCase().includes(search.toLowerCase())
        )
        .filter(field =>
            filterType === "all"
                ? true
                : field.fieldType === Number(filterType)
        );

    const openBookingModal = (field) => {
        setSelectedField(field);
        setShowModal(true);
    };

    return (

        <div>


            {/* HERO */}

            <section className="hero">

                <h1>Hệ Thống Đặt Sân Bóng</h1>

                <p>Đặt sân nhanh chóng trong vài giây</p>

                <div className="hero-buttons">

                    <button className="btn-primary">
                        Đặt sân ngay
                    </button>

                </div>

            </section>

            {/* SEARCH + FILTER */}

            <section className="search-section">

                <input
                    type="text"
                    placeholder="Tìm sân theo địa điểm..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="search-input"
                />

                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="filter-select"
                >

                    <option value="all">Tất cả sân</option>
                    <option value="5">Sân 5 người</option>
                    <option value="7">Sân 7 người</option>
                    <option value="11">Sân 11 người</option>

                </select>

            </section>

            {/* FIELD LIST */}

            <section className="fields">

                <h2>Danh sách sân bóng</h2>

                <div className="field-grid">

                    {filteredFields.map(field => (

                        <FieldCard
                            key={field.id}
                            field={field}
                            onBook={openBookingModal}
                        />

                    ))}

                </div>

            </section>

            {/* MODAL */}

            {showModal && selectedField && (

                <BookingModal
                    field={selectedField}
                    onClose={() => setShowModal(false)}
                />

            )}

            <Footer />

        </div>

    );
}

export default Home;