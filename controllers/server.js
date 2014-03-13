var secrets = require('../config/secrets');
var DigitalOceanAPI = require('digitalocean-api');
var api = new DigitalOceanAPI(secrets.digitalocean.client_id, secrets.digitalocean.api_key);
var _ = require('underscore');
var User = require('../models/User');

exports.getServer = function(req, res) {
  // Droplet

  User.findById(req.user.id, function (err, user) {
    if (err) return next(err);
    var stats = {};
    console.log( user.server.tokens );

    var used_tokens = user.server.billed_seconds/3600;
    stats.life = 0;
    stats.spent = 0;

    stats.tokens = stats.spent + ( - used_tokens ) + parseInt(user.server.tokens);
    if( user.server.id != '' ) {
      // User has a server
      api.dropletGet( user.server.id , function (err, droplet) {
        if (err) return err;
        var stats = {};
        var current_time = new Date().getTime()/1000
        var created_time = new Date(droplet.created_at).getTime()/1000
        stats.life = current_time - created_time;
        stats.spent = ( stats.life/3600 ) + 1;
        stats.tokens = stats.spent + used_tokens;
        if( droplet.snapshots !== [] ) {
          user.server.image = _.last( droplet.snapshots ).id;
        }
        console.log( droplet.snapshots );
        // user.server.image = 2629230;
        user.server.tokens = -1;
        user.save(function (err) {
          if (err) return err;
          // req.flash('success', { msg: 'Server information updated.' });
          res.render('account/server', {
            title: 'Server Management',
            droplet: droplet,
            stats: stats
          });
        });
      });
    }
    else{
      // user.server.tokens = -1;
      // user.save(function (err) {
      //   if (err) return err;
        res.render('account/server', {
          title: 'Server Management',
          droplet: false,
          stats: stats
        });
      // });
    }
  });
};

/**
 * POST /account/profile
 * Update profile information.
 */



exports.postUpdateServer = function(req, res, next) {
  User.findById(req.user.id, function (err, user) {
    if (err) return next(err);
    console.log( req.body );
    api.dropletGet( req.body.id, function (err, droplet) {
      user.server.id = droplet.id || '';
      user.server.token = req.body.token || '';
      user.save(function (err) {
        if (err) return next(err);
        // req.flash('success', { msg: 'Profile information updated.' });
        res.redirect('server');
      });
    });
  });
};

// // Admins only

// exports.postUpdateServer = function(req, res, next) {
//   // Droplet
//   dropletGet(id, function (err, droplet) {
//     if (err) return next(err);
//     console.log( droplet );

//     User.findById(req.user.id, function (err, user) {
//       if (err) return next(err);
//       // user.email = req.body.email || '';
//       // user.profile.name = req.body.name || '';
//       // user.profile.player = req.body.player || '';
//       // user.profile.steam = req.body.steam || '';
//       // user.profile.gender = req.body.gender || '';
//       // user.profile.location = req.body.location || '';
//       // user.profile.website = req.body.website || '';

//       user.server.token = req.body.token || '';
//       user.server.size = req.body.size || '';
//       user.server.host_name = req.body.host_name || '';
//       user.server.ip_address = req.body.ip_address || '';
//       user.server.id = req.body.id || '';
//       user.server.latest_image = req.body.latest_image || '';
//       user.server.parent_image = req.body.parent_image || '';

//       user.save(function (err) {
//         if (err) return next(err);
//         req.flash('success', { msg: 'Profile information updated.' });
//         res.redirect('server');
//       });
//     });
//   });
// };
