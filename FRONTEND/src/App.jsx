import React from 'react'
import {BrowserRouter, Routes,Route} from 'react-router-dom'
import Login from './pages/Login.jsx'
import Principal from './pages/Principal.jsx'
import FirstRegistro from './pages/FirstRegistro.jsx'
import SecondRegistro from './pages/SecondRegistro.jsx'
import CrudProd from './components/admincomponents/CrudProd.jsx'
import Catalogo from './pages/Catalogo.jsx'
import EditClient from './pages/EditClient.jsx'
import './App.css'

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


        {/* Puedes agregar más rutas aquí */}
      </Routes>
    
    </BrowserRouter>
    
  )
}

export default App