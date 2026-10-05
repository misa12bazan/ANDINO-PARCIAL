import { sql } from '../config/neon-config.js';
import { exigirSesion } from '../auth/auth.js';
import { pintarNav, esc, fmtMonto, fmtFecha, mostrarMensaje } from '../utils/ui.js';
import { estaEnTurno, getHorarioTurno, horaTexto } from '../utils/horarios.js';

const usuario = exigirSesion();
if (usuario.rol === 'cliente') window.location.href = 'registro.html';
pintarNav(usuario);

const esEmpleado = usuario.rol === 'empleado';
// Se evalúa cada vez que se usa: si el turno termina con el panel abierto, pasa a solo lectura
const puedeEditar = () => !esEmpleado || estaEnTurno(usuario.turno);
let ultimoEstado = null;

function actualizarEstadoTurno() {
  if (!esEmpleado) return;
  const dentro = puedeEditar();
  const info = document.getElementById('infoTurno');
  info.hidden = false;
  info.className = 'turno-info ' + (dentro ? 'en-turno' : 'fuera-turno');
  info.textContent = 'Turno ' + (usuario.turno || 'no asignado') + ' (' + getHorarioTurno(usuario.turno) + ') — ' +
    (dentro ? 'en turno: puedes crear, editar y eliminar' : 'fuera de turno: solo lectura');
  if (dentro === ultimoEstado) return;
  const primeraVez = ultimoEstado === null;
  ultimoEstado = dentro;
  if (!dentro) {
    document.getElementById('seccionForm').hidden = true;
    mostrarMensaje('msgPanel',
      (primeraVez ? 'Acceso restringido: ' : 'Terminó tu turno. ') +
      `Tu turno (${usuario.turno || 'no asignado'}) es de ${getHorarioTurno(usuario.turno)}. ` +
      `Actualmente son las ${horaTexto()}. Solo puedes consultar registros.`, 'error');
  } else if (!primeraVez) {
    mostrarMensaje('msgPanel', 'Comenzó tu turno: ya puedes crear, editar y eliminar registros.');
  }
  if (typeof registros !== 'undefined' && registros.length) filtrar();
}

const f = document.getElementById('formPanel');
const campos = ['nombres','apellidos','dni','telefono','tipo_cuenta','moneda','monto_inicial','estado'];
let registros = [];

export const listarTodos = () => sql`
  SELECT s.*, u.nombre AS cliente FROM solicitudes_apertura_cuenta s
  LEFT JOIN usuarios u ON u.id = s.id_usuario ORDER BY s.fecha_registro DESC;`;

export async function crearRegistro(d) {
  const codigo = 'COD-' + Date.now().toString().slice(-8);
  await sql`
    INSERT INTO solicitudes_apertura_cuenta
      (codigo_seguimiento, nombres, apellidos, dni, telefono, tipo_cuenta, moneda, monto_inicial, estado)
    VALUES (${codigo}, ${d.nombres}, ${d.apellidos}, ${d.dni}, ${d.telefono}, ${d.tipo_cuenta},
            ${d.moneda}, ${d.monto_inicial}, ${d.estado});`;
  return codigo;
}

export const actualizarComoPanel = (id, d) => sql`
  UPDATE solicitudes_apertura_cuenta
  SET nombres = ${d.nombres}, apellidos = ${d.apellidos}, dni = ${d.dni}, telefono = ${d.telefono},
      tipo_cuenta = ${d.tipo_cuenta}, moneda = ${d.moneda}, monto_inicial = ${d.monto_inicial}, estado = ${d.estado}
  WHERE id = ${id};`;

export const eliminarRegistro = id => sql`DELETE FROM solicitudes_apertura_cuenta WHERE id = ${id};`;

function pintar(lista) {
  document.getElementById('total').textContent = lista.length + ' registros';
  document.getElementById('cuerpo').innerHTML = lista.map(r => `
    <tr>
      <td>${esc(r.codigo_seguimiento)}</td>
      <td>${esc(r.nombres)} ${esc(r.apellidos)}</td>
      <td>${esc(r.cliente || 'Sin cliente (panel)')}</td>
      <td>${esc(r.tipo_cuenta)}</td>
      <td>${fmtMonto(r.monto_inicial, r.moneda)}</td>
      <td><span class="estado ${esc(r.estado)}">${esc(r.estado)}</span></td>
      <td>${fmtFecha(r.fecha_registro)}</td>
      <td class="acciones">
        ${puedeEditar() ? `
          <button type="button" data-editar="${Number(r.id)}">Editar</button>
          <button type="button" class="peligro" data-eliminar="${Number(r.id)}">Eliminar</button>
        ` : `
          <span style="color: var(--color-texto-suave); font-size: 0.85rem;">Solo lectura</span>
        `}
      </td>
    </tr>`).join('') || '<tr><td colspan="8">No hay registros.</td></tr>';
}

async function cargar() {
  try {
    registros = await listarTodos();
    filtrar();
  } catch (err) {
    mostrarMensaje('msgPanel', 'No se pudieron cargar los registros.', 'error');
  }
}

function filtrar() {
  const q = document.getElementById('buscar').value.toLowerCase();
  pintar(registros.filter(r => (r.codigo_seguimiento + r.nombres + r.apellidos + r.dni + r.estado).toLowerCase().includes(q)));
}

function abrirForm(r) {
  if (!puedeEditar()) {
    mostrarMensaje('msgPanel', 'No puedes editar fuera de tu turno.', 'error');
    return;
  }
  f.reset();
  f.id_editar.value = r ? r.id : '';
  campos.forEach(c => { f[c].value = r ? r[c] : (c === 'estado' ? 'registrado' : f[c].value); });
  document.getElementById('tituloForm').textContent = r ? 'Editar solicitud ' + r.codigo_seguimiento : 'Nueva solicitud';
  document.getElementById('seccionForm').hidden = false;
  f.nombres.focus();
}

document.getElementById('btnNuevo').addEventListener('click', () => abrirForm(null));
document.getElementById('btnCancelar').addEventListener('click', () => { document.getElementById('seccionForm').hidden = true; });
document.getElementById('buscar').addEventListener('input', filtrar);

document.getElementById('cuerpo').addEventListener('click', async e => {
  if (!puedeEditar()) {
    mostrarMensaje('msgPanel', 'Acción no permitida fuera de tu turno.', 'error');
    return;
  }
  const idEd = e.target.dataset.editar, idEl = e.target.dataset.eliminar;
  if (idEd) abrirForm(registros.find(r => r.id === Number(idEd)));
  if (idEl && confirm('¿Eliminar este registro? Esta acción no se puede deshacer.')) {
    try {
      await eliminarRegistro(Number(idEl));
      mostrarMensaje('msgPanel', 'Registro eliminado.');
      cargar();
    } catch (err) { mostrarMensaje('msgPanel', 'No se pudo eliminar el registro.', 'error'); }
  }
});

f.addEventListener('submit', async e => {
  e.preventDefault();
  if (!puedeEditar()) {
    mostrarMensaje('msgPanel', 'No puedes guardar cambios fuera de tu turno.', 'error');
    return;
  }
  const d = {};
  campos.forEach(c => { d[c] = f[c].value; });
  d.monto_inicial = Number(d.monto_inicial);
  try {
    if (f.id_editar.value) {
      await actualizarComoPanel(Number(f.id_editar.value), d);
      mostrarMensaje('msgPanel', 'Registro actualizado.');
    } else {
      const cod = await crearRegistro(d);
      mostrarMensaje('msgPanel', 'Registro creado con código ' + cod + '.');
    }
    document.getElementById('seccionForm').hidden = true;
    cargar();
  } catch (err) { mostrarMensaje('msgPanel', 'No se pudo guardar. Revisa los datos.', 'error'); }
});
actualizarEstadoTurno();
setInterval(actualizarEstadoTurno, 30000);   // revisa el turno cada 30 s
cargar();
