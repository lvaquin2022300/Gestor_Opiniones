import jwt from 'jsonwebtoken'
import Usuario from "../user/user.model.js"

export const validarJWT = async (req, res, next) => {
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      msg: "No hay token en la petición",
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    const usuario = await Usuario.findById(uid);
    if (!usuario) {
      return res.status(401).json({
        msg: "Usuario no existe en la base de datos",
      });
    }
    if (!usuario.estado) {
      return res.status(401).json({
        msg: "Token no válido - usuario con estado:false",
      });
    }

    req.usuario = usuario;

    next();
  } catch (e) {
    console.log(e),
      res.status(401).json({
        msg: "Token no válido",
      });
  }
};

export const validarUsuario = async (req, res, next) => {
  try {
    const { correo } = req.body;
    const token = req.header("x-token");

    if (!token) {
      return res.status(401).json({
        msg: "No hay token en el encabezado",
      });
    }

    if (!correo) {
      return res.status(401).json({
        msg: "Por favor colocar el correo del usuario en el cuerpo de la petición",
      });
    }

    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    const user = await Usuario.findById(uid);
    if (!user) {
      return res.status(401).json({
        msg: "Usuario no existe en la base de datos",
      });
    }
    if (!user.estado) {
      return res.status(401).json({
        msg: "Token no válido - usuario con estado:false",
      });
    }
    if (user.correo !== correo) {
      return res.status(400).json({
        msg: 'El correo asignado no coincide con el token proporcionado'
      })
    }

    next();
  } catch (e) {
    console.log(e),
      res.status(401).json({
        msg: "Token no válido",
      });
  }
}