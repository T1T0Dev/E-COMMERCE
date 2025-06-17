import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./estiloscliente/PasswordInput.css";

const PasswordInput = ({
  value,
  onChange,
  name = "password",
  id = "password",
  placeholder = "Contraseña",
  required = false,
  error = "",
  ...props
}) => {
  const [show, setShow] = useState(false);

  return (
    <>
      <div className="password-input-wrapper">
        <input
          className="password-input"
          type={show ? "text" : "password"}
          id={id}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete="current-password"
          {...props}
        />
        <button
          type="button"
          className="password-eye-btn"
          onClick={() => setShow((v) => !v)}
          tabIndex={-1}
          aria-label={show ? "Ocultar contraseña" : "Ver contraseña"}
        >
          {show ? <FaEye /> : <FaEyeSlash />}
        </button>
      </div>
      {error && <span className="password-error">{error}</span>}
    </>
  );
};

export default PasswordInput;