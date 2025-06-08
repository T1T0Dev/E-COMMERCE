import db from '../config/db.js';

export const crearCarrito = async (req, res) => {
    const { id_cliente } = req.body;

    try {
        const [result] = await db.query('INSERT INTO Carritos (id_cliente) VALUES (?)', [id_cliente]);
        res.status(201).json({ id_carrito: result.insertId, id_cliente });
    } catch (error) {
        console.error('Error al crear el carrito:', error);
        res.status(500).json({ error: 'Error al crear el carrito' });
    }
}

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
    res.status(500).json({ error: "Error al actualizar el estado del carrito" });
  }
};

export const agregarProductoACarrito = async (req, res) => {
    const { id_carrito, id_producto,id_talle, cantidad,subtotal } = req.body;

    try {
        const [result] = await db.query('INSERT INTO Carrito_Detalle (id_carrito, id_producto,id_talle, cantidad,subtotal) VALUES (?, ?, ?, ?, ?)', [id_carrito, id_producto,id_talle, cantidad,subtotal]);
        res.status(201).json({ id_carrito_producto: result.insertId, id_carrito, id_producto, cantidad });
    } catch (error) {
        console.error('Error al agregar el producto al carrito:', error);
        res.status(500).json({ error: 'Error al agregar el producto al carrito' });
    }
}

export const quitarProductoDelCarrito = async (req, res) => {
    const { id_carrito_detalle} = req.params;

    try {
        const [result] = await db.query('DELETE FROM Carrito_Detalle WHERE id_carrito_detalle = ?', [id_carrito_detalle]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
        }
        res.json({ message: 'Producto eliminado del carrito correctamente' });
    } catch (error) {
        console.error('Error al eliminar el producto del carrito:', error);
        res.status(500).json({ error: 'Error al eliminar el producto del carrito' });
    }
}


export const verCarrito = async (req, res) => {
    const { id_carrito } = req.params;

    try {
        const [rows] = await db.query('SELECT * FROM Carrito_Detalle WHERE id_carrito = ?', [id_carrito]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Carrito vacío o no encontrado' });
        }
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).json({ error: 'Error al obtener el carrito' });
    }
    
}

export const vaciarCarrito = async (req, res) => {
    const { id_carrito } = req.params;

    try {
        const [result] = await db.query('DELETE FROM Carrito_Detalle WHERE id_carrito = ?', [id_carrito]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Carrito no encontrado o ya vacío' });
        }
        res.json({ message: 'Carrito vaciado correctamente' });
    } catch (error) {
        console.error('Error al vaciar el carrito:', error);
        res.status(500).json({ error: 'Error al vaciar el carrito' });
    }
}

export const confirmarCarrito = async (req, res) => {
    const { id_carrito } = req.params;

    try {
        const [result] = await db.query('UPDATE Carritos SET confirmado = 1 WHERE id_carrito = ?', [id_carrito]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Carrito no encontrado o ya confirmado' });
        }
        res.json({ message: 'Carrito confirmado correctamente' });
    } catch (error) {
        console.error('Error al confirmar el carrito:', error);
        res.status(500).json({ error: 'Error al confirmar el carrito' });
    }
}
