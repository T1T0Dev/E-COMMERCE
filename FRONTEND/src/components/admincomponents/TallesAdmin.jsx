import React, { useEffect, useState } from "react";
import './estilosadmin/CategoriasAdmin.css'; // Puedes crear un estilosadmin/TallesAdmin.css si quieres estilos distintos
import { useNavigate } from "react-router-dom";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
        <div className="categorias-admin-container">
            <ToastContainer position="top-right" autoClose={2000} />
            <button
                onClick={() => navigate(-1)}
                className="cta-button"
            >
                <AiOutlineArrowLeft size={30} className="drop-shadow" />
                Volver atrás
            </button>
            <h2 className="categorias-admin-title">Administrar Talles</h2>
            <form onSubmit={handleAgregar} className="categorias-admin-form">
                <input
                    className="categorias-admin-input"
                    placeholder="Nombre del talle"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                />
                <button
                    type="submit"
                    className="categorias-admin-btn-agregar"
                >
                    Agregar Talle
                </button>
            </form>
            <h3 className="categorias-admin-subtitle">Talles existentes</h3>
            {loading ? (
                <p className="categorias-admin-loading">Cargando...</p>
            ) : (
                <ul className="categorias-admin-list">
                    {talles.map((talle) => (
                        <li key={talle.id_talle} className="categorias-admin-item">
                            <div className="categorias-admin-item-info">
                                <span className="categorias-admin-item-nombre">{talle.nombre_talle}</span>
                            </div>
                            <button
                                onClick={() => handleEliminar(talle.id_talle)}
                                className="categorias-admin-btn-eliminar"
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