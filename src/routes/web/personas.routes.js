const { Router } = require('express');
const { GET_Personas_Web, POST_CrearPersona_Web, POST_EditarPersona_Web,GET_PerfilParticipante_Web } = require('../../controllers/web/persona.controllers.js');
const { validarBodyWeb } = require('../../middleware/validarBodyWeb.js');
const { crearPersonaWebSchema } = require('../../schemas/persona.schema.js');

const router = Router();

router.get('/', GET_Personas_Web);
router.post('/', validarBodyWeb(crearPersonaWebSchema), POST_CrearPersona_Web);
router.post('/:id', validarBodyWeb(crearPersonaWebSchema), POST_EditarPersona_Web);
router.get('/:id/perfil-participante', GET_PerfilParticipante_Web);
module.exports = router;
