
import db from '../config/db.js';

export const getProductos = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                p.id_producto,
                p.nombre_producto,
                p.precio,
                p.imagen_producto,
                c.nombre_categoria,
                c.descripcion
            FROM Productos p
            JOIN Categorias c ON p.id_categoria = c.id_categoria
        `);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'No se encontraron productos.' });
        }
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos.', detalle: error.message });
    }
};
        
export const getProductosConTalles = async (req, res) => {
    try {
      const [rows] = await db.query(`
        SELECT 
          p.id_producto,
          p.nombre_producto,
          p.precio,
          p.imagen_producto,
          c.nombre_categoria,
          t.id_talle,
          t.nombre_talle,
          pt.stock
        FROM Productos p
        JOIN Categorias c ON p.id_categoria = c.id_categoria
        LEFT JOIN Producto_Talle pt ON p.id_producto = pt.id_producto
        LEFT JOIN Talles t ON pt.id_talle = t.id_talle
      `);
  
      // Agrupar por producto
      const productos = {};
  
      for (const row of rows) {
        if (!productos[row.id_producto]) {
          productos[row.id_producto] = {
            id_producto: row.id_producto,
            nombre_producto: row.nombre_producto,
            precio: row.precio,
            imagen_producto: row.imagen_producto,
            nombre_categoria: row.nombre_categoria,
            talles: []
          };
        }
  
        if (row.id_talle) {
          productos[row.id_producto].talles.push({
            id_talle: row.id_talle,
            nombre_talle: row.nombre_talle,
            stock: row.stock
          });
        }
      }
  
      res.json(Object.values(productos));
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener productos.', detalle: error.message });
    }
  };
  


export const createProductoConTalles = async (req, res) => {
    const {
      nombre_producto,
      precio,
      id_categoria,
      imagen_producto,
    } = req.body;
  
    const conn = await db.getConnection(); // si usás pool
    try {
      await conn.beginTransaction();
  
      // 1. Insertar el producto
      const [productoResult] = await conn.query(
        'INSERT INTO Productos (nombre_producto, precio, id_categoria, imagen_producto) VALUES (?, ?, ?, ?, ?)',
        [nombre_producto,precio, id_categoria, imagen_producto]
      );
  
      const id_producto = productoResult.insertId;
  
      // 2. Insertar talles y stock
      for (const item of talles) {
        await conn.query(
          'INSERT INTO Producto_Talle (id_producto, id_talle, stock) VALUES (?, ?, ?)',
          [id_producto, item.id_talle, item.stock]
        );
      }
  
      await conn.commit();
      res.status(201).json({ message: 'Producto y talles creados con éxito.' });
  
    } catch (error) {
      await conn.rollback();
      res.status(500).json({ error: 'Error al crear el producto con talles.', detalle: error.message });
    } finally {
      conn.release();
    }
  };

export const deleteProducto = async (req, res) => {
    const { id_producto } = req.params;

    try {
        // Eliminar talles asociados al producto
        await db.query('DELETE FROM Producto_Talle WHERE id_producto = ?', [id_producto]);

        // Eliminar el producto
        const [result] = await db.query('DELETE FROM Productos WHERE id_producto = ?', [id_producto]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Producto no encontrado.' });
        }

        res.json({ message: 'Producto eliminado con éxito.' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto.', detalle: error.message });
    }
}
export const updateProductoConTalles = async (req, res) => {
    const { id_producto } = req.params;
    const {
        nombre_producto,
        precio,
        id_categoria,
        imagen_producto,
        talles // array de objetos: [{id_talle, stock}, ...]
    } = req.body;

    const conn = await db.getConnection(); // si usás pool
    try {
        await conn.beginTransaction();

        // 1. Actualizar el producto
        await conn.query(
            'UPDATE Productos SET nombre_producto = ?, precio = ?, id_categoria = ?, imagen_producto = ? WHERE id_producto = ?',
            [nombre_producto, precio, id_categoria, imagen_producto, id_producto]
        );

        // 2. Eliminar talles existentes para este producto
        await conn.query('DELETE FROM Producto_Talle WHERE id_producto = ?', [id_producto]);

        // 3. Insertar nuevos talles y stock
        for (const item of talles) {
            await conn.query(
                'INSERT INTO Producto_Talle (id_producto, id_talle, stock) VALUES (?, ?, ?)',
                [id_producto, item.id_talle, item.stock]
            );
        }

        await conn.commit();
        res.json({ message: 'Producto y talles actualizados con éxito.' });

    } catch (error) {
        await conn.rollback();
        res.status(500).json({ error: 'Error al actualizar el producto con talles.', detalle: error.message });
    } finally {
        conn.release();
    }
  
}

export const getProductoById = async (req, res) => {
    const { id_producto } = req.params;

    try {
        const [rows] = await db.query(`
            SELECT 
                p.id_producto,
                p.nombre_producto,
                p.precio,
                p.imagen_producto,
                c.nombre_categoria,
                t.id_talle,
                t.nombre_talle,
                pt.stock
            FROM Productos p
            JOIN Categorias c ON p.id_categoria = c.id_categoria
            LEFT JOIN Producto_Talle pt ON p.id_producto = pt.id_producto
            LEFT JOIN Talles t ON pt.id_talle = t.id_talle
            WHERE p.id_producto = ?
        `, [id_producto]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado.' });
        }

        // Agrupar talles
        const producto = {
            id_producto: rows[0].id_producto,
            nombre_producto: rows[0].nombre_producto,
            precio: rows[0].precio,
            imagen_producto: rows[0].imagen_producto,
            nombre_categoria: rows[0].nombre_categoria,
            talles: []
        };

        for (const row of rows) {
            if (row.id_talle) {
                producto.talles.push({
                    id_talle: row.id_talle,
                    nombre_talle: row.nombre_talle,
                    stock: row.stock
                });
            }
        }

        res.json(producto);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto.', detalle: error.message });
    }
}


export const getProductosPorCategoria = async (req, res) => {
    const { id_categoria } = req.params;

    try {
        const [rows] = await db.query(`
            SELECT 
                p.id_producto,
                p.nombre_producto,
                p.precio,
                p.imagen_producto,
                c.nombre_categoria,
                c.descripcion
                t.id_talle,
                t.nombre_talle,
                pt.stock
            FROM Productos p
            JOIN Categorias c ON p.id_categoria = c.id_categoria
            LEFT JOIN Producto_Talle pt ON p.id_producto = pt.id_producto
            LEFT JOIN Talles t ON pt.id_talle = t.id_talle
            WHERE p.id_categoria = ?
        `, [id_categoria]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'No se encontraron productos para esta categoría.' });
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
                    talles: []
                };
            }

            if (row.id_talle) {
                productos[row.id_producto].talles.push({
                    id_talle: row.id_talle,
                    nombre_talle: row.nombre_talle,
                    stock: row.stock
                });
            }
        }

        res.json(Object.values(productos));
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos por categoría.', detalle: error.message });
    }
}

export const buscarProductoPorNombre = async (req, res) => {
    const { nombre } = req.query;

    if (!nombre) {
        return res.status(400).json({ error: 'El parámetro "nombre" es requerido.' });
    }

    try {
        const [rows] = await db.query(`
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
            WHERE p.nombre_producto LIKE ?
        `, [`%${nombre}%`]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'No se encontraron productos con ese nombre.' });
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
                    talles: []
                };
            }

            if (row.id_talle) {
                productos[row.id_producto].talles.push({
                    id_talle: row.id_talle,
                    nombre_talle: row.nombre_talle,
                    stock: row.stock
                });
            }
        }

        res.json(Object.values(productos));
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar el producto.', detalle: error.message });
    }

}