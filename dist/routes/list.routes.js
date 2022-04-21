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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authentication_1 = require("../middlewares/authentication");
const list_model_1 = require("../models/list.model");
const listRoutes = (0, express_1.Router)();
// Obtener las listas del usuario logeado: mediante su token y su id
listRoutes.get('/', [authentication_1.validateToken], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let page = Number(req.query.page) || 1;
    let skip = page - 1;
    skip = skip * 15;
    const body = req.body;
    body.user = req.user._id;
    const lists = yield list_model_1.List
        .find(body) // Busca por id user
        .sort({ _id: -1 }) // Ordena
        .skip(skip) // Paginación
        .limit(15) // Muestra solo 10    
        .exec(); // Ejecuta
    // Respuesta    
    res.json({
        ok: true,
        page,
        lists,
    });
}));
// Obtener todas las listas 
listRoutes.get('/all', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const lists = yield list_model_1.List
        .find() // Busca por id user
        .sort({ _id: -1 }) // Ordena
        .exec(); // Ejecuta
    // Respuesta    
    res.json({
        ok: true,
        lists: lists,
    });
}));
// Crear Listas ----------------------------------------------------
listRoutes.post('/', [authentication_1.validateToken], (req, res) => {
    // Inserción
    // Con el body parser obtenemos toda la información que la persona manda
    const body = req.body;
    body.user = req.user._id;
    body._id = req.body._id;
    // Grabar en la base de datos
    list_model_1.List.create(body).then((listDB) => __awaiter(void 0, void 0, void 0, function* () {
        // Aqui el registro ya se ha creado en la DB
        // ---------------------------------------------------------------
        // Esto llena el usuario con toda su información
        // El -password no muestra la contraseña
        yield listDB.populate('user', '-password').execPopulate();
        res.json({
            ok: true,
            list: listDB
        });
    })).catch(err => {
        res.json(err);
    });
});
// Actualizar listas
listRoutes.post('/update/:listid', (req, res) => {
    const list = {
        title: req.body.title || req.item.title,
    };
    list_model_1.List.findByIdAndUpdate(req.params.listid, list, { new: true }, (err, listDB) => {
        if (err)
            throw err;
        if (!listDB) {
            return res.json({
                ok: false,
                message: 'No existe una lista con ese ID'
            });
        }
        res.json({
            ok: true,
            item: 'Lista actualizada con éxito'
        });
    });
});
// Borrar Listas por su ID
listRoutes.delete('/delete/:listid', (req, res) => {
    list_model_1.List.findByIdAndRemove(req.params.listid, req.body, (err, listDB) => {
        if (err)
            throw err;
        if (!listDB) {
            return res.json({
                ok: false,
                message: 'No existe una lista con ese ID'
            });
        }
        res.json({
            ok: true,
            item: 'Lista borrada con éxito'
        });
    });
});
exports.default = listRoutes;
