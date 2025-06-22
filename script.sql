-- SCRIPT DREKKZ DB

CREATE DATABASE IF NOT EXISTS drekkz_db;
USE drekkz_db;

-- 1. Usuarios (login)
CREATE TABLE IF NOT EXISTS Usuarios (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) NOT NULL UNIQUE,
  contraseña VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  rol ENUM('admin', 'cliente') NOT NULL
);

-- 2. Clientes (datos personales)
CREATE TABLE IF NOT EXISTS Clientes (
  id_cliente INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  nombre VARCHAR(50),
  apellido VARCHAR(50),
  direccion VARCHAR(100),
  telefono VARCHAR(20) NOT NULL UNIQUE,
  foto_perfil VARCHAR(255),
  FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario) ON DELETE CASCADE
);



-- 3. Categorías de productos
CREATE TABLE IF NOT EXISTS Categorias (
  id_categoria INT AUTO_INCREMENT PRIMARY KEY,
  nombre_categoria VARCHAR(50)
);

-- 4. Productos
CREATE TABLE IF NOT EXISTS Productos (
  id_producto INT AUTO_INCREMENT PRIMARY KEY,
  id_categoria INT,
  nombre_producto VARCHAR(100),
  precio INT,
  descripcion VARCHAR(200),
  imagen_producto VARCHAR(255),
  activo TINYINT(1) DEFAULT 1,
  FOREIGN KEY (id_categoria) REFERENCES Categorias(id_categoria)
);

-- 5. Talles
CREATE TABLE IF NOT EXISTS Talles (
  id_talle INT AUTO_INCREMENT PRIMARY KEY,
  nombre_talle VARCHAR(10)
);

-- 6. Producto_Talle (stock por talle)
CREATE TABLE IF NOT EXISTS Producto_Talle (
  id_producto_talle INT AUTO_INCREMENT PRIMARY KEY,
  id_producto INT,
  id_talle INT,
  stock INT DEFAULT 0 CHECK (stock >=0),
  FOREIGN KEY (id_producto) REFERENCES Productos(id_producto),
  FOREIGN KEY (id_talle) REFERENCES Talles(id_talle)
);

-- 7. Carritos
CREATE TABLE IF NOT EXISTS Carritos (
  id_carrito INT AUTO_INCREMENT PRIMARY KEY,
  id_cliente INT,
  estado ENUM('activo','entregado','cancelado','pagado') DEFAULT 'activo',
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  fecha_entrega DATETIME NULL,
  FOREIGN KEY (id_cliente) REFERENCES Clientes(id_cliente)
);

-- 8. Detalle del Carrito
CREATE TABLE IF NOT EXISTS Carrito_Detalle (
  id_carrito_detalle INT AUTO_INCREMENT PRIMARY KEY,
  id_carrito INT,
  id_producto INT,
  id_talle INT,
  cantidad INT,
  subtotal INT,
  FOREIGN KEY (id_carrito) REFERENCES Carritos(id_carrito) ON DELETE CASCADE,
  FOREIGN KEY (id_producto) REFERENCES Productos(id_producto),
  FOREIGN KEY (id_talle) REFERENCES Talles(id_talle)
);

-- 9. Pedidos
CREATE TABLE IF NOT EXISTS Pedidos (
  id_pedido INT AUTO_INCREMENT PRIMARY KEY,
  id_cliente INT,
  id_carrito INT,
  fecha_pedido DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_cliente) REFERENCES Clientes(id_cliente),
  FOREIGN KEY (id_carrito) REFERENCES Carritos(id_carrito) ON DELETE CASCADE
);

-- 9b. Lógica de envío (nuevo)
CREATE TABLE IF NOT EXISTS Envios (
  id_envio INT AUTO_INCREMENT PRIMARY KEY,
  id_pedido INT NOT NULL,
  requiere_envio BOOLEAN NOT NULL,
  direccion_envio VARCHAR(255),
  FOREIGN KEY (id_pedido) REFERENCES Pedidos(id_pedido) ON DELETE CASCADE
);

-- 10. Detalle del Pedido
CREATE TABLE IF NOT EXISTS Detalle_Pedido (
  id_detalle INT AUTO_INCREMENT PRIMARY KEY,
  id_pedido INT,
  id_producto INT,
  id_talle INT,
  cantidad INT,
  subtotal INT,
  FOREIGN KEY (id_pedido) REFERENCES Pedidos(id_pedido) ON DELETE CASCADE,
  FOREIGN KEY (id_producto) REFERENCES Productos(id_producto),
  FOREIGN KEY (id_talle) REFERENCES Talles(id_talle) 
);

-- Tabla de ventas diarias
CREATE TABLE IF NOT EXISTS Ventas_Diarias (
  id_venta_diaria INT AUTO_INCREMENT PRIMARY KEY,
  fecha DATE NOT NULL UNIQUE,
  total INT DEFAULT 0
);

-- Detalle de ventas diarias por producto
CREATE TABLE IF NOT EXISTS Detalle_Venta_Diaria (
  id_detalle_venta_diaria INT AUTO_INCREMENT PRIMARY KEY,
  id_venta_diaria INT,
  id_producto INT,
  id_talle INT,
  cantidad INT,
  subtotal INT,
  FOREIGN KEY (id_venta_diaria) REFERENCES Ventas_Diarias(id_venta_diaria),
  FOREIGN KEY (id_producto) REFERENCES Productos(id_producto),
  FOREIGN KEY (id_talle) REFERENCES Talles(id_talle)
);

-- PROCEDIMIENTO

DELIMITER $$

CREATE PROCEDURE generar_venta_diaria(IN fecha_consulta DATE)
BEGIN
  DECLARE venta_id INT;

  -- Si no existe, crea el registro
  SELECT id_venta_diaria INTO venta_id
  FROM Ventas_Diarias
  WHERE fecha = fecha_consulta;

  IF venta_id IS NULL THEN
    INSERT INTO Ventas_Diarias (fecha) VALUES (fecha_consulta);
    SET venta_id = LAST_INSERT_ID();
  END IF;

  -- BORRAR detalles anteriores para esa fecha
  DELETE FROM Detalle_Venta_Diaria WHERE id_venta_diaria = venta_id;

  -- Insertar nuevos detalles (sin ON DUPLICATE)
  INSERT INTO Detalle_Venta_Diaria (id_venta_diaria, id_producto, id_talle, cantidad, subtotal)
  SELECT
    venta_id,
    dp.id_producto,
    dp.id_talle,
    SUM(dp.cantidad) AS cantidad,
    SUM(dp.subtotal) AS subtotal
  FROM Pedidos p
  JOIN Carritos c ON p.id_carrito = c.id_carrito
  JOIN Detalle_Pedido dp ON p.id_pedido = dp.id_pedido
  WHERE DATE(c.fecha_entrega) = fecha_consulta
    AND c.estado = 'entregado'
  GROUP BY dp.id_producto, dp.id_talle;

  -- Calcular el total del día
  UPDATE Ventas_Diarias
  SET total = (
    SELECT IFNULL(SUM(subtotal), 0)
    FROM Detalle_Venta_Diaria
    WHERE id_venta_diaria = venta_id
  )
  WHERE id_venta_diaria = venta_id;
END $$
DELIMITER ;

-- TRIGGER

DELIMITER $$
CREATE TRIGGER restar_stock_al_entregar
AFTER UPDATE ON Carritos
FOR EACH ROW
BEGIN
  DECLARE v_id_pedido INT;
  IF NEW.estado = 'entregado' AND OLD.estado <> 'entregado' THEN
    SELECT id_pedido INTO v_id_pedido
    FROM Pedidos
    WHERE id_carrito = NEW.id_carrito;
    UPDATE Producto_Talle pt
    JOIN Detalle_Pedido dp
    ON pt.id_producto = dp.id_producto
    AND pt.id_talle = dp.id_talle
    SET pt.stock = GREATEST(pt.stock - dp.cantidad, 0)
    WHERE dp.id_pedido = v_id_pedido;
  END IF;
END $$
DELIMITER ;

-- VISTAS

CREATE OR REPLACE VIEW vista_pedidos_join AS
SELECT
  p.id_pedido,
  p.id_cliente,
  c.nombre AS nombre_cliente,
  c.apellido AS apellido_cliente,
  p.fecha_pedido,
  p.id_carrito,
  car.estado AS estado_carrito,
  car.fecha_creacion AS fecha_carrito,
  dp.id_detalle,
  pr.nombre_producto,
  t.nombre_talle,
  dp.cantidad,
  dp.subtotal
FROM Pedidos p
JOIN Clientes c    ON p.id_cliente   = c.id_cliente
LEFT JOIN Carritos car ON p.id_carrito  = car.id_carrito
LEFT JOIN Detalle_Pedido dp ON p.id_pedido = dp.id_pedido
LEFT JOIN Productos pr     ON dp.id_producto = pr.id_producto
LEFT JOIN Talles t         ON dp.id_talle    = t.id_talle
ORDER BY p.id_pedido DESC ;

CREATE OR REPLACE VIEW vista_carritos_pedidos_fusion AS
SELECT
  ca.id_carrito,
  ca.estado AS estado_carrito,
  ca.fecha_creacion,
  cl.nombre AS cliente_nombre,
  cl.apellido AS cliente_apellido,
  cl.telefono,
  p.id_pedido,
  p.fecha_pedido,
  dp.id_detalle,
  pr.nombre_producto,
  pr.imagen_producto,
  t.nombre_talle,
  dp.cantidad,
  dp.subtotal,
  e.direccion_envio,
  e.requiere_envio
FROM Carritos ca
JOIN Clientes cl ON ca.id_cliente = cl.id_cliente
LEFT JOIN Pedidos p ON ca.id_carrito = p.id_carrito
LEFT JOIN Detalle_Pedido dp ON p.id_pedido = dp.id_pedido
LEFT JOIN Productos pr ON dp.id_producto = pr.id_producto
LEFT JOIN Talles t ON dp.id_talle = t.id_talle
LEFT JOIN Envios e ON p.id_pedido = e.id_pedido
ORDER BY ca.fecha_creacion DESC, p.fecha_pedido DESC;

-- Índices recomendados

CREATE INDEX idx_detallepedido_pedido ON Detalle_Pedido(id_pedido);
CREATE UNIQUE INDEX idx_venta_producto_talle
ON Detalle_Venta_Diaria (id_venta_diaria, id_producto, id_talle);


