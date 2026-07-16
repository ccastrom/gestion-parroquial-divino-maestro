var inputFechaBautismo = document.querySelector('#modalEditarEstado input[name="fecha_bautismo"]');
if (inputFechaBautismo) {
  inputFechaBautismo.setAttribute('min', new Date().toISOString().split('T')[0]);
}

// Tab 1: mostrar/ocultar RUT y fecha según rol
document.getElementById('rolNuevo').addEventListener('change', function() {
  const esBautizado = this.value === 'Bautizado';
  document.getElementById('wrapperRutNuevo').classList.toggle('d-none', !esBautizado);
  document.getElementById('wrapperFechaNuevo').classList.toggle('d-none', !esBautizado);
  document.getElementById('wrapperLugarNuevo').classList.toggle('d-none', !esBautizado);
  document.getElementById('rutNuevo').classList.remove('is-invalid');
  document.getElementById('fechaNacimientoNuevo').classList.remove('is-invalid');

  // Precargar el teléfono del bautizado como sugerencia editable
  const rolesConTelefonoFamiliar = ['Padre', 'Madre', 'Padre 2', 'Madre 2', 'Tutor Legal'];
  const fonoNuevo = document.getElementById('fonoNuevo');
  if (rolesConTelefonoFamiliar.includes(this.value) && !fonoNuevo.value) {
    fonoNuevo.value = fonoNuevo.dataset.fonoBautizado;
  }
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
  document.getElementById('wrapperRutNuevo').classList.add('d-none');
  document.getElementById('wrapperFechaNuevo').classList.add('d-none');
  document.getElementById('wrapperLugarNuevo').classList.add('d-none');

  // Resetear Tab 2 (buscador + selección)
  if (window.tab2Reset) window.tab2Reset();
});

// '← Volver' usa history.back() — si la página se restaura desde bfcache
// (e.persisted), el HTML queda desactualizado tras crear/editar algo. Forzar reload.
window.addEventListener('pageshow', function(e) {
  if (e.persisted) {
    window.location.reload();
  }
});
