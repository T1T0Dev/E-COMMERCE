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

// --- Pedidos con JOIN (sin cambios) ---
export const getPedidosJoin = async (req, res) => {
  try {
    const [rows] = await db.query(`
     SELECT * vista_pedidos_join 
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
    vd.fecha,
    vd.total AS total_vendido,
    (
    SELECT COUNT(*) 
    FROM Pedidos p 
    JOIN Carritos c ON p.id_carrito = c.id_carrito 
    WHERE DATE(c.fecha_entrega) = vd.fecha
    ) AS cantidad_pedidos,
    (
    SELECT pr.nombre_producto
    FROM Detalle_Venta_Diaria dvd
    JOIN Productos pr ON dvd.id_producto = pr.id_producto
    WHERE dvd.id_venta_diaria = vd.id_venta_diaria
    GROUP BY pr.nombre_producto
    ORDER BY SUM(dvd.cantidad) DESC
    LIMIT 1
    ) AS producto_mas_vendido
    FROM Ventas_Diarias vd
    ORDER BY vd.fecha DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener ventas por día" });
  }
};

// --- Detalle de ventas de un día ---
export const getDetalleVentasPorDia = async (req, res) => {
  const { fecha } = req.params;
  try {
    const [rows] = await db.query(`
      SELECT 
        pr.nombre_producto,
        t.nombre_talle,
        dvd.cantidad,
        dvd.subtotal
      FROM Ventas_Diarias vd
      JOIN Detalle_Venta_Diaria dvd ON vd.id_venta_diaria = dvd.id_venta_diaria
      JOIN Productos pr ON dvd.id_producto = pr.id_producto
      JOIN Talles t ON dvd.id_talle = t.id_talle
      WHERE vd.fecha = ?
      ORDER BY pr.nombre_producto, t.nombre_talle
    `, [fecha]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener detalle de ventas" });
  }
};


