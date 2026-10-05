import { sql } from '../config/neon-config.js';
import { exigirSesion } from '../auth/auth.js';
import { pintarNav, esc, fmtMonto, fmtFecha, mostrarMensaje } from '../utils/ui.js';

const usuario = exigirSesion();
if (usuario.rol !== 'cliente') window.location.href = 'panel.html';
pintarNav(usuario);

async function cargar() {
  const cuerpo = document.getElementById('cuerpo');
  try {
    const filas = await sql`
      SELECT * FROM solicitudes_apertura_cuenta
      WHERE id_usuario = ${usuario.id} ORDER BY fecha_registro DESC;`;
    if (filas.length === 0) {
      cuerpo.innerHTML = '<tr><td colspan="7">Aún no tienes solicitudes. <a href="registro.html">Abre tu primera cuenta</a>.</td></tr>';
      return;
    }
    cuerpo.innerHTML = filas.map(r => `
      <tr>
        <td>${esc(r.codigo_seguimiento)}</td>
        <td>${esc(r.nombres)} ${esc(r.apellidos)}</td>
        <td>${esc(r.tipo_cuenta)}</td>
        <td>${fmtMonto(r.monto_inicial, r.moneda)}</td>
        <td><span class="estado ${esc(r.estado)}">${esc(r.estado)}</span></td>
        <td>${fmtFecha(r.fecha_registro)}</td>
        <td>${r.estado === 'registrado'
          ? '<a class="btn" href="actualizar.html?id=' + Number(r.id) + '">Editar</a>'
          : 'Solo lectura'}</td>
      </tr>`).join('');
  } catch (err) {
    mostrarMensaje('msgConsulta', 'No se pudieron cargar tus solicitudes.', 'error');
  }
}
cargar();
