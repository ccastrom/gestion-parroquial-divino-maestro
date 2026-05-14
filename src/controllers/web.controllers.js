const tramiteService=require('../services/tramite.service');
const asyncHandler=require('../utils/asyncHandler');

const GET_Tramites_Web= asyncHandler(async(req,res)=>{
    const tramites = await tramiteService.obtenerTramitesConBautizado();
    res.render('tramites/lista', {tramites:tramites});
});

const GET_TramitesById_Web= asyncHandler(async(req,res)=>{
    const tramite= await tramiteService.obtenerTramitePorId(req.params.id)
    res.render('tramites/detalle',{tramite});
})



module.exports={
    GET_Tramites_Web,
    GET_TramitesById_Web
}