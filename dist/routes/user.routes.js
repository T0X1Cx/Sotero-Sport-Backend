"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Imports
const express_1 = require("express");
const user_model_1 = require("../models/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_1 = __importDefault(require("../classes/token"));
const authentication_1 = require("../middlewares/authentication");
const userRoutes = express_1.Router();
// Login de usuario
userRoutes.post('/login', (req, res) => {
    // extraer la info del post
    const body = req.body;
    user_model_1.User.findOne({ email: body.email }, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: 'Usuario/contraseña incorrecta'
            });
        }
        if (userDB.comparePassword(body.password)) {
            const tokenUser = token_1.default.getJWebToken({
                _id: userDB._id,
                name: userDB.name,
                email: userDB.email,
                role: userDB.role,
                avatar: userDB.avatar
            });
            res.json({
                ok: true,
                id: userDB._id,
                token: tokenUser,
                role: req.body.role,
                user: userDB
            });
        }
        else {
            return res.json({
                ok: false,
                mensaje: 'Usuario/contraseña incorrecta ***'
            });
        }
    });
});
userRoutes.post('/login/admin', (req, res) => {
    // extraer la info del post
    const body = req.body;
    user_model_1.User.findOne({ email: body.email }, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: 'Usuario/contraseña incorrecta'
            });
        }
        //!!!!Aqui solo podrá iniciar sesión si el usuario y contraseña es correcto y tiene el rol admin!!!!
        if (userDB.comparePassword(body.password) && userDB.role) {
            const tokenUser = token_1.default.getJWebToken({
                _id: userDB._id,
                name: userDB.name,
                email: userDB.email,
                role: userDB.role,
                avatar: userDB.avatar
            });
            res.json({
                ok: true,
                id: userDB._id,
                token: tokenUser,
                role: userDB.role,
                user: userDB
            });
        }
        else {
            return res.json({
                ok: false,
                mensaje: 'Usuario/contraseña incorrecta ***'
            });
        }
    });
});
// Crear un usuario
userRoutes.post('/create', (req, res) => {
    // extraer la info del post
    const user = {
        name: req.body.name,
        email: req.body.email,
        password: bcrypt_1.default.hashSync(req.body.password, 10),
        role: req.body.role,
        avatar: req.body.avatar
    };
    user_model_1.User.create(user).then(userDB => {
        const tokenUser = token_1.default.getJWebToken({
            _id: userDB._id,
            name: userDB.name,
            email: userDB.email,
            role: userDB.role,
            avatar: userDB.avatar
        });
        res.json({
            ok: true,
            token: tokenUser
        });
    }).catch(err => {
        res.json({
            ok: false,
            err
        });
    });
});
// Actualizar usuario
userRoutes.post('/update', authentication_1.validateToken, (req, res) => {
    const user = {
        name: req.body.name || req.user.name,
        email: req.body.email || req.user.email,
        role: req.body.role || req.user.role,
        avatar: req.body.avatar || req.user.avatar
    };
    user_model_1.User.findByIdAndUpdate(req.user._id, user, { new: true }, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                message: 'No existe un usuario con ese ID'
            });
        }
        const tokenUser = token_1.default.getJWebToken({
            _id: userDB._id,
            name: userDB.name,
            email: userDB.email,
            role: userDB.role,
            avatar: userDB.avatar
        });
        res.json({
            ok: true,
            token: tokenUser
        });
    });
});
// Actualizar usuarios en Sotero Sport Admin
userRoutes.post('/update/:userid', [authentication_1.validateToken], (req, res) => {
    const user = {
        name: req.body.name || req.user.name,
        email: req.body.email || req.user.email,
        password: bcrypt_1.default.hashSync(req.body.password, 10) || req.user.password,
        role: req.body.role || req.user.role,
        avatar: req.body.avatar || req.user.avatar
    };
    user_model_1.User.findByIdAndUpdate(req.params.userid, user, { new: true }, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                message: 'No existe un usuario con ese ID'
            });
        }
        res.json({
            ok: true,
            user: 'Usuario actualizado con éxito'
        });
    });
});
userRoutes.get('/', [authentication_1.validateToken], (req, res) => {
    const user = req.user;
    res.json({
        ok: true,
        user
    });
});
// Obtener todos los usuarios 
userRoutes.get('/all', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.User
        .find() // Busca por id user
        .sort({ _id: -1 }) // Ordena
        .exec(); // Ejecuta
    // Respuesta    
    res.json({
        ok: true,
        users,
    });
}));
// Metodo para borrar usuario por su ID
userRoutes.delete('/delete/:userid', (req, res) => {
    user_model_1.User.findByIdAndRemove(req.params.userid, req.body, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                message: 'No existe un usuario con ese ID'
            });
        }
        res.json({
            ok: true,
            user: 'Usuario borrado con éxito'
        });
    });
});
exports.default = userRoutes;
