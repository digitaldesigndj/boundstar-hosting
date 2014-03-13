var User = require('../models/User');

exports.gumroadWebhook = function( req, res ) {
  console.log( req.body );  
  console.log( req.header('host') );
  console.log( req.body['subdomain/username'] );
  console.log( 'bash blog.sh '+req.body['subdomain/username']+'.tdy721 com 3015');
  res.set('Content-Type', 'text/plain');
  return res.send("http://my.boundstar.com/account/credit/");
  // res.send("http://" + (req.header('host')) + "/?slug=THATROCKS" );
}

exports.createAccount = function( req, res ) {
  return res.send("Hello Person");
}
