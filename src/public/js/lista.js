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
