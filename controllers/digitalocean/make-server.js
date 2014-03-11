var secrets = require('../../config/secrets');
var DigitalOceanAPI = require('digitalocean-api');
var api = new DigitalOceanAPI(secrets.digitalocean.client_id, secrets.digitalocean.api_key);
var _ = require('underscore');

exports.getMakeServer = function (req, res) {
  // size_id 66 = 512MB
  api.imageGetAll(function (error, images){
    res.render('hosting/make/server', {
      'title': 'Spin Up A Server',
      'images': images
    });
  });
};

exports.postMakeServer = function (req, res) {
  // size_id 66 = 512MB
  // res.send( req.body );
  
  // Create Droplet

  api.dropletNew(
    req.body.name + '.boundstar.com',
    66,
    req.body.image,
    4,
    {'ssh_key_ids': '87061,69732'},
    function ( err, response ){
      if( err ) { res.send( err); }
      console.log( response );
      console.log( response.event_id );

      // Get Droplet Creation Event
      api.eventGet(response.event_id, function ( error, event ) {
        if( err ) { res.send( err ); }
        console.log( event );

        // Get Droplet Info
        api.dropletGetAll( function ( error, data ) {
          if( err ) { res.send( err ); }
          var new_server = _.findWhere( data, { name: req.body.name + '.boundstar.com' });
          console.log( new_server );

          // Create DNS Record
          api.domainRecordNew(
            '152674',
            'A',
            new_server.ip_address,
            { 'name': req.body.name },
            function ( err, domain_reponse ) {
              if( err ) { res.send( err ); }
              console.log( domain_reponse );
              req.flash('success', { msg: req.body.name + ' created at ' + new_server.ip_address + ', will be ready in ~5 Min ' });
              req.flash('success', { msg: JSON.stringify(event) });
              res.redirect('/hosting/event?id='+event.id);
            }
          );
        });

      }
    );

  });
};
