const asyncHandler = require('../utils/asyncHandler');
const authService = require('../services/auth.service');

const GET_Login = (req, res) => {
    if (req.session && req.session.usuarioId) {
        return res.redirect(req.session.debeCambiarPassword ? '/cambiar-password' : '/web');
    }
    res.render('login', { query: req.query });
};

const POST_Login = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    try {
        const usuario = await authService.verificarCredenciales(username, password);
        req.session.usuarioId = usuario.id;
        req.session.username = usuario.username;
        req.session.debeCambiarPassword = usuario.debe_cambiar_password;
        return res.redirect(usuario.debe_cambiar_password ? '/cambiar-password' : '/web');
    } catch (error) {
        return res.redirect(`/?error=${encodeURIComponent(error.message)}&username=${encodeURIComponent(username)}`);
    }
});

const GET_CambiarPassword = (req, res) => {
    res.render('cambiar-password', { query: req.query });
};

const POST_CambiarPassword = asyncHandler(async (req, res) => {
    const { passwordActual, passwordNueva } = req.body;
    try {
        await authService.cambiarPassword({ idUsuario: req.session.usuarioId, passwordActual, passwordNueva });
        req.session.debeCambiarPassword = false;
        return res.redirect(`/web?success=${encodeURIComponent('Contraseña actualizada exitosamente')}`);
    } catch (error) {
        return res.redirect(`/cambiar-password?error=${encodeURIComponent(error.message)}`);
    }
});

const POST_Logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};

module.exports = {
    GET_Login,
    POST_Login,
    GET_CambiarPassword,
    POST_CambiarPassword,
    POST_Logout,
};
