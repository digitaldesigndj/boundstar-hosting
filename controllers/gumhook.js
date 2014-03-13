var secrets = require('../config/secrets');
var crypto = require('crypto');
var nodemailer = require("nodemailer");
var smtpTransport = nodemailer.createTransport('SMTP', {
  service: 'Mailgun',
  auth: {
    user: secrets.mailgun.login,
    pass: secrets.mailgun.password
  }
});
var Purchase = require('../models/Purchase');
var User = require('../models/User');


exports.gumroadWebhook = function( req, res ) {
  if (req.user) return res.redirect('/?todo=AccountFoundAndWillBeCreditedThanksPage');
  res.set('Content-Type', 'text/plain');
  return res.send("http://" + req.header('host') + "/signup?email="+req.body.email);
}

exports.purchase = function( req, res ) {
  Purchase.findOne({ url_hash: req.params.hash }, function(err, purchase) {
    if (err) return next(err);
    if( purchase != null ) {
      console.log( purchase );
      console.log( purchase.claimed );
      if( purchase.claimed ) {
        res.send('This purchased has been redeemed to ' + purchase.email + '. Thanks!');
      }
      else{
        User.findById(req.user.id, function (err, user) {
          if (err) return next(err);
          // Round to tenths
          // Give 10 Tokens
          user.server.tokens = (Math.round(10*user.server.tokens)/10)+10;
          user.save(function (err) {
            if (err) return next(err);
            purchase.claimed = true;
            purchase.save(function(err) {
              if (err) { return err; }
              console.log( 'purchase claimed' );
              req.flash('default', { msg: 'Redeemed tokens to account' + purchase.email + '. Thanks!'});
              res.redirect('/server');
            });
          });
        });
      }
    }
    else {
      res.send( 'Can\'t find it...' );
    }
  });
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
    // && req.body.test != 'true' ) { ??

    // User.findById(req.user.id, function (err, user) {
    //   if (err) return next(err);
    //   var stats = {};
    //   console.log( user.server.tokens );
    // });
    
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
      test: req.body.test || false
    });

    // User.findOne({ email: req.body.email }, function(err, user) {
    //   if( err ) {

    //   }
    //   else{
    //     console.log(user);  
    //   }
    // });

    // if( Find User with  req.body.email )
    // Credit Now
    // purchase.claimed = true;
    // Send an email
    // else 
    // full_name: req.body.full_name || ''    

    console.log( purchase );

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
