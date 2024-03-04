const { Router } = require('express');
const { check } = require('express-validator');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');


const { userPut} = require('../controllers/user.controller');

const router = Router();

router.put("/:id", [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id'),
    validarCampos
], userPut);



module.exports = router;