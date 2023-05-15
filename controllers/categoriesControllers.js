const Category = require('../models/category');


module.exports ={


    async getAll(req, res, next){

        try{
            const data = await Category.getAll();
            return res.status(201).json(data);

        }catch(error){
            console.log(`Error ${error}`);
            return res.status(501).json({
                message:'Se produjo un error al cargar las categorias ',
                error: error,
                success: false
            })

        }
    },



    async create(req, res, next) {
        try{
            const category = req.body;
            console.log(`Categoria enviada ${category}`);

            const data = await Category.create(category);

            return res.status(201).json({
                message: 'Se creo correctamete la categoria',
                success: true,
                data: data.id
            })


        }catch(error){
            console.log(`Error: ${error}`);
            return res.status(501).json({
                message: 'Se produjo un error al crear la categoria',
                success: false,
                error: error

            })
        }
    }


}