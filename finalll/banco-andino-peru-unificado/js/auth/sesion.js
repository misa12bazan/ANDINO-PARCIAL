export function usuarioActual() {
  try { return JSON.parse(sessionStorage.getItem('usuario')); } catch { return null; }
}

export function guardarSesion(usuario) {
  sessionStorage.setItem('usuario', JSON.stringify(usuario));
}

export function cerrarSesion() {
  sessionStorage.removeItem('usuario');
  window.location.href = 'login.html';
}

export function paginaSegunRol(usuario) {
  return usuario.rol === 'cliente' ? 'registro.html' : 'panel.html';
}

function esc(t) {
  const d = document.createElement('div');
  d.textContent = t ?? '';
  return d.innerHTML;
}

export function pintarCabecera(usuario) {
  const cont = document.getElementById('acciones-sesion');
  if (!cont || !usuario) return;
  const enlaces = usuario.rol === 'cliente'
    ? '<a href="registro.html" class="btn btn-outline">Abrir cuenta</a><a href="consulta.html" class="btn btn-outline">Mis solicitudes</a>'
    : '<a href="panel.html" class="btn btn-outline">Panel de gestión</a>';

  const infoTurno = usuario.rol === 'empleado' && usuario.turno
    ? ` · ${usuario.turno}`
    : '';

  cont.innerHTML = enlaces +
    '<span class="quien">' + esc(usuario.nombre) + ' (' + esc(usuario.rol) + infoTurno + ')</span>' +
    '<button type="button" class="btn btn-acento" id="btnSalir">Cerrar sesión</button>';
  document.getElementById('btnSalir').addEventListener('click', cerrarSesion);
}