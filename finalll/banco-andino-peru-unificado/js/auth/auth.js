import { sql } from '../config/neon-config.js';
import { usuarioActual, guardarSesion, cerrarSesion, paginaSegunRol } from './sesion.js';

export { cerrarSesion };

export async function registrarUsuario(nombre, correo, contrasena) {
  const existe = await sql`SELECT id FROM usuarios WHERE correo = ${correo};`;
  if (existe.length > 0) return null;
  const filas = await sql`
    INSERT INTO usuarios (nombre, correo, contrasena, rol)
    VALUES (${nombre}, ${correo}, ${contrasena}, 'cliente')
    RETURNING id, nombre, rol;`;
  return filas[0];
}

export async function iniciarSesion(correo, contrasena) {

  const filas = await sql`
    SELECT id, nombre, rol, turno FROM usuarios
    WHERE correo = ${correo} AND contrasena = ${contrasena};`;
  if (filas.length === 0) return null;
  guardarSesion(filas[0]);
  return filas[0];
}

export function exigirSesion() {
  const u = usuarioActual();
  if (!u) {
    window.location.href = 'login.html';
    throw new Error('Sin sesión');
  }
  return u;
}

export function irSegunRol(usuario) {
  window.location.href = paginaSegunRol(usuario);
}