var inputFechaBautismo = document.querySelector('#modalEditarEstado input[name="fecha_bautismo"]');
if (inputFechaBautismo) {
  inputFechaBautismo.setAttribute('min', new Date().toISOString().split('T')[0]);
}

// Tab 2: intercambio familiares / celebrantes según rol
document.getElementById('rolExistente').addEventListener('change', function() {
  const esCelebrante = this.value === 'Celebrante';
  const wrapFam = document.getElementById('wrapperFamiliares');
  const wrapCel = document.getElementById('wrapperCelebrantes');
  const selFam  = document.getElementById('selectFamiliares');
  const selCel  = document.getElementById('selectCelebrantes');

  wrapFam.classList.toggle('d-none', esCelebrante);
  wrapCel.classList.toggle('d-none', !esCelebrante);
  selFam.disabled  = esCelebrante;
  selCel.disabled  = !esCelebrante;
});

// Tab 1: marcar RUT y fecha como obligatorios al seleccionar Bautizado
document.getElementById('rolNuevo').addEventListener('change', function() {
  const esBautizado = this.value === 'Bautizado';
  document.getElementById('labelRutNuevo').textContent   = esBautizado ? 'RUT *'                  : 'RUT';
  document.getElementById('labelFechaNuevo').textContent = esBautizado ? 'Fecha de nacimiento *'  : 'Fecha de nacimiento';
  document.getElementById('rutNuevo').classList.remove('is-invalid');
  document.getElementById('fechaNacimientoNuevo').classList.remove('is-invalid');
});

// Tab 1: validación client-side antes de enviar
document.getElementById('formNuevoParticipante').addEventListener('submit', function(e) {
  let valido = true;

  const rol    = document.getElementById('rolNuevo');
  const nombre = document.getElementById('nombreNuevo');
  const apellido = document.getElementById('apellidoNuevo');
  const rut    = document.getElementById('rutNuevo');
  const fecha  = document.getElementById('fechaNacimientoNuevo');

  [rol, nombre, apellido].forEach(function(campo) {
    if (!campo.value.trim()) {
      campo.classList.add('is-invalid');
      valido = false;
    } else {
      campo.classList.remove('is-invalid');
    }
  });

  if (rol.value === 'Bautizado') {
    if (!rut.value.trim()) {
      rut.classList.add('is-invalid');
      valido = false;
    } else {
      rut.classList.remove('is-invalid');
    }
    if (!fecha.value) {
      fecha.classList.add('is-invalid');
      valido = false;
    } else {
      fecha.classList.remove('is-invalid');
    }
  }

  if (!valido) e.preventDefault();
});

// Resetear modal al cerrar
document.getElementById('modalAgregarParticipante').addEventListener('hidden.bs.modal', function() {
  this.querySelectorAll('form').forEach(function(form) { form.reset(); });

  // Limpiar estado de validación Tab 1
  ['rolNuevo', 'nombreNuevo', 'apellidoNuevo', 'rutNuevo', 'fechaNacimientoNuevo'].forEach(function(id) {
    document.getElementById(id).classList.remove('is-invalid');
  });
  document.getElementById('labelRutNuevo').textContent   = 'RUT';
  document.getElementById('labelFechaNuevo').textContent = 'Fecha de nacimiento';

  // Restaurar selects Tab 2
  document.getElementById('wrapperFamiliares').classList.remove('d-none');
  document.getElementById('wrapperCelebrantes').classList.add('d-none');
  document.getElementById('selectFamiliares').disabled = false;
  document.getElementById('selectCelebrantes').disabled = true;
});
