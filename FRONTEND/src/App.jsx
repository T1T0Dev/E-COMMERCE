import React from 'react'
import {BrowserRouter, Routes,Route} from 'react-router-dom'
import Login from './pages/Login.jsx'
import Principal from './pages/Principal.jsx'
import FirstRegistro from './pages/FirstRegistro.jsx'
import SecondRegistro from './pages/SecondRegistro.jsx'
import CrudProd from './components/admincomponents/CrudProd.jsx'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Principal />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<FirstRegistro />} />
        <Route path="/second-registro" element={<SecondRegistro />} />
 <Route path="/admin/productos" element={<CrudProd />} />
        {/* Puedes agregar más rutas aquí */}
      </Routes>
    
    </BrowserRouter>
    
  )
}

export default App