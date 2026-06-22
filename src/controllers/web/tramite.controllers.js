const tramiteService=require('../../services/tramite.service');
const asyncHandler=require('../../utils/asyncHandler');
const { ESTADOS_TRAMITE, ESTADOS_REUNION, ESTADOS_DOCUMENTO } = require('../../constants/estados_tramites');

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
    const tramitesHistoricos = await tramiteService.obtenerTramitesHistoricos();
    res.render('bautismos/lista', { tramites, tramitesEliminados, tramitesHistoricos, query: req.query });
});

const POST_eliminarTramite_Web = asyncHandler(async(req, res) => {
    await tramiteService.eliminarTramite(req.params.id);
    const destino = req.body.origen === 'lista' ? '/web' : '/web/calendario';
    res.redirect(`${destino}?success=Trámite%20eliminado%20exitosamente`);
});

const POST_restaurarTramite_Web = asyncHandler(async(req, res) => {
    await tramiteService.restaurarTramite(req.params.id);
    res.redirect('/web?success=Trámite%20restaurado%20exitosamente');
});

const GET_TramitesById_Web= asyncHandler(async(req,res)=>{
    const {tramite, ListaDeParticipantes, reunion, catequista, ListaDecatequistas, ListaDePersonas, ListaDeCelebrantes} = await tramiteService.obtenerDetalleTramite(req.params.id);
    if (tramite.es_historico) {
        return res.render('bautismos/historico', { tramite, ListaDeParticipantes, reunion: null, catequista: null, query: req.query });
    }
    res.render('bautismos/detalle', {tramite, ListaDeParticipantes, catequista, reunion, ListaDecatequistas, ListaDePersonas, ListaDeCelebrantes, estadosTramite: Object.values(ESTADOS_TRAMITE), estadosReunion: Object.values(ESTADOS_REUNION), estadosDocumento: Object.values(ESTADOS_DOCUMENTO), query: req.query});
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

const GET_CalendarioTramites_Web = asyncHandler(async(req, res) => {
    const calendarioTramites = await tramiteService.obtenerTramitesParaCalendario();
    const eventos = calendarioTramites.filter(t=>t.fecha_bautismo);
    const sinFecha= calendarioTramites.filter(t=>!t.fecha_bautismo);
    res.render('bautismos/calendario', { eventos, sinFecha, query: req.query });
});

const POST_RegistrarHistorico_Web = asyncHandler(async (req, res) => {
    await tramiteService.registrarBautismoHistorico(req.body);
    res.redirect('/web?success=Registro%20hist%C3%B3rico%20guardado%20exitosamente');
});

module.exports={
    POST_Tramites_Web,
    GET_Tramites_Web,
    POST_eliminarTramite_Web,
    POST_restaurarTramite_Web,
    GET_TramitesById_Web,
    POST_CambiarEstado_Web,
    GET_CalendarioTramites_Web,
    POST_RegistrarHistorico_Web,
}
