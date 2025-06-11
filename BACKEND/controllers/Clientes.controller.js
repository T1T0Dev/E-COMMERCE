import db from '../config/db.js';

//Interfaz de Clientes

export const getClientes = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                id_cliente,
                nombre,
                apellido,
                telefono,
                direccion
            FROM clientes
        `);
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener los clientes:', error);
        res.status(500).json({ error: 'Error al obtener los clientes' });
    }
}

export const getClienteById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM clientes WHERE id_cliente = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener el cliente:', error);
        res.status(500).json({ error: 'Error al obtener el cliente' });
    }
}

export const getClienteByUsuarioId = async (req, res) => {
    const { id_usuario } = req.params;
    console.log("Buscando cliente con id_usuario:", id_usuario);
    try {
        const [rows] = await db.query('SELECT * FROM clientes WHERE id_usuario = ?', [Number(id_usuario)]);
        console.log("Resultado de la consulta:", rows);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener el cliente por id_usuario:', error);
        res.status(500).json({ error: 'Error al obtener el cliente' });
    }
};

export const updateCliente = async (req, res) => {
    const { id } = req.params;
    const { nombre,apellido,direccion, telefono } = req.body;

    try {
        const [result] = await db.query('UPDATE clientes SET nombre = ?, apellido = ?, direccion = ?, telefono = ? WHERE id_cliente = ?', [nombre,apellido,direccion, telefono, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }
        res.json({ message: 'Cliente actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar el cliente:', error);
        res.status(500).json({ error: 'Error al actualizar el cliente' });
    }
}

export const deleteCliente = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query('DELETE FROM clientes WHERE id_cliente = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }
        res.json({ message: 'Cliente eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar el cliente:', error);
        res.status(500).json({ error: 'Error al eliminar el cliente' });
    }
}

export const createCliente = async (req, res) => {
    const { nombre, apellido, direccion, telefono, id_usuario } = req.body; // agrega id_usuario

    try {
        const [result] = await db.query(
            'INSERT INTO clientes (nombre, apellido, direccion, telefono, id_usuario) VALUES (?, ?, ?, ?, ?)',
            [nombre, apellido, direccion, telefono, id_usuario] // agrega id_usuario
        );
        res.status(201).json({ id_cliente: result.insertId, nombre, apellido, direccion, telefono, id_usuario });
    } catch (error) {
        console.error('Error al crear el cliente:', error);
        res.status(500).json({ error: 'Error al crear el cliente' });
    }
}


export const uploadFotoPerfil = async (req, res) => {
    const { id } = req.params;
    const fotoPerfil = req.file;

    if (!fotoPerfil) {
        return res.status(400).json({ error: 'No se ha subido ninguna foto' });
    }

    // Normaliza la ruta para que siempre sea con /
    const relativePath = fotoPerfil.path.replace(/\\/g, '/');

    try {
        const [result] = await db.query(
            'UPDATE clientes SET foto_perfil = ? WHERE id_cliente = ?',
            [relativePath, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }
        res.json({ message: 'Foto de perfil actualizada correctamente', foto_perfil: relativePath });
    } catch (error) {
        console.error('Error al actualizar la foto de perfil:', error);
        res.status(500).json({ error: 'Error al actualizar la foto de perfil' });
    }
}


