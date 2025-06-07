import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaShoppingCart, FaUserShield } from 'react-icons/fa';
import useAuthStore from '../../../store/useAuthStore';
import '../landingcomponents/estiloslanding/Header.css';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false);
    setAdminMenuOpen(false);
  };

  return (
    <header>
      <nav>
        <ul>
          {/* Si es cliente */}
          {user && user.rol === 'cliente' && (
            <>
              <li><Link to="/catalogo">Catálogo</Link></li>
              <li><button onClick={handleLogout}>Cerrar sesión</button></li>
              <li>
                <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
                  <FaBars />
                </button>
                {menuOpen && (
                  <div className="dropdown-menu">
                    <Link to="/perfil">Editar Perfil</Link>
                    <div className="cart-section">
                      <FaShoppingCart /> Carrito
                    </div>
                  </div>
                )}
              </li>
            </>
          )}

          {/* Si es admin */}
          {user && user.rol === 'admin' && (
            <>
              <li>
                <button className="admin-btn" onClick={() => setAdminMenuOpen(!adminMenuOpen)}>
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
              <li><button onClick={handleLogout}>Cerrar sesión</button></li>
            </>
          )}

          {/* Si no está logueado */}
          {!user && (
            <li><Link to="/login">Iniciar sesión</Link></li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;