import React, { useEffect, useState } from "react";
import axios from "axios";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import defaultProfile from "../../assets/default-profile.jpg";
import "./estilosadmin/ClienteCrud.css";
import AdminNavbar from "./AdminNavbar";
import AdminHomeButton from "./AdminHomeButton";

const ClienteCrud = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/clientes");
        setClientes(res.data);
      } catch (error) {
        setClientes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchClientes();
  }, []);

  return (
    <div className="clientecrud-bg">
      <AdminNavbar />
      {/* Botón volver afuera */}
      <div className="clientecrud-back-btn-wrapper">
        <AdminHomeButton />
        
      </div>
      <h2 className="clientecrud-title">Clientes Registrados</h2>
      {loading ? (
        <div className="clientecrud-loading">Cargando clientes...</div>
      ) : clientes.length === 0 ? (
        <div className="clientecrud-vacio">No hay clientes registrados.</div>
      ) : (
        <table className="clientecrud-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Foto</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Teléfono</th>
              <th>Dirección</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((c) => (
              <tr key={c.id_cliente}>
                <td>{c.id_cliente}</td>
                <td>
                  <img
                    className="clientecrud-foto"
                    src={
                      c.foto_perfil
                        ? `http://localhost:3000/${c.foto_perfil}`
                        : defaultProfile
                    }
                    alt="Foto de perfil"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = defaultProfile;
                    }}
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "2px solid #353535",
                      background: "#181818",
                    }}
                  />
                </td>
                <td>{c.nombre}</td>
                <td>{c.apellido}</td>
                <td>{c.telefono}</td>
                <td>{c.direccion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ClienteCrud;