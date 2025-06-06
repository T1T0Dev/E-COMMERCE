import React from 'react'
import {BrowserRouter, Routes,Route} from 'react-router-dom'
import Principal from './components/clientcomponents/landingcomponents/Principal.jsx'




const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Principal/>}/>
      </Routes>
    
    </BrowserRouter>
    
  )
}

export default App