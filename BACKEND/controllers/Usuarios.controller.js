import db from '../config/db.js';

export const getUsuarios = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM usuarios');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener los usuarios:', error);
        res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
    }

export const getUsuarioById = async (req, res) => {
    const { id } = req.params; // <-- así coincide con la ruta
    try {
        const [rows] = await db.query('SELECT * FROM usuarios WHERE id_usuario = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        res.status(500).json({ error: 'Error al obtener el usuario' });
    }
}

export const updateUsuario = async (req, res) => {
    const { id } = req.params;
    const { email,contraseña } = req.body;

    try {
        const [result] = await db.query('UPDATE usuarios SET email = ?, contraseña = ? WHERE id_usuario = ?', [email, contraseña, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json({ message: 'Usuario actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        res.status(500).json({ error: 'Error al actualizar el usuario' });
    }
}

export const deleteUsuario = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query('DELETE FROM usuarios WHERE id_usuario = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        res.status(500).json({ error: 'Error al eliminar el usuario' });
    }
}

