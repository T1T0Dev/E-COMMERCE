import db from '../config/db.js';

export const createUsuario = async (req, res) => {
    const { email, contraseña, rol } = req.body;
    if (!email || !contraseña || !rol) {
        return res.status(400).json({ error: "Faltan datos obligatorios" });
    }
    try {
        const [result] = await db.query(
            'INSERT INTO usuarios (email, contraseña, rol) VALUES (?, ?, ?)',
            [email, contraseña, rol]
        );
        res.status(201).json({ id_usuario: result.insertId, email, rol });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ error: "El email ya está registrado" });
        }
        console.error('Error al crear usuario:', error);
        res.status(500).json({ error: 'Error al crear usuario' });
    }
};

export const getUsuarios = async (req, res) => {
    try {
        const [rows] = await db.query(`
      SELECT 
        u.id_usuario,
        u.email,
        u.contraseña,
        u.rol,
        c.nombre,
        c.apellido,
        c.direccion,
        c.telefono,
        c.foto_perfil
      FROM Usuarios u
        LEFT JOIN Clientes c ON u.id_usuario = c.id_usuario
    `);
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
    const { email, contraseña } = req.body;

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

