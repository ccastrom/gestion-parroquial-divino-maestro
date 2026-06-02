$(document).ready(function() {
  $('#tablaPersonas').DataTable({
    language: {
      url: '//cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json'
    }
  });
});

function validarCamposRequeridos(ids) {
  let valido = true;
  ids.forEach(function(id) {
    const campo = document.getElementById(id);
    if (!campo.value.trim()) {
      campo.classList.add('is-invalid');
      valido = false;
    } else {
      campo.classList.remove('is-invalid');
    }
  });
  return valido;
}

function abrirModalEditar(btn) {
  document.getElementById('formEditarPersona').action = '/web/personas/' + btn.dataset.id;
  document.getElementById('editNombre').value          = btn.dataset.nombre;
  document.getElementById('editApellido').value        = btn.dataset.apellido;
  document.getElementById('editRut').value             = btn.dataset.rut;
  document.getElementById('editFono').value            = btn.dataset.fono;
  document.getElementById('editDireccion').value       = btn.dataset.direccion;
  document.getElementById('editFechaNacimiento').value = btn.dataset.fecha_nacimiento;
  document.getElementById('editObservaciones').value   = btn.dataset.observaciones;
  document.getElementById('editTipo').value            = btn.dataset.tipo;
  document.getElementById('editNombre').classList.remove('is-invalid');
  document.getElementById('editApellido').classList.remove('is-invalid');
}

document.getElementById('formAgregarPersona').addEventListener('submit', function(e) {
  if (!validarCamposRequeridos(['agregarNombre', 'agregarApellido'])) e.preventDefault();
});

document.getElementById('formEditarPersona').addEventListener('submit', function(e) {
  if (!validarCamposRequeridos(['editNombre', 'editApellido'])) e.preventDefault();
});

document.getElementById('modalAgregarPersona').addEventListener('hidden.bs.modal', function() {
  document.getElementById('formAgregarPersona').reset();
  ['agregarNombre', 'agregarApellido'].forEach(function(id) {
    document.getElementById(id).classList.remove('is-invalid');
  });
});

document.querySelectorAll('.btn-editar-persona').forEach(function(btn) {
  btn.addEventListener('click', function() { abrirModalEditar(this); });
});

const params = new URLSearchParams(window.location.search);
const editId = params.get('edit');
if (editId) {
  const btn = document.querySelector('.btn-editar-persona[data-id="' + editId + '"]');
  if (btn) {
    abrirModalEditar(btn);
    new bootstrap.Modal(document.getElementById('modalEditarPersona')).show();
  }
}
