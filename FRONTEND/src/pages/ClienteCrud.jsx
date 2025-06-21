import React, { useEffect, useState } from "react";
import axios from "axios";
import defaultProfile from "../assets/default-profile.jpg";
import "./styles/ClienteCrud.css";
import AdminNavbar from "../components/AdminNavbar";
import AdminHomeButton from "../components/AdminHomeButton";

const ClienteCrud = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);

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
        <>
          <table className="clientecrud-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>FOTO</th>
                <th>NOMBRE</th>
                <th>APELLIDO</th>
                <th>TELEFONO</th>
                <th>DIRECCION</th>
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
          {/* Tarjetas para mobile */}
          <div className="clientecrud-table-mobile">
            {clientes.map((c) => (
              <div className="clientecrud-card" key={c.id_cliente}>
                <div className="clientecrud-card-row">
                  <span className="clientecrud-card-label">ID:</span>
                  <span>{c.id_cliente}</span>
                </div>
                <div className="clientecrud-card-row">
                  <span className="clientecrud-card-label">Foto:</span>
                  <img
                    className="clientecrud-card-foto"
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
                  />
                </div>
                <div className="clientecrud-card-row">
                  <span className="clientecrud-card-label">Nombre:</span>
                  <span>{c.nombre}</span>
                </div>
                <div className="clientecrud-card-row">
                  <span className="clientecrud-card-label">Apellido:</span>
                  <span>{c.apellido}</span>
                </div>
                <div className="clientecrud-card-row">
                  <span className="clientecrud-card-label">Teléfono:</span>
                  <span>{c.telefono}</span>
                </div>
                <div className="clientecrud-card-row">
                  <span className="clientecrud-card-label">Dirección:</span>
                  <span>{c.direccion}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ClienteCrud;