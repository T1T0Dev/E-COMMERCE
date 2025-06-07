import React from "react";
import { useState,useEffect } from "react";



export default function Login() {

    const [usuario,setUsuario] = useState([])
    const [loading,setLoading] = useState(true)
    

 





  return (
    <div>
        <h1>Login</h1>
        <form>
            <div>
            <label htmlFor="username">Email</label>
            <input type="text" id="username" name="username" required />
            </div>
            <div>
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" required />
            </div>
            <button type="submit">Login</button>
        </form>
      
    </div>
  )
}
