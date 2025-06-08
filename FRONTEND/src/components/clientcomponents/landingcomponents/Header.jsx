import React, { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { FaBars, FaShoppingCart, FaUserShield } from "react-icons/fa";
import useAuthStore from "../../../store/useAuthStore";
import "../landingcomponents/estiloslanding/Header.css";
import Carrito from "./Carrito.jsx";
import useCarritoStore from "../../../store/useCarritoStore";

const Header = () => {
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const location = useLocation();
  const { items } = useCarritoStore();

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMenuOpen(false);
    setAdminMenuOpen(false);
  };

  return (
    <header>
      <nav className="navbar-flex">
        {/* IZQUIERDA */}
        <ul className="navbar-left">
          {location.pathname !== "/" && (
            <li>
              <button
                className="home-btn"
                title="Volver a inicio"
                onClick={() => navigate("/")}
              >
                <img
                  src="src/Resources/logo-drekkz.png"
                  alt="Inicio"
                  className="home-logo-img"
                />
              </button>
            </li>
          )}
          {user && (
            <li>
              <button className="cerrar-sesion-btn" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </li>
          )}
        </ul>

        {/* DERECHA */}
        <ul className="navbar-right">
          {user && user.rol === "cliente" && (
            <>
              {location.pathname !== "/catalogo" && (
                <li>
                  <Link to="/catalogo">Catálogo</Link>
                </li>
              )}
              <li>
                <button
                  className="cart-section"
                  onClick={() => setMostrarCarrito(true)}
                  title="Ver carrito"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <FaShoppingCart size={22} />
                  {items.length > 0 && (
                    <span className="cart-count">{items.length}</span>
                  )}
                </button>
              </li>
              <li>
                <button
                  className="menu-btn"
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  <FaBars />
                </button>
                {menuOpen && (
                  <div className="dropdown-menu">
                    <Link to="/perfil">Editar Perfil</Link>
                  </div>
                )}
              </li>
            </>
          )}

          {user && user.rol === "admin" && (
            <>
              <li>
                <button
                  className="admin-btn"
                  onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                >
                  <FaUserShield style={{ fontSize: 22, color: "#f39c12" }} />
                </button>
                {adminMenuOpen && (
                  <div className="dropdown-menu">
                    <Link to="/admin/productos">CRUD Productos</Link>
                    <Link to="/admin/pedidos">CRUD Pedidos</Link>
                    <Link to="/admin/categorias">CRUD Categorías</Link>
                    <Link to="/admin/talles">CRUD Talles</Link>
                    <Link to="/admin/usuarios">CRUD Usuarios</Link>
                  </div>
                )}
              </li>
            </>
          )}

          {!user && (
            <li>
              <Link to="/login">Iniciar sesión</Link>
            </li>
          )}
        </ul>
      </nav>

      {/* OVERLAY desenfocado */}
      {mostrarCarrito && (
        <div
          className="carrito-overlay"
          onClick={() => setMostrarCarrito(false)}
        />
      )}

      {/* Panel lateral del carrito */}
      {mostrarCarrito && (
        <Carrito open={mostrarCarrito} onClose={() => setMostrarCarrito(false)} />
      )}
    </header>
  );
};

export default Header;
