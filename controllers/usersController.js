const { getAll, create } = require('../models/user');
const User = require('../models/user');
const Rol = require('../models/rol');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const  storage  = require('../utils/cloud_storage');

module.exports = {

    async getAll(req,res,next){
        try{
            const data = await User.getAll();
            console.log(`Usuarios: ${data}`);
            return res.status(201).json(data);
        }
        catch(error){
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Error al obtener los usuarios'
            });
        }
    },

    async findById(req,res,next){
        try{

            const id = req.params.id;

            const data = await User.findByUserId(id);
            console.log(`Usuario: ${data}`);
            return res.status(201).json(data);
        }
        catch(error){
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Error al obtener el usuario'
            });
        }
    },


    async register(req,res,next){
        try{
           
            const user = req.body;
            const data = await User.create(user);

            await Rol.create(data.id, 1) //Rol por defecto Cliente 

            return res.status(201).json({
                success:true,
                message:'El registro se realizo correctamente',
                data:data.id

            })
        }
        catch(error){
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Error al registrar el usuario',
                error:error
            })
        }
    },

    async registerWithImage(req,res,next){
        try{
           
            const user = JSON.parse(req.body.user);
            console.log(`Datos enviados del usuario: ${user}`);
            const files = req.files;

            if (files.length > 0){
                const pathImage = `image_${Date.now}`;
                const url = await storage(files[0],pathImage);

                if (url != undefined && url != null){
                    user.image =url;
                }
            }
            const data = await User.create(user);

            await Rol.create(data.id, 1) //Rol por defecto Cliente 

            return res.status(201).json({
                success:true,
                message:'El registro se realizo correctamente',
                data:data.id

            })
        }
        catch(error){
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Error al registrar el usuario',
                error:error
            })
        }
    },


    async update(req,res,next){
        try{
           
            const user = JSON.parse(req.body.user);
            console.log(`Datos enviados del usuario: ${user}`);
            const files = req.files;

            if (files.length > 0){
                const pathImage = `image_${Date.now}`;
                const url = await storage(files[0],pathImage);

                if (url != undefined && url != null){
                    user.image =url;
                }
            }
            await User.update(user);

            return res.status(201).json({
                success:true,
                message:'Los Datos fueron actualizados correctamente',
               

            })
        }
        catch(error){
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Error al actualizar el usuario',
                error:error
            })
        }
    },

    async login(req,res,next){
        try {
            const email = req.body.email;
            const password = req.body.password
            const myUser = await User.findByEmail(email);
            if(!myUser){
                return res.status(401).json({
                    success:false,
                    message:'El usuario no fue encontrado en la base de datos'
                });
            }

            if(User.isPasswordMatched(password, myUser.password)){
                const token = jwt.sign({id:myUser.id,email:myUser.email}, keys.secretOrKey,{
                    expiresIn: (60*60*24) //el token expira cada Hora
                    // expiresIn: (60*1) //el token expira cada Hora
                });
                const data = {
                    id: myUser.id,
                    name:myUser.name,
                    lastname:myUser.lastname,
                    email:myUser.email,
                    phone:myUser.phone,
                    image:myUser.image,
                    session_token:`JWT ${token}`,
                    roles:myUser.roles
                }
                await User.updateToken(myUser.id, `JWT ${token}`);

                console.log(`USUARIO LOGUEADO : ${data}`);
               
                return res.status(201).json({
                    success: true,
                    data:data,
                    message:'El usuario se autentico correctamente',
                    
                })

               
            }
            else{
                return res.status(401).json({
                    success:false,
                    message:'La contraseña es incorrecta',
                   

                })
            }
            
        } catch (error) {
            console.log(`Error:  ${error}`);
            return res.status(501).json({
                success: false,
                message:'Error al realizar login',
                error: error
            })
        }
    },


    async logout(req,res,next){

        try{
            const id = req.body.id;
            await User.updateToken(id, null);
            return res.status(201).json({
                success: true,
                message:'La sesión del usuario se ha cerrado correctamente'
            });

        }
        catch(e){
            console.log(`Error:  ${error}`);
            return res.status(501).json({
                success: false,
                message:'Error al cerrar sesión',
                error: error
            });
        }
    }
};