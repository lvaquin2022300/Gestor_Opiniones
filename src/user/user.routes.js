import { Router } from "express";
import { check } from "express-validator";

import { validarCampos } from "../middlewares/validar-campos.js";

import {
    existeUsuarioById,
    existenteEmail, existenteUsuario
} from "../helpers/db-validators.js";

import {
    usuariosPost,
    usuariosLogin,
    usuariosPut
} from "./user.controller.js";
import { validarUsuario } from "../middlewares/validar-jwts.js";

const router = Router();


router.post(
    "/",
    [
        check("nombre", "El nombre es obligatorio").not().isEmpty(),
        check("correo", "El correo es obligatorio").not().isEmpty(),
        check("password", "El password debe tener más de 6 letras").isLength({ min: 6, }),
        check("correo", "El correo debe ser un correo").isEmail(),
        check("correo").custom(existenteEmail),
        check("username").custom(existenteUsuario),
        validarCampos,
    ], usuariosPost);

router.post(
    "/login",
    [
        check('user', 'El usuario es necesario').not().isEmpty(),
        check('password', 'la password es necesaria').not().isEmpty(),
        validarCampos,
    ], usuariosLogin);

router.put(
    "/:id",
    [
        validarUsuario,
        check("usuario").custom(existenteUsuario),
        check("id", "El id no es un formato válido de MongoDB").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos,
    ], usuariosPut);

export default router;