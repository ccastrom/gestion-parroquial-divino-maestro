(function () {
  var KEY = 'ficha-funeral-v1';

  var TIPOS_CELEBRACION = {
    funeral:  'Celebración de Funeral',
    recuerdo: 'Celebración de Recuerdo'
  };

  var inputs = Array.prototype.slice.call(document.querySelectorAll('[data-field]'));
  var toggleBtns = Array.prototype.slice.call(document.querySelectorAll('#toggle-palabras .toggle__btn'));
  var palabrasPrint = document.getElementById('palabras-print');
  var selectTipo = document.getElementById('select-tipo');
  var tituloCelebracion = document.getElementById('titulo-celebracion');
  var wrapNumero = document.getElementById('wrap-numero');
  var wrapTiempo = document.getElementById('wrap-tiempo');
  var caracteristicasInput = document.getElementById('f-caracteristicas');
  var charCounter = document.getElementById('char-counter');
  var CHAR_LIMIT = 1600;
  var palabras = 'Sí';
  var tipo = 'funeral';
  var mirrors = {};

  // Contador de caracteres de Semblanza — naranja cerca del límite,
  // rojo al llegar al tope (el textarea ya tiene maxlength="1600").
  function updateCharCounter() {
    if (!caracteristicasInput || !charCounter) return;
    var len = caracteristicasInput.value.length;
    charCounter.textContent = len + ' / ' + CHAR_LIMIT;
    charCounter.classList.remove('is-warning', 'is-danger');
    if (len >= CHAR_LIMIT) charCounter.classList.add('is-danger');
    else if (len >= CHAR_LIMIT * 0.9) charCounter.classList.add('is-warning');
  }

  // Crea un <span class="field-print"> espejo por cada campo.
  // Al imprimir, los inputs se ocultan y los espejos muestran el texto
  // como elemento normal que fluye — nunca se recorta.
  function buildPrintMirrors() {
    inputs.forEach(function (el) {
      var k = el.getAttribute('data-field');
      var isArea = el.tagName === 'TEXTAREA';
      var m = document.createElement('span');
      m.className = 'field-print';
      m.setAttribute('data-print-for', k);

      if (k === 'numero')          m.className += ' field-print--num';
      if (k === 'caracteristicas') m.className += ' field-print--block field-print--flow';
      else if (isArea)             m.className += ' field-print--block';

      var cs = window.getComputedStyle(el);
      m.style.fontFamily    = cs.fontFamily;
      m.style.fontSize      = cs.fontSize;
      m.style.fontWeight    = cs.fontWeight;
      m.style.letterSpacing = cs.letterSpacing;
      m.style.textTransform = cs.textTransform;

      el.parentNode.insertBefore(m, el.nextSibling);
      mirrors[k] = m;
    });
  }

  function syncPrint() {
    inputs.forEach(function (el) {
      var k = el.getAttribute('data-field');
      if (mirrors[k]) mirrors[k].textContent = el.value || '';
    });
  }

  function autoGrow(el) {
    if (el.tagName !== 'TEXTAREA') return;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  }

  function applyTipo(val) {
    tipo = val;
    selectTipo.value = val;
    tituloCelebracion.textContent = TIPOS_CELEBRACION[val];
    if (val === 'recuerdo') {
      wrapNumero.classList.add('is-hidden');
      wrapTiempo.classList.remove('is-hidden');
    } else {
      wrapNumero.classList.remove('is-hidden');
      wrapTiempo.classList.add('is-hidden');
    }
  }

  function read() {
    var data = {};
    inputs.forEach(function (el) { data[el.getAttribute('data-field')] = el.value; });
    data.palabras = palabras;
    data.tipo = tipo;
    return data;
  }

  function persist() {
    try { localStorage.setItem(KEY, JSON.stringify(read())); } catch (e) {}
  }

  function paintToggle() {
    toggleBtns.forEach(function (b) {
      b.classList.toggle('is-active', b.getAttribute('data-val') === palabras);
    });
    if (palabrasPrint) palabrasPrint.textContent = palabras;
  }

  function apply(data) {
    inputs.forEach(function (el) {
      var k = el.getAttribute('data-field');
      el.value = (data[k] != null) ? data[k] : '';
      autoGrow(el);
    });
    palabras = data.palabras || 'Sí';
    paintToggle();
    applyTipo(data.tipo || 'funeral');
    syncPrint();
    updateCharCounter();
  }

  // Hora: la secretaria solo escribe los 4 dígitos corridos (ej. "1000")
  // y el campo arma "10:00" solo; al salir, agrega " hrs". Al volver a
  // entrar se le quita el " hrs" para que siga editando solo los dígitos.
  var horaInput = document.getElementById('f-hora');
  if (horaInput) {
    horaInput.addEventListener('input', function () {
      var digits = horaInput.value.replace(/\D/g, '').slice(0, 4);
      horaInput.value = digits.length > 2 ? digits.slice(0, 2) + ':' + digits.slice(2) : digits;
    });
    horaInput.addEventListener('focus', function () {
      horaInput.value = horaInput.value.replace(/\s*hrs\s*$/i, '');
    });
    horaInput.addEventListener('blur', function () {
      var digits = horaInput.value.replace(/\D/g, '').slice(0, 4);
      if (digits.length === 4) horaInput.value = digits.slice(0, 2) + ':' + digits.slice(2) + ' hrs';
      syncPrint();
      persist();
    });
  }

  if (caracteristicasInput) {
    caracteristicasInput.addEventListener('input', updateCharCounter);
  }

  inputs.forEach(function (el) {
    el.addEventListener('input', function () { autoGrow(el); syncPrint(); persist(); });
    if (el.tagName === 'INPUT') {
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          var indiceCampoActual = inputs.indexOf(el);
          if (inputs[indiceCampoActual + 1]) inputs[indiceCampoActual + 1].focus();
        }
      });
    }
  });

  toggleBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      palabras = b.getAttribute('data-val');
      paintToggle();
      syncPrint();
      persist();
    });
  });

  selectTipo.addEventListener('change', function () {
    applyTipo(selectTipo.value);
    persist();
  });

  document.getElementById('btn-print').addEventListener('click', function () { window.print(); });
  document.getElementById('btn-print-bottom').addEventListener('click', function () { window.print(); });

  document.getElementById('btn-clear').addEventListener('click', function () {
    if (window.confirm('¿Vaciar todos los campos de la ficha?')) {
      apply({ palabras: 'Sí', tipo: 'funeral' });
      persist();
    }
  });

  buildPrintMirrors();

  var saved = null;
  try { saved = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) {}
  apply(saved && typeof saved === 'object' ? saved : { palabras: 'Sí', tipo: 'funeral' });
})();
