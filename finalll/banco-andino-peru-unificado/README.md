# Banco Andino Perú — proyecto unificado

Une el sitio público (Comso01) con la aplicación de apertura de cuenta (CRUD con roles, Semana 7).
Un solo inicio de sesión para todo el sitio: la cabecera muestra "Banca por Internet" si no hay sesión,
y el nombre del usuario + "Cerrar sesión" cuando sí la hay.

## Páginas
| Página | Acceso |
|---|---|
| index, servicios, como-funciona, contacto | públicas |
| login (iniciar sesión / crear cuenta) | pública |
| registro, consulta, actualizar | rol cliente |
| panel (CRUD completo) | rol administrador / empleado |

## Puesta en marcha
1. Neon: en SQL Editor ejecuta, en orden y una sola vez, `sql/01_tablas.sql`, `sql/02_datos_prueba.sql` y `sql/03_turnos.sql`.
2. Neon > Connect: copia la connection string y pégala en `js/config/neon-config.js`.
3. Local: abre `index.html` con Live Server (VS Code). Los módulos JS no funcionan abriendo el archivo con doble clic.
4. Vercel: sube la carpeta como proyecto estático (Framework: Other, sin build).

## Cuentas de prueba (clave 1234)
cliente1@correo.com … cliente10@correo.com, admin@correo.com, empleado1@correo.com, empleado2@correo.com

## Estructura
- `css/style.css` estilo del sitio · `css/app.css` estilo de las páginas de la aplicación
- `js/auth/sesion.js` sesión sin base de datos (la usan páginas públicas y de la app)
- `js/auth/auth.js` login/registro contra Neon · `js/nav-sesion.js` cabecera de páginas públicas

## Turnos de los trabajadores
- Turnos en `js/utils/horarios.js` (hora de Lima): mañana 06:00–14:00, tarde 14:00–22:00, noche 22:00–06:00.
- Un empleado dentro de su turno puede crear, editar y eliminar. Fuera de su turno el panel queda en **solo lectura** y se muestra un aviso con su horario.
- El estado se revisa cada 30 s: si el turno termina (o empieza) con el panel abierto, cambia solo, sin recargar.
- El administrador y los clientes no tienen restricción de horario.
- Para la captura del examen: `HORA_SIMULADA` en `horarios.js` (ej. `15`). Déjalo en `null` al terminar.

## Efectos y transiciones
`css/style.css` y `css/app.css` (bloques "TRANSICIONES Y EFECTOS"), `js/efectos.js`: entrada/salida de página, menú con subrayado animado, botones con elevación y brillo, tarjetas con hover, aparición al hacer scroll, filas de tabla animadas, mensajes con rebote/sacudida y carrusel de la portada. Respetan `prefers-reduced-motion`.
