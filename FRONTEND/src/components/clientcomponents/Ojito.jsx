import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./estiloscliente/Ojito.css"

const Ojito = ({ visible, onClick, ariaLabel }) => (
  <button
    type="button"
    className="password-eye-btn"
    onClick={onClick}
    tabIndex={-1}
    aria-label={ariaLabel}
  >
    {visible ? <FaEye/> : <FaEyeSlash />}
  </button>
);

export default Ojito;