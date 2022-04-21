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
const item_model_1 = require("../models/item.model");
const itemRoutes = (0, express_1.Router)();
// Metodo GET obtener un item por su id
itemRoutes.get('/search/:itemid', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    body._id = req.params.itemid;
    const items = yield item_model_1.Item
        .find(body).exec(); // Ejecuta
    // Respuesta
    res.json({
        ok: true,
        items
    });
}));
// Obtener todos los items 
itemRoutes.get('/all', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const items = yield item_model_1.Item
        .find() // Busca por id user
        .sort({ _id: -1 }) // Ordena
        .exec(); // Ejecuta
    // Respuesta    
    res.json({
        ok: true,
        items: items,
    });
}));
// Método GET para Obtener los items de una lista
itemRoutes.get('/:listid', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    body.list = req.params.listid;
    const items = yield item_model_1.Item
        .find(body) // Busca por id user
        .sort({ _id: -1 }) // Ordena
        .populate('list')
        .exec(); // Ejecuta
    // Respuesta
    res.json({
        ok: true,
        // page,
        items
    });
}));
// Método POST para crear items (item = Ejercicio)
itemRoutes.post('/:listid', (req, res) => {
    const body = req.body;
    body.list = req.params.listid;
    // Grabar en DB
    item_model_1.Item.create(body).then((itemDB) => __awaiter(void 0, void 0, void 0, function* () {
        yield itemDB.populate('list').execPopulate();
        res.json({
            ok: true,
            item: itemDB
        });
    })).catch(err => {
        res.json(err);
    });
});
// Metodo para borrar items por su ID
itemRoutes.delete('/delete/:itemid', (req, res) => {
    item_model_1.Item.findByIdAndRemove(req.params.itemid, req.body, (err, itemDB) => {
        if (err)
            throw err;
        if (!itemDB) {
            return res.json({
                ok: false,
                message: 'No existe un item con ese ID'
            });
        }
        res.json({
            ok: true,
            item: 'Item borrado con éxito'
        });
    });
});
// Método DELETE para BORRAR los items de una lista
itemRoutes.delete('/delete/items/:listid', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    body.list = req.params.listid;
    const items = yield item_model_1.Item
        .find(body)
        .remove()
        .exec();
    // Respuesta
    res.json({
        ok: true,
        // page,
        items
    });
}));
// Actualizar items
itemRoutes.post('/update/:listid/:itemid', (req, res) => {
    const item = {
        title: req.body.title || req.item.title,
        description: req.body.description || req.item.description,
        preparation: req.body.preparation || req.item.preparation,
        sets: req.body.sets || req.item.sets,
        time: req.body.time || req.item.time,
        restSets: req.body.restSets || req.item.restSets,
        repeats: req.body.repeats || req.item.repeats,
        restReps: req.body.restReps || req.item.restReps,
        totalTime: req.body.totalTime,
        list: req.params.listid
    };
    item_model_1.Item.findByIdAndUpdate(req.params.itemid, item, { new: true }, (err, itemDB) => {
        if (err)
            throw err;
        if (!itemDB) {
            return res.json({
                ok: false,
                message: 'No existe un item con ese ID'
            });
        }
        res.json({
            ok: true,
            item: 'Item actualizado con éxito'
        });
    });
});
exports.default = itemRoutes;
