# 🛒 DREKKZ INDUMENTARIA — Proyecto Full Stack

Bienvenido al repositorio privado de **DREKKZ INDUMENTARIA**.
Este proyecto es una solución integral para la gestión de un e-commerce de indumentaria, desarrollado con **React + Vite** en el frontend y **Node.js + Express + MySQL** en el backend.

---

## Tabla de Contenidos
- [Descripción General](#descripción-general)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación y Puesta en Marcha](#instalación-y-puesta-en-marcha)
- [Variables de Entorno](#variables-de-entorno)
- [Principales Funcionalidades](#principales-funcionalidades)
- [Rutas Backend](#rutas-backend)
- [Componentes Frontend Destacados](#componentes-frontend-destacados)
- [Notas y Recomendaciones](#notas-y-recomendaciones)
- [Equipo de Desarrollo](#equipo-de-desarrollo)
- [Licencia](#licencia)

---

## Descripción General
DREKKZ INDUMENTARIA es una plataforma web para la gestión de productos, carritos, ventas, clientes y administración de un e-commerce de ropa. Incluye un panel de administración, gestión de usuarios, integración con WhatsApp y email, sistema de pedidos y ventas, y una landing page moderna y responsive.

---

## Tecnologías Utilizadas
- **Frontend:** React, Vite, React Router, React Toastify, Swiper, CSS Modules
- **Backend:** Node.js, Express, MySQL2, CORS, Multer.
- **Base de Datos:** MySQL
- **Otros:** Axios, dotenv.

---

## Estructura del Proyecto
```
TRABAJO-FINAL-PROGRAMACION-III/
├── BACKEND/
│   ├── app.js
│   ├── index.js
│   ├── package.json
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── routes/
│   └── uploads/
├── FRONTEND/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── public/
│   └── src/
└── README.md
```

---

## Instalación y Puesta en Marcha

### 1. Clona el repositorio
```bash
git clone https://github.com/tuusuario/drekkz-private.git
cd drekkz-private
```

### 2. Configura la base de datos
- Crea una base de datos MySQL llamada `drekkz_db`.
- Si tienes un archivo `.sql`, impórtalo para cargar el esquema y los datos iniciales.

### 3. Configura el Backend
```bash
cd BACKEND
cp .env.example .env
npm install
```
Edita `.env` con tus credenciales y variables:

| Variable      | Valor de ejemplo      |
|--------------|----------------------|
| DB_HOST      | localhost            |
| DB_USER      | tu_usuario           |
| DB_PASSWORD  | tu_contraseña        |
| DB_NAME      | drekkz_db            |
| PORT         | 3000                 |
| JWT_SECRET   | tu_clave_secreta     |

Inicia el servidor:
```bash
npm run dev
```

### 4. Configura el Frontend
```bash
cd ../FRONTEND
npm install
npm run dev
```

---

## Variables de Entorno
Asegúrate de definir correctamente las variables en el archivo `.env` del backend. No compartas este archivo públicamente.

---

## Principales Funcionalidades
- **Gestión de Productos:** ABM de productos con imágenes, talles y stock (baja lógica activa/inactiva).
- **Categorías y Talles:** CRUD completo.
- **Clientes y Usuarios:** Registro, edición y autenticación.
- **Carrito de Compras:** Carrito persistente, selección de talles/cantidades.
- **Pedidos y Ventas:** Generación y seguimiento de pedidos, historial de ventas.
- **Panel de Administración:** Gestión centralizada de recursos (acceso protegido).
- **Envíos:** Registro y administración de envíos asociados a pedidos.
- **Notificaciones:** Feedback visual con Toasts.
- **Responsive:** Interfaz adaptable a móviles y escritorio.
- **Integración WhatsApp y Email:** Contacto directo vía formulario.

---

## Rutas Backend
| Ruta                | Descripción                        |
|---------------------|------------------------------------|
| /api/auth/          | Registro y login de usuarios       |
| /api/usuarios/      | CRUD usuarios administradores      |
| /api/clientes/      | CRUD clientes                      |
| /api/productos/     | CRUD productos                     |
| /api/categorias/    | CRUD categorías                    |
| /api/talles/        | CRUD talles                        |
| /api/carrito/       | Gestión de carritos                |
| /api/pedidos/       | Gestión de pedidos y ventas        |
| /api/envios/        | Gestión de envíos                  |

---

## Componentes Frontend Destacados
- **CarritosAdmin.jsx** — Panel de administración de carritos y pedidos
- **CrudProd.jsx** — Gestión de productos
- **CategoriasAdmin.jsx** — Gestión de categorías
- **TallesAdmin.jsx** — Gestión de talles
- **UsersCrud.jsx** — Gestión de administradores
- **ClienteCrud.jsx** — Gestión de clientes
- **VentasCrud.jsx** — Historial y detalle de ventas
- **Principal.jsx** — Landing page, hero, carrusel de productos, contacto
- **Carruselprod.jsx** — Carrusel de productos destacados
- **ModalProd.jsx, ModalSaberMas.jsx, ModalEnvio.jsx** — Modales reutilizables

---

## Notas y Recomendaciones
- Cambia las claves secretas y credenciales en `.env` antes de producción.
- Usa HTTPS en producción.
- Sube imágenes/productos a un bucket/CDN si esperas mucho tráfico.
- Haz backup regular de la base de datos.
- Ante errores de integridad referencial al eliminar carritos/pedidos, elimina primero los registros hijos (detalle_pedido, historial_ventas, etc.).

---

## Equipo de Desarrollo
| Nombre            | Rol                                 |
|-------------------|-------------------------------------|
| Thiago Robles     | Product Owner / Desarrollador       |
| Jorge Villagra    | Scrum Master / Desarrollador        |
| Nicolas Gonzalez  | Desarrollador                       |
| Tomas Jerez       | Desarrollador                       |

---

## Licencia
Proyecto privado y para uso exclusivo de DREKKZ INDUMENTARIA.
Para uso comercial, educativo o distribución, contacta al autor.

<p align="center"> <b>¡Gracias por visitar este repositorio!</b><br> <em>¿Dudas o sugerencias? No dudes en contactarnos.</em> </p>
