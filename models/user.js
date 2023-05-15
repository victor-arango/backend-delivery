const db = require('../config/config');
const crypto = require('crypto');

const User = {};

//Obtiene todos los usuarios 

User.getAll = () =>{
    const sql = `SELECT * FROM users`;
    return db.manyOrNone(sql);
}
//obtiene un usuario por ID


User.findById = (id, callback) =>{
    const sql =`SELECT 
    id,
    email,
    name,
    lastname,
    image,
    phone,
    password,
    session_token
    FROM
        users
    WHERE id = $1
    `;

    return db.oneOrNone(sql,id).then(user=>{callback(null,user);});

}

//Encuentra el usuario por Id
User.findByUserId = (id) =>{
    const sql =`SELECT 
    u.id,
    u.email,
    u.name,
    u.lastname,
    u.image,
    u.phone,
    u.password,
    u.session_token,
	json_agg(
		json_build_object(
		'id', R.id,
		'name', R.name,
		'image', R.image,
		'route', R.route
		)
	) AS roles
    FROM
        users as U
	INNER JOIN	
		user_has_roles as UHR
	ON
	UHR.id_user = U.id
	
	INNER JOIN
	roles AS R
	ON
	R.id = UHR.id_rol
	
    WHERE U.id = $1
	
	GROUP BY 
		U.id
    `;
    return db.oneOrNone(sql, id);
}

User.findByDeliveryMen= () =>{
    const sql =`
    SELECT 
    u.id,
    u.email,
    u.name,
    u.lastname,
    u.image,
    u.phone,
    u.password,
    u.session_token
    FROM
        users as u
    INNER JOIN 
        user_has_roles AS UHR
    ON
    UHR .id_user = u.id
    INNER JOIN 
        roles AS R
    ON
        R.id= UHR.id_rol
    WHERE
        R.id = 3 

    `;
    return db.manyOrNone(sql);
}



//Consulta el correo 

User.findByEmail = (email) =>{
    const sql =`SELECT 
    u.id,
    u.email,
    u.name,
    u.lastname,
    u.image,
    u.phone,
    u.password,
    u.session_token,
	json_agg(
		json_build_object(
		'id', R.id,
		'name', R.name,
		'image', R.image,
		'route', R.route
		)
	) AS roles
    FROM
        users as U
	INNER JOIN	
		user_has_roles as UHR
	ON
	UHR.id_user = U.id
	
	INNER JOIN
	roles AS R
	ON
	R.id = UHR.id_rol
	
    WHERE U.email = $1
	
	GROUP BY 
		U.id
    `;
    return db.oneOrNone(sql, email);
}



// crea un nuevo usuario 

User.create = (user) =>{

    const myPasswordHashed = crypto.createHash('md5').update(user.password).digest('hex');
    user.password = myPasswordHashed;

    const sql = `
    INSERT INTO users(
        email,name,lastname,phone,image,password,created_at,update_at
    )
    VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id
    `;

    return db.oneOrNone(sql,[
       user.email,
       user.name,
       user.lastname,
       user.phone,
       user.image,
       user.password,
       new Date(),
       new Date()
    ]);
    
}

User.update = (user) =>{
    const sql = `
    UPDATE 
        users
    SET
        name      = $2,
        lastname  = $3,
        phone     = $4,
        image     = $5,
        update_at =$6
    WHERE
        id = $1
    `; 


    return db.none(sql, [
        user.id,
        user.name,
        user.lastname,
        user.phone,
        user.image,
        new Date()
    ])
}
User.updateToken = (id,token) =>{
    const sql = `
    UPDATE 
        users
    SET
        session_token = $2
       
    WHERE
        id = $1
    `; 


    return db.none(sql, [
       id,
       token
        
    ])
}


User.isPasswordMatched = (userPassword, hash) =>{
    const myPasswordHashed = crypto.createHash('md5').update(userPassword).digest('hex');
    if(myPasswordHashed === hash){
        return true;
    }
    return false;
}


module.exports = User;