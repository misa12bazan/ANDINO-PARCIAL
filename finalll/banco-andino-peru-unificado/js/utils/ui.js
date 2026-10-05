// Utilidades de interfaz compartidas por las páginas de la aplicación
import { pintarCabecera } from '../auth/sesion.js';

export function esc(texto) {
  const d = document.createElement('div');
  d.textContent = texto ?? '';
  return d.innerHTML;
}

// Mensaje de éxito/error con animación (clase .msg)
export function mostrarMensaje(id, texto, tipo = 'ok') {
  const el = document.getElementById(id);
  el.textContent = texto;
  el.className = 'msg ' + tipo;
  el.hidden = false;
  el.classList.remove('anim');
  void el.offsetWidth;
  el.classList.add('anim');
}

export function pintarNav(usuario) { pintarCabecera(usuario); }

export const fmtMonto = (m, mon) => (mon === 'USD' ? 'US$ ' : 'S/ ') + Number(m).toFixed(2);
export const fmtFecha = f => new Date(f).toLocaleDateString('es-PE');
