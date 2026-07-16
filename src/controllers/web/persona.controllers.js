const personaService=require('../../services/persona.service');
const asyncHandler=require('../../utils/asyncHandler');

const GET_Personas_Web = asyncHandler(async(req, res) => {
    const personas = await personaService.obtenerPersonas();
    res.render('personas/lista', { personas, query: req.query });
});

const POST_CrearPersona_Web = asyncHandler(async(req, res) => {
    await personaService.crearPersona(req.body);
    res.redirect('/web/personas?success=Persona%20agregada%20exitosamente');
});
const POST_EditarPersona_Web = asyncHandler(async(req, res) => {
    const { origen, tramiteId, ...datosPersona } = req.body;
    await personaService.actualizarPersonaPorId(req.params.id, datosPersona);
    const destino = origen === 'detalle'
        ? `/web/tramites/${tramiteId}`
        : '/web/personas';
    res.redirect(`${destino}?success=Persona%20modificada%20exitosamente`);
});
const GET_PerfilParticipante_Web= asyncHandler(async(req,res)=>{
    const perfilParticipantes= await personaService.obtenerPerfilParticipante(req.params.id);
    res.json(perfilParticipantes);
})

module.exports={
    GET_Personas_Web,
    POST_CrearPersona_Web,
    POST_EditarPersona_Web,
    GET_PerfilParticipante_Web
}
