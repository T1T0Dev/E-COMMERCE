import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./estilosadmin/TallesAdmin.css";
const TallesAdmin = () => {
    const [talles, setTalles] = useState([]);
    const [nombre, setNombre] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Traer talles
    const fetchTalles = async () => {
        setLoading(true);
        const res = await fetch("http://localhost:3000/api/talles");
        const data = await res.json();
        setTalles(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchTalles();
    }, []);

    // Agregar talle
    const handleAgregar = async (e) => {
        e.preventDefault();
        if (!nombre) return;
        const res = await fetch("http://localhost:3000/api/talles", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre }),
        });
        if (res.ok) {
            toast.success("¡Talle agregado!");
            setNombre("");
            fetchTalles();
        } else {
            toast.error("Error al agregar el talle");
        }
    };

    // Eliminar talle
    const handleEliminar = async (id) => {
        if (!window.confirm("¿Eliminar este talle?")) return;
        const res = await fetch(`http://localhost:3000/api/talles/${id}`, {
            method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok) {
            toast.error(data.error || "Error al eliminar el talle");
            return;
        }
        toast.success("¡Talle eliminado!");
        fetchTalles();
    };

    return (
        <div className="talles-admin-container">
            <ToastContainer position="top-right" autoClose={2000} />
            <button
                onClick={() => navigate(-1)}
                className="talles-admin-back-btn"
            >
                <AiOutlineArrowLeft size={30} className="talles-admin-back-icon" />
                Volver atrás
            </button>
            <h2 className="talles-admin-title">Administrar Talles</h2>
            <form onSubmit={handleAgregar} className="talles-admin-form">
                <input
                    className="talles-admin-input"
                    placeholder="Nombre del talle"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                />
                <button
                    type="submit"
                    className="talles-admin-btn-agregar"
                >
                    Agregar Talle
                </button>
            </form>
            <h3 className="talles-admin-subtitle">Talles existentes</h3>
            {loading ? (
                <p className="talles-admin-loading">Cargando...</p>
            ) : (
                <ul className="talles-admin-list">
                    {talles.map((talle) => (
                        <li key={talle.id_talle} className="talles-admin-item">
                            <div className="talles-admin-item-info">
                                <span className="talles-admin-item-nombre">{talle.nombre_talle}</span>
                            </div>
                            <button
                                onClick={() => handleEliminar(talle.id_talle)}
                                className="talles-admin-btn-eliminar"
                            >
                                Eliminar
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TallesAdmin;