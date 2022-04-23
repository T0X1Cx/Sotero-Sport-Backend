// Imports
import Server from "./classes/server";
import mongoose from 'mongoose'
import bodyparser from 'body-parser'
import cors from 'cors'

import userRoutes from './routes/user.routes';
import listRoutes from './routes/list.routes';
import itemRoutes from './routes/item.routes';
import eventRoutes from "./routes/event.routes";

const server = new Server();


// Body parser (Esto es para que el Content-Type de la aplicación solo sea urlencode y json)
server.app.use(bodyparser.urlencoded({ extended: true }));
server.app.use(bodyparser.json());


// Cors (Esto es para que no tengamos problemas con el acceso CORS y no fallen algunas peticiones)
server.app.use(cors({ origin: true, credentials: true }));


// Rutas de la app
server.app.use('/user', userRoutes);
server.app.use('/lists', listRoutes);
server.app.use('/items', itemRoutes);
server.app.use('/events', eventRoutes);


// Conexión BD
mongoose.connect('mongodb+srv://usuario:root@soterosportdb.5xnrm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    { useNewUrlParser: true, useCreateIndex: true }, (err) => {

        if (err) throw err;
        console.log('Base de datos Online');

    })


//datos del puerto del env. | en caso de no tenerlo establece por defecto el puerto 3000
let listenPort = process.env.PORT || 3000;

server.app.listen(listenPort, () => {
    console.log("Servidor funcionando en puerto: " + listenPort);
})
