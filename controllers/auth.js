const { response, request } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario'); 
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async (req = request, res = response) => {

    const {name, email, password } = req.body;
    
    try {
        const correoExiste = await Usuario.findOne({ email });
        	//console.log("ola");
        if (correoExiste) {
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario ya existe con ese correo'
            });
        }

        usuario = new Usuario({name, email, password});

        //Encriptar password
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);


        //Guardar en DB
        await usuario.save();

        //Generar JWT
        const token = await generarJWT(usuario.id, usuario.name);

        res.status(201).json({
            ok: true,
            msg: 'Registro',
            uid: usuario.id,
            name: usuario.name,
            token
        })
    
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }
    

}

const loginUsuario = async (req = response, res = response) => {
    const { email, password } = req.body

    try {

        const usuario = await Usuario.findOne({ email });

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario no existe con ese email'
            });
        }

        //Confirmar los passwords
        const validPassword = bcrypt.compareSync(password, usuario.password);

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            });
        }

        //Generar JWT
        const token = await generarJWT(usuario.id, usuario.name);

        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }


}

const revalidarToken = async(req = request, res = response) => {

    const { uid, name } = req;

    //generar un nuevo JWT y retornarlo en este petición
    //Generar JWT
    const token = await generarJWT(uid, name);

    res.json({
        ok: true,
        msg: 'token',
        uid, name,
        token
    });
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}