$(document).ready(function() {
  $('#tablaTramites').DataTable({
    language: {
      url: '//cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json'
    }
  });
});

document.getElementById('modalConfirmarEliminar').addEventListener('show.bs.modal', function(e) {
  var id = e.relatedTarget.dataset.id;
  document.getElementById('formConfirmarEliminar').action = '/web/tramites/' + id + '/eliminar';
});

document.getElementById('formHistorico').addEventListener('submit', function(e) {
  var formularioValido = true;
  ['bautizado_nombre', 'bautizado_apellido'].forEach(function(idCampo) {
    var campo = document.getElementById(idCampo);
    if (!campo.value.trim()) {
      campo.classList.add('is-invalid');
      formularioValido = false;
    } else {
      campo.classList.remove('is-invalid');
    }
  });
  if (!formularioValido) e.preventDefault();
});

// Agregar nueva fila de padrino/madrina clonando la primera
document.getElementById('btnAgregarPadrino').addEventListener('click', function() {
  var contenedor = document.getElementById('contenedorFilasPadrino');
  var plantillaFila = contenedor.querySelector('.fila-padrino');
  var nuevaFila = plantillaFila.cloneNode(true);
  nuevaFila.querySelectorAll('input').forEach(function(input) { input.value = ''; });
  contenedor.appendChild(nuevaFila);
});

// Eliminar fila usando delegación de eventos (funciona para filas agregadas dinámicamente)
document.getElementById('contenedorFilasPadrino').addEventListener('click', function(e) {
  if (!e.target.classList.contains('btn-eliminar-fila-padrino')) return;
  var todasLasFilas = this.querySelectorAll('.fila-padrino');
  if (todasLasFilas.length > 1) {
    e.target.closest('.fila-padrino').remove();
  }
});

// Al cerrar el modal: resetear formulario y dejar solo una fila de padrino vacía
document.getElementById('modalRegistrarHistorico').addEventListener('hidden.bs.modal', function() {
  document.getElementById('formHistorico').reset();
  ['bautizado_nombre', 'bautizado_apellido'].forEach(function(idCampo) {
    document.getElementById(idCampo).classList.remove('is-invalid');
  });
  var contenedor = document.getElementById('contenedorFilasPadrino');
  var todasLasFilas = contenedor.querySelectorAll('.fila-padrino');
  todasLasFilas.forEach(function(fila, indice) {
    if (indice > 0) fila.remove();
  });
});
