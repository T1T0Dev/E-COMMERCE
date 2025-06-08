import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import usuariosRoutes from './routes/usuarios.routes.js';
import clientesRoutes from './routes/clientes.routes.js';
import productosRoutes from './routes/productos.routes.js';
import tallesRoutes from './routes/talles.routes.js';
import categoriasRoutes from './routes/categorias.routes.js';
import carritoRoutes from './routes/carrito.routes.js';
import pedidosRoutes from './routes/pedidos.routes.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/talles', tallesRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/carrito', carritoRoutes);
app.use('/api/pedidos', pedidosRoutes);



// Servir archivos estáticos de la carpeta uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Handler de errores genérico
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal en el servidor.' });
});

export default app;
