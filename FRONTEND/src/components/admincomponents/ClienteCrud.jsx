import React, { useEffect, useState } from "react";
import axios from "axios";
import "./estilosadmin/ClienteCrud.css";

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
    <div className="clientecrud-container">
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