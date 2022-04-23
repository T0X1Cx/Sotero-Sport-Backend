"use strict";
var __importDefault = (this && this.__importDefault) || function(mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Imports
const server_1 = __importDefault(require("./classes/server"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const list_routes_1 = __importDefault(require("./routes/list.routes"));
const item_routes_1 = __importDefault(require("./routes/item.routes"));
const event_routes_1 = __importDefault(require("./routes/event.routes"));
const server = new server_1.default();
// Body parser (Esto es para que el Content-Type de la aplicación solo sea urlencode y json)
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
// Cors (Esto es para que no tengamos problemas con el acceso CORS y no fallen algunas peticiones)
server.app.use((0, cors_1.default)({ origin: true, credentials: true }));
// Rutas de la app
server.app.use('/user', user_routes_1.default);
server.app.use('/lists', list_routes_1.default);
server.app.use('/items', item_routes_1.default);
server.app.use('/events', event_routes_1.default);
// Conexión BD
mongoose_1.default.connect('mongodb+srv://usuario:root@soterosportdb.5xnrm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', { useNewUrlParser: true, useCreateIndex: true }, (err) => {
    if (err)
        throw err;
    console.log('Base de datos Online');
});
//datos del puerto del env. | en caso de no tenerlo establece por defecto el puerto 3000
let listenPort = process.env.PORT || 3000;
server.app.listen(listenPort, () => {
    console.log("Servidor funcionando en puerto: " + listenPort);
});