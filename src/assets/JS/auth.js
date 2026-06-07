/**
 * auth.js — VetCare Pro
 * Gestión de sesión, login y control de roles.
 * Usa sessionStorage para la sesión activa.
 */

const SESSION_KEY = 'vetcare_session';

// ─── Usuarios de demostración (en producción esto sería una API) ──
const USUARIOS_DEMO = [
  {
    id: 'usr001',
    nombre: 'Administrador Demo',
    email: 'admin@vetcare.demo',
    password: 'demo1234',
    rol: 'admin',
    avatar: 'AD',
  },
  {
    id: 'usr002',
    nombre: 'Dr. Veterinario',
    email: 'vet@vetcare.demo',
    password: 'demo1234',
    rol: 'vet',
    avatar: 'DV',
  },
];

// ─── Iniciar sesión ───────────────────────────────────────────
export function login(email, password) {
  const usuario = USUARIOS_DEMO.find(
    u => u.email === email.trim().toLowerCase() && u.password === password
  );

  if (!usuario) {
    return { ok: false, error: 'Correo o contraseña incorrectos.' };
  }

  const sesion = {
    id:     usuario.id,
    nombre: usuario.nombre,
    email:  usuario.email,
    rol:    usuario.rol,
    avatar: usuario.avatar,
    loginAt: new Date().toISOString(),
  };

  sessionStorage.setItem(SESSION_KEY, JSON.stringify(sesion));
  return { ok: true, usuario: sesion };
}

// ─── Cerrar sesión ────────────────────────────────────────────
export function logout() {
  sessionStorage.removeItem(SESSION_KEY);
  window.location.href = '/login';
}

// ─── Obtener sesión activa ────────────────────────────────────
export function getSesion() {
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY));
  } catch {
    return null;
  }
}

// ─── Verificar si está autenticado ───────────────────────────
export function estaAutenticado() {
  return getSesion() !== null;
}

// ─── Guard: redirige a login si no hay sesión ─────────────────
export function requireAuth(redirectTo = '/login') {
  if (!estaAutenticado()) {
    window.location.href = redirectTo;
    return null;
  }
  return getSesion();
}

// ─── Verificar rol ────────────────────────────────────────────
export function esAdmin() {
  const s = getSesion();
  return s?.rol === 'admin';
}

export function esVet() {
  const s = getSesion();
  return s?.rol === 'vet' || s?.rol === 'admin';
}

// ─── Renderizar nombre del rol ────────────────────────────────
export function labelRol(rol) {
  return { admin: 'Administrador', vet: 'Veterinario' }[rol] ?? rol;
}
