var secrets = require('../../config/secrets');
var DigitalOceanAPI = require('digitalocean-api');
var api = new DigitalOceanAPI(secrets.digitalocean.client_id, secrets.digitalocean.api_key);
// var _ = require('underscore');
var User = require('../../models/User');

exports.getMakeServer = function (req, res) {
  // size_id 66 = 512MB
  api.imageGetAll(function (error, images){
    res.render('hosting/make/server', {
      'title': 'Spin Up A Server',
      'tagline': 'Ha-Ha! Just kidding, they\'re SSD!',
      'images': images
    });
  });
};

exports.postMakeServer = function (req, res) {
  console.log( "Creating Server");
  // size_id 66 = 512MB, 62 = 2GB
  console.log( req.body );
  // res.send( req.body );
  var image = '2629230';
  // Create Droplet
  // Cant start new server!
  if( req.user.server.image !== '' ) { image = req.user.server.image; }
  api.dropletNew( user.profile.domain + '.boundstar.com', 62, image, 4, {'ssh_key_ids': '87061,69732,93888'}, function ( err, response ){
    if( err ) { res.send( err ); }
    // console.log( response );
    api.eventGet(response.event_id, function ( error, event ) {
      if( err ) { res.send( err ); }
      // console.log( event );
      // console.log( event.droplet_id );
      api.dropletGet( event.droplet_id, function (err, droplet) {
        if( err ) { res.send( err ); }
        console.log( droplet );
        req.user.server.id = droplet.id || '';
        // req.user.server.token = req.body.token || '';
        // Subtract a token for spinning up the server
        req.user.server.tokens = req.user.server.tokens - 1;
        req.user.server.image = req.body.image || '2629230';
        req.user.server.size = droplet.size_id || '';
        req.user.server.host_name = droplet.name || '';
        req.user.server.ip_address = droplet.ip_address || '';
        req.user.server.snapshots = JSON.stringify(droplet.snapshots) || '';
        user.save(function (err) {
          if (err) return next(err);
          req.flash('success', { msg: 'Profile information updated.' });
          res.redirect('/server');
        });
      });
    });
    // Create DNS Record
    // For Later
    // api.domainRecordNew( '152674', 'A', new_server.ip_address, { 'name': req.body.name }, function ( err, domain_reponse ) {
    //   if( err ) { res.send( err ); }
    //   console.log( domain_reponse );
    //   req.flash('success', { msg: req.body.name + ' created at ' + new_server.ip_address + ', will be ready in ~5 Min ' });
    //   req.flash('success', { msg: JSON.stringify(event) });
    //   res.redirect('/hosting/event?id='+event.id);
    // });

    // Get Droplet Info
    // api.dropletGetAll( function ( error, data ) {
    //   if( err ) { res.send( err ); }
    //   var new_server = _.findWhere( data, { name: req.body.name + '.boundstar.com' });
    //   console.log( new_server );
  });
};
