// Turnos de los trabajadores (formato 24 h, hora de Lima).
// "noche" cruza la medianoche (22:00 a 06:00) y se maneja abajo.
export const TURNOS = {
  mañana: { inicio: 6,  fin: 14 },
  tarde:  { inicio: 14, fin: 22 },
  noche:  { inicio: 22, fin: 6 }
};

// Para la demo/captura del examen: pon una hora (ej. 15) para simular que son las 3 pm.
// Déjalo en null para usar la hora real.
export const HORA_SIMULADA = null;

// Hora actual en Lima (no depende de la zona horaria de la computadora)
export function horaActual() {
  if (HORA_SIMULADA !== null) return HORA_SIMULADA;
  return Number(new Intl.DateTimeFormat('en-GB', { timeZone: 'America/Lima', hour: '2-digit', hourCycle: 'h23' }).format(new Date()));
}

export function horaTexto() {
  if (HORA_SIMULADA !== null) return String(HORA_SIMULADA).padStart(2, '0') + ':00';
  return new Date().toLocaleTimeString('es-PE', { timeZone: 'America/Lima', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
}

export function estaEnTurno(turno) {
  if (!turno || !TURNOS[turno]) return false;
  const hora = horaActual();
  const { inicio, fin } = TURNOS[turno];
  if (inicio < fin) return hora >= inicio && hora < fin;
  return hora >= inicio || hora < fin;          // turno que cruza la medianoche
}

export function getHorarioTurno(turno) {
  if (!turno || !TURNOS[turno]) return 'Turno no asignado';
  const { inicio, fin } = TURNOS[turno];
  const fmt = h => `${h.toString().padStart(2, '0')}:00`;
  return `${fmt(inicio)} a ${fmt(fin)}`;
}
