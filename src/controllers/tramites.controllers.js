const tramiteService=require('../services/tramite.service');
const asyncHandler=require('../utils/asyncHandler');

const GET_Tramites= asyncHandler(async (req,res)=> {
        
        const tramites= await tramiteService.getTramites();
        if(tramites.length===0){
            return res.status(200).json({message:'No se encontraron trámites'});
        }
        res.status(200).json(tramites);
    
});
const GET_TramitesById= asyncHandler (async(req,res)=>{
      const tramite= await tramiteService.getTramiteById(req.params.id);
            res.status(200).json(tramite);
      
    
});

const POST_Tramites= asyncHandler(async(req,res)=>{
    
        const tramite= await tramiteService.createTramite(req.body);
        res.status(201).json(tramite);
   
    
});

const PATCH_Tramites= asyncHandler(async(req,res)=>{
   
        const {estado}=req.body;
        const tramite=await tramiteService.cambiarEstadoTramite(req.params.id,estado);
      
    
         res.status(200).json(tramite);
    
});







module.exports={
    GET_Tramites,
    GET_TramitesById,
    POST_Tramites,
    PATCH_Tramites
}