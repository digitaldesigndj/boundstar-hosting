var secrets = require('../config/secrets');
var nodemailer = require("nodemailer");
var smtpTransport = nodemailer.createTransport('SMTP', {
  service: 'Mailgun',
  auth: {
    user: secrets.mailgun.login,
    pass: secrets.mailgun.password
  }
});
var Purchase = require('../models/Purchase');
var crypto = require('crypto');

exports.gumroadWebhook = function( req, res ) {
  if (req.user) return res.redirect('/?todo=AccountFoundAndWillBeCreditedThanksPage');
  res.set('Content-Type', 'text/plain');
  return res.send("http://" + req.header('host') + "/signup?email="+req.body.email);
}

// var mailOptions = {
//   to: to,
//   from: 'tdy721@gmail.com',
//   subject: 'Thanks for your purchase',
//   text: 'You get server tokens!' // body + '\n\n' + name
// };

// smtpTransport.sendMail(mailOptions, function(err) {
//   if (err) {
//     req.flash('errors', { msg: err.message });
//     return res.redirect('/contact');
//   }
//   req.flash('success', { msg: 'Email has been sent successfully!' });
//   res.redirect('/contact');
// });

exports.gumroadPurchaseCallback = function( req, res ) {
  console.log( req.body );  
  if ( req.body.test ) {
    console.log( ' THIS IS A TEST ' );
  }
  if ( req.body.seller_id === secrets.gumroad.seller_id ) {
    // && req.body.test != 'true' ) {
    var hash = crypto.createHash('md5').update(JSON.stringify(req.body)+Math.random()).digest("hex");
    // This is a purchase 
    var purchase = new Purchase({
      url_hash: hash,
      seller_id: req.body.seller_id,
      product_id: req.body.product_id,
      product_name: req.body.product_name,
      permalink: req.body.permalink,
      product_permalink: req.body.product_permalink,
      email: req.body.email,
      price: req.body.price,
      currency: req.body.currency,
      order_number: req.body.order_number,
    });

    // if( Find User with  req.body.email )
    // Credit Now
    // purchase.claimed = true;
    // Send an email
    // else 
    // full_name: req.body.full_name || ''    

    purchase.save(function(err) {
      if (err) { return err; }
        console.log( 'purchase saved' );
        res.send('ok');
      /// return res.send("http://" + req.header('host') + "/account/credit/" + hash);
    });
  }
  else {
    return res.send("go away, seller_id did not match.");
  }
}
