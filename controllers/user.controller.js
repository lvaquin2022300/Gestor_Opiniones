const { response } = require('express');
const bcryptjs = require('bcryptjs');
const User = require('../models/user');

const userPut = async (req, res) => {
    try {
        const { id } = req.params;
        const { _id, password, ...resto } = req.body;

        const usuarioAutenticado = req.usuario;
        const idCoincide = usuarioAutenticado._id.toString() === id;
        const tienePermiso = usuarioAutenticado.role === 'USER_ROLE';

        if (!idCoincide || !tienePermiso) {
            return res.status(403).json({
                msg: 'No tienes permiso para actualizar este usuario',
            });
        }

        // Verificar si la contraseña anterior fue proporcionada en la solicitud
        if (!password) {
            return res.status(400).json({
                msg: 'Debes proporcionar la contraseña anterior para actualizar',
            });
        }

        // Buscar el usuario por ID
        const usuario = await User.findById(id);
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario no encontrado',
            });
        }

        // Comparar la contraseña proporcionada con la almacenada en la base de datos
        const contrasenaValida = await bcryptjs.compare(password, usuario.password);
        if (!contrasenaValida) {
            return res.status(400).json({
                msg: 'La contraseña anterior no es válida',
            });
        }

        // Si la contraseña anterior es válida, actualizar el perfil con la nueva información
        const updatedUser = await User.findByIdAndUpdate(id, resto, { new: true });
        
        res.status(200).json({
            msg: 'Se actualizó el perfil correctamente',
            usuario: updatedUser,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Hable con el administrador',
        });
    }
};

module.exports = {
    userPut
};
