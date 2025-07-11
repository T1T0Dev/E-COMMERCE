import db from "../config/db.js";

// Interfaz de Clientes





export const registerUsuario = async (req, res) => {

  const { email, contraseña, rol } = req.body;

  try {
    const [result] = await db.query(
      "INSERT INTO usuarios (email, contraseña, rol) VALUES (?, ?, ?)",
      [email, contraseña, rol]
    );
    res.status(201).json({ id_usuario: result.insertId, email, rol });
  } catch (error) {
    console.error("Error al registrar el usuario:", error);
    res.status(500).json({ error: "Error al registrar el usuario" });
  }
};

export const loginUsuario = async (req, res) => {

  const { email, contraseña } = req.body;

  if (!email || !contraseña) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }
  if (contraseña.length < 6) {
    return res
      .status(400)
      .json({ error: "La contraseña debe tener al menos 6 caracteres" });
  }

  

  try {
    const [rows] = await db.query(
      `
            SELECT u.id_usuario, u.email, u.rol, c.id_cliente, c.nombre, c.apellido, c.direccion
            FROM Usuarios u
            LEFT JOIN Clientes c ON u.id_usuario = c.id_usuario
            WHERE u.email = ? AND u.contraseña = ?
        `,
      [email, contraseña]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
};


// Función para normalizar el teléfono (elimina todo menos números)
const normalizePhone = (phone) => {
  if (!phone) return "";
  let num = phone.replace(/\D/g, "");
  // Elimina prefijo internacional +54 o 54
  if (num.startsWith("54")) num = num.slice(2);
  // Elimina prefijo 0
  if (num.startsWith("0")) num = num.slice(1);
  // Elimina prefijo 15 después del código de área (opcional, avanzado)
  // Si tiene 11 dígitos y un 15 después del código de área, lo elimina
  if (num.length === 11 && num[3] === "1" && num[4] === "5") {
    num = num.slice(0, 3) + num.slice(5);
  }
  // Si tiene 10 dígitos, lo acepta
  if (num.length === 10) return num;
  // Si tiene más de 10, recorta
  if (num.length > 10) return num.slice(0, 10);
  return "";
};

export const registerClienteYUsuario = async (req, res) => {
  const { email, contraseña, rol, nombre, apellido, direccion, telefono } = req.body;
  const telefonoNormalizado = normalizePhone(telefono);
  const conn = await db.getConnection();
  try {
    // Validar email único
    const [usuarios] = await conn.query("SELECT id_usuario FROM usuarios WHERE email = ?", [email]);
    if (usuarios.length > 0) {
      return res.status(409).json({ error: "Esta cuenta de correo ya está asociada a una cuenta." });
    }
    // Validar teléfono único (normalizado)
    const [clientes] = await conn.query("SELECT id_cliente FROM clientes WHERE telefono = ?", [telefonoNormalizado]);
    if (clientes.length > 0) {
      return res.status(409).json({ error: `Este número de teléfono ya está vinculado a una cuenta.` });
    }

    await conn.beginTransaction();

    // 1. Crear usuario
    const [usuarioResult] = await conn.query(
      "INSERT INTO usuarios (email, contraseña, rol) VALUES (?, ?, ?)",
      [email, contraseña, rol]
    );
    const id_usuario = usuarioResult.insertId;

    // 2. Crear cliente con id_usuario y teléfono normalizado
    const [clienteResult] = await conn.query(
      "INSERT INTO clientes (nombre, apellido, direccion, telefono, id_usuario) VALUES (?, ?, ?, ?, ?)",
      [nombre, apellido, direccion, telefonoNormalizado, id_usuario]
    );

    await conn.commit();
    res.status(201).json({
      id_usuario,
      id_cliente: clienteResult.insertId,
      email,
      rol,
      nombre,
      apellido,
      direccion,
      telefono: telefonoNormalizado,
    });
  } catch (error) {
    await conn.rollback();
    // Manejo de errores de clave única
    if (error.code === "ER_DUP_ENTRY") {
      if (error.message.includes("usuarios.email")) {
        return res.status(409).json({ error: "Esta cuenta de correo ya está asociada a una cuenta." });
      }
      if (error.message.includes("clientes.telefono")) {
        return res.status(409).json({ error: "Este número de teléfono ya está vinculado a una cuenta." });
      }
    }
    console.error("Error al registrar cliente y usuario:", error);
    res.status(500).json({ error: "Error al registrar cliente y usuario" });
  } finally {
    conn.release();
  }
};

export const telefonoExiste = async (req, res) => {
  const { telefono } = req.params;
  const telefonoNormalizado = normalizePhone(telefono);
  try {
    const [rows] = await db.query("SELECT id_cliente FROM clientes WHERE telefono = ?", [telefonoNormalizado]);
    res.json({ exists: rows.length > 0 });
  } catch (error) {
    res.status(500).json({ error: "Error al validar teléfono" });
  }
};


export const emailExiste = async (req, res) => {
  const { email } = req.params;
  try {
    const [rows] = await db.query("SELECT id_usuario FROM usuarios WHERE email = ?", [email]);
    res.json({ exists: rows.length > 0 });
  } catch (error) {
    res.status(500).json({ error: "Error al validar email" });
  }
};

