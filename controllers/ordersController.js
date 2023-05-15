const Order = require('../models/order');
const OrderHasProduct = require('../models/order_has_products');



module.exports = {

    async findByStatus(req, res, next){

        try{
            const status = req.params.status;
            const data = await Order.findByStatus(status);
            // console.log(`status ${JSON.stringify(data)}`);
            return res.status(201).json(data);

        }catch(error){
            console.log(`Error ${error}`);
            return res.status(501).json({
                message:'No se puedieron cargar las ordenes',
                error: error,
                success: false
            })

        }
    },
    async findByDeliveryAndStatus(req, res, next){

        try{
            const id_delivery = req.params.id_delivery;
            const status = req.params.status;
            const data = await Order.findByDeliveryAndStatus(id_delivery,status);
    
            return res.status(201).json(data);

        }catch(error){
            console.log(`Error ${error}`);
            return res.status(501).json({
                message:'No se puedieron cargar las ordenes',
                error: error,
                success: false
            })

        }
    },
    async findByClientAndStatus(req, res, next) {
        try {
            const id_client = req.params.idClient;
            const status = req.params.status;
            const data = await Order.findByClientAndStatus(id_client, status);
            return res.status(201).json(data);
        } catch(error) {
            console.log(`Error ${error}`);
            return res.status(501).json({
                message:'No se pudieron cargar las ordenes',
                error: error,
                success: false
            });
        }
    },
    



    async create(req,res,next){
        try {
                let order = req.body;
                order.status ='PAGADO';
                const data = await Order.create(order);


                //Recorre los productos de la orden
                for (const product of order.products){
                    await OrderHasProduct.create(data.id,product.id, product.quantify);

                }

                return res.status(201).json({
                    message:'la order se creo correctamente',
                    success: true,
                    data: data.id

                });
        } catch (error) {
            console.log(`Error ${error}`);
            return res.status(501).json({
                message:'se produjo un error al crear la orden',
                error: error,
                success: false
            });
        }
    },


    async updateToDispatched(req,res,next){
        try {
                let order = req.body;
               
                order.status ='DESPACHADO';
                const data = await Order.update(order);
                console.log(`Ordenes actualizadas ${JSON.stringify(data)}`);

                return res.status(201).json({
                    message:'la order se actualizo correctamente  ',
                    success: true,
                });

        } catch (error) {
            console.log(`Error ${error}`);
            return res.status(501).json({
                message:'se produjo un error al actualizar la orden',
                error: error,
                success: false
            });
        }
    },
    async updateToOnTheWay(req,res,next){
        try {
                let order = req.body;
               
                order.status ='EN CAMINO';
                const data = await Order.update(order);
                console.log(`Ordenes actualizadas ${JSON.stringify(data)}`);

                return res.status(201).json({
                    message:'la order se actualizo correctamente  ',
                    success: true,
                });

        } catch (error) {
            console.log(`Error ${error}`);
            return res.status(501).json({
                message:'se produjo un error al actualizar la orden',
                error: error,
                success: false
            });
        }
    },
    async updateTodelivery(req,res,next){
        try {
                let order = req.body;
               
                order.status ='ENTREGADO';
                const data = await Order.update(order);
                console.log(`Ordenes actualizadas ${JSON.stringify(data)}`);

                return res.status(201).json({
                    message:'la orden se actualizo correctamente  ',
                    success: true,
                });

        } catch (error) {
            console.log(`Error ${error}`);
            return res.status(501).json({
                message:'se produjo un error al actualizar la orden',
                error: error,
                success: false
            });
        }
    },

};

