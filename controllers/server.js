var secrets = require('../config/secrets');
var DigitalOceanAPI = require('digitalocean-api');
var api = new DigitalOceanAPI(secrets.digitalocean.client_id, secrets.digitalocean.api_key);
var _ = require('underscore');
var _ = require('underscore');
var User = require('../models/User');

exports.getServer = function(req, res) {
  // Droplet
  // console.log( req.user.server.id );
  if( req.user.server.id != '' ) {
    api.dropletGet( req.user.server.id , function (err, droplet) {
      if (err) return err;
      var droplet = droplet;
      // console.log( droplet );
      User.findById(req.user.id, function (err, user) {
        if (err) return next(err);
        if( droplet.snapshots != '' ) {
          user.server.image = _.last( droplet.snapshots ).id;
        }
        user.server.id = droplet.id;
        user.save(function (err) {
          if (err) return next(err);
          // req.flash('success', { msg: 'Server information updated.' });
          res.render('account/server', {
            title: 'Server Management',
            droplet: droplet
          });
        });
      });
    });
  }
  else{
    res.render('account/server', {
      title: 'Server Management',
      droplet: false
    });
  }
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

      // user.server.id = req.body.id || '';
      // user.server.image = req.body.image || '';
      // user.server.image = _.last( droplet.snapshots ).id;
      // user.server.id = droplet.id;
      // user.server.id = droplet.id || '';
      // user.server.token = req.body.token || '';
      // user.server.image = req.body.image || '';
      // user.server.size = droplet.size_id || '';
      // user.server.host_name = droplet.name || '';
      // user.server.ip_address = droplet.ip_address || '';
      // user.server.snapshots = JSON.stringify(droplet.snapshots) || '';

      user.save(function (err) {
        if (err) return next(err);
        // req.flash('success', { msg: 'Profile information updated.' });
        res.redirect('server');
      });
    });
  });
};


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
