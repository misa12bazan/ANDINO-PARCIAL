import { iniciarSesion, registrarUsuario, irSegunRol } from './auth.js';
import { mostrarMensaje } from '../utils/ui.js';
import { usuarioActual } from './sesion.js';

const yaIngresado = usuarioActual();
if (yaIngresado) irSegunRol(yaIngresado);

document.getElementById('formLogin').addEventListener('submit', async e => {
  e.preventDefault();
  try {
    const u = await iniciarSesion(e.target.correo.value.trim(), e.target.contrasena.value);
    if (!u) return mostrarMensaje('msgLogin', 'Correo o contraseña incorrectos.', 'error');
    irSegunRol(u);
  } catch (err) {
    mostrarMensaje('msgLogin', 'No se pudo conectar con la base de datos.', 'error');
  }
});

document.getElementById('formCuenta').addEventListener('submit', async e => {
  e.preventDefault();
  const f = e.target;
  try {
    const u = await registrarUsuario(f.nombre.value.trim(), f.correo.value.trim(), f.contrasena.value);
    if (!u) return mostrarMensaje('msgCuenta', 'Ese correo ya tiene una cuenta. Inicia sesión.', 'error');
    mostrarMensaje('msgCuenta', 'Cuenta creada. Ya puedes iniciar sesión.');
    f.reset();
  } catch (err) {
    mostrarMensaje('msgCuenta', 'No se pudo crear la cuenta. Intenta de nuevo.', 'error');
  }
});
