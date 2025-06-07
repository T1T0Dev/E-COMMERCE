import React from 'react'
import {BrowserRouter, Routes,Route} from 'react-router-dom'
import Login from './pages/Login.jsx'
import Principal from './pages/Principal.jsx'
import FirstRegistro from './pages/FirstRegistro.jsx'
import SecondRegistro from './pages/SecondRegistro.jsx'


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Principal />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<FirstRegistro />} />
        <Route path="/second-registro" element={<SecondRegistro />} />

        {/* Puedes agregar más rutas aquí */}
      </Routes>
    
    </BrowserRouter>
    
  )
}

export default App