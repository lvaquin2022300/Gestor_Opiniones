const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');

const registrarse = async (req, res) => {
    const { nameUser, email, password, role } = req.body;
    const salt = bcryptjs.genSaltSync();
    const hashedPassword = bcryptjs.hashSync(password, salt);

    try {
        const usuario = await User.create({ nameUser, email, password: hashedPassword, role });
        res.status(200).json({ usuario });
    } catch (error) {
        console.error("Error al registrar usuario:", error);
        res.status(500).json({ msg: 'Error al registrar usuario, comuníquese con el administrador' });
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const usuario = await User.findOne({ email });

        if (!usuario || !usuario.estado) {
            return res.status(400).json({ msg: 'Credenciales inválidas' });
        }

        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({ msg: 'Credenciales inválidas' });
        }

        const token = await generarJWT(usuario.id);

        res.status(200).json({ msg: 'Inicio de sesión exitoso', usuario, token });
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        res.status(500).json({ msg: 'Error al iniciar sesión, comuníquese con el administrador' });
    }
}

module.exports = { registrarse, login };
