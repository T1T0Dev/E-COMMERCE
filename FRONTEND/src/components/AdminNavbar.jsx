import React, { useRef, useEffect, useState } from "react";
import { FaUserShield } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import useAdminNavbarStore from "../store/useAdminNavbarStore";
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
  const { open, toggle, setOpen } = useAdminNavbarStore();
  const [closing, setClosing] = useState(false);
  const location = useLocation();
  const navRef = useRef();

  // Cierra el menú si se hace click fuera, con animación
  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setClosing(true);
        setTimeout(() => {
          setOpen(false);
          setClosing(false);
        }, 280); // Debe coincidir con el tiempo de la transición CSS
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, setOpen]);

  // Si el menú se cierra por otro motivo, resetea closing
  useEffect(() => {
    if (open) setClosing(false);
  }, [open]);

  return (
    <div
      className={`admin-navbar-container${open ? " open" : ""}${closing ? " closing" : ""}`}
      ref={navRef}
    >
      <div
        className="admin-navbar-icon"
        onClick={() => {
          if (open) {
            setClosing(true);
            setTimeout(() => {
              setOpen(false);
              setClosing(false);
            }, 280);
          } else {
            setOpen(true);
          }
        }}
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