import { response, request } from "express";
import bcryptjs from "bcryptjs";
import Usuario from "./user.model.js";
import { generarJWT } from "../helpers/generar-jwt.js"

export const usuariosPost = async (req, res) => {
    const { nombre, username, correo, password } = req.body;
    const usuario = new Usuario({ nombre, usuario: username, correo, password });

    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    await usuario.save();
    res.status(200).json({
        usuario
    });
}

export const usuariosLogin = async (req, res) => {
    const { user, password } = req.body;

    try {
        const usuario = await Usuario.findOne({ correo: user });
        const usuario2 = await Usuario.findOne({ usuario: user });

        if (!usuario && !usuario2) {
            return res.status(400).json({
                msg: 'Usuario no encontrado'
            });
        }

        if ((!usuario || !usuario.estado) && (!usuario2 || !usuario2.estado)) {
            return res.status(400).json({
                msg: 'Usuario borrado de la base de datos'
            })
        }

        let passwordValido = false;
        if (usuario) {
            passwordValido = bcryptjs.compareSync(password, usuario.password);
        } else if (usuario2) {
            passwordValido = bcryptjs.compareSync(password, usuario2.password);
        }

        if (!passwordValido) {
            return res.status(400).json({
                msg: 'Contraseña incorrecta'
            });
        }

        const token = await generarJWT(usuario ? usuario.id : usuario2.id);

        res.status(200).json({
            msg_1: 'Inicio de sesión exitoso',
            msg_2: 'Bienvenido ' + (usuario ? usuario.nombre : usuario2.nombre),
            msg_3: 'Este su token => ' + token,
        });

    } catch (e) {
        console.log(e);
        res.status(500).json({
            msg: 'Error inesperado'
        })
    }
}

export const usuariosPut = async (req, res) => {
    const { id } = req.params;
    const { _id, password, correo, ...resto } = req.body;
    const { contraseña } = req.body;

    if(!contraseña){
        return res.status(400).json({
            msg: 'Poner contraseña'
        });
    }

    const x = await Usuario.findById(id);

    const passwordValido = bcryptjs.compareSync(contraseña, x.password);

    if (!passwordValido) {
        return res.status(400).json({
            msg: 'Contraseña incorrecta'
        });
    }

    const usuarioso = await Usuario.findByIdAndUpdate(id, resto, { new: true });
    const nombre = usuarioso.nombre;
    const usua = usuarioso.usuario;

    res.status(200).json({
        msg: 'Tu usuario ha sido actualizado',
        nombre_nuevo: nombre,
        usuario_nuevo: usua
    });
}