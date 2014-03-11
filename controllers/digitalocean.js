var secrets = require('../config/secrets');
var DigitalOceanAPI = require('digitalocean-api');
var api = new DigitalOceanAPI(secrets.digitalocean.client_id, secrets.digitalocean.api_key);
var _ = require('underscore');
/**
 * GET /admin
 * Admin page for selecting scripts to be run.
 */

exports.getIndex = function (req, res) {
  // Get things done
  api.dropletGetAll(function (error, data){
    res.render('hosting/index', {
      'title': 'Server Admin',
      'droplets': data
    });
  });
};

exports.getServers = function (req, res) {
  // Get things done
  api.dropletGetAll(function (error, data){
    res.render('hosting/servers', {
      'title': 'Servers',
      'droplets': data
    });
  });
};

exports.getImages = function (req, res) {
  // Get things done
  api.imageGetAll(function (error, images){
    res.render('hosting/images', {
      'title': 'Server Images',
      'images': images
    });
  });
};

exports.getDomains = function (req, res) {
  // Get things done
  api.domainGetAll(function(error, data){
    res.render('hosting/domains', {
      'title': 'Domains',
      'domains': data
    });
  });
};

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
  api.dropletNew( req.body.name + '.boundstar.com', 66, req.body.image, 4, {'ssh_key_ids': '87061,69732'}, function ( err, response ){
    if( err ) { res.send( err); }
    console.log( response );
    api.dropletGetAll( function ( error, data) {
      if( err ) { res.send( err ); }
      var new_server = _.findWhere( data, { name: req.body.name + '.boundstar.com' });
      console.log( new_server );
      api.domainRecordNew( '152674', 'A', new_server.ip_address, {'name': req.body.name}, function ( err, domain_reponse ) {
        if( err ) { res.send( err ); }
        console.log( domain_reponse );
        req.flash('success', { msg: req.body.name + ' created at ' + new_server.ip_address + ', will be ready in ~5 Min ' });
        res.redirect('/hosting/servers');
      });
    });
  });
};

exports.getMakeImage = function (req, res) {
  // size_id 66 = 512MB
  api.imageGetAll(function (error, images){
    res.render('hosting/make/image', {
      'title': 'Make a new image',
      'images': images
    });
  });
};

exports.postMakeImage = function (req, res) {
  // size_id 66 = 512MB, 1 is ny1
  // api.dropletNew( name+'.boundstar.com', 66, req.body.image, 1, {'ssh_key_ids': '87061,69732'}, function( err, response ){
  //   res.send( response );
  // });
  res.send( req );
};


/**
 * POST /admin
 * Runs Bash Scripts
 */

exports.newDroplet = function (req, res) {
  // size_id 66 = 512MB
  
  api.dropletNew( name+'.boundstar.com', 66, imageId, 1, {'ssh_key_ids': '87061,69732'}, function( err, response ){
    // {
    //   "status": "OK",
    //   "droplet": {
    //       "id": 100824,
    //       "name": "test",
    //       "image_id": 419,
    //       "size_id": 32,
    //       "event_id": 7499
    //   }
    // }
  });
  
};
