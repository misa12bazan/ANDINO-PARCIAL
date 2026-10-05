// Páginas públicas: si hay sesión iniciada, la cabecera muestra el usuario y "Cerrar sesión".
import { usuarioActual, pintarCabecera } from './auth/sesion.js';
pintarCabecera(usuarioActual());
