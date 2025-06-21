import React, { useEffect, useState } from "react";
import axios from "axios";
import useAuthStore from "../store/useAuthStore";
import "./styles/EditClient.css";
import defaultProfile from "../assets/default-profile.jpg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PasswordInput from "../components/PasswordInput";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const requisitos = [
  {
    label: "8 caracteres",
    test: (pw) => pw.length >= 8,
    key: "caracteres",
  },
  {
    label: "Una letra mayúscula",
    test: (pw) => /[A-Z]/.test(pw),
    key: "mayuscula",
  },
  {
    label: "Una letra minúscula",
    test: (pw) => /[a-z]/.test(pw),
    key: "minuscula",
  },
  {
    label: "Un número",
    test: (pw) => /\d/.test(pw),
    key: "numero",
  },
];

// Normaliza el teléfono (elimina todo menos números)
const normalizePhone = (phone) => phone.replace(/\D/g, "");

// Validación de teléfono: de 8 a 15 dígitos
const validarTelefono = (telefono) => {
  return /^\d{8,15}$/.test(normalizePhone(telefono));
};

const EditClient = () => {
  const user = useAuthStore((state) => state.user);
  const [cliente, setCliente] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    direccion: "",
    telefono: "",
    email: "",
    contraseña: "",
  });
  const [errores, setErrores] = useState({});
  const [foto, setFoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    // Obtener cliente por id_usuario (mejor desde el backend)
    axios
      .get(`http://localhost:3000/api/clientes/usuario/${user.id_usuario}`)
      .then((res) => {
        setCliente(res.data);
        if (res.data) {
          setForm((f) => ({
            ...f,
            nombre: res.data.nombre || "",
            apellido: res.data.apellido || "",
            direccion: res.data.direccion || "",
            telefono: res.data.telefono || "",
          }));
        }
      })
      .catch(() => setCliente(null));

    // Obtener usuario
    axios
      .get(`http://localhost:3000/api/usuarios/${user.id_usuario}`)
      .then((res) => {
        setUsuario(res.data);
        setForm((f) => ({
          ...f,
          email: res.data.email || "",
          contraseña: "",
        }));
      })
      .catch(() => setUsuario(null));
  }, [user]);

  useEffect(() => {
    if (!foto) {
      setPreview(null);
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(foto);
  }, [foto]);

  const handleChange = (e) => {
    let value = e.target.value;
    if (e.target.name === "telefono") {
      // Permite que el usuario escriba con espacios, pero normaliza para validar y guardar
      value = value.replace(/[^\d\s]/g, ""); // Solo números y espacios
    }
    setForm({ ...form, [e.target.name]: value });
    setErrores({ ...errores, [e.target.name]: "" });
  };

  const handleFotoChange = (e) => {
    setFoto(e.target.files[0]);
  };

  // VALIDACIONES
  const validarCliente = () => {
    const newErrors = {};
    if (!form.nombre.trim()) newErrors.nombre = "El nombre es obligatorio";
    if (!form.apellido.trim()) newErrors.apellido = "El apellido es obligatorio";
    if (!form.direccion.trim()) newErrors.direccion = "La dirección es obligatoria";
    if (!form.telefono.trim()) {
      newErrors.telefono = "El teléfono es obligatorio";
    } else if (!validarTelefono(form.telefono)) {
      newErrors.telefono = "El teléfono no es válido";
    }
    setErrores(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validarUsuario = () => {
    const newErrors = {};
    if (!form.email) {
      newErrors.email = "El email es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "El email no es válido";
    }
    if (form.contraseña) {
      const requisitosCumplidos = requisitos.every((r) => r.test(form.contraseña));
      if (!requisitosCumplidos) {
        newErrors.contraseña = "La contraseña no cumple con los requisitos";
      }
    }
    setErrores(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveCliente = async (e) => {
    e.preventDefault();
    if (!cliente) return;
    if (!validarCliente()) return;
    try {
      await axios.put(
        `http://localhost:3000/api/clientes/${cliente.id_cliente}`,
        {
          nombre: form.nombre,
          apellido: form.apellido,
          direccion: form.direccion,
          telefono: form.telefono,
        }
      );
      toast.success("Datos personales actualizados");
    } catch (error) {
      toast.error("Error al actualizar datos personales");
    }
  };

  const handleSaveUsuario = async (e) => {
    e.preventDefault();
    if (!usuario) return;
    if (!validarUsuario()) return;
    try {
      await axios.put(
        `http://localhost:3000/api/usuarios/${usuario.id_usuario}`,
        {
          email: form.email,
          contraseña: form.contraseña,
        }
      );
      toast.success("Usuario actualizado correctamente");
    } catch (error) {
      toast.error("Error al actualizar usuario");
    }
  };

  const handleUploadFoto = async (e) => {
    e.preventDefault();
    if (!foto || !cliente) return;
    const data = new FormData();
    data.append("foto", foto);
    await axios.post(
      `http://localhost:3000/api/clientes/${cliente.id_cliente}/foto`,
      data,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    toast.success("Foto de perfil actualizada");
    window.location.reload();
  };

  // Para mostrar requisitos visuales de contraseña
  const password = form.contraseña || "";

  if (!usuario) return <div>Cargando...</div>;
  if (!cliente)
    return (
      <div>
        No se encontró información de cliente para este usuario.
        <br />
        Si eres cliente y ves este mensaje, contacta al administrador.
      </div>
    );

  return (
    <div className="editcliente-main">
      <div className="editcliente-panel-izq">
        <div className="editcliente-foto-wrapper">
          <img
            src={
              preview
                ? preview
                : cliente.foto_perfil
                ? `http://localhost:3000/${cliente.foto_perfil}`
                : defaultProfile
            }
            alt="Foto de perfil"
            className="editcliente-foto"
          />
        </div>
        <form onSubmit={handleUploadFoto} className="editcliente-foto-form">
          <label htmlFor="foto" className="editcliente-foto-label">
            Seleccionar foto
          </label>
          <input
            id="foto"
            type="file"
            accept="image/*"
            onChange={handleFotoChange}
            className="editcliente-foto-input"
          />
          <button type="submit" className="editcliente-foto-btn">
            Cambiar foto
          </button>
        </form>
        <button
          className="editcliente-volver-btn"
          onClick={() => navigate(-1)}
        >
          <AiOutlineArrowLeft style={{ marginRight: 8, fontSize: 22 }} />
          Volver
        </button>
      </div>
      <div className="editcliente-panel-der">
        <form className="editcliente-form" onSubmit={handleSaveCliente}>
          <h2>Datos personales</h2>
          <label>Nombre</label>
          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Nombre"
          />
          {errores.nombre && (
            <span className="editcliente-error">{errores.nombre}</span>
          )}
          <label>Apellido</label>
          <input
            name="apellido"
            value={form.apellido}
            onChange={handleChange}
            placeholder="Apellido"
          />
          {errores.apellido && (
            <span className="editcliente-error">{errores.apellido}</span>
          )}
          <label>Dirección</label>
          <input
            name="direccion"
            value={form.direccion}
            onChange={handleChange}
            placeholder="Dirección"
          />
          {errores.direccion && (
            <span className="editcliente-error">{errores.direccion}</span>
          )}
          <label>Teléfono</label>
          <input
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            placeholder="Teléfono"
          />
          {errores.telefono && (
            <span className="editcliente-error">{errores.telefono}</span>
          )}
          <button type="submit" className="editcliente-btn">
            Guardar cambios
          </button>
        </form>
        <form className="editcliente-form" onSubmit={handleSaveUsuario}>
          <h2>Datos de usuario</h2>
          <label>Email</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
          />
          {errores.email && (
            <span className="editcliente-error">{errores.email}</span>
          )}
          <label>Contraseña</label>
          <PasswordInput
            name="contraseña"
            value={form.contraseña}
            onChange={handleChange}
            placeholder="Nueva contraseña"
            className="editcliente-input"
            error={errores.contraseña}
          />
          {/* Requisitos visuales */}
          {form.contraseña && (
            <ul>
              {requisitos.map((r) => {
                const ok = r.test(password);
                return (
                  <li key={r.key} style={{ color: ok ? "green" : "red" }}>
                    {ok ? "✔️" : "❌"} {r.label}
                  </li>
                );
              })}
            </ul>
          )}
          {errores.contraseña && (
            <span className="editcliente-error">{errores.contraseña}</span>
          )}
          <button type="submit" className="editcliente-btn">
            Guardar cambios
          </button>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default EditClient;