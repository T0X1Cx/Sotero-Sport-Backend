"use strict";
// Modelo de items 
// Seran los ejercicios de los usuarios
Object.defineProperty(exports, "__esModule", { value: true });
exports.Item = void 0;
const mongoose_1 = require("mongoose");
const itemSchema = new mongoose_1.Schema({
    // Título del ejercicio
    title: {
        type: String
    },
    // Descripción del ejercicio
    description: {
        type: String
    },
    // Fecha de creación
    created: {
        type: Date
    },
    // Si esta terminado o no
    completed: {
        type: Boolean,
        default: false
    },
    // Tiempo de preparación 
    preparation: {
        type: Number,
    },
    // Número de series
    sets: {
        type: Number,
    },
    // Tiempo del ejercicio
    time: {
        type: Number,
    },
    // Descanso entre series
    restSets: {
        type: Number,
    },
    // Número de repeticiones
    repeats: {
        type: Number,
    },
    // Descanso entre repeticiones
    restReps: {
        type: Number,
    },
    // Tiempo total (lo que dura el ejercicio completo)
    totalTime: {
        type: Number,
    },
    list: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'List',
        required: [true, 'Debe existir una referencia a una lista']
    }
});
itemSchema.pre('save', function (next) {
    this.created = new Date();
    next();
});
exports.Item = mongoose_1.model('Item', itemSchema);
