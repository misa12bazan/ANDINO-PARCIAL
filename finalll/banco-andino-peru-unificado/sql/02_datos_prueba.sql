-- Ejecutar UNA sola vez, después de 01_tablas.sql
-- 1) 10 clientes + 1 administrador + 2 empleados (clave de todos: 1234)
INSERT INTO usuarios (nombre, correo, contrasena, rol)
SELECT 'Cliente ' || n, 'cliente' || n || '@correo.com', '1234', 'cliente'
FROM generate_series(1,10) AS n
UNION ALL
VALUES
 ('Admin de prueba','admin@correo.com','1234','administrador'),
 ('Empleado Uno','empleado1@correo.com','1234','empleado'),
 ('Empleado Dos','empleado2@correo.com','1234','empleado');

-- 2) 3 solicitudes por cada cliente = 30 registros
INSERT INTO solicitudes_apertura_cuenta
 (id_usuario, codigo_seguimiento, nombres, apellidos, dni, telefono, tipo_cuenta, moneda, monto_inicial, estado)
SELECT u.id,
  'COD-' || lpad((u.id*10+s)::text, 8, '0'),
  'Cliente ' || u.id,
  'Prueba ' || s,
  lpad((70000000 + u.id*10 + s)::text, 8, '0'),
  '9' || lpad((10000000 + u.id*10 + s)::text, 8, '0'),
  (ARRAY['ahorros','corriente','sueldo'])[s],
  CASE WHEN s = 2 THEN 'USD' ELSE 'PEN' END,
  s * 500,
  CASE WHEN s = 1 THEN 'registrado' ELSE 'atendido' END
FROM usuarios u CROSS JOIN generate_series(1,3) AS s
WHERE u.rol = 'cliente';

-- 3) Verificación para la captura
SELECT rol, count(*) FROM usuarios GROUP BY rol;
SELECT count(*) AS registros FROM solicitudes_apertura_cuenta;
