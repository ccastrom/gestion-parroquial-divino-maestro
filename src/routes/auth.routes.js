const { Router } = require('express');
const {
    GET_Login,
    POST_Login,
    GET_CambiarPassword,
    POST_CambiarPassword,
    POST_Logout,
} = require('../controllers/auth.controllers');
const { validarBodyWeb } = require('../middleware/validarBodyWeb');
const { loginSchema, cambiarPasswordSchema } = require('../schemas/auth.schema');
const { requireSesion } = require('../middleware/requireAuth');

const router = Router();

router.get('/', GET_Login);
router.post('/', validarBodyWeb(loginSchema), POST_Login);
router.get('/cambiar-password', requireSesion, GET_CambiarPassword);
router.post('/cambiar-password', requireSesion, validarBodyWeb(cambiarPasswordSchema), POST_CambiarPassword);
router.post('/logout', requireSesion, POST_Logout);

module.exports = router;
