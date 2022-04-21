import { Response, Request, NextFunction } from 'express'
import { decodedTextSpanIntersectsWith } from 'typescript';
import Token from '../classes/token';

//el parametro next, es una función que cuando se invoca, ejecuta el middleware que sucede al middleware actual (Lo vi en un video de youtube)
export const validateToken = (req: any, res: Response, next: NextFunction ) => {

    const userToken = req.get('x-token') || '';

    Token.checkToken(userToken)
        .then((decoded: any) => {

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

}

