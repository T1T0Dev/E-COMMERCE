import db from "../config/db.js";

export const getProductos = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        p.id_producto,
        p.nombre_producto,
        p.descripcion,
        p.precio,
        p.imagen_producto,
        p.id_categoria,
        c.nombre_categoria
      FROM Productos p
      LEFT JOIN Categorias c ON p.id_categoria = c.id_categoria
    `);

    const productos = rows.map((row) => ({
      id_producto: row.id_producto,
      nombre_producto: row.nombre_producto,
      descripcion: row.descripcion,
      precio: row.precio,
      imagen_producto: row.imagen_producto,
      id_categoria: row.id_categoria,
      nombre_categoria: row.nombre_categoria,
    }));

    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener productos" });
  }
};

export const getStockProductoTalle = async (req, res) => {
  const { id_producto, id_talle } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT stock FROM Producto_Talle WHERE id_producto = ? AND id_talle = ?",
      [id_producto, id_talle]
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: "No existe ese producto con ese talle." });
    }
    res.json({ stock: rows[0].stock });
  } catch (error) {
    res.status(500).json({ error: "Error al consultar el stock." });
  }
};

export const getProductosConTalles = async (req, res) => {
  try {
    // Lee el parámetro de query
    const { activo } = req.query;
    let where = "";
    let params = [];

    if (activo === "1" || activo === "0") {
      where = "WHERE p.activo = ?";
      params.push(Number(activo));
    }

    const [rows] = await db.query(
      `
      SELECT 
        p.id_producto,
        p.nombre_producto,
        p.descripcion,          
        p.precio,
        p.imagen_producto,
        p.id_categoria,           
        c.nombre_categoria,
        t.id_talle,
        t.nombre_talle,
        pt.stock,
        p.activo
      FROM Productos p
      LEFT JOIN Categorias c ON p.id_categoria = c.id_categoria
      LEFT JOIN Producto_Talle pt ON p.id_producto = pt.id_producto
      LEFT JOIN Talles t ON pt.id_talle = t.id_talle
      ${where}
    `,
      params
    );

    // Agrupar por producto
    const productos = {};

    for (const row of rows) {
      if (!productos[row.id_producto]) {
        productos[row.id_producto] = {
          id_producto: row.id_producto,
          nombre_producto: row.nombre_producto,
          descripcion: row.descripcion,
          precio: row.precio,
          imagen_producto: row.imagen_producto,
          id_categoria: row.id_categoria,
          nombre_categoria: row.nombre_categoria,
          talles: [],
        };
      }
      if (row.id_talle) {
        productos[row.id_producto].talles.push({
          id_talle: row.id_talle,
          nombre_talle: row.nombre_talle,
          stock: row.stock,
        });
      }
    }

    res.json(Object.values(productos));
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al obtener productos.", detalle: error.message });
  }
};

export const createProductoConTalles = async (req, res) => {
  let conn;
  try {
    conn = await db.getConnection();
    await conn.beginTransaction();

    const { nombre_producto, precio, descripcion, id_categoria } = req.body;
    const imagen_producto = `/uploads/${req.file.filename}`;
    const talles = JSON.parse(req.body.talles || "[]");

    // Insertar el producto
    const [productoResult] = await conn.query(
      "INSERT INTO Productos (nombre_producto, precio, descripcion, imagen_producto, id_categoria) VALUES (?, ?, ?, ?, ?)",
      [nombre_producto, precio, descripcion, imagen_producto, id_categoria]
    );
    const id_producto = productoResult.insertId;

    // Insertar talles
    for (const { id_talle, stock } of talles) {
      await conn.query(
        "INSERT INTO Producto_Talle (id_producto, id_talle, stock) VALUES (?, ?, ?)",
        [id_producto, id_talle, stock]
      );
    }

    await conn.commit();
    res.status(201).json({ message: "Producto creado correctamente" });
  } catch (error) {
    if (conn) await conn.rollback();
    console.error("ERROR AL CREAR PRODUCTO:", error);
    res
      .status(500)
      .json({ error: "Error al crear el producto", detalle: error.message });
  } finally {
    if (conn) conn.release();
  }
};

export const deleteProducto = async (req, res) => {
  try {
    const { id_producto } = req.params;
    // Baja lógica: marcar como inactivo
    const [result] = await db.query(
      "UPDATE Productos SET activo = 0 WHERE id_producto = ?",
      [id_producto]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json({ message: "Producto dado de baja (inactivo)" });
  } catch (error) {
    console.error("Error al dar de baja el producto:", error);
    res.status(500).json({ error: "Error al dar de baja el producto" });
  }
};

export const activarProducto = async (req, res) => {
  try {
    const { id_producto } = req.params;
    const [result] = await db.query(
      "UPDATE Productos SET activo = 1 WHERE id_producto = ?",
      [id_producto]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json({ message: "Producto dado de alta correctamente" });
  } catch (error) {
    console.error("Error al dar de alta el producto:", error);
    res.status(500).json({ error: "Error al dar de alta el producto" });
  }
};

export const updateProductoConTalles = async (req, res) => {
  let conn;
  try {
    conn = await db.getConnection();
    await conn.beginTransaction();

    const { id_producto } = req.params;
    const { nombre_producto, precio, descripcion, id_categoria } = req.body;
    let imagen_producto = req.file
      ? `/uploads/${req.file.filename}`
      : req.body.imagen_producto;
    const talles = JSON.parse(req.body.talles || "[]");

    // Actualizar producto
    let query =
      "UPDATE Productos SET nombre_producto=?, precio=?, descripcion=?, id_categoria=?";
    let params = [nombre_producto, precio, descripcion, id_categoria];

    if (req.file) {
      query += ", imagen_producto=?";
      params.push(imagen_producto);
    }
    query += " WHERE id_producto=?";
    params.push(id_producto);

    const [result] = await conn.query(query, params);

    if (result.affectedRows === 0) {
      await conn.rollback();
      return res.status(404).json({ error: "Producto no encontrado." });
    }

    // Actualizar talles: primero borra los actuales, luego inserta los nuevos
    await conn.query("DELETE FROM Producto_Talle WHERE id_producto = ?", [
      id_producto,
    ]);
    for (const { id_talle, stock } of talles) {
      await conn.query(
        "INSERT INTO Producto_Talle (id_producto, id_talle, stock) VALUES (?, ?, ?)",
        [id_producto, id_talle, stock]
      );
    }

    await conn.commit();
    res.json({ message: "Producto actualizado correctamente." });
  } catch (error) {
    await conn.rollback();
    res.status(500).json({
      error: "Error al actualizar el producto con talles.",
      detalle: error.message,
    });
  } finally {
    if (conn) conn.release();
  }
};

export const getProductoById = async (req, res) => {
  const { id_producto } = req.params;

  try {
    const [rows] = await db.query(
      `
            SELECT 
                p.id_producto,
                p.nombre_producto,
                p.precio,
                p.imagen_producto,
                p.id_categoria,
                c.nombre_categoria,
                t.id_talle,
                t.nombre_talle,
                pt.stock
            FROM Productos p
            LEFT JOIN Categorias c ON p.id_categoria = c.id_categoria
            LEFT JOIN Producto_Talle pt ON p.id_producto = pt.id_producto
            LEFT JOIN Talles t ON pt.id_talle = t.id_talle
            WHERE p.id_producto = ?
        `,
      [id_producto]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado." });
    }

    // Agrupar talles
    const producto = {
      id_producto: rows[0].id_producto,
      nombre_producto: rows[0].nombre_producto,
      descripcion: rows[0].descripcion,
      precio: rows[0].precio,
      imagen_producto: rows[0].imagen_producto,
      nombre_categoria: rows[0].nombre_categoria,
      talles: [],
    };

    for (const row of rows) {
      if (row.id_talle) {
        producto.talles.push({
          id_talle: row.id_talle,
          nombre_talle: row.nombre_talle,
          stock: row.stock,
        });
      }
    }

    res.json(producto);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al obtener el producto.", detalle: error.message });
  }
};

export const getProductosPorCategoria = async (req, res) => {
  const { id_categoria } = req.params;

  try {
    const [rows] = await db.query(
      `
            SELECT 
                p.id_producto,
                p.nombre_producto,
                p.precio,
                p.imagen_producto,
                c.nombre_categoria,
                c.descripcion,
                t.id_talle,
                t.nombre_talle,
                pt.stock
            FROM Productos p
            JOIN Categorias c ON p.id_categoria = c.id_categoria
            LEFT JOIN Producto_Talle pt ON p.id_producto = pt.id_producto
            LEFT JOIN Talles t ON pt.id_talle = t.id_talle
            WHERE p.id_categoria = ?
        `,
      [id_categoria]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: "No se encontraron productos para esta categoría." });
    }

    // Agrupar productos por id
    const productos = {};

    for (const row of rows) {
      if (!productos[row.id_producto]) {
        productos[row.id_producto] = {
          id_producto: row.id_producto,
          nombre_producto: row.nombre_producto,
          precio: row.precio,
          imagen_producto: row.imagen_producto,
          nombre_categoria: row.nombre_categoria,
          talles: [],
        };
      }

      if (row.id_talle) {
        productos[row.id_producto].talles.push({
          id_talle: row.id_talle,
          nombre_talle: row.nombre_talle,
          stock: row.stock,
        });
      }
    }

    res.json(Object.values(productos));
  } catch (error) {
    res.status(500).json({
      error: "Error al obtener productos por categoría.",
      detalle: error.message,
    });
  }
};

export const buscarProductoPorNombre = async (req, res) => {
  const { nombre } = req.query;

  if (!nombre) {
    return res
      .status(400)
      .json({ error: 'El parámetro "nombre" es requerido.' });
  }

  try {
    const [rows] = await db.query(
      `
            SELECT 
                p.id_producto,
                p.nombre_producto,
                p.precio,
                p.imagen_producto,
                c.nombre_categoria,
                c.descripcion,
                t.id_talle,
                t.nombre_talle,
                pt.stock
            FROM Productos p
            LEFT JOIN Categorias c ON p.id_categoria = c.id_categoria
            LEFT JOIN Producto_Talle pt ON p.id_producto = pt.id_producto
            LEFT JOIN Talles t ON pt.id_talle = t.id_talle
            WHERE p.nombre_producto LIKE ?
        `,
      [`%${nombre}%`]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: "No se encontraron productos con ese nombre." });
    }

    // Agrupar productos por id
    const productos = {};

    for (const row of rows) {
      if (!productos[row.id_producto]) {
        productos[row.id_producto] = {
          id_producto: row.id_producto,
          nombre_producto: row.nombre_producto,
          precio: row.precio,
          imagen_producto: row.imagen_producto,
          nombre_categoria: row.nombre_categoria,
          talles: [],
        };
      }

      if (row.id_talle) {
        productos[row.id_producto].talles.push({
          id_talle: row.id_talle,
          nombre_talle: row.nombre_talle,
          stock: row.stock,
        });
      }
    }

    res.json(Object.values(productos));
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al buscar el producto.", detalle: error.message });
  }
};