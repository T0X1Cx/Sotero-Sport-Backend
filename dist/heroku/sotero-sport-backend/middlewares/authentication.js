"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateToken = void 0;
const token_1 = __importDefault(require("../classes/token"));
//el parametro next, es una función que cuando se invoca, ejecuta el middleware que sucede al middleware actual (Lo vi en un video de youtube)
const validateToken = (req, res, next) => {
    const userToken = req.get('x-token') || '';
    token_1.default.checkToken(userToken)
        .then((decoded) => {
        console.log('Decoded', decoded);
        req.user = decoded.user;
        next();
    })
        .catch(err => {
        res.json({
            ok: false,
            message: 'El token no es correcto'
        });
    });
};
exports.validateToken = validateToken;
