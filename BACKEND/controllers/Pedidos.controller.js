import db from "../config/db.js";

// --- Crear Pedido (sin cambios) ---
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

// --- Pedidos por cliente (sin cambios) ---
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

// --- Pedido por ID (sin cambios) ---
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

// --- Cambiar estado de pedido (sin cambios) ---
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

// --- Pedidos con JOIN (sin cambios) ---
export const getPedidosJoin = async (req, res) => {
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

// --- Pedidos para ventas (sin cambios) ---
export const getPedidosVentas = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.id_pedido,
        CONCAT(c.nombre, ' ', c.apellido) AS cliente_nombre,
        p.fecha_pedido,
        p.estado,
        dp.id_detalle,
        pr.nombre_producto,
        t.nombre_talle,
        dp.cantidad,
        dp.subtotal
      FROM Pedidos p
      JOIN Clientes c ON p.id_cliente = c.id_cliente
      LEFT JOIN Detalle_Pedido dp ON p.id_pedido = dp.id_pedido
      LEFT JOIN Productos pr ON dp.id_producto = pr.id_producto
      LEFT JOIN Talles t ON dp.id_talle = t.id_talle
      ORDER BY p.fecha_pedido DESC
    `);

    // Agrupa los detalles por pedido
    const pedidosMap = {};
    for (const row of rows) {
      if (!pedidosMap[row.id_pedido]) {
        pedidosMap[row.id_pedido] = {
          id_pedido: row.id_pedido,
          cliente_nombre: row.cliente_nombre,
          fecha_pedido: row.fecha_pedido,
          estado: row.estado,
          total: 0,
          detalle: [],
        };
      }
      if (row.id_detalle) {
        pedidosMap[row.id_pedido].detalle.push({
          nombre_producto: row.nombre_producto,
          nombre_talle: row.nombre_talle,
          cantidad: row.cantidad,
          subtotal: row.subtotal,
        });
        pedidosMap[row.id_pedido].total += Number(row.subtotal || 0);
      }
    }
    res.json(Object.values(pedidosMap));
  } catch (error) {
    console.error("Error en getPedidosVentas:", error);
    res.status(500).json({ error: "Error al obtener los pedidos para ventas" });
  }
};

// --- Ventas agrupadas por día ---
export const getVentasPorDia = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        DATE(hv.fecha) AS fecha,
        COUNT(hv.id_venta) AS cantidad_pedidos,
        SUM(hv.total) AS total_vendido,
        (
          SELECT pr.nombre_producto
          FROM Detalle_Pedido dp
          JOIN Productos pr ON dp.id_producto = pr.id_producto
          JOIN Pedidos p2 ON dp.id_pedido = p2.id_pedido
          JOIN Historial_Ventas hv2 ON hv2.id_pedido = p2.id_pedido
          WHERE DATE(hv2.fecha) = DATE(hv.fecha)
          GROUP BY pr.nombre_producto
          ORDER BY SUM(dp.cantidad) DESC
          LIMIT 1
        ) AS producto_mas_vendido
      FROM Historial_Ventas hv
      GROUP BY DATE(hv.fecha)
      ORDER BY fecha DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error("Error en getVentasPorDia:", error);
    res.status(500).json({ error: "Error al obtener ventas por día" });
  }
};

// --- Detalle de ventas de un día ---
export const getDetalleVentasPorDia = async (req, res) => {
  const { fecha } = req.params;
  try {
    const [rows] = await db.query(`
      SELECT 
        p.id_pedido,
        CONCAT(cl.nombre, ' ', cl.apellido) AS cliente_nombre,
        pr.nombre_producto,
        t.nombre_talle,
        dp.cantidad,
        dp.subtotal
      FROM Historial_Ventas hv
      JOIN Pedidos p ON hv.id_pedido = p.id_pedido
      JOIN Clientes cl ON p.id_cliente = cl.id_cliente
      JOIN Detalle_Pedido dp ON p.id_pedido = dp.id_pedido
      JOIN Productos pr ON dp.id_producto = pr.id_producto
      JOIN Talles t ON dp.id_talle = t.id_talle
      WHERE DATE(hv.fecha) = ?
      ORDER BY p.id_pedido
    `, [fecha]);
    res.json(rows);
  } catch (error) {
    console.error("Error en getDetalleVentasPorDia:", error);
    res.status(500).json({ error: "Error al obtener detalle de ventas" });
  }
};

const verDetalle = (fecha) => {
  console.log("Consultando detalles para:", fecha);
  fetch(`/api/pedidos/ventas-por-dia/${fecha}`)
    .then(res => {
      console.log("Respuesta fetch detalles:", res);
      if (!res.ok) throw new Error("No hay datos para ese día");
      return res.json();
    })
    .then(data => {
      setDetalleDia(data);
      setModalFecha(fecha);
    })
    .catch(err => {
      setDetalleDia([]);
      setModalFecha(fecha);
      alert("No hay ventas para ese día.");
    });
};