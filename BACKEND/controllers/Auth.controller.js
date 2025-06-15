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

export const registerClienteYUsuario = async (req, res) => {
  const { email, contraseña, rol, nombre, apellido, direccion, telefono } =
    req.body;
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // 1. Crear usuario
    const [usuarioResult] = await conn.query(
      "INSERT INTO usuarios (email, contraseña, rol) VALUES (?, ?, ?)",
      [email, contraseña, rol]
    );
    const id_usuario = usuarioResult.insertId;

    // 2. Crear cliente con id_usuario
    const [clienteResult] = await conn.query(
      "INSERT INTO clientes (nombre, apellido, direccion, telefono, id_usuario) VALUES (?, ?, ?, ?, ?)",
      [nombre, apellido, direccion, telefono, id_usuario]
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
      telefono,
    });
  } catch (error) {
    await conn.rollback();
    console.error("Error al registrar cliente y usuario:", error);
    res.status(500).json({ error: "Error al registrar cliente y usuario" });
  } finally {
    conn.release();
  }
};
