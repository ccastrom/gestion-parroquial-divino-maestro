const tramiteService=require('../../services/tramite.service');
const asyncHandler=require('../../utils/asyncHandler');

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

module.exports={
    POST_AgregarDocumento_Web,
    POST_ModificarDocumento_Web,
}
