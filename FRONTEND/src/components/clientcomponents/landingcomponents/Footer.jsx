import React from 'react'
import '../../Estilos/Footer.css' // Assuming you have a CSS file for styling the footer
const Footer =() => {

    return(
<div>
    <footer>
        <div className="footer-container" id ="footer-container">
            <div className="footer-section">
                <h4>About Us</h4>
                <p>Learn more about our company and mission.</p>
            </div>
            <div className="footer-section">
                <h4>Contact</h4>
                <ul>
                    <li>Email: contact@example.com</li>
                    <li>Phone: +123 456 7890</li>
                </ul>
            </div>
            <div className="footer-section">
                <h4>Follow Us</h4>
                <ul>
                    <li><a href="https://facebook.com">Facebook</a></li>
                    <li><a href="https://twitter.com">Twitter</a></li>
                    <li><a href="https://instagram.com">Instagram</a></li>
                </ul>
            </div>
        </div>
        <div className="footer-bottom">
            <p>&copy; 2025 Drekkz. All rights reserved.</p>
        </div>
    </footer>

</div>


    )
}

export default Footer