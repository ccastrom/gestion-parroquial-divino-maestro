const tramiteService=require('../../services/tramite.service');
const participacionService=require('../../services/participacion.service');
const asyncHandler=require('../../utils/asyncHandler');

const POST_CrearParticipante_Web = asyncHandler(async(req, res) => {
    const { rol, personaId, nombre, apellido, rut, fecha_nacimiento, fono, direccion,lugar_nacimiento,observaciones } = req.body;

    const participante = personaId
        ? { rol, personaId }
        : { rol, persona: { nombre, apellido, rut, fecha_nacimiento, fono, direccion,lugar_nacimiento,observaciones } };

    await tramiteService.agregarParticipante(req.params.id, participante);
    res.redirect(`/web/tramites/${req.params.id}?success=Participante%20agregado%20exitosamente`);
})

const POST_EditarRolParticipante_Web = asyncHandler(async(req, res) => {
    const { rol } = req.body;
    await participacionService.actualizarRolParticipacion({
        idParticipacion: req.params.idParticipacion,
        idTramite: req.params.id,
        nuevoRol: rol,
    });
    res.redirect(`/web/tramites/${req.params.id}?success=Rol%20actualizado%20exitosamente`);
})

const POST_EliminarParticipante_Web = asyncHandler(async(req, res) => {
    await participacionService.eliminarParticipacion({
        idParticipacion: req.params.idParticipacion,
        idTramite: req.params.id,
    });
    res.redirect(`/web/tramites/${req.params.id}?success=Participante%20eliminado%20exitosamente`);
})

module.exports={
    POST_CrearParticipante_Web,
    POST_EditarRolParticipante_Web,
    POST_EliminarParticipante_Web,
}
