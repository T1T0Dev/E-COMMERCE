import db from '../config/db.js';

// Interfaz de Clientes

export const registerUsuario = async (req, res) => {
    const { email, password, rol } = req.body;

    try {
        const [result] = await db.query('INSERT INTO usuarios (email,contraseña, rol) VALUES (?, ?, ?, ?)', [email,password, rol]);
        res.status(201).json({ id_usuario: result.insertId,email,rol});
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        res.status(500).json({ error: 'Error al registrar el usuario' });
    }
}

export const loginUsuario = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ? AND contraseña = ?', [email, password]);
        if (rows.length === 0) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }
        const usuario = rows[0];
        res.json({ id_usuario: usuario.id_usuario, nombre: usuario.nombre, rol: usuario.rol });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
}
