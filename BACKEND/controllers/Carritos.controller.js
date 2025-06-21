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
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Cambia el estado y, si es entregado, actualiza fecha_entrega
    let updateQuery, updateParams;
    if (estado === "entregado") {
      updateQuery =
        "UPDATE Carritos SET estado = ?, fecha_entrega = NOW() WHERE id_carrito = ?";
      updateParams = [estado, id_carrito];
    } else {
      updateQuery = "UPDATE Carritos SET estado = ? WHERE id_carrito = ?";
      updateParams = [estado, id_carrito];
    }

    const [result] = await connection.query(updateQuery, updateParams);
    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    // Si el nuevo estado es "entregado", llama al procedimiento
    if (estado === "entregado") {
      // Obtén la fecha_entrega real del carrito recién actualizado
      const [[carrito]] = await connection.query(
        "SELECT fecha_entrega FROM Carritos WHERE id_carrito = ?",
        [id_carrito]
      );
      const fechaEntrega = carrito.fecha_entrega.toISOString().slice(0, 10);
      await connection.query("CALL generar_venta_diaria(?)", [fechaEntrega]);
    }

    await connection.commit();
    res.json({ message: "Estado actualizado correctamente" });
  } catch (error) {
    await connection.rollback();
    console.error("Error al cambiar estado del carrito:", error);
    res.status(500).json({ error: "Error al cambiar estado del carrito" });
  } finally {
    connection.release();
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
  SELECT * FROM vista_carritos_pedidos_fusion
    `);

    // Agrupa por carrito
    const carritosMap = {};
    for (const row of rows) {
      if (!carritosMap[row.id_carrito]) {
        carritosMap[row.id_carrito] = {
          id_carrito: row.id_carrito,
          estado: row.estado_carrito,
          direccion_envio: row.direccion_envio,
          requiere_envio: row.requiere_envio,
          fecha_creacion: row.fecha_creacion,
          cliente: [row.cliente_nombre, row.cliente_apellido]
            .filter(Boolean)
            .join(" "),
          telefono: row.telefono,
          id_pedido: row.id_pedido,
          fecha_pedido: row.fecha_pedido,
          productos: [],
        };
      }
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
