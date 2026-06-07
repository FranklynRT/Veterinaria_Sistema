/**
 * db.js — VetCare Pro
 * Capa de persistencia sobre localStorage.
 * Todas las entidades usan el mismo patrón: getAll / getById / save / update / remove
 */

// ─── Claves de almacenamiento ─────────────────────────────────
const KEYS = {
  clientes:  'vetcare_clientes',
  mascotas:  'vetcare_mascotas',
  citas:     'vetcare_citas',
  historial: 'vetcare_historial',
  seeded:    'vetcare_seeded',
};

// ─── Leer / escribir ──────────────────────────────────────────
function leer(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch { return []; }
}

function escribir(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// ─── Generador de ID ──────────────────────────────────────────
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// ─── Datos de demostración ────────────────────────────────────
function sembrarDatosDemo() {
  if (localStorage.getItem(KEYS.seeded)) return;

  const clientes = [
    { id: 'cli001', nombre: 'Carlos Martínez',  telefono: '555-1234', email: 'carlos@demo.com',  fechaRegistro: '2026-01-15' },
    { id: 'cli002', nombre: 'Ana López',         telefono: '555-5678', email: 'ana@demo.com',     fechaRegistro: '2026-02-03' },
    { id: 'cli003', nombre: 'Roberto Sánchez',   telefono: '555-9012', email: 'roberto@demo.com', fechaRegistro: '2026-03-20' },
    { id: 'cli004', nombre: 'María Torres',      telefono: '555-3456', email: 'maria@demo.com',   fechaRegistro: '2026-04-10' },
  ];

  const mascotas = [
    { id: 'mas001', idCliente: 'cli001', nombre: 'Max',     especie: 'Perro', raza: 'Golden Retriever', edad: 3,  peso: 28.5 },
    { id: 'mas002', idCliente: 'cli001', nombre: 'Luna',    especie: 'Gato',  raza: 'Persa',            edad: 5,  peso: 4.2  },
    { id: 'mas003', idCliente: 'cli002', nombre: 'Rocky',   especie: 'Perro', raza: 'Bulldog Francés',  edad: 2,  peso: 12.0 },
    { id: 'mas004', idCliente: 'cli003', nombre: 'Nube',    especie: 'Gato',  raza: 'Siamés',           edad: 7,  peso: 3.8  },
    { id: 'mas005', idCliente: 'cli004', nombre: 'Toby',    especie: 'Perro', raza: 'Labrador',         edad: 1,  peso: 22.0 },
    { id: 'mas006', idCliente: 'cli004', nombre: 'Mochi',   especie: 'Conejo',raza: 'Mini Lop',         edad: 2,  peso: 1.5  },
  ];

  const hoy = new Date().toISOString().split('T')[0];
  const manana = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const citas = [
    { id: 'cit001', idMascota: 'mas001', fecha: hoy,    hora: '09:00', motivo: 'Vacunación anual',       estado: 'pendiente'  },
    { id: 'cit002', idMascota: 'mas003', fecha: hoy,    hora: '10:30', motivo: 'Revisión general',        estado: 'completada' },
    { id: 'cit003', idMascota: 'mas002', fecha: hoy,    hora: '12:00', motivo: 'Control de peso',         estado: 'pendiente'  },
    { id: 'cit004', idMascota: 'mas004', fecha: manana, hora: '09:00', motivo: 'Desparasitación',         estado: 'pendiente'  },
    { id: 'cit005', idMascota: 'mas005', fecha: manana, hora: '11:00', motivo: 'Primera consulta',        estado: 'pendiente'  },
    { id: 'cit006', idMascota: 'mas001', fecha: '2026-05-10', hora: '10:00', motivo: 'Vacuna rabia', estado: 'completada' },
  ];

  const historial = [
    { id: 'his001', idMascota: 'mas001', fecha: '2026-05-10', sintomas: 'Ninguno, visita preventiva', diagnostico: 'Saludable', tratamiento: 'Vacuna antirrábica aplicada. Próxima revisión en 6 meses.' },
    { id: 'his002', idMascota: 'mas003', fecha: hoy,          sintomas: 'Tos ocasional, sin fiebre',  diagnostico: 'Bronquitis leve', tratamiento: 'Amoxicilina 250mg, 1 tableta cada 12h por 7 días.' },
    { id: 'his003', idMascota: 'mas002', fecha: '2026-03-05', sintomas: 'Pérdida de apetito, letargo', diagnostico: 'Anemia leve', tratamiento: 'Suplemento de hierro 2ml diarios. Dieta blanda por 10 días.' },
  ];

  escribir(KEYS.clientes,  clientes);
  escribir(KEYS.mascotas,  mascotas);
  escribir(KEYS.citas,     citas);
  escribir(KEYS.historial, historial);
  localStorage.setItem(KEYS.seeded, '1');
}

// ═══════════════════════════════════════════════════════════════
//  CLIENTES
// ═══════════════════════════════════════════════════════════════
export const Clientes = {
  getAll() {
    return leer(KEYS.clientes);
  },

  getById(id) {
    return this.getAll().find(c => c.id === id) || null;
  },

  save(datos) {
    const lista = this.getAll();
    const nuevo = { id: uid(), fechaRegistro: new Date().toISOString().split('T')[0], ...datos };
    lista.push(nuevo);
    escribir(KEYS.clientes, lista);
    return nuevo;
  },

  update(id, datos) {
    const lista = this.getAll().map(c => c.id === id ? { ...c, ...datos } : c);
    escribir(KEYS.clientes, lista);
    return lista.find(c => c.id === id);
  },

  remove(id) {
    // Eliminar mascotas, citas e historial asociados en cascada
    const mascotas = Mascotas.getAll().filter(m => m.idCliente === id);
    mascotas.forEach(m => Mascotas.remove(m.id));
    const lista = this.getAll().filter(c => c.id !== id);
    escribir(KEYS.clientes, lista);
  },

  buscar(query) {
    const q = query.toLowerCase().trim();
    return this.getAll().filter(c =>
      c.nombre.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q)  ||
      c.telefono.includes(q)
    );
  },
};

// ═══════════════════════════════════════════════════════════════
//  MASCOTAS
// ═══════════════════════════════════════════════════════════════
export const Mascotas = {
  getAll() {
    return leer(KEYS.mascotas);
  },

  getById(id) {
    return this.getAll().find(m => m.id === id) || null;
  },

  getByCliente(idCliente) {
    return this.getAll().filter(m => m.idCliente === idCliente);
  },

  save(datos) {
    const lista = this.getAll();
    const nueva = { id: uid(), ...datos };
    lista.push(nueva);
    escribir(KEYS.mascotas, lista);
    return nueva;
  },

  update(id, datos) {
    const lista = this.getAll().map(m => m.id === id ? { ...m, ...datos } : m);
    escribir(KEYS.mascotas, lista);
    return lista.find(m => m.id === id);
  },

  remove(id) {
    // Eliminar citas e historial en cascada
    const citasLista = Citas.getAll().filter(c => c.idMascota !== id);
    escribir(KEYS.citas, citasLista);
    const histLista = Historial.getAll().filter(h => h.idMascota !== id);
    escribir(KEYS.historial, histLista);
    const lista = this.getAll().filter(m => m.id !== id);
    escribir(KEYS.mascotas, lista);
  },

  buscar(query) {
    const q = query.toLowerCase().trim();
    return this.getAll().filter(m =>
      m.nombre.toLowerCase().includes(q) ||
      m.especie.toLowerCase().includes(q) ||
      m.raza.toLowerCase().includes(q)
    );
  },
};

// ═══════════════════════════════════════════════════════════════
//  CITAS
// ═══════════════════════════════════════════════════════════════
export const Citas = {
  getAll() {
    return leer(KEYS.citas).sort((a, b) =>
      new Date(b.fecha + 'T' + b.hora) - new Date(a.fecha + 'T' + a.hora)
    );
  },

  getById(id) {
    return this.getAll().find(c => c.id === id) || null;
  },

  getByMascota(idMascota) {
    return this.getAll().filter(c => c.idMascota === idMascota);
  },

  getHoy() {
    const hoy = new Date().toISOString().split('T')[0];
    return this.getAll().filter(c => c.fecha === hoy);
  },

  getPendientes() {
    return this.getAll().filter(c => c.estado === 'pendiente');
  },

  save(datos) {
    const lista = leer(KEYS.citas);
    const nueva = { id: uid(), estado: 'pendiente', ...datos };
    lista.push(nueva);
    escribir(KEYS.citas, lista);
    return nueva;
  },

  update(id, datos) {
    const lista = leer(KEYS.citas).map(c => c.id === id ? { ...c, ...datos } : c);
    escribir(KEYS.citas, lista);
    return lista.find(c => c.id === id);
  },

  cambiarEstado(id, estado) {
    return this.update(id, { estado });
  },

  remove(id) {
    const lista = leer(KEYS.citas).filter(c => c.id !== id);
    escribir(KEYS.citas, lista);
  },
};

// ═══════════════════════════════════════════════════════════════
//  HISTORIAL CLÍNICO
// ═══════════════════════════════════════════════════════════════
export const Historial = {
  getAll() {
    return leer(KEYS.historial).sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  },

  getById(id) {
    return this.getAll().find(h => h.id === id) || null;
  },

  getByMascota(idMascota) {
    return this.getAll().filter(h => h.idMascota === idMascota);
  },

  save(datos) {
    const lista = leer(KEYS.historial);
    const nuevo = { id: uid(), fecha: new Date().toISOString().split('T')[0], ...datos };
    lista.push(nuevo);
    escribir(KEYS.historial, lista);
    return nuevo;
  },

  update(id, datos) {
    const lista = leer(KEYS.historial).map(h => h.id === id ? { ...h, ...datos } : h);
    escribir(KEYS.historial, lista);
    return lista.find(h => h.id === id);
  },

  remove(id) {
    const lista = leer(KEYS.historial).filter(h => h.id !== id);
    escribir(KEYS.historial, lista);
  },
};

// ─── Estadísticas globales ────────────────────────────────────
export function getStats() {
  const hoy = new Date().toISOString().split('T')[0];
  const citas = leer(KEYS.citas);
  return {
    totalClientes:  leer(KEYS.clientes).length,
    totalMascotas:  leer(KEYS.mascotas).length,
    citasHoy:       citas.filter(c => c.fecha === hoy).length,
    citasPendientes:citas.filter(c => c.estado === 'pendiente').length,
  };
}

// ─── Inicialización automática ────────────────────────────────
sembrarDatosDemo();
