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



export const getPedidosCliente = async (req, res) => {
    const { id_cliente } = req.params;

    try {
        const [rows] = await db.query('SELECT * FROM pedidos WHERE id_cliente = ?', [id_cliente]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'No se encontraron pedidos para este cliente' });
        }
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener los pedidos del cliente:', error);
        res.status(500).json({ error: 'Error al obtener los pedidos del cliente' });
    }
}

export const getPedidoById = async (req, res) => {
    const { id_pedido } = req.params;

    try {
        const [rows] = await db.query('SELECT * FROM pedidos WHERE id_pedido = ?', [id_pedido]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener el pedido:', error);
        res.status(500).json({ error: 'Error al obtener el pedido' });
    }
}

export const cambiarEstadoPedido = async (req, res) => {
    const { id_pedido } = req.params;
    const { estado } = req.body;

    if (!estado) {
        return res.status(400).json({ error: 'Estado del pedido es requerido' });
    }

    try {
        const [result] = await db.query('UPDATE pedidos SET estado = ? WHERE id_pedido = ?', [estado, id_pedido]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }
        res.json({ message: 'Estado del pedido actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar el estado del pedido:', error);
        res.status(500).json({ error: 'Error al actualizar el estado del pedido' });
    }
}


export const getPedidosAdmin = async (req, res) => {

    try {
        const [rows] = await db.query('SELECT * FROM pedidos');
        if (rows.length === 0) {
            return res.status(404).json({ error: 'No se encontraron pedidos' });
        }
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener los pedidos:', error);
        res.status(500).json({ error: 'Error al obtener los pedidos' });
    }

}