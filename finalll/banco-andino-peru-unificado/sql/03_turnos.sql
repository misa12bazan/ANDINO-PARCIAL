-- Ejecutar en Neon > SQL Editor (una sola vez, después de 01 y 02).
-- Seguro si ya creaste la columna "turno": no la duplica ni pisa los turnos que ya asignaste.
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS turno VARCHAR(10);

-- Solo se asignan turnos a los empleados que aún no tienen uno
UPDATE usuarios SET turno = 'mañana' WHERE correo = 'empleado1@correo.com' AND turno IS NULL;
UPDATE usuarios SET turno = 'tarde'  WHERE correo = 'empleado2@correo.com' AND turno IS NULL;

-- Verificación para la captura
SELECT nombre, correo, rol, turno FROM usuarios WHERE rol <> 'cliente' ORDER BY rol, correo;
