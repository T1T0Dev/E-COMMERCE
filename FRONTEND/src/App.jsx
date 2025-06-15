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
import ClienteCrud from './components/admincomponents/ClienteCrud.jsx'
import ProtectedRoute from "./components/ProtectedRoute.jsx"; 


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<FirstRegistro />} />
        <Route path="/second-registro" element={<SecondRegistro />} />

        {/* Rutas protegidas */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Principal />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/productos"
          element={
            <ProtectedRoute>
              <CrudProd />
            </ProtectedRoute>
          }
        />
        <Route
          path="/catalogo"
          element={
            <ProtectedRoute>
              <Catalogo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <EditClient />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/categorias"
          element={
            <ProtectedRoute>
              <CategoriasAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/talles"
          element={
            <ProtectedRoute>
              <TallesAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/usuarios"
          element={
            <ProtectedRoute>
              <UsersCrud />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/carritos"
          element={
            <ProtectedRoute>
              <CarritosAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/ventas"
          element={
            <ProtectedRoute>
              <VentasCrud />
            </ProtectedRoute>
          }
        />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  )
}

export default App;