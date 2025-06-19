import React, { useState, useRef, useEffect } from "react";
import { FaUserShield } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import "./styles/AdminNavbar.css";

const adminLinks = [
  { to: "/admin/usuarios", label: "Usuarios", emoji: "👤" },
  { to: "/admin/crud-clientes", label: "Clientes", emoji: "👥" },
  { to: "/admin/productos", label: "Productos", emoji: "📦" },
  { to: "/admin/categorias", label: "Categorías", emoji: "📂" },
  { to: "/admin/talles", label: "Talles", emoji: "📏" },
  { to: "/admin/carritos", label: "Carritos", emoji: "🛒" },
  { to: "/admin/ventas", label: "Ventas", emoji: "💰" },
];

const AdminNavbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navRef = useRef();

  // Cierra el menú si se hace click fuera
  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div
      className={`admin-navbar-container${open ? " open" : ""}`}
      ref={navRef}
    >
      <div
        className="admin-navbar-icon"
        onClick={() => setOpen((prev) => !prev)}
        tabIndex={0}
        style={{ cursor: "pointer" }}
        aria-label="Abrir menú de administración"
      >
        <FaUserShield size={32} />
      </div>
      <nav className={`admin-navbar-menu${open ? " show" : ""}`}>
        {adminLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`admin-navbar-link${
              location.pathname === link.to ? " active" : ""
            }`}
            onClick={() => setOpen(false)}
          >
            <span className="admin-navbar-emoji">{link.emoji}</span>
            <span className="admin-navbar-label">{link.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default AdminNavbar;