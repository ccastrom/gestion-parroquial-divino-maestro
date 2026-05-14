const inputBusqueda = document.querySelector('input[type="text"]');
const filas = document.querySelectorAll('tbody tr');

inputBusqueda.addEventListener('input', function() {
  const texto = this.value.toLowerCase();

  filas.forEach(function(fila) {
    const contenido = fila.textContent.toLowerCase();
    fila.style.display = contenido.includes(texto) ? '' : 'none';
  });
});
