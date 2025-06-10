import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Principal from './pages/Principal.jsx'
import FirstRegistro from './pages/FirstRegistro.jsx'
import SecondRegistro from './pages/SecondRegistro.jsx'
import CrudProd from './components/admincomponents/CrudProd.jsx'
import Catalogo from './pages/Catalogo.jsx'
import CategoriasAdmin from "./components/admincomponents/CategoriasAdmin";
import EditClient from './pages/EditClient.jsx'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './App.css'
import TallesAdmin from "./components/admincomponents/TallesAdmin";

import UsersCrud from './components/admincomponents/UsersCrud.jsx'
import CarritosAdmin from './components/admincomponents/CarritosAdmin.jsx'
import VentasCrud from './components/admincomponents/VentasCrud.jsx'
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Principal />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<FirstRegistro />} />
        <Route path="/second-registro" element={<SecondRegistro />} />
        <Route path="/admin/productos" element={<CrudProd />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/perfil" element={<EditClient />} />
        <Route path="/admin/categorias" element={<CategoriasAdmin />} />
        <Route path="/admin/talles" element={<TallesAdmin />} />
      
        <Route path="/admin/usuarios" element={<UsersCrud />} />
        <Route path="/admin/carritos" element={<CarritosAdmin />} />
        <Route path="/admin/ventas" element={<VentasCrud/>} />
        {/* Puedes agregar más rutas aquí */}
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  )
}

export default App; 