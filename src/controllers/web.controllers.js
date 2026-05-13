const tramiteService=require('../services/tramite.service');
const asyncHandler=require('../utils/asyncHandler');

const GET_Tramites_Web= asyncHandler(async(req,res)=>{
    const tramites = await tramiteService.obtenerTramitesConBautizado();
    res.render('tramites/lista', {tramites:tramites});
});



module.exports={
    GET_Tramites_Web
}