var secrets = require('../../config/secrets');
var DigitalOceanAPI = require('digitalocean-api');
var api = new DigitalOceanAPI(secrets.digitalocean.client_id, secrets.digitalocean.api_key);

var _ = require('underscore');
var User = require('../../models/User');

exports.dropletPowerCycle = function(req, res) {
  console.log( req.user.server.id );
  api.dropletPowerCycle( req.user.server.id, function(err, event){
    if (err) return err;
    req.flash('success', { msg: JSON.stringify(event) + " - your event is processing, refresh the page in 10 seconds" });
    res.redirect('/server');
    // res.redirect('/hosting/event?id='+event);
  });
};

exports.dropletShutdown = function(req, res) {
  console.log( req.user.server.id );
  api.dropletShutdown( req.user.server.id, function(err, event){
    if (err) return err;
    req.flash('success', { msg: JSON.stringify(event) + " - your event is processing, refresh the page in 10 seconds" });
    res.redirect('/server');
    // res.redirect('/hosting/event?id='+event);
  });
};

exports.dropletPowerOff = function(req, res) {
  console.log( req.user.server.id );
  api.dropletPowerOff( req.user.server.id, function(err, event){
    if (err) return err;
    req.flash('success', { msg: JSON.stringify(event) + " - your event is processing, refresh the page in 10 seconds" });
    res.redirect('/server');
    // res.redirect('/hosting/event?id='+event);
  });
};

exports.dropletPowerOn = function(req, res) {
  console.log( req.user.server.id );
  api.dropletPowerOn( req.user.server.id, function(err, event){
    if (err) return err;
    req.flash('success', { msg: JSON.stringify(event) + " - your event is processing, refresh the page in 10 seconds" });
    res.redirect('/server');
    // res.redirect('/hosting/event?id='+event);
  });
};

exports.dropletSnapshot = function(req, res) {
  User.findById(req.user.id, function (err, user) {
    if (err) return next(err);
    api.dropletSnapshot( user.server.id, { name: user.profile.name }, function (err, event_id) {
      if (err) return err;
      api.eventGet(event_id, function ( error, event ) {
        req.flash('success', { msg: JSON.stringify(event) + " - your event is processing, this usually takes about 10 min." });
        console.log( event );
        res.redirect( '/server' );
        // res.redirect('/hosting/event?id='+event_id);
      });
    });
  });
};

// exports.dropletRestore = function(req, res) {
//   console.log( req.user.server.image );

//   // api.dropletRestore( req.user.server.id, req.user.server.image, function(err, event){
//   //   if (err) return err;
//   //   req.flash('success', { msg: JSON.stringify(event) + " - your event is processing, refresh the page in 10 seconds" });
//   //   res.redirect('/server');
//   //   // res.redirect('/hosting/event?id='+event);
//   // });
// };

exports.dropletRebuild = function(req, res) {
  console.log( req.user.server.id );
  api.dropletRebuild( req.user.server.id, function(err, event){
    if (err) return err;
    req.flash('success', { msg: JSON.stringify(event) + " - your event is processing, refresh the page in 10 seconds" });
    res.redirect('/server');
    // res.redirect('/hosting/event?id='+event);
  });
};

exports.dropletDestroy = function(req, res) {
  User.findById(req.user.id, function (err, user) {
    if (err) return next(err);
    api.dropletDestroy( user.server.id, function (err, event) {
      if (err) return err;
      user.server.id = '';
      user.save(function (err) {
        if (err) return next(err);
        req.flash('warning', { msg: "SERVER DESTROYED" });
        res.redirect('/server');
      });
    });
  });
};

exports.selectImage = function (req, res) {
  // size_id 66 = 512MB
  api.imageGetAll(function (error, images) {
    res.render('hosting/make/server', {
      'title': 'Rebuild',
      'tagline': 'Pick an Image to rebuild from',
      'images': images
    });
  });
};
