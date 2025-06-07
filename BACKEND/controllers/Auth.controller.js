import db from '../config/db.js';

// Interfaz de Clientes

export const registerUsuario = async (req, res) => {
    const { email, password, rol } = req.body;

    try {
        const [result] = await db.query('INSERT INTO usuarios (email, contraseña, rol) VALUES (?, ?, ?)', [email, password, rol]);
        res.status(201).json({ id_usuario: result.insertId, email, rol });
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
export const registerClienteYUsuario = async (req, res) => {
    const { email, password, rol, nombre, apellido, direccion, telefono } = req.body;
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        // 1. Crear usuario
        const [usuarioResult] = await conn.query(
            'INSERT INTO usuarios (email, contraseña, rol) VALUES (?, ?, ?)',
            [email, password, rol]
        );
        const id_usuario = usuarioResult.insertId;

        // 2. Crear cliente con id_usuario
        const [clienteResult] = await conn.query(
            'INSERT INTO clientes (nombre, apellido, direccion, telefono, id_usuario) VALUES (?, ?, ?, ?, ?)',
            [nombre, apellido, direccion, telefono, id_usuario]
        );

        await conn.commit();
        res.status(201).json({
            id_usuario,
            id_cliente: clienteResult.insertId,
            email,
            rol,
            nombre,
            apellido,
            direccion,
            telefono
        });
    } catch (error) {
        await conn.rollback();
        console.error('Error al registrar cliente y usuario:', error);
        res.status(500).json({ error: 'Error al registrar cliente y usuario' });
    } finally {
        conn.release();
    }
};