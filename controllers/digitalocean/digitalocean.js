var secrets = require('../config/secrets');
var DigitalOceanAPI = require('digitalocean-api');
var api = new DigitalOceanAPI(secrets.digitalocean.client_id, secrets.digitalocean.api_key);




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
