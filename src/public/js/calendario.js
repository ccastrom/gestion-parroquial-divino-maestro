var FERIADOS_FIJOS = ['01-01', '05-01', '05-21', '09-18', '09-19', '12-25'];

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
    var ev = info.event;
    var props = ev.extendedProps;

    document.getElementById('modalEventoTitulo').textContent = ev.title;
    document.getElementById('modalEventoEstadoTexto').textContent = props.estado || '';
    document.getElementById('modalEventoHeader').style.backgroundColor = ev.backgroundColor;
    document.getElementById('formEditarEvento').action = '/web/tramites/' + ev.id + '/estado';
    document.getElementById('formEliminarEvento').action = '/web/tramites/' + ev.id + '/eliminar';
    document.getElementById('modalEventoEstado').value = props.estado || '';
    document.getElementById('modalEventoLink').href = '/web/tramites/' + ev.id;

    var fechaISO = ev.startStr ? ev.startStr.substring(0, 10) : '';
    document.getElementById('modalEventoFecha').value = fechaISO;
    document.getElementById('modalEventoFecha').setAttribute('min', new Date().toISOString().split('T')[0]);
    document.getElementById('modalEventoHora').value = props.hora || '';

    new bootstrap.Modal(document.getElementById('modalEvento')).show();
  },

  dateClick: function(info) {
    var hoy = new Date().toISOString().split('T')[0];
    if (info.dateStr < hoy) return;
    document.getElementById('nuevaFecha').value = info.dateStr;
    document.getElementById('nuevaFechaTexto').textContent = info.dateStr.split('-').reverse().join('-');
    document.getElementById('nuevaHora').value = '';
    new bootstrap.Modal(document.getElementById('modalNuevoTramite')).show();
  },

  dayCellClassNames: function(info) {
    var clases = [];
    var hoy = new Date().toISOString().split('T')[0];
    if (info.dateStr < hoy) clases.push('fc-dia-pasado');
    return clases;
  },

  dayCellDidMount: function(info) {
    var diaSemana = info.date.getUTCDay();
    var mm = String(info.date.getUTCMonth() + 1).padStart(2, '0');
    var dd = String(info.date.getUTCDate()).padStart(2, '0');
    var esDomingo = diaSemana === 0;
    var esFeriado = !esDomingo && FERIADOS_FIJOS.includes(mm + '-' + dd);
    if (!esDomingo && !esFeriado) return;
    var numEl = info.el.querySelector('.fc-daygrid-day-number');
    if (!numEl) return;
    numEl.style.display = 'inline-flex';
    numEl.style.alignItems = 'center';
    numEl.style.justifyContent = 'center';
    numEl.style.width = '24px';
    numEl.style.height = '24px';
    numEl.style.borderRadius = '50%';
    numEl.style.fontWeight = '700';
    numEl.style.textDecoration = 'none';
    if (esDomingo) {
      numEl.style.backgroundColor = '#dc3545';
      numEl.style.color = 'white';
    } else {
      numEl.style.backgroundColor = '#ffc107';
      numEl.style.color = '#212529';
    }
  }
});

calendar.render();

window.addEventListener('pageshow', function(e) {
  if (e.persisted) {
    window.location.reload();
  }
});

document.getElementById('modalNuevoTramite').addEventListener('shown.bs.modal', function() {
  document.getElementById('nuevaHora').focus();
});

document.getElementById('formEliminarEvento').addEventListener('submit', function(e) {
  if (!confirm('¿Desea archivar este trámite? Podrá restaurarlo desde la sección Archivados.')) {
    e.preventDefault();
  }
});

document.getElementById('buscarBautizado').addEventListener('input', function() {
  var q = this.value.toLowerCase().trim();
  calendar.removeAllEvents();
  calendar.addEventSource(
    q ? todosLosEventos.filter(function(e) { return e.title.toLowerCase().includes(q); })
      : todosLosEventos
  );
});
