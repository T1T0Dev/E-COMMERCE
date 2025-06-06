import React from 'react'
import '../../Estilos/Header.css'
import { FaShoppingCart } from 'react-icons/fa';
const Header = () => {
return (
    <header>
        <nav>
            <ul>
                <li className="logo">
                    <a href="#home">
                        <img src="src\Resources\logo.jpg" alt="Logo" style={{ width: '50px', height: '50px' }} />   
                    </a>
                </li>
                <li><a href="#home">Home</a></li>
                <li><a href="#footer-container">About</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#contact-section">Contact</a></li>
                <li className='cart-section'><strong>Cart</strong><a href="#cart-section"><FaShoppingCart /></a></li>
            </ul>
        </nav>
    </header>
)
}

export default Header