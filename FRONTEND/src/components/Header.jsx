import React, { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { FaBars, FaShoppingCart, FaUserShield } from "react-icons/fa";
import Carrito from "../components/Carrito.jsx";
import useCarritoStore from "../store/useCarritoStore.js";
import useAuthStore from "../store/useAuthStore.js";
import "./styles/Header.css";

const Header = () => {
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [perfilMenuOpen, setPerfilMenuOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const location = useLocation();
  const { items } = useCarritoStore();

  useEffect(() => {
    if (mostrarCarrito) {
      document.body.classList.add("carrito-abierto");
    } else {
      document.body.classList.remove("carrito-abierto");
    }
    // Limpieza por si el componente se desmonta
    return () => document.body.classList.remove("carrito-abierto");
  }, [mostrarCarrito]);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    logout();
    navigate("/login");
    setMenuOpen(false);
    setAdminMenuOpen(false);
    setPerfilMenuOpen(false);
  };

  return (
    <header>
      <nav className="navbar-flex">
        {/* IZQUIERDA */}
        <ul className="navbar-left">
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
        </ul>

        {/* Agrupa carrito y hamburguesa en mobile */}
        <div className="navbar-actions-mobile">
          {user && user.rol === "cliente" && (
            <button
              className="cart-section cart-mobile"
              onClick={() => setMostrarCarrito(true)}
              title="Ver carrito"
            >
              <FaShoppingCart size={22} />
              {items.length > 0 && (
                <span className="cart-count">{items.length}</span>
              )}
            </button>
          )}
          <button
            className="hamburger-menu-btn"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menú"
          >
            <FaBars />
          </button>
        </div>

        {/* DERECHA (solo desktop) */}
        <ul className="navbar-right">
          {user && (
            <>
              {user.rol === "cliente" && location.pathname !== "/catalogo" && (
                <li>
                  <Link to="/catalogo">CATALOGO</Link>
                </li>
              )}
              {user.rol === "cliente" && (
                <li style={{ position: "relative" }}>
                  <button
                    className="cart-section"
                    onClick={() => setMostrarCarrito(true)}
                    title="Ver carrito"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      position: "relative",
                    }}
                  >
                    <FaShoppingCart size={22} />
                    {items.length > 0 && (
                      <span className="cart-count">{items.length}</span>
                    )}
                  </button>
                </li>
              )}
              {user.rol === "cliente" && (
                <li>
                  <button
                    className="menu-btn"
                    onClick={() => setPerfilMenuOpen(!perfilMenuOpen)}
                  >
                    <FaBars />
                  </button>
                  {perfilMenuOpen && (
                    <div className="dropdown-menu">
                      <Link
                        to="/perfil"
                        onClick={() => setPerfilMenuOpen(false)}
                      >
                        <span className="span-edit-perfil">
                          👤 Editar Perfil
                        </span>
                      </Link>
                      <li>
                        <button
                          className="cerrar-sesion-btn"
                          onClick={handleLogout}
                        >
                          <span className="span-cerrar-sesion">
                            👋 Cerrar Sesion
                          </span>
                        </button>
                      </li>
                    </div>
                  )}
                </li>
              )}
              {user.rol === "admin" && (
                <li>
                  <button
                    className="admin-btn"
                    onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                  >
                    <FaUserShield style={{ fontSize: 22, color: "white" }} />
                  </button>
                  {adminMenuOpen && (
                    <div className="dropdown-menu">
                      <Link to="/admin/usuarios">👤 Usuarios</Link>
                      <Link to="/admin/crud-clientes">👥 Clientes</Link>
                      <Link to="/admin/productos">📦 Productos</Link>
                      <Link to="/admin/categorias">📂 Categorías</Link>
                      <Link to="/admin/talles">📏 Talles</Link>
                      <Link to="/admin/carritos">🛒 Carritos</Link>
                      <Link to="/admin/ventas">💰 Ventas</Link>
                      <button
                        className="cerrar-sesion-btn"
                        onClick={handleLogout}
                      >
                        <span className="span-cerrar-sesion">
                            👋 Cerrar Sesion
                          </span>
                      </button>
                    </div>
                  )}
                </li>
              )}
            </>
          )}
          {!user && (
            <li>
              <Link to="/login"> Iniciar sesión</Link>
            </li>
          )}
        </ul>
      </nav>

      {/* Menú móvil */}
      {menuOpen && (
        <div className="mobile-menu">
          <button
            className="close-btn"
            onClick={() => setMenuOpen(false)}
            aria-label="Cerrar menú"
          >
            ×
          </button>
          {user && (
            <>
              {user.rol === "cliente" && location.pathname !== "/catalogo" && (
                <Link to="/catalogo" onClick={() => setMenuOpen(false)}>
                  👖 Catalogo
                </Link>
              )}
              {user.rol === "cliente" && (
                <Link to="/perfil" onClick={() => setMenuOpen(false)}>
                  👤 Editar Perfil
                </Link>
              )}
              <button className="cerrar-sesion-btn" onClick={handleLogout}>
                👋 Cerrar sesión
              </button>

              {user.rol === "admin" && (
                <>
                  <Link to="/admin/usuarios" onClick={() => setMenuOpen(false)}>
                    👤 Usuarios
                  </Link>
                  <Link
                    to="/admin/crud-clientes"
                    onClick={() => setMenuOpen(false)}
                  >
                    👥 Clientes
                  </Link>
                  <Link
                    to="/admin/productos"
                    onClick={() => setMenuOpen(false)}
                  >
                    📦 Productos
                  </Link>
                  <Link
                    to="/admin/categorias"
                    onClick={() => setMenuOpen(false)}
                  >
                    📂 Categorías
                  </Link>
                  <Link to="/admin/talles" onClick={() => setMenuOpen(false)}>
                    📏 Talles
                  </Link>
                  <Link to="/admin/carritos" onClick={() => setMenuOpen(false)}>
                    🛒 Carritos
                  </Link>
                  <Link to="/admin/ventas" onClick={() => setMenuOpen(false)}>
                    💰 Ventas
                  </Link>
                </>
              )}
            </>
          )}
          {!user && (
            <Link to="/login" onClick={() => setMenuOpen(false)}>
              Iniciar sesión
            </Link>
          )}
        </div>
      )}

      {mostrarCarrito && (
        <div
          className="carrito-overlay"
          onClick={() => setMostrarCarrito(false)}
        />
      )}
      {mostrarCarrito && (
        <Carrito
          open={mostrarCarrito}
          onClose={() => setMostrarCarrito(false)}
        />
      )}
    </header>
  );
};

export default Header;
