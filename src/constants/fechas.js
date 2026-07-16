const MESES_CORTOS = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];

const formatFecha = (fecha) => {
  if (!fecha) return '—';
  const d = new Date(fecha);
  return `${String(d.getUTCDate()).padStart(2,'0')} ${MESES_CORTOS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
};

module.exports = { MESES_CORTOS, formatFecha };
