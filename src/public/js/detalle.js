document.getElementById('rolExistente').addEventListener('change', function() {
  const esCelebrante = this.value === 'Celebrante';
  const wrapFam = document.getElementById('wrapperFamiliares');
  const wrapCel = document.getElementById('wrapperCelebrantes');
  const selFam  = document.getElementById('selectFamiliares');
  const selCel  = document.getElementById('selectCelebrantes');

  wrapFam.classList.toggle('d-none', esCelebrante);
  wrapCel.classList.toggle('d-none', !esCelebrante);
  selFam.disabled  = esCelebrante;
  selCel.disabled  = !esCelebrante;
});
