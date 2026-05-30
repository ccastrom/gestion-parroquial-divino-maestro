const tramiteService=require('../services/tramite.service');
const asyncHandler=require('../utils/asyncHandler');
const { ESTADOS_VALIDOS } = require('../constants/estados_tramites');

const POST_Tramites_Web= asyncHandler(async(req,res)=>{
    const tramites = await tramiteService.crearTramite();
    res.redirect('/web')
})

const GET_Tramites_Web= asyncHandler(async(req,res)=>{
    const tramites = await tramiteService.obtenerTramitesConBautizado();
    res.render('bautismos/lista', {tramites:tramites});
});

const GET_TramitesById_Web= asyncHandler(async(req,res)=>{
    const {tramite, participantes, reunion,catequista, ListaDecatequistas} = await tramiteService.obtenerDetalleTramite(req.params.id);
    res.render('bautismos/detalle', {tramite, participantes, catequista, reunion, ListaDecatequistas, estados: Object.values(ESTADOS_VALIDOS), query: req.query});
});

const POST_CambiarEstado_Web = asyncHandler(async(req, res)=>{
    const { estado, fecha_bautismo } = req.body;
    await tramiteService.modificarTramite(req.params.id, { estado, fecha_bautismo: fecha_bautismo || null });
    res.redirect(`/web/tramites/${req.params.id}`);
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

module.exports={
    POST_Tramites_Web,
    GET_Tramites_Web,
    GET_TramitesById_Web,
    POST_CambiarEstado_Web,
    POST_CambiarReunion_Web,
    POST_CompletarReunion_Web,
    POST_AgregarDocumento_Web
}