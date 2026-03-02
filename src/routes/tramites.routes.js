
const {Router} = require('express');
const
{   GET_Tramites,
    GET_TramitesById,
    POST_Tramites,
    PATCH_Tramites
}=require('../controllers/tramites.controllers');
const router= Router();

router.get('/',GET_Tramites);
router.get('/:id',GET_TramitesById);
router.post('/',POST_Tramites);
router.patch('/:id/estado',PATCH_Tramites);

module.exports = router;