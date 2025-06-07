import Productos from "../clientcomponents/landingcomponents/Productos";
import './estilosadmin/CrudProd.css'; // Assuming you have a CSS file for styling the product cards
import { FaTrash } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { AiOutlinePlusCircle } from "react-icons/ai";
import React, { useState } from "react";
import ModalProd from "./ModalProd";
const CrudProd = () => {

    const [isModelOpen, setIsModelOpen] = useState(false);


    return (
        <div className="crudprod-container-father">
            <div className="crudprod-add-btn-wrapper flex justify-center mb-6">
                <button onClick={() => setIsModelOpen(true)} className="crudprod-add-btn bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition">
                    Agregar Producto 
                    <AiOutlinePlusCircle size={45}/>
                </button>
                <ModalProd isOpen={isModelOpen} onClose={() => setIsModelOpen(false)} />
            </div>
            <div className="crudprod-flex-row flex flex-row flex-wrap gap-[20px] justify-center">
                {Productos.map((producto, idx) => (
                    <div
                        key={idx}
                        className="crudprod-card bg-white rounded-xl shadow-md flex flex-col overflow-hidden h-[480px] mx-auto"
                    >
                        <div className="crudprod-img-wrapper w-full h-64 overflow-hidden flex items-center justify-center">
                            <img
                                src={producto.imagen}
                                alt={producto.nombre}
                                className="crudprod-img w-full h-64 object-cover"
                                style={{
                                    maxWidth: "100%",
                                    maxHeight: "16rem",
                                    minHeight: "16rem",
                                    objectFit: "cover",
                                }}
                            />
                        </div>
                        <div className="crudprod-info p-4 flex flex-col justify-between flex-grow">
                            <div>
                                <h3 className="crudprod-title text-lg font-semibold">
                                    {producto.nombre}
                                </h3>
                                <h2 className="crudprod-price text-xl font-bold text-gray-800 mt-2">
                                    {producto.precio}
                                </h2>
                                <p className="crudprod-desc text-gray-500 text-sm mt-1">
                                    {producto.descripcion}
                                </p>
                                <div className="crudprod-btns flex gap-2 mt-2">
                                    <button className="crudprod-edit-btn bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition">
                                        Editar <br />
                                        <FaEdit />
                                    </button>
                                    
                                    <button className="crudprod-delete-btn bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition">
                                        Eliminar <br />
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CrudProd;