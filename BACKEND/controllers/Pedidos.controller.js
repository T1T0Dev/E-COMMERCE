import db from "../config/db.js";

export const crearPedido = async (req, res) => {
  const { id_cliente, items } = req.body;
  // items: [{ id_producto, id_talle, cantidad, subtotal }]

  if (!id_cliente || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Datos incompletos para crear el pedido." });
  }

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // 1. Crear el pedido
    const [pedidoResult] = await conn.query(
      "INSERT INTO Pedidos (id_cliente) VALUES (?)",
      [id_cliente]
    );
    const id_pedido = pedidoResult.insertId;

    // 2. Insertar los detalles del pedido
    for (const item of items) {
      await conn.query(
        "INSERT INTO Detalle_Pedido (id_pedido, id_producto, id_talle, cantidad, subtotal) VALUES (?, ?, ?, ?, ?)",
        [id_pedido, item.id_producto, item.id_talle, item.cantidad, item.subtotal]
      );
    }

    await conn.commit();
    res.status(201).json({ message: "Pedido creado con éxito", id_pedido });
  } catch (error) {
    await conn.rollback();
    res.status(500).json({ error: "Error al crear el pedido", detalle: error.message });
  } finally {
    conn.release();
  }
};