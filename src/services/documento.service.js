const { Documento } = require('../models/documento.model');

const crearDocumento = async (documentoDatos) => {
  const { id_fk_participacion, tipo_documento, estado_documento, fecha_entrega } = documentoDatos;
  const documento = await Documento.create({
    tipo_documento,
    estado_documento,
    fecha_entrega,
    id_fk_participacion,
  });
  return documento;
};

const obtenerDocumentoParticipacion = async (id) => {
  const documento = await Documento.findOne({ where: { id_fk_participacion: id } });
  return documento;
};

const obtenerDocumentoPorId = async (id) => {
  const documento = await Documento.findByPk(id);
  if (!documento) {
    const error = new Error('Documento no encontrado');
    error.statusCode = 404;
    throw error;
  }
  return documento;
};
const actualizarDocumento = async (id,documentoDatos)=>{
  const documento = await Documento.findByPk(id);
  if (!documento) {
    const error = new Error('Documento no encontrado');
    error.statusCode = 404;
    throw error;
  }
  await documento.update(documentoDatos);
  return documento;
}

module.exports = {
  crearDocumento,
  obtenerDocumentoParticipacion,
  obtenerDocumentoPorId,
  actualizarDocumento
};
