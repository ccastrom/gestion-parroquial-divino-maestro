var calendar = new FullCalendar.Calendar(document.getElementById('calendario'), {
  locale: 'es',
  timeZone: 'UTC',
  initialView: 'dayGridMonth',
  height: 'auto',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek'
  },
  buttonText: { today: 'Hoy', month: 'Mes', week: 'Semana' },
  events: todosLosEventos,

  eventDidMount: function(info) {
    var props = info.event.extendedProps;
    var texto = props.hora ? props.hora + 'h · ' + props.estado : props.estado;
    new bootstrap.Tooltip(info.el, {
      title: texto,
      placement: 'top',
      trigger: 'hover',
      container: 'body'
    });
  },

  eventClick: function(info) {
    info.jsEvent.preventDefault();
    window.location.href = info.event.url;
  },

  dateClick: function(info) {
    var hoy = new Date().toISOString().split('T')[0];
    if (info.dateStr < hoy) return;
    document.getElementById('nuevaFecha').value = info.dateStr;
    document.getElementById('nuevaHora').value = '';
    new bootstrap.Modal(document.getElementById('modalNuevoTramite')).show();
  },

  dayCellClassNames: function(info) {
    var hoy = new Date().toISOString().split('T')[0];
    return info.dateStr < hoy ? ['fc-dia-pasado'] : [];
  }
});

calendar.render();

var hoy = new Date().toISOString().split('T')[0];
document.getElementById('nuevaFecha').setAttribute('min', hoy);

document.getElementById('buscarBautizado').addEventListener('input', function() {
  var q = this.value.toLowerCase().trim();
  calendar.removeAllEvents();
  calendar.addEventSource(
    q ? todosLosEventos.filter(function(e) { return e.title.toLowerCase().includes(q); })
      : todosLosEventos
  );
});
