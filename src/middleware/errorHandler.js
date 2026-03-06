
const errorHandler= (err, req, res, next) => {
    console.log('Error capturado por el middleware:', err);
     res.status(err.statusCode || 500).json({
        message: err.message || 'Error interno'
    });
};



module.exports=errorHandler;