import React from "react";
import "./estilosadmin/ModalProd.css"; // Assuming you have a CSS file for styling the modal
const ModalProd = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-content">
                    <button className="modal-close" onClick={onClose} aria-label="Cerrar">
                        &times;
                    </button>
                    <h2 className="modal-title">Nuevo Producto</h2>
                    <form className="modal-form">
                        <div className="modal-form-group">
                            <label className="modal-label">Nombre del producto</label>
                            <input className="modal-input" type="text" name="nombre" required />
                        </div>
                        <div className="modal-form-group">
                            <label className="modal-label">Descripción</label>
                            <textarea className="modal-input" name="descripcion" rows="3" required />
                        </div>
                        <div className="modal-form-group">
                            <label className="modal-label">Precio</label>
                            <input className="modal-input" type="number" name="precio" required min="0" step="0.01" />
                        </div>
                        <div className="modal-form-group">
                            <label className="modal-label">Categoría</label>
                            <select className="modal-input" name="categoria" required defaultValue="">
                                <option value="" disabled hidden>
                                    Seleccionar categoría
                                </option>
                                <option value="Buzo">Buzo</option>
                                <option value="Remera">Remera</option>
                                <option value="Campera">Campera</option>
                                <option value="Zapatillas">Zapatillas</option>
                                <option value="Pantalones">Pantalones</option>
                                <option value="Medias">Medias</option>
                                <option value="Sweater">Sweater</option>
                            </select>
                        </div>
                        <div className="modal-form-group">
                            <label className="modal-label">Imagen</label>
                            <input className="modal-input" type="file" name="imagen" accept="image/*" required />
                        </div>
                        <button className="modal-submit" type="submit">
                            Guardar
                        </button>
                    </form>
                </div>
            </div>
        </div> 
    );
};

export default ModalProd;
