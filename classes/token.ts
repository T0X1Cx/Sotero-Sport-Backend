import JWebToken from 'jsonwebtoken'


export default class Token {

    //Esta va a ser mi configuración para la semilla del token y el tiempo de vida del token
    private static seed: string = 'esta-es-la-semilla-para-firmar-mis-tokens';
    private static expiration: string = '30d';

    constructor() { }

    //Esta funcion genera el JWT
    static getJWebToken(payload: any): string {
        return JWebToken.sign({
            user: payload
        }, this.seed, { expiresIn: this.expiration });

    }

    //Funcion que realiza la verificación del token JWT
    static checkToken(userToken: string) {

        return new Promise((resolve, reject) => {

            JWebToken.verify(userToken, this.seed, (err, decoded) => {

                if (err) {
                    reject();
                } else {
                    resolve(decoded);
                }


            })

        });
    }

}