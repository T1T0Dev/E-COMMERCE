import db from '../config/db.js';

export const crearEnvio = async (req, res) => {
  const { id_pedido, requiere_envio, direccion_envio } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO Envios (id_pedido, requiere_envio, direccion_envio) VALUES (?, ?, ?)",
      [id_pedido, requiere_envio, direccion_envio]
    );
    res.status(201).json({ id_envio: result.insertId });
  } catch (error) {
    res.status(500).json({ error: "Error al registrar el envío" });
  }
};