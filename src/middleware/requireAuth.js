const requireAuth = (req, res, next) => {
    if (!req.session || !req.session.usuarioId) {
        return res.redirect('/');
    }
    if (req.session.debeCambiarPassword) {
        return res.redirect('/cambiar-password');
    }
    next();
};

const requireSesion = (req, res, next) => {
    if (!req.session || !req.session.usuarioId) {
        return res.redirect('/');
    }
    next();
};

module.exports = { requireAuth, requireSesion };
