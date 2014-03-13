/**
 * Module dependencies.
 */

var express = require('express');
var MongoStore = require('connect-mongo')(express);
var flash = require('express-flash');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var expressValidator = require('express-validator');
var connectAssets = require('connect-assets');
// var request = require('request');
// var fs = require('fs');
// var _ = require('underscore');

/**
 * Load controllers.
 */

var homeController = require('./controllers/home');
var userController = require('./controllers/user');
var contactController = require('./controllers/contact');
var forgotController = require('./controllers/forgot');
var resetController = require('./controllers/reset');

var claimController  = require('./controllers/claim');
var adminController  = require('./controllers/admin');
var gumhookController = require('./controllers/gumhook');

var scriptController  = require('./controllers/script');
// var digitalOceanController  = require('./controllers/digitalocean/digitalocean');
var doEvents  = require('./controllers/digitalocean/events');
var doInfo  = require('./controllers/digitalocean/info');
var doMakeServer  = require('./controllers/digitalocean/make-server');
var doMakeImage  = require('./controllers/digitalocean/make-image');
var doManageServer  = require('./controllers/digitalocean/manage-server');

var serverController  = require('./controllers/server');

/**
 * API keys + Passport configuration.
 */

var secrets = require('./config/secrets');
var passportConf = require('./config/passport');

/**
 * Create Express server.
 */

var app = express();

/**
 * Mongoose configuration.
 */

mongoose.connect(secrets.db);
mongoose.connection.on('error', function() {
  console.error('✗ MongoDB Connection Error. Please make sure MongoDB is running.');
});

/**
 * Express configuration.
 */

var hour = 3600000;
var day = (hour * 24);
var week = (day * 7);
var month = (day * 30);

app.set('port', process.env.MYPORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(connectAssets({
  paths: ['public/css', 'public/js'],
  helperContext: app.locals
}));
app.use(express.compress());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.json());
app.use(express.urlencoded());
app.use(expressValidator());
app.use(express.methodOverride());
app.use(express.session({
  secret: secrets.sessionSecret,
  store: new MongoStore({
    db: mongoose.connection.db,
    auto_reconnect: true
  })
}));
// app.use(express.csrf());

app.use(function (req, res, next) {
  var whitelist = [
    '/secret'
  ];
  if (req.method !== 'POST') {
    next();
  }
  if (whitelist.indexOf(req.url) !== -1) {
    next();
  } else {
    express.csrf()(req, res, next);
  }
});

app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  res.locals.user = req.user;
  // res.locals.token = req.csrfToken();
  res.locals.secrets = secrets;
  next();
});
app.use(flash());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public'), { maxAge: week }));
app.use(function(req, res) {
  res.status(404);
  res.render('404');
});
app.use(express.errorHandler());


app.post('/secret', gumhookController.gumroadWebhook);
app.get('/account/credit/', gumhookController.createAccount);


// Starbound Stuff

app.get( '/claim', passportConf.isAuthenticated, claimController.claimForm );
app.post( '/claim', passportConf.isAuthenticated, claimController.claimPlayer );

app.get( '/admin', passportConf.isAdmin, adminController.getAdmin );
app.post( '/admin', passportConf.isAdmin, adminController.postAdmin );

// Digital Ocean Info Pages
app.get( '/hosting', passportConf.isAdmin, doInfo.getIndex );
app.get( '/hosting/servers', passportConf.isAdmin, doInfo.getServers );
app.get( '/hosting/images', passportConf.isAdmin, doInfo.getImages );
app.get( '/hosting/domains', passportConf.isAdmin, doInfo.getDomains );

// Digital Ocean Events Pages
app.get( '/hosting/event', passportConf.isAdmin, doEvents.getEvent );
app.get( '/hosting/event/json', passportConf.isAdmin, doEvents.getEventJson );

// Digital Ocean Creation Pages
app.get( '/hosting/make/image', passportConf.isAdmin, doMakeImage.getMakeImage );
app.post( '/hosting/make/image', passportConf.isAdmin, doMakeImage.postMakeImage );
app.get( '/hosting/make/server', passportConf.isAdmin, doMakeServer.getMakeServer );
app.post( '/hosting/make/server', passportConf.isAdmin, doMakeServer.postMakeServer );
app.post( '/server/restore', passportConf.isAdmin, doMakeServer.postMakeServer );

// app.post( '/hosting/make/event', passportConf.isAdmin, digitalOceanController.postEvent );

app.get('/server', passportConf.isAuthenticated, serverController.getServer);
// app.post('/server', passportConf.isAuthenticated, serverController.postUpdateServer);




// Server Manager Event Pages
app.post('/server/runscript', passportConf.isAuthenticated, scriptController.postScript);

app.get('/server/powercycle', passportConf.isAuthenticated, doManageServer.dropletPowerCycle);
app.get('/server/shutdown', passportConf.isAuthenticated, doManageServer.dropletShutdown);
app.get('/server/poweroff', passportConf.isAuthenticated, doManageServer.dropletPowerOff);
app.get('/server/poweron', passportConf.isAuthenticated, doManageServer.dropletPowerOn);

// app.get('/server/snapshot', passportConf.isAuthenticated, doManageServer.dropletSnapshot);
app.post('/server/snapshot', passportConf.isAuthenticated, doManageServer.dropletSnapshot);
// app.get('/server/restore', passportConf.isAuthenticated, doManageServer.dropletRestore);
// app.post('/server/rebuild', passportConf.isAuthenticated, doManageServer.dropletRestore);
app.get('/server/rebuild', passportConf.isAuthenticated, doManageServer.selectImage);
// app.post('/server/rebuild', passportConf.isAuthenticated, doManageServer.dropletRebuild);
app.get('/server/destroy', passportConf.isAuthenticated, doManageServer.dropletDestroy);

/**
 * Application routes.
 */

app.get('/', homeController.index);
app.get('/login', userController.getLogin);
app.post('/login', userController.postLogin);
app.get('/logout', userController.logout);
app.get('/forgot', forgotController.getForgot);
app.post('/forgot', forgotController.postForgot);
app.get('/reset/:token', resetController.getReset);
app.post('/reset/:token', resetController.postReset);
app.get('/signup', userController.getSignup);
app.post('/signup', userController.postSignup);
app.get('/contact', contactController.getContact);
app.post('/contact', contactController.postContact);
app.get('/account', passportConf.isAuthenticated, userController.getAccount);
app.post('/account/profile', passportConf.isAuthenticated, userController.postUpdateProfile);
app.post('/account/password', passportConf.isAuthenticated, userController.postUpdatePassword);
app.post('/account/delete', passportConf.isAuthenticated, userController.postDeleteAccount);
app.get('/account/unlink/:provider', passportConf.isAuthenticated, userController.getOauthUnlink);

/**
 * OAuth routes for sign-in.
 */

app.get('/auth/google', passport.authenticate('google', { scope: 'profile email' }));
app.get('/auth/google/callback', passport.authenticate('google', { successRedirect: '/', failureRedirect: '/login' }));


/**
 * Start Express server.
 */

app.listen(app.get('port'), function() {
  console.log("✔ Express server listening on port %d in %s mode", app.get('port'), app.settings.env);
});
