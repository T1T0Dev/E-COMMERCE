import db from '../config/db.js';

export const getTalles = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM talles');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener los talles:', error);
        res.status(500).json({ error: 'Error al obtener los talles' });
    }
}

export const createTalle = async (req, res) => {
    const { nombre } = req.body;
    try {
        // Validar si ya existe un talle con ese nombre (case-insensitive)
        const [existe] = await db.query(
            'SELECT id_talle FROM talles WHERE LOWER(nombre_talle) = LOWER(?)',
            [nombre]
        );
        if (existe.length > 0) {
            return res.status(409).json({ error: 'El talle ya existe.' });
        }
        const [result] = await db.query(
            'INSERT INTO talles (nombre_talle) VALUES (?)',
            [nombre]
        );
        res.status(201).json({ id_talle: result.insertId, nombre });
    } catch (error) {
        console.error('Error al crear el talle:', error);
        res.status(500).json({ error: 'Error al crear el talle' });
    }
};

export const updateTalle = async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;

    try {
        const [result] = await db.query('UPDATE talles SET nombre = ?, descripcion = ? WHERE id_talle = ?', [nombre, descripcion, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Talle no encontrado' });
        }
        res.json({ message: 'Talle actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar el talle:', error);
        res.status(500).json({ error: 'Error al actualizar el talle' });
    }
}


export const deleteTalle = async (req, res) => {
    const { id } = req.params;

    try {
        // Verificar si el talle está asociado a algún producto
        const [productos] = await db.query(
            `SELECT p.nombre_producto 
             FROM producto_talle pt 
             JOIN productos p ON pt.id_producto = p.id_producto 
             WHERE pt.id_talle = ?`,
            [id]
        );
        if (productos.length > 0) {
            return res.status(400).json({
                error: "No puedes eliminar el talle porque está asociado a productos.",
                productos: productos.map(p => p.nombre_producto)
            });
        }

        const [result] = await db.query('DELETE FROM talles WHERE id_talle = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Talle no encontrado' });
        }
        res.json({ message: 'Talle eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar el talle:', error);
        res.status(500).json({ error: 'Error al eliminar el talle' });
    }
}