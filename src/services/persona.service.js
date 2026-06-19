const { Persona } = require('../models/persona.model');

const crearPersona = async (persona, transaction = null) => {
  if (!persona.rut || persona.rut.trim() === '') {
    persona.rut = null;
  }
  if (persona.rut) {
    await obtenerPersonaPorRUT(persona.rut);
  } else {
    const resultado = await obtenerPersonaPorNombreApellido(persona);
    if (resultado?.advertencia) {
      const error = new Error(`Ya existe una persona registrada con el nombre "${persona.nombre} ${persona.apellido}". Si es la misma persona, vinculala como persona existente. Si es otra persona distinta, ingresa su RUT para diferenciarla.`);
      error.statusCode = 409;
      error.advertencia = true;
      error.personaEncontrada = resultado.personaEncontrada;
      throw error;
    }
  }
  return await Persona.create(persona, { transaction });
};

const obtenerPersonas = async (nombre, apellido) => {
  if (nombre && apellido) {
    const persona = await Persona.findOne({ where: { nombre, apellido } });
    if (!persona) {
      const error = new Error("No existe persona");
      error.statusCode = 400;
      throw error;
    }
    return persona;
  }
  return await Persona.findAll();
};

const obtenerPersonaPorNombreApellido = async (datos) => {
  const personaExistente = await Persona.findOne({
    where: { nombre: datos.nombre, apellido: datos.apellido },
  });
  if (personaExistente) {
    return {
      advertencia: true,
      mensaje: "Persona existe con este nombre",
      personaEncontrada: personaExistente,
    };
  }
};

const obtenerPersonaPorRUT = async (rutPersona) => {
  const personaExistente = await Persona.findOne({ where: { rut: rutPersona } });
  if (personaExistente) {
    const error = new Error("persona duplicada por rut");
    error.statusCode = 400;
    throw error;
  }
};

const obtenerPersonaPorId = async (id) => {
  const persona = await Persona.findByPk(id);
  if (!persona) {
    const error = new Error('Persona no encontrada');
    error.statusCode = 404;
    throw error;
  }
  return persona;
};

const actualizarPersonaPorId = async (id, datosPersona) => {
  const persona = await Persona.findByPk(id);
  if (!persona) {
    const error = new Error('Persona no encontrada');
    error.statusCode = 404;
    throw error;
  }
  return await Persona.update(datosPersona, { where: { id } });
};

module.exports = {
  crearPersona,
  obtenerPersonas,
  obtenerPersonaPorRUT,
  obtenerPersonaPorNombreApellido,
  obtenerPersonaPorId,
  actualizarPersonaPorId,
};
