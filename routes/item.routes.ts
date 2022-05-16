import { Router, Response } from 'express'
import { Item } from '../models/item.model';

const itemRoutes = Router();

// Metodo GET obtener un item por su id

itemRoutes.get('/search/:itemid', async (req: any, res: Response) => {

    const body = req.body;
    body._id = req.params.itemid;
    const items = await Item

        .find(body).exec();              // Ejecuta

    // Respuesta
    res.json({
        ok: true,
        items
    });

});


// Obtener todos los items 

itemRoutes.get('/all', async (req: any, res: Response) => {

    const items = await Item
        .find()           // Busca por id user
        .sort({ _id: -1 })    // Ordena
        .exec()               // Ejecuta

    // Respuesta    
    res.json({
        ok: true,
        items: items,

    });

});


// Método GET para Obtener los items de una lista

itemRoutes.get('/:listid', async (req: any, res: Response) => {

    const body = req.body;
    body.list = req.params.listid;

    const items = await Item
        .find(body)           // Busca por id user
        .sort({ _id: -1 })    // Ordena
        .populate('list')
        .exec()               // Ejecuta

    // Respuesta
    res.json({
        ok: true,
        // page,
        items
    });

});

// Método POST para crear items (item = Ejercicio)

itemRoutes.post('/:listid', (req: any, res: Response) => {

    const body = req.body;
    body.list = req.params.listid;

    // Grabar en DB
    Item.create(body).then(async itemDB => {
    
        await itemDB.populate('list').execPopulate();

        res.json({
            ok: true,
            item: itemDB
        });

    }).catch(err => {
        res.json(err)
    });

});


// Metodo para borrar items por su ID

itemRoutes.delete('/delete/:itemid', (req: any, res: Response) => {

    Item.findByIdAndRemove(req.params.itemid, req.body, (err, itemDB) => {

        if (err) throw err;

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

itemRoutes.delete('/delete/items/:listid', async (req: any, res: Response) => {

    const body = req.body;
    body.list = req.params.listid;

    const items = await Item
        .find(body)
        .remove()
        .exec()

    // Respuesta
    res.json({
        ok: true,
        // page,
        items
    });

});



// Actualizar items
itemRoutes.post('/update/:listid/:itemid', (req: any, res: Response) => {

    let item = {

            
    }

    if(req.item){

            item = {
            title: req.item.title,
            description: req.item.description,
            preparation: req.item.preparation,
            sets: req.item.sets,
            time: req.item.time,
            restSets: req.item.restSets,
            repeats: req.item.repeats,
            restReps: req.item.restReps,
            totalTime: req.body.totalTime,
            list: req.params.listid
        }
    }else{

            item = {
            title: req.body.title,
            description: req.body.description,
            preparation: req.body.preparation,
            sets: req.body.sets,
            time: req.body.time,
            restSets: req.body.restSets,
            repeats: req.body.repeats,
            restReps: req.body.restReps,
            totalTime: req.body.totalTime,
            list: req.params.listid
        }

    }

    

    Item.findOneAndUpdate(req.params.itemid, item, { new: true }, (err, itemDB) => {

        if (err){
            console.log(err);
            return res.json({
                ok: false,
                message: err
            });
            
        };

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


export default itemRoutes;