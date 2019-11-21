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
  session_info: 'user',
  destroy_session: true//me borra la sesión al hacer el logout
});



//instanciacion 
let app = express();
//rutas requeridas
let routerPas = require('./routes/routerPas');
let routerApiPas = require('./routes/routerApiPas');
let routerAlumno = require('./routes/routerAlumno');
let routerApiAlumno = require('./routes/routerApiAlumno');
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
  app.use(function (req, res, next) {
    req.session.user = {}
    req.session.user.employeetype = "FA"
    req.session.user.irispersonaluniqueid ="123456789D"
    req.session.user.sn = "FERNANDEZ FERNANDEZ"
    req.session.user.cn = "FERNANDO"
    res.locals.session = req.session;
    next();
  })
} else {
  app.use(cas.bounce, function (req, res, next) {
    // Hacer visible req.session en las vistas
    //modelo de pruebas
    if (process.env.PRUEBAS == 'true'){
      req.session.user.employeetype = "FA"
      req.session.user.irispersonaluniqueid ="123456789D"
      req.session.user.sn = "FERNANDEZ FERNANDEZ"
      req.session.user.cn = "FERNANDO"
    }
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

// Rutas que no empiezan por /api/
app.use(path.join(contextPath1, 'api'), routerApiPas);
// Rutas que no empiezan por /api/
app.use(path.join(contextPath2, 'api'), routerApiAlumno);

// Rutas que no empiezan por /api/
app.use(contextPath1, routerPas);
// Rutas que no empiezan por /api/
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