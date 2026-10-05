import { sql } from '../config/neon-config.js';
import { exigirSesion } from '../auth/auth.js';
import { pintarNav, mostrarMensaje } from '../utils/ui.js';

const usuario = exigirSesion();
if (usuario.rol !== 'cliente') window.location.href = 'panel.html';
pintarNav(usuario);

document.getElementById('formRegistro').addEventListener('submit', async e => {
  e.preventDefault();
  const f = e.target;
  const codigo = 'COD-' + Date.now().toString().slice(-8);
  try {
    await sql`
      INSERT INTO solicitudes_apertura_cuenta
        (id_usuario, codigo_seguimiento, nombres, apellidos, dni, telefono, tipo_cuenta, moneda, monto_inicial, estado)
      VALUES (${usuario.id}, ${codigo}, ${f.nombres.value.trim()}, ${f.apellidos.value.trim()},
        ${f.dni.value}, ${f.telefono.value}, ${f.tipo_cuenta.value}, ${f.moneda.value},
        ${Number(f.monto_inicial.value)}, 'registrado');`;
    mostrarMensaje('msgRegistro', 'Solicitud registrada. Tu código de seguimiento es ' + codigo + '.');
    f.reset();
  } catch (err) {
    mostrarMensaje('msgRegistro', 'No se pudo registrar la solicitud. Revisa los datos.', 'error');
  }
});
