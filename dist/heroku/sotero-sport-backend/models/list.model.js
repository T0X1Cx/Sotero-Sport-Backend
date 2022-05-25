"use strict";
// Primero las importaciones
Object.defineProperty(exports, "__esModule", { value: true });
exports.List = void 0;
const mongoose_1 = require("mongoose");
// Creación de la instacia del esquema
const listSchema = new mongoose_1.Schema({
    // Fecha de creación
    // Se crea automaticamente
    created: {
        type: Date
    },
    // Si las listas están terminadas
    completed: {
        type: Boolean,
        default: false
    },
    // Los items que contendrá la lista
    // Es decir los ejercicios.
    items: [{
            type: String
        }],
    // Titulo de la lista
    // String en mayúsculas
    title: {
        type: String
    },
    //El usuario.
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Debe de existir una referencia a un usuario'] // Es requerido
    }
});
// Esto es para crear la fecha automaticamente
listSchema.pre('save', function (next) {
    this.created = new Date();
    next();
});
// Lo exportamos
exports.List = mongoose_1.model('List', listSchema);
