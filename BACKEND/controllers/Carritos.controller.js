import db from "../config/db.js";

export const crearCarrito = async (req, res) => {
  const { id_cliente } = req.body;

  try {
    const [result] = await db.query(
      "INSERT INTO Carritos (id_cliente) VALUES (?)",
      [id_cliente]
    );
    res.status(201).json({ id_carrito: result.insertId, id_cliente });
  } catch (error) {
    console.error("Error al crear el carrito:", error);
    res.status(500).json({ error: "Error al crear el carrito" });
  }
};

export const cambiarEstadoCarrito = async (req, res) => {
  const { id_carrito } = req.params;
  const { estado } = req.body;
  try {
    const [result] = await db.query(
      "UPDATE Carritos SET estado = ? WHERE id_carrito = ?",
      [estado, id_carrito]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }
    res.json({ message: "Estado del carrito actualizado" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al actualizar el estado del carrito" });
  }
};

export const agregarProductoACarrito = async (req, res) => {
  const { id_carrito, id_producto, id_talle, cantidad, subtotal } = req.body;

  try {
    const [result] = await db.query(
      "INSERT INTO Carrito_Detalle (id_carrito, id_producto,id_talle, cantidad,subtotal) VALUES (?, ?, ?, ?, ?)",
      [id_carrito, id_producto, id_talle, cantidad, subtotal]
    );
    res.status(201).json({
      id_carrito_producto: result.insertId,
      id_carrito,
      id_producto,
      cantidad,
    });
  } catch (error) {
    console.error("Error al agregar el producto al carrito:", error);
    res.status(500).json({ error: "Error al agregar el producto al carrito" });
  }
};

export const quitarProductoDelCarrito = async (req, res) => {
  const { id_carrito_detalle } = req.params;

  try {
    const [result] = await db.query(
      "DELETE FROM Carrito_Detalle WHERE id_carrito_detalle = ?",
      [id_carrito_detalle]
    );
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "Producto no encontrado en el carrito" });
    }
    res.json({ message: "Producto eliminado del carrito correctamente" });
  } catch (error) {
    console.error("Error al eliminar el producto del carrito:", error);
    res
      .status(500)
      .json({ error: "Error al eliminar el producto del carrito" });
  }
};

export const verCarrito = async (req, res) => {
  const { id_carrito } = req.params;

  try {
    // Trae info del carrito y cliente
    const [[carrito]] = await db.query(
      `SELECT ca.*, cl.nombre AS cliente_nombre 
             FROM Carritos ca 
             JOIN Clientes cl ON ca.id_cliente = cl.id_cliente 
             WHERE ca.id_carrito = ?`,
      [id_carrito]
    );
    if (!carrito) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    // Trae detalle de productos
    const [detalle] = await db.query(
      `SELECT cd.*, p.nombre_producto, p.imagen_producto, t.nombre_talle, p.precio AS precio_unitario
             FROM Carrito_Detalle cd
             JOIN Productos p ON cd.id_producto = p.id_producto
             JOIN Talles t ON cd.id_talle = t.id_talle
             WHERE cd.id_carrito = ?`,
      [id_carrito]
    );

    // Calcula total
    const total = detalle.reduce((acc, item) => acc + (item.subtotal || 0), 0);

    res.json({
      id_carrito: carrito.id_carrito,
      cliente_nombre: [row.cliente_nombre, row.apellido]
        .filter(Boolean)
        .join(" "),
      fecha_creacion: carrito.fecha_creacion,
      detalle,
      total,
    });
  } catch (error) {
    console.error("Error al obtener el carrito:", error);
    res.status(500).json({ error: "Error al obtener el carrito" });
  }
};

export const vaciarCarrito = async (req, res) => {
  const { id_carrito } = req.params;

  try {
    const [result] = await db.query(
      "DELETE FROM Carrito_Detalle WHERE id_carrito = ?",
      [id_carrito]
    );
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "Carrito no encontrado o ya vacío" });
    }
    res.json({ message: "Carrito vaciado correctamente" });
  } catch (error) {
    console.error("Error al vaciar el carrito:", error);
    res.status(500).json({ error: "Error al vaciar el carrito" });
  }
};

export const confirmarCarrito = async (req, res) => {
  const { id_carrito } = req.params;

  try {
    const [result] = await db.query(
      "UPDATE Carritos SET confirmado = 1 WHERE id_carrito = ?",
      [id_carrito]
    );
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "Carrito no encontrado o ya confirmado" });
    }
    res.json({ message: "Carrito confirmado correctamente" });
  } catch (error) {
    console.error("Error al confirmar el carrito:", error);
    res.status(500).json({ error: "Error al confirmar el carrito" });
  }
};

export const listarCarritos = async (req, res) => {
  try {
    const [rows] = await db.query(`
            SELECT ca.*, cl.nombre AS cliente_nombre
            FROM Carritos ca
            JOIN Clientes cl ON ca.id_cliente = cl.id_cliente
            ORDER BY ca.fecha_creacion DESC
        `);
    res.json(rows);
  } catch (error) {
    console.error("Error al listar los carritos:", error);
    res.status(500).json({ error: "Error al listar los carritos" });
  }
};

export const eliminarCarrito = async (req, res) => {
  const { id_carrito } = req.params;
  try {
    // Elimina los detalles del carrito (si existen)
    await db.query("DELETE FROM Carrito_Detalle WHERE id_carrito = ?", [
      id_carrito,
    ]);
    // Luego elimina el carrito
    const [result] = await db.query(
      "DELETE FROM Carritos WHERE id_carrito = ?",
      [id_carrito]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Carrito no encontrado." });
    }
    res.json({ message: "Carrito eliminado correctamente." });
  } catch (error) {
    console.error("Error al eliminar el carrito:", error);
    res.status(500).json({ error: "Error al eliminar el carrito" });
  }
};

export const getCarritosPedidosFusion = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        ca.id_carrito,
        ca.estado AS estado_carrito,
        ca.fecha_creacion,
        cl.nombre AS cliente_nombre,
        cl.apellido AS cliente_apellido,
        p.id_pedido,
        p.fecha_pedido,
        hv.fecha AS fecha_venta,
        hv.total AS total_venta,
        dp.id_detalle,
        pr.nombre_producto,
        pr.imagen_producto, -- <--- AGREGA ESTA LINEA
        t.nombre_talle,
        dp.cantidad,
        dp.subtotal
      FROM Carritos ca
      JOIN Clientes cl ON ca.id_cliente = cl.id_cliente
      LEFT JOIN Pedidos p ON ca.id_carrito = p.id_carrito
      LEFT JOIN Historial_Ventas hv ON p.id_pedido = hv.id_pedido
      LEFT JOIN Detalle_Pedido dp ON p.id_pedido = dp.id_pedido
      LEFT JOIN Productos pr ON dp.id_producto = pr.id_producto
      LEFT JOIN Talles t ON dp.id_talle = t.id_talle
      ORDER BY ca.fecha_creacion DESC, p.fecha_pedido DESC
    `);

    // Agrupa por carrito
    const carritosMap = {};
    for (const row of rows) {
      if (!carritosMap[row.id_carrito]) {
        carritosMap[row.id_carrito] = {
          id_carrito: row.id_carrito,
          estado: row.estado_carrito,
          fecha_creacion: row.fecha_creacion,
          cliente: [row.cliente_nombre, row.cliente_apellido]
            .filter(Boolean)
            .join(" "),
          id_pedido: row.id_pedido,
          fecha_pedido: row.fecha_pedido,
          fecha_venta: row.fecha_venta,
          total_venta: row.total_venta,
          productos: [],
        };
      }
      // Solo agrega si hay producto (puede haber filas sin producto si LEFT JOIN)
      if (row.id_detalle) {
        carritosMap[row.id_carrito].productos.push({
          id_detalle: row.id_detalle,
          nombre_producto: row.nombre_producto,
          imagen_producto: row.imagen_producto,
          nombre_talle: row.nombre_talle,
          cantidad: row.cantidad,
          subtotal: row.subtotal,
        });
      }
    }

    res.json(Object.values(carritosMap));
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error al obtener carritos y pedidos fusionados" });
  }
};
