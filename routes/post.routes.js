const { check } = require('express-validator');
const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');
const { postPublicacion, putPublicacion, addComment, getAllPostsWithComments } = require('../controllers/post.controller'); // Ajusta el controlador

const router = Router();

router.post('/', [
    validarJWT,
    validarCampos,
    postPublicacion 
]);
router.put('/:createdAt', [
    validarJWT,
    validarCampos,
    putPublicacion 
]);
router.post('/users/:userId', [
    validarJWT,
    check('postId', 'El ID del post es requerido').notEmpty(),
    validarCampos
], addComment);

router.get('/', [
    getAllPostsWithComments
]);


module.exports = router;
