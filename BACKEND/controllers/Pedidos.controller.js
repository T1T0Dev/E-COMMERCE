import db from "../config/db.js";

export const crearPedido = async (req, res) => {
  const { id_cliente, id_carrito, items } = req.body;
  if (
    !id_cliente ||
    !id_carrito ||
    !items ||
    !Array.isArray(items) ||
    items.length === 0
  ) {
    return res
      .status(400)
      .json({ error: "Datos incompletos para crear el pedido." });
  }
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    // 1. Crear el pedido
    const [pedidoResult] = await conn.query(
      "INSERT INTO Pedidos (id_cliente, id_carrito) VALUES (?, ?)",
      [id_cliente, id_carrito]
    );
    const id_pedido = pedidoResult.insertId;
    // 2. Insertar los detalles del pedido
    for (const item of items) {
      await conn.query(
        "INSERT INTO Detalle_Pedido (id_pedido, id_producto, id_talle, cantidad, subtotal) VALUES (?, ?, ?, ?, ?)",
        [
          id_pedido,
          item.id_producto,
          item.id_talle,
          item.cantidad,
          item.subtotal,
        ]
      );
    }
    // 3. Cambiar estado del carrito a 'enviado'
    await conn.query(
      "UPDATE Carritos SET estado = 'enviado' WHERE id_carrito = ?",
      [id_carrito]
    );
    await conn.commit();
    res.status(201).json({ message: "Pedido creado con éxito", id_pedido });
  } catch (error) {
    await conn.rollback();
    res
      .status(500)
      .json({ error: "Error al crear el pedido", detalle: error.message });
  } finally {
    conn.release();
  }
};

export const getPedidosCliente = async (req, res) => {
  const { id_cliente } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT * FROM pedidos WHERE id_cliente = ?",
      [id_cliente]
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: "No se encontraron pedidos para este cliente" });
    }
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener los pedidos del cliente:", error);
    res.status(500).json({ error: "Error al obtener los pedidos del cliente" });
  }
};

export const getPedidoById = async (req, res) => {
  const { id_pedido } = req.params;

  try {
    const [rows] = await db.query("SELECT * FROM pedidos WHERE id_pedido = ?", [
      id_pedido,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Pedido no encontrado" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error("Error al obtener el pedido:", error);
    res.status(500).json({ error: "Error al obtener el pedido" });
  }
};

export const cambiarEstadoPedido = async (req, res) => {
  const { id_pedido } = req.params;
  const { estado } = req.body;
  try {
    const [result] = await db.query(
      "UPDATE Pedidos SET estado = ? WHERE id_pedido = ?",
      [estado, id_pedido]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Pedido no encontrado" });
    }
    res.json({ message: "Estado del pedido actualizado" });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el estado del pedido" });
  }
};


export const getPedidosJoin = async (req, res) => {
  console.log("Entrando a getPedidosJoin"); // <-- agrega esto
  try {
    const [rows] = await db.query(`
      SELECT 
        p.id_pedido,
        p.id_cliente,
        c.nombre AS nombre_cliente,
        c.apellido AS apellido_cliente,
        p.fecha_pedido,
        p.estado AS estado_pedido,
        p.id_carrito,
        car.estado AS estado_carrito,
        car.fecha_creacion AS fecha_carrito,
        dp.id_detalle,
        pr.nombre_producto,
        t.nombre_talle,
        dp.cantidad,
        dp.subtotal
      FROM Pedidos p
      JOIN Clientes c    ON p.id_cliente   = c.id_cliente
      LEFT JOIN Carritos car ON p.id_carrito  = car.id_carrito
      LEFT JOIN Detalle_Pedido dp ON p.id_pedido = dp.id_pedido
      LEFT JOIN Productos pr     ON dp.id_producto = pr.id_producto
      LEFT JOIN Talles t         ON dp.id_talle    = t.id_talle
      ORDER BY p.id_pedido DESC
    `);

    // Agrupa los detalles por pedido
    const pedidosMap = {};
    for (const row of rows) {
      if (!pedidosMap[row.id_pedido]) {
        pedidosMap[row.id_pedido] = {
          id_pedido: row.id_pedido,
          id_cliente: row.id_cliente,
          nombre_cliente: row.nombre_cliente,
          apellido_cliente: row.apellido_cliente,
          fecha_pedido: row.fecha_pedido,
          estado: row.estado_pedido,
          id_carrito: row.id_carrito,
          estado_carrito: row.estado_carrito,
          fecha_carrito: row.fecha_carrito,
          detalles: [],
        };
      }
      if (row.id_detalle) {
        pedidosMap[row.id_pedido].detalles.push({
          id_detalle: row.id_detalle,
          nombre_producto: row.nombre_producto,
          nombre_talle: row.nombre_talle,
          cantidad: row.cantidad,
          subtotal: row.subtotal,
        });
      }
    }
    res.json(Object.values(pedidosMap));
  } catch (error) {
    console.error("Error en getPedidosJoin:", error);
    res.status(500).json({ error: "Error al obtener los pedidos con JOIN" });
  }
};