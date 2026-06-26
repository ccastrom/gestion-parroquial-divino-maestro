const asyncHandler=require('../../utils/asyncHandler');

const GET_FichaFuneral_Web = asyncHandler(async(req, res) => {
    res.render('fichas/funeral');
});

module.exports={
    GET_FichaFuneral_Web,
}
