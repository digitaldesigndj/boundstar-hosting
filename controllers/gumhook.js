// var User = require('../models/User');
var crypto = require('crypto');
exports.gumroadWebhook = function( req, res ) {
  var hash = crypto.createHash('md5').update(1).digest("hex");
  console.log( req.body );  
  console.log( req.header('host') );
  console.log( req.body['subdomain/username'] );
  console.log( 'bash blog.sh '+req.body['subdomain/username']+'.tdy721 com 3015');


  res.set('Content-Type', 'text/plain');
  return res.send("http://my.boundstar.com/account/credit/" + hash);
  // res.send("http://" + (req.header('host')) + "/?slug=THATROCKS" );
}

/**
 * GET /account/credit/:hash
 * Unlink OAuth2 provider from the current user.
 * @param provider
 * @param id - User ObjectId
 */

// This page contains your credits

exports.createAccount = function( req, res, next ) {
  var provider = req.params.provider;
  return res.send( "Hello Person: " + provider );
});
