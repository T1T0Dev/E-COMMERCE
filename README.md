# DREKKZ INDUMENTARIA — Proyecto Full Stack

Bienvenido al repositorio privado de DREKKZ INDUMENTARIA. Este proyecto es una solución completa para la gestión de un e-commerce de indumentaria, desarrollado con **React + Vite** en el frontend y **Node.js + Express + MySQL** en el backend.

---

## 🚀 Instalación y Puesta en Marcha

### 1. Clona el repositorio

```bash
git clone https://github.com/tuusuario/drekkz-private.git
cd drekkz-private

2. Configura la base de datos

Crea una base de datos MySQL llamada drekkz_db.

Si tienes un archivo .sql, impórtalo para cargar el esquema y los datos iniciales.

3. Configura el Backend

cd BACKEND
cp .env.example .env
npm install

Edita .env con tus credenciales de MySQL y variables necesarias:
        DB_HOST=localhost     DB_USER=tu_usuario     DB_PASSWORD=tu_contraseña     DB_NAME=drekkz_db     PORT=3000     JWT_SECRET=tu_clave_secreta    

Inicia el servidor:
    bash     npm run dev     

4. Configura el Frontend

cd ../FRONTEND
npm install
npm run dev

🛠️ Principales Funcionalidades

Gestión de Productos: Alta, baja, modificación y visualización de productos con imágenes, talles y stock.

Gestión de Categorías y Talles: CRUD completo para categorías y talles.

Gestión de Clientes y Usuarios: Registro, edición y autenticación de clientes y administradores.

Carrito de Compras: Carrito persistente, selección de talles y cantidades, agregar/quitar productos.

Pedidos y Ventas: Generación de pedidos, historial y detalle de ventas.

Panel de Administración: Acceso protegido para gestionar todos los recursos.

Envíos: Registro y gestión de envíos asociados a pedidos.

Notificaciones: Feedback visual con Toasts para acciones exitosas o con error.

Responsive: Interfaz adaptable a dispositivos móviles y escritorio.

Integración con WhatsApp: Formulario de contacto que envía mensajes vía WhatsApp.

🔗 Rutas Backend

/api/auth/ — Registro y login de usuarios y clientes.

/api/usuarios/ — CRUD de usuarios administradores.

/api/clientes/ — CRUD de clientes.

/api/productos/ — CRUD de productos.

/api/categorias/ — CRUD de categorías.

/api/talles/ — CRUD de talles.

/api/carrito/ — Gestión de carritos.

/api/pedidos/ — Gestión de pedidos y ventas.

/api/envios/ — Gestión de envíos.

🧩 Componentes Frontend Destacados

CarritosAdmin.jsx: Panel de administración de carritos y pedidos.

CrudProd.jsx: Gestión de productos.

CategoriasAdmin.jsx: Gestión de categorías.

TallesAdmin.jsx: Gestión de talles.

UsersCrud.jsx: Gestión de usuarios administradores.

ClienteCrud.jsx: Gestión de clientes.

VentasCrud.jsx: Historial y detalle de ventas.

Principal.jsx: Landing page, hero, carrusel de productos, contacto y modal "Saber Más".

Carruselprod.jsx: Carrusel de productos destacados.

ModalProd.jsx, ModalSaberMas.jsx, ModalEnvio.jsx: Modales reutilizables para distintas acciones.

⚠️ Notas y Recomendaciones

Cambia las claves secretas y credenciales en .env antes de producción.

Usa HTTPS en producción.

Sube imágenes/productos a un bucket o CDN si esperas mucho tráfico.

Haz backup regular de la base de datos.

Si tienes errores de integridad referencial al eliminar carritos/pedidos, elimina primero los registros hijos (detalle_pedido, historial_ventas, etc.) antes de los padres.

📄 Licencia

Este proyecto es privado y para uso exclusivo de DREKKZ INDUMENTARIA.  
Para uso comercial, educativo o distribución, contacta al autor.

Team of Development

Thiago Robles -Product Owner- and Desarrollador de software
Jorge Villagra -Scrum Master- and Desarrollador de software
Nicolas Gonzalez -Desarrollador de software-
Tomas Jerez -Desarrollador de software-

