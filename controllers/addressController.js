const Address = require('../models/address');



module.exports = {

    async findByUser(req, res, next){

        try{
            const id_user = req.params.id_user;
            const data = await Address.findByUser(id_user);
            return res.status(201).json(data);

        }catch(error){
            console.log(`Error ${error}`);
            return res.status(501).json({
                message:'Error al obtener las direcciones',
                error: error,
                success: false
            })

        }
    },


    async create(req,res,next){
        try {
                const address = req.body;
                const data = await Address.create(address);
                return res.status(201).json({
                    message:'la direccion se cargo de manera exitosa',
                    success: true,
                    data: data.id

                });
        } catch (error) {
            console.log(`Error ${error}`);
            return res.status(501).json({
                message:'Se produjo un error al cargar la dirección ',
                error: error,
                success: false
            });
        }
    }

};

