const { Persona, Participacion, Tramite } = require('../models');
const { ROLES_VALIDOS } = require('../constants/roles_Participantes');
const { formatFecha } = require('../constants/fechas');
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
const obtenerPerfilParticipante= async(id)=>{
  const persona = await obtenerPersonaPorId(id);
  const participaciones = await Participacion.findAll({
    where: { id_fk_persona: id },
    include: [
      {
        model: Tramite,
        attributes: ['id', 'fecha_bautismo'],
        include: [{
          model: Participacion,
          as: 'participacion',
          where: { rol: ROLES_VALIDOS.Bautizado },
          required: false,
          include: [
            { model: Persona, attributes: ['nombre', 'apellido'] }
          ]
        }]
      }
    ]
  });

  return {
    rut: persona.rut || '—',
    nac: formatFecha(persona.fecha_nacimiento),
    participaciones: participaciones.map(p => {
      const bautizado = p.Tramite.participacion[0]?.Persona;
      return {
        tramite: p.Tramite.id,
        rol: p.rol,
        detalle: bautizado
          ? `Bautismo de ${bautizado.nombre} ${bautizado.apellido}`
          : `Trámite #${p.Tramite.id}`,
        fecha: formatFecha(p.Tramite.fecha_bautismo)
      };
    })
  };

}

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
  obtenerPerfilParticipante
};
