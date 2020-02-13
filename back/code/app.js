let express = require('express');
const normalize = require('normalize-path');
let path = require('path');
let cookieParser = require('cookie-parser');
let morgan = require('morgan');
let session = require('express-session');
const MemoryStore = require('memorystore')(session);

//dos contextos uno para pas y otro para alumnos
const contextPath1 = normalize(process.env.CONTEXT1);
exports.contextPath1 = contextPath1;
const contextPath2 = normalize(process.env.CONTEXT2);
exports.contextPath2 = contextPath2;

const local = process.env.DEV;
exports.local = local;


//cas autentication
let CASAuthentication = require('cas-authentication');
// Create a new instance of CASAuthentication.
let service = process.env.SERVICE;
let cas_url = process.env.CAS;

let cas = new CASAuthentication({
  cas_url: cas_url,
  //local o despliegue
  service_url: service,
  cas_version: '3.0',
  renew: false,
  is_dev_mode: true,
  dev_mode_user: '',
  dev_mode_info: {},
  session_name: 'cas_user',
  session_info: 'cas_userinfo',
  destroy_session: true//me borra la sesión al hacer el logout
});



//instanciacion 
let app = express();
//rutas requeridas
let routerPas = require('./routes/routerPas');
let routerAlumno = require('./routes/routerAlumno');
let models = require('./models');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//solo te imprime las peticiones incorrectas
app.use(morgan('combined', {
  skip: function (req, res) { return res.statusCode < 400 }
}))

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Set up an Express session with MemoryStore to avoid memory leaks.
app.use(session({
  cookie: { maxAge: 6 * 60 * 60 * 1000 }, //6h
  store: new MemoryStore({
    checkPeriod: 6 * 60 * 60 * 1000, // prune expired entries every 6h
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));


// autologout
//El cas es el encargado de eliminar la sesión
app.get(path.join(contextPath1, 'logout'), cas.logout);
app.get(path.join(contextPath2, 'logout'), cas.logout);


/**
 * OTRO MIDDLEWARE - Para ambos contextos
 * Este es para añadir a las variables req parametros necesarios en posteriores middlewares
 * 
 */
if (process.env.DEV == 'true') {
  /**
   * modelo dev. Se debe configurar en fichero .env el email y password particular
   * Será ese mail el sender y el receiver.
   * Sólo entorno dev, no usar en producción ni en pruebas
   * No usa la api nodos de finalización ni el servidor de mailing 
   * Usa datos inventados
   * Está preparado para usar el servidor de desarrollo de react
  */
  app.use(function (req, res, next) {
    req.session.user = {}
    req.session.user.employeetype = "FA"
    req.session.user.irispersonaluniqueid = "123456789D"
    req.session.user.sn = "FERNANDEZ FERNANDEZ"
    req.session.user.cn = "FERNANDO"
    //se debe sobrescribir con el texto correspondiente en el router del trámite
    res.locals.barraInicioText="TRÁMITE";
    res.locals.session = req.session;
    res.locals.portalName='portal'
    //se envía y se recibe en el propio mail del usuario de pruebas
    req.session.user.mail = process.env.EMAIL_USER;
    next();
  })
} else {
  //obliga a pasar por el cas. Tambien en pruebas pq estará en el host27
  app.use(cas.bounce, function (req, res, next) {
    /**
     * Si no es pruebas. Se debe configurar en fichero .env el servidor mailing de la aplicación
     * y la api de nodos de finalización (habilitados por ip)
     * Será ese mail el sender
     * El receiver será el correspondiente en cada caso (pas/alumno)
     * Usa la api nodos de finalización 
     * Datos reales
     * Debe usar el bundle.js
    */
    if (process.env.PRUEBAS == 'true') {
      /**
     * modelo pruebas. Se debe configurar en fichero .env el servidor mailing de la aplicación (habilitados por ip)
     * Será ese mail el sender
     * El receiver será en todos los casos el usuario autenticado
     * No usa la api nodos de finalización 
     * Usa datos inventados
     * Debe usar el bundle.js
    */
      req.session.user.employeetype = "FA"
      req.session.user.irispersonaluniqueid = "123456789D"
      req.session.user.sn = "FERNANDEZ FERNANDEZ"
      req.session.user.cn = "FERNANDO" 
      res.locals.portalName='pruebas';
    } else {
      res.locals.portalName='portal';
    }
       // Hacer visible req.session en las vistas
    //se debe sobrescribir con el texto correspondiente en el router del trámite
    res.locals.barraInicioText="TRÁMITE";
    res.locals.session = req.session;
    next();
  });
}


//static
app.use(contextPath1, express.static(path.join(__dirname, 'public')));
app.use(contextPath2, express.static(path.join(__dirname, 'public')));

//separa ente los dos contextPath disponibles
app.use(contextPath1, function (req, res, next) {
  res.locals.context = contextPath1;
  next();
});

app.use(contextPath2, function (req, res, next) {
  res.locals.context = contextPath2
  next();
})


// Rutas para cada contextPath
app.use(contextPath1, routerPas);
// Rutas para cada contextPath
app.use(contextPath2, routerAlumno);


// catch 404 and forward to error handler
app.use(function (req, res, next) {

  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  console.log(err)
  res.locals.message = err.message;
  res.locals.error = process.env.DEV === 'true' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error')
});

module.exports = app;