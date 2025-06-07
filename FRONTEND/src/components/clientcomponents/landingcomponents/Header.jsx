import React, { useState } from 'react';
import '../landingcomponents/estiloslanding/Header.css';
import { FaShoppingCart } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Header = () => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    return (
        <header>
            <nav>
                <ul>
                    <li className="logo">
                        <a href="#home">
                            <img src="src/Resources/logo.jpg" alt="Logo" style={{ width: '50px', height: '50px' }} />   
                        </a>
                    </li>
                    <li><a href="#home">Home</a></li>
                    <li><a href="#footer-container">About</a></li>
                    <li><a href="#services">Services</a></li>
                    <li><a href="#contact-section">Contact</a></li>
                    <li className='cart-section'>
                        <strong onClick={toggleDropdown}>
                            <FaShoppingCart />
                        </strong>
                        {isDropdownOpen && (
                            <div className="dropdown-menu">
                                <Link to="#cart-section">Carrito</Link>
                                <Link to="#edit-profile">Editar Perfil</Link>
                            </div>
                        )}
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;