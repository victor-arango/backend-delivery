const db = require('../config/config');

const Category ={};


Category.getAll = () =>{

    const sql =`
        SELECT
            id,
            name,
            description
        FROM    
            categories
            ORDER BY 
            name
    `;
    return db.manyOrNone(sql);
}


Category.create =(Category) =>{
    const sql =`
        INSERT INTO
        categories(
            name,
            description,
            created_at,
            update_at
        )
        VALUES($1,$2,$3,$4) RETURNING id
    `;
    return db.oneOrNone(sql,[
        Category.name,
        Category.description,
        new Date(),
        new Date()
    ])
}



module.exports = Category;