-- Ejecutar en Neon > SQL Editor (una sola vez)
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(120) NOT NULL UNIQUE,
  contrasena VARCHAR(100) NOT NULL,
  fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Semana 7: roles
ALTER TABLE usuarios
  ADD COLUMN IF NOT EXISTS rol VARCHAR(20) NOT NULL DEFAULT 'cliente'
  CHECK (rol IN ('cliente','administrador','empleado'));

CREATE TABLE IF NOT EXISTS solicitudes_apertura_cuenta (
  id SERIAL PRIMARY KEY,
  codigo_seguimiento VARCHAR(20) NOT NULL UNIQUE,
  nombres VARCHAR(80) NOT NULL,
  apellidos VARCHAR(80) NOT NULL,
  dni CHAR(8) NOT NULL,
  telefono VARCHAR(15) NOT NULL,
  tipo_cuenta VARCHAR(20) NOT NULL CHECK (tipo_cuenta IN ('ahorros','corriente','sueldo')),
  moneda VARCHAR(3) NOT NULL CHECK (moneda IN ('PEN','USD')),
  monto_inicial NUMERIC(12,2) NOT NULL CHECK (monto_inicial >= 0),
  estado VARCHAR(20) NOT NULL DEFAULT 'registrado' CHECK (estado IN ('registrado','atendido','rechazado')),
  fecha_registro TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Semana 7: dueño del registro
ALTER TABLE solicitudes_apertura_cuenta
  ADD COLUMN IF NOT EXISTS id_usuario INT REFERENCES usuarios(id);
