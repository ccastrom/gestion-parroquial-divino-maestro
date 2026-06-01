$(document).ready(function() {
  $('#tablaPersonas').DataTable({
    language: {
      url: '//cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json'
    }
  });
});

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
}

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
