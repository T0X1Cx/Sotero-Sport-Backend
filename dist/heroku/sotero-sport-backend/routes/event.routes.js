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
const event_model_1 = require("../models/event.model");
const express_1 = require("express");
const authentication_1 = require("../middlewares/authentication");
const eventRoutes = express_1.Router();
// Obtener eventos
eventRoutes.get('/', [authentication_1.validateToken], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    body.user = req.user._id;
    const events = yield event_model_1.Event
        .find(body) // Busca por id user
        .sort({ _id: -1 }) // Ordena
        .exec(); // Ejecuta
    // Respuesta    
    res.json({
        ok: true,
        events,
    });
}));
// Crear eventos
eventRoutes.post('/', [authentication_1.validateToken], (req, res) => {
    // Inserción
    const body = req.body;
    body.user = req.user._id;
    body._id = req.body._id;
    // Grabar en la base de datos
    event_model_1.Event.create(body).then((eventDB) => __awaiter(void 0, void 0, void 0, function* () {
        yield eventDB.populate('user', '-password').execPopulate();
        res.json({
            ok: true,
            event: eventDB
        });
    })).catch(err => {
        res.json(err);
    });
});
// Metodo para borrar eventos por su ID
eventRoutes.delete('/delete/:eventid', (req, res) => {
    event_model_1.Event.findByIdAndRemove(req.params.eventid, req.body, (err, eventDB) => {
        if (err)
            throw err;
        if (!eventDB) {
            return res.json({
                ok: false,
                message: 'No existe un evento con ese ID'
            });
        }
        res.json({
            ok: true,
            event: 'Evento borrado con éxito'
        });
    });
});
// Actualizar Eventos
eventRoutes.post('/update/:eventid', (req, res) => {
    const event = {
        title: req.body.title || req.event.title,
        description: req.body.description || req.event.description,
        startTime: req.body.startTime || req.event.startTime,
        endTime: req.body.endTime || req.event.endTime
    };
    event_model_1.Event.findByIdAndUpdate(req.params.eventid, event, { new: true }, (err, eventDB) => {
        if (err)
            throw err;
        if (!eventDB) {
            return res.json({
                ok: false,
                message: 'No existe un evento con ese ID'
            });
        }
        res.json({
            ok: true,
            event: 'Evento actualizado con éxito'
        });
    });
});
// Obtener todos los eventos
eventRoutes.get('/all', [authentication_1.validateToken], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const events = yield event_model_1.Event
        .find()
        .sort({ _id: -1 })
        .exec();
    // Respuesta    
    res.json({
        ok: true,
        events: events,
    });
}));
exports.default = eventRoutes;
