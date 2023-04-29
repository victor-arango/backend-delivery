const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const logger = require('morgan');
const cors = require('cors');
const multer = require('multer');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const passport = require('passport');
const session = require('express-session'); // Importa el paquete express-session

/**
 * INICIALIZAR FIREBASE
 */

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const upload = multer({
  storage: multer.memoryStorage()
});

/**
 * Rutas
 */

const users = require('./routes/usersRoutes');
const categories = require('./routes/categoryRoutes');
const products = require('./routes/productsRoutes');

const port = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use(cors());
app.disable('x-powered-by');

// Agrega el middleware express-session
app.use(
  session({
    secret: 'tu_clave_secreta_aquí',
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

app.set('port', port);

// Llamado de las rutas.
users(app, upload);
categories(app);
products(app, upload);

server.listen(3000, '192.168.1.16' || 'localhost', function () {
  console.log('se inicio la aplicacion de manera correcta ' + port + ' se inicio...');
});


//Manejo de error 

app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).send(err.stack);
});

module.exports = {
  app: app,
  server: server
};

