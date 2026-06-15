(function () {
  var KEY = 'ficha-funeral-v1';

  var inputs = Array.prototype.slice.call(document.querySelectorAll('[data-field]'));
  var toggleBtns = Array.prototype.slice.call(document.querySelectorAll('#toggle-palabras .toggle__btn'));
  var palabrasPrint = document.getElementById('palabras-print');
  var palabras = 'Sí';
  var mirrors = {};

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

  function read() {
    var data = {};
    inputs.forEach(function (el) { data[el.getAttribute('data-field')] = el.value; });
    data.palabras = palabras;
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
    syncPrint();
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

  document.getElementById('btn-print').addEventListener('click', function () { window.print(); });

  document.getElementById('btn-clear').addEventListener('click', function () {
    if (window.confirm('¿Vaciar todos los campos de la ficha?')) {
      apply({ palabras: 'Sí' });
      persist();
    }
  });

  buildPrintMirrors();

  var saved = null;
  try { saved = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) {}
  apply(saved && typeof saved === 'object' ? saved : { palabras: 'Sí' });
})();
