import db from '../config/db.js';

export const getCategorias = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM categorias');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener las categorías:', error);
        res.status(500).json({ error: 'Error al obtener las categorías' });
    }
}

export const createCategoria = async (req, res) => {
    const { nombre } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO categorias (nombre_categoria) VALUES (?)',
            [nombre]
        );
        res.status(201).json({ id_categoria: result.insertId, nombre });
    } catch (error) {
        console.error('Error al crear la categoría:', error);
        res.status(500).json({ error: 'Error al crear la categoría' });
    }
}


export const updateCategoria = async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;

    try {
        const [result] = await db.query('UPDATE categorias SET nombre = ?, descripcion = ? WHERE id_categoria = ?', [nombre, descripcion, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }
        res.json({ message: 'Categoría actualizada correctamente' });
    } catch (error) {
        console.error('Error al actualizar la categoría:', error);
        res.status(500).json({ error: 'Error al actualizar la categoría' });
    }
}

export const deleteCategoria = async (req, res) => {
    const { id } = req.params;

    try {
        // Poner en NULL la categoría de todos los productos que la usen
        await db.query(
            `UPDATE productos SET id_categoria = NULL WHERE id_categoria = ?`,
            [id]
        );

        // Ahora sí puedes eliminar la categoría
        const [result] = await db.query('DELETE FROM categorias WHERE id_categoria = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }
        res.json({ message: 'Categoría eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar la categoría:', error);
        res.status(500).json({ error: 'Error al eliminar la categoría' });
    }
}