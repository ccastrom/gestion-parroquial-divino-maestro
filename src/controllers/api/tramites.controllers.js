const tramiteService=require('../../services/tramite.service');
const asyncHandler=require('../../utils/asyncHandler');

const GET_Tramites= asyncHandler(async (req,res)=> {
        
        const tramites= await tramiteService.obtenerTramites();
        if(tramites.length===0){
            return res.status(200).json({message:'No se encontraron trámites'});
        }
        res.status(200).json(tramites);
    
});
const GET_TramitesById= asyncHandler (async(req,res)=>{
      const tramite= await tramiteService.obtenerTramitePorId(req.params.id);
            res.status(200).json(tramite);
      
    
});


const POST_Tramites_Agregar_Participantes= asyncHandler(async(req,res)=>{
        const tramite= await tramiteService.agregarParticipante(req.params.id,req.body);
           res.status(200).json(tramite);
});

const POST_Tramites= asyncHandler(async(req,res)=>{
    
        const tramite= await tramiteService.crearTramite();
        res.status(201).json(tramite);
   
    
});


const PATCH_Tramites= asyncHandler(async(req,res)=>{
   
        const datosTramite= {fecha_bautismo,estado}=req.body;
        const tramite=await tramiteService.modificarTramite(req.params.id,datosTramite);
      
    
         res.status(200).json(tramite);
    
});

const PUT_ReunionById=asyncHandler(async(req,res)=>{
        const datosReunion=req.body;
        const reunion = await tramiteService.actualizarReunionPorId(req.params.id,datosReunion);
         res.status(200).json(reunion);
})

const PATCHcompletarReunion=asyncHandler(async(req,res)=>{
        const tramiteId=req.params.id
        const estadoReunion=req.body;
        const reunion=await tramiteService.completarReunion(tramiteId,estadoReunion);
        res.status(200).json(reunion);
})

const POSTagregarDocumento = asyncHandler(async (req, res) => {
    const { idTramite, idParticipacion } = req.params;
    const documento = await tramiteService.agregarDocumentoParticipacion({
        idTramite,
        idParticipacion,
        documento: req.body
    });
    res.status(201).json(documento);
});

const PATCHmodificarDocumento = asyncHandler(async (req, res) => {
    const { idTramite, idDocumento } = req.params;
    const documento = await tramiteService.modificarDocumentoParticipacion({ idTramite, idDocumento, documento: req.body });
    res.status(200).json(documento);
});





module.exports={
    GET_Tramites,
    GET_TramitesById,
    POST_Tramites,
    PATCH_Tramites,
    PUT_ReunionById,
    POST_Tramites_Agregar_Participantes,
    PATCHcompletarReunion,
    POSTagregarDocumento,
    PATCHmodificarDocumento
}