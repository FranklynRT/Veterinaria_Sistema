/**
 * utils.js — VetCare Pro
 * Helpers reutilizables: fechas, formatos, validaciones, DOM.
 */

// ─── Fechas ───────────────────────────────────────────────────
export function formatFecha(iso) {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

export function formatFechaHora(fecha, hora) {
  return `${formatFecha(fecha)} ${hora ?? ''}`.trim();
}

export function fechaHoy() {
  return new Date().toISOString().split('T')[0];
}

export function esFechaHoy(iso) {
  return iso === fechaHoy();
}

export function esFechaFutura(iso) {
  return iso > fechaHoy();
}

// ─── Texto ────────────────────────────────────────────────────
export function truncar(str, max = 50) {
  if (!str) return '';
  return str.length <= max ? str : str.slice(0, max) + '…';
}

export function capitalizar(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function iniciales(nombre) {
  return nombre
    .split(' ')
    .slice(0, 2)
    .map(p => p[0]?.toUpperCase() ?? '')
    .join('');
}

// ─── Estado de citas ──────────────────────────────────────────
const ESTADO_CONFIG = {
  pendiente:  { label: 'Pendiente',  cls: 'badge-warn'    },
  completada: { label: 'Completada', cls: 'badge-ok'      },
  cancelada:  { label: 'Cancelada',  cls: 'badge-danger'  },
};

export function estadoBadge(estado) {
  return ESTADO_CONFIG[estado] ?? { label: estado, cls: 'badge-info' };
}

// ─── Especies — iconos FontAwesome ────────────────────────────
const ESPECIE_ICON = {
  Perro:  'fa-dog',
  Gato:   'fa-cat',
  Ave:    'fa-dove',
  Conejo: 'fa-rabbit',
  Pez:    'fa-fish',
  Caballo:'fa-horse',
};

export function especieIcon(especie) {
  return ESPECIE_ICON[especie] ?? 'fa-paw';
}

// ─── Validaciones simples ─────────────────────────────────────
export function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validarRequeridos(obj, campos) {
  return campos.every(c => (obj[c] ?? '').toString().trim() !== '');
}

// ─── DOM helpers ──────────────────────────────────────────────
export function $(selector, ctx = document) {
  return ctx.querySelector(selector);
}

export function $$(selector, ctx = document) {
  return [...ctx.querySelectorAll(selector)];
}

export function mostrarEl(el) { el?.classList.remove('hidden'); }
export function ocultarEl(el) { el?.classList.add('hidden'); }
export function toggleEl(el)  { el?.classList.toggle('hidden'); }

// ─── Toast notifications ──────────────────────────────────────
let toastTimer = null;

export function toast(mensaje, tipo = 'success') {
  const contenedor = document.getElementById('toast-container');
  if (!contenedor) return;

  clearTimeout(toastTimer);
  const t = document.createElement('div');
  t.className = `toast toast-${tipo}`;
  const iconos = { success: 'fa-circle-check', error: 'fa-circle-xmark', info: 'fa-circle-info' };
  t.innerHTML = `<i class="fa-solid ${iconos[tipo] ?? 'fa-circle-info'}"></i><span>${mensaje}</span>`;
  contenedor.innerHTML = '';
  contenedor.appendChild(t);

  // Animar entrada
  requestAnimationFrame(() => t.classList.add('toast-show'));

  toastTimer = setTimeout(() => {
    t.classList.remove('toast-show');
    setTimeout(() => contenedor.innerHTML = '', 400);
  }, 3200);
}

// ─── Modal helpers ────────────────────────────────────────────
export function abrirModal(id) {
  const m = document.getElementById(id);
  if (!m) return;
  m.classList.add('modal-open');
  document.body.style.overflow = 'hidden';
}

export function cerrarModal(id) {
  const m = document.getElementById(id);
  if (!m) return;
  m.classList.remove('modal-open');
  document.body.style.overflow = '';
}

// Cerrar modal al hacer clic en el fondo
document.addEventListener('click', e => {
  if (e.target?.classList.contains('modal-backdrop')) {
    e.target.closest('.modal-wrapper')?.classList.remove('modal-open');
    document.body.style.overflow = '';
  }
});
