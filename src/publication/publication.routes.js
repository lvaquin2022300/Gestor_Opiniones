import { Router } from "express";
import { check } from "express-validator";

import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT, validarUsuario } from "../middlewares/validar-jwts.js";

import {
    existePubliById
} from "../helpers/db-validators.js";

import {
    publiGet,
    publiPost,
    publiPut,
    publiDelete
} from "./publication.controller.js";

const router = Router();

router.get("/", [
    validarJWT
], publiGet);

router.post(
    "/",
    [
        validarJWT,
        check("titulo", "El titulo es obligatorio").not().isEmpty(),
        check("categoria", "La categoria es obligatorio").not().isEmpty(),
        check("texto", "El texto es obligatorio").not().isEmpty(),
        validarCampos,
    ], publiPost);

router.put(
    "/:id",
    [
        validarUsuario,
        validarCampos,
    ], publiPut);

router.delete(
    "/:id",
    [
        validarUsuario,
        validarCampos,
    ], publiDelete);

export default router;