const tramiteService=require('../services/tramite.service');

const GET_Tramites= async (req,res)=>{
    try {
        const tramites= await tramiteService.getTramites();
        res.status(200).json(tramites);
    } catch (error) {
        res.status(500).json({message:'Error al obtener los trámites', error:error.message});
    }
}
const GET_TramitesById= async (req,res)=>{
    try {
        const tramite= await tramiteService.getTramiteById(req.params.id);
        res.status(200).json(tramite);
    } catch (error) {
        res.status(404).json({message:'Trámite no encontrado', error:error.message});
    }
}

const POST_Tramites= async(req,res)=>{
    try {
        const tramite= await tramiteService.createTramite(req.body);
        res.status(201).json(tramite);
    } catch (error) {
        res.status(500).json({message:'Error al crear el trámite', error:error.message});
    }
}

const PATCH_Tramites= async(req,res)=>{
    try {
        const {estado}=req.body;
        const tramite=await tramiteService.cambiarEstadoTramite(req.params.id,estado);
        res.json(tramite);
    } catch (error) {
        res.status(400).json({message:error.message});
    }
};







module.exports={
    GET_Tramites,
    GET_TramitesById,
    POST_Tramites,
    PATCH_Tramites
}