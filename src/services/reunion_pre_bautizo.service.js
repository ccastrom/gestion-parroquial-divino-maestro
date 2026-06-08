const { Reunion_prebautizmal } = require("../models");
const { ESTADOS_VALIDOS } = require("../constants/estados_tramites");

const crearReunionPreBautizo = async (transaction) => {
  const reunion = await Reunion_prebautizmal.create(
    { estado: ESTADOS_VALIDOS.Reunion_Pre_Bautizo_Creada },
    { transaction }
  );
  return reunion;
};

const obtenerReunionPreBautizoPorId = async (id) => {
  const reunion = await Reunion_prebautizmal.findByPk(id);
  if (!reunion) {
    const error = new Error("Reunión de pre-bautizo no encontrada");
    error.statusCode = 404;
    throw error;
  }
  return reunion;
};

const actualizarReunionPreBautizoPorId = async (id, datos) => {
  const reunion = await obtenerReunionPreBautizoPorId(id);
  return await Reunion_prebautizmal.update(datos, { where: { id: reunion.id } });
};

module.exports = {
  crearReunionPreBautizo,
  obtenerReunionPreBautizoPorId,
  actualizarReunionPreBautizoPorId,
};
