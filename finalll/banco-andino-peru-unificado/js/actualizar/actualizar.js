import { sql } from '../config/neon-config.js';
import { exigirSesion } from '../auth/auth.js';
import { pintarNav, mostrarMensaje } from '../utils/ui.js';

const usuario = exigirSesion();
if (usuario.rol !== 'cliente') window.location.href = 'panel.html';
pintarNav(usuario);

const id = Number(new URLSearchParams(window.location.search).get('id'));
const f = document.getElementById('formActualizar');

export async function actualizarRegistro(id, d) {
  // AND id_usuario evita editar el registro de otro cliente aunque se cambie el id en la URL
  await sql`
    UPDATE solicitudes_apertura_cuenta
    SET nombres = ${d.nombres}, apellidos = ${d.apellidos}, dni = ${d.dni}, telefono = ${d.telefono},
        tipo_cuenta = ${d.tipo_cuenta}, moneda = ${d.moneda}, monto_inicial = ${d.monto_inicial}
    WHERE id = ${id} AND id_usuario = ${usuario.id} AND estado = 'registrado';`;
}

async function cargar() {
  try {
    const filas = await sql`
      SELECT * FROM solicitudes_apertura_cuenta WHERE id = ${id} AND id_usuario = ${usuario.id};`;
    if (filas.length === 0) {
      f.hidden = true;
      return mostrarMensaje('msgActualizar', 'No encontramos esa solicitud en tu cuenta.', 'error');
    }
    const r = filas[0];
    ['nombres','apellidos','dni','telefono','tipo_cuenta','moneda','monto_inicial'].forEach(c => { f[c].value = r[c]; });
    document.getElementById('codigo').textContent = r.codigo_seguimiento;
    if (r.estado !== 'registrado') {
      Array.from(f.elements).forEach(el => { el.disabled = true; });
      mostrarMensaje('msgActualizar', 'Esta solicitud ya fue ' + r.estado + ' y no se puede editar (solo lectura).', 'error');
    }
  } catch (err) {
    mostrarMensaje('msgActualizar', 'No se pudo cargar la solicitud.', 'error');
  }
}

f.addEventListener('submit', async e => {
  e.preventDefault();
  try {
    await actualizarRegistro(id, {
      nombres: f.nombres.value.trim(), apellidos: f.apellidos.value.trim(), dni: f.dni.value,
      telefono: f.telefono.value, tipo_cuenta: f.tipo_cuenta.value, moneda: f.moneda.value,
      monto_inicial: Number(f.monto_inicial.value)
    });
    mostrarMensaje('msgActualizar', 'Cambios guardados.');
  } catch (err) {
    mostrarMensaje('msgActualizar', 'No se pudieron guardar los cambios.', 'error');
  }
});
cargar();
