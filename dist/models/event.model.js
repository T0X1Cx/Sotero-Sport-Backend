"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = void 0;
// Primero las importaciones
const mongoose_1 = require("mongoose");
// Creamos la instancia de esquema
const eventSchema = new mongoose_1.Schema({
    title: {
        type: String
    },
    description: {
        type: String
    },
    startTime: {
        type: Date
    },
    endTime: {
        type: Date
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Debe de existir una referencia a un usuario'] // Es requerido
    }
});
// Lo exportamos
exports.Event = (0, mongoose_1.model)('Event', eventSchema);
