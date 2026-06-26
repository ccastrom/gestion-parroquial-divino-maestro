const tramiteService=require('../../services/tramite.service');
const asyncHandler=require('../../utils/asyncHandler');

const POST_CambiarReunion_Web= asyncHandler(async(req,res)=>{
    const {id_fk_persona_catequista,fecha,estado}= req.body;
    await tramiteService.actualizarReunionPorId(req.params.id, { id_fk_persona_catequista: id_fk_persona_catequista || null, fecha: fecha || null, estado })
    res.redirect(`/web/tramites/${req.params.id}`);
})
const POST_CompletarReunion_Web= asyncHandler(async(req,res)=>{
    await tramiteService.completarReunion(req.params.id)
    res.redirect(`/web/tramites/${req.params.id}?success=Reunión%20completada%20exitosamente`);
})

module.exports={
    POST_CambiarReunion_Web,
    POST_CompletarReunion_Web,
}
