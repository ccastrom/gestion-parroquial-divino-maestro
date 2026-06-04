const tramiteService=require('../services/tramite.service');
const personaService=require('../services/persona.service');
const asyncHandler=require('../utils/asyncHandler');
const { ESTADOS_VALIDOS } = require('../constants/estados_tramites');

const POST_Tramites_Web= asyncHandler(async(req,res)=>{
    const { fecha_bautismo, hora_bautismo, origen } = req.body;
    const datos = {};
    if (fecha_bautismo) {
        const hora = hora_bautismo || '00:00';
        datos.fecha_bautismo = new Date(`${fecha_bautismo}T${hora}:00.000Z`);
    }
    await tramiteService.crearTramite(datos);
    res.redirect(origen === 'calendario' ? '/web/calendario' : '/web');
})

const GET_Tramites_Web= asyncHandler(async(req,res)=>{
    const tramites = await tramiteService.obtenerTramitesConBautizado();
    const tramitesEliminados = await tramiteService.obtenerTramitesEliminados();
    res.render('bautismos/lista', { tramites, tramitesEliminados, query: req.query });
});

const POST_eliminarTramite_Web = asyncHandler(async(req, res) => {
    await tramiteService.eliminarTramite(req.params.id);
    res.redirect('/web/calendario?success=Trámite%20eliminado%20exitosamente');
});

const POST_restaurarTramite_Web = asyncHandler(async(req, res) => {
    await tramiteService.restaurarTramite(req.params.id);
    res.redirect('/web?success=Trámite%20restaurado%20exitosamente');
});

const GET_TramitesById_Web= asyncHandler(async(req,res)=>{
    const {tramite, participantes, reunion, catequista, ListaDecatequistas, ListaDePersonas, ListaDeCelebrantes} = await tramiteService.obtenerDetalleTramite(req.params.id);
    res.render('bautismos/detalle', {tramite, participantes, catequista, reunion, ListaDecatequistas, ListaDePersonas, ListaDeCelebrantes, estados: Object.values(ESTADOS_VALIDOS), query: req.query});
});

const POST_CambiarEstado_Web = asyncHandler(async(req, res)=>{
    const { estado, fecha_bautismo, hora_bautismo, origen } = req.body;
    let fechaFinal = null;
    if (fecha_bautismo) {
        const hora = hora_bautismo || '00:00';
        fechaFinal = new Date(`${fecha_bautismo}T${hora}:00.000Z`);
    }
    await tramiteService.modificarTramite(req.params.id, { estado, fecha_bautismo: fechaFinal });
    res.redirect(origen === 'calendario' ? '/web/calendario' : `/web/tramites/${req.params.id}`);
});

const POST_CambiarReunion_Web= asyncHandler(async(req,res)=>{
    const {id_fk_persona_catequista,fecha,estado}= req.body;
    await tramiteService.actualizarReunionPorId(req.params.id, { id_fk_persona_catequista: id_fk_persona_catequista || null, fecha: fecha || null, estado })
    res.redirect(`/web/tramites/${req.params.id}`);
})
const POST_CompletarReunion_Web= asyncHandler(async(req,res)=>{
    await tramiteService.completarReunion(req.params.id)
    res.redirect(`/web/tramites/${req.params.id}?success=Reunión%20completada%20exitosamente`);
})

const POST_AgregarDocumento_Web = asyncHandler(async(req,res)=>{
    const {id_participacion, tipo_documento, estado_documento, fecha_entrega} = req.body;
    await tramiteService.agregarDocumentoParticipacion({ idTramite: req.params.id,  idParticipacion:id_participacion, documento: { tipo_documento, estado_documento, fecha_entrega } });
    res.redirect(`/web/tramites/${req.params.id}?success=Documento%20agregado%20exitosamente`);

});
const POST_ModificarDocumento_Web = asyncHandler(async(req,res)=>{
    const { tipo_documento, estado_documento, fecha_entrega } = req.body;
    await tramiteService.modificarDocumentoParticipacion({ idTramite: req.params.id, idDocumento: req.params.idDocumento, documento: { tipo_documento, estado_documento, fecha_entrega } });
    res.redirect(`/web/tramites/${req.params.id}?success=Documento%20modificado%20exitosamente`);
})
const POST_CrearParticipante_Web = asyncHandler(async(req, res) => {
    const { rol, personaId, nombre, apellido, rut, fecha_nacimiento, fono, direccion } = req.body;

    const participante = personaId
        ? { rol, personaId }
        : { rol, persona: { nombre, apellido, rut, fecha_nacimiento, fono, direccion } };

    await tramiteService.agregarParticipante(req.params.id, participante);
    res.redirect(`/web/tramites/${req.params.id}?success=Participante%20agregado%20exitosamente`);
})

const GET_Personas_Web = asyncHandler(async(req, res) => {
    const personas = await personaService.obtenerPersonas();
    res.render('personas/lista', { personas, query: req.query });
});

const POST_CrearPersona_Web = asyncHandler(async(req, res) => {
    await personaService.crearPersona(req.body);
    res.redirect('/web/personas?success=Persona%20agregada%20exitosamente');
});
const POST_EditarPersona_Web = asyncHandler(async(req, res) => {
    await personaService.actualizarPersonaPorId(req.params.id, req.body);
    res.redirect('/web/personas?success=Persona%20modificada%20exitosamente');
});
const GET_CalendarioTramites_Web = asyncHandler(async(req, res) => {
    const calendarioTramites = await tramiteService.obtenerTramitesParaCalendario();
    const eventos = calendarioTramites.filter(t=>t.fecha_bautismo);
    const sinFecha= calendarioTramites.filter(t=>!t.fecha_bautismo);
    res.render('bautismos/calendario', { eventos, sinFecha, query: req.query });
});
module.exports={
    POST_Tramites_Web,
    GET_Tramites_Web,
    POST_eliminarTramite_Web,
    POST_restaurarTramite_Web,
    GET_TramitesById_Web,
    POST_CambiarEstado_Web,
    POST_CambiarReunion_Web,
    POST_CompletarReunion_Web,
    POST_AgregarDocumento_Web,
    POST_ModificarDocumento_Web,
    POST_CrearParticipante_Web,
    GET_Personas_Web,
    POST_CrearPersona_Web,
    POST_EditarPersona_Web,
    GET_CalendarioTramites_Web
}