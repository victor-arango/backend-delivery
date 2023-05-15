const db = require('../config/config');

const OrderHasProduct ={};





OrderHasProduct.create = (id_order, id_product, quantify)=>{
    const sql = `
        INSERT INTO
            order_has_products(
                id_order,
                id_product,
                quantify,
                created_at,
                update_at
            )
        VALUES($1,$2,$3,$4,$5) 
    `;

    return db.none(sql,[
        id_order,
        id_product,
        quantify,
        new Date(),
        new Date()
    ])
}


module.exports = OrderHasProduct;