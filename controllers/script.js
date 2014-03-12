var sys = require('sys');
var fs = require('fs')
var exec = require('child_process').exec;
var starboundConfig = require('../config/starbound');
var User = require('../models/User');


/**
 * POST /admin
 * Runs Bash Scripts
 */


exports.postScript = function (req, res) {
  //req.body.script
  //req.body.ip_address
  //perhaps req.body.password

  req.assert('script', 'BAD BAD BAD BAD NO! Choose a script to run').notEmpty();
  var errors = req.validationErrors();
  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/server');
  }

  var command = 'cd ~; ls';
  var script = req.body.script;

  req.flash('success', { msg: 'You selected this script: ' + script });

  if( script === 'restart' ) {
    command = "bash /root/my/scripts/remote.sh root@" + req.body.ip_address + " 'service starbound restart'";
    console.log( command );
    exec(command, function (error, stdout, stderr) { 
      if (error !== null) {
        req.flash('errors', { msg: 'exec error: ' + error });
      }
      if (stderr !== '') {
        req.flash('errors', { msg: 'stderr: ' + stderr });
      }
      req.flash('success', { msg: 'stdout: ' + stdout });
      res.redirect('/server');
    });
  }
  if( script === 'password' ) {
    starboundConfig.serverPasswords = [req.body.password];
    console.log( starboundConfig )

    fs.writeFileSync('/root/my/scripts/starbound.config', JSON.stringify( starboundConfig , null, 2 ) );
    command = 'scp /root/my/scripts/starbound.config root@' + req.body.ip_address + ':/root/starbound/starbound.config;bash /root/my/scripts/remote.sh root@' + req.body.ip_address + " 'service starbound restart'";
    User.findById( req.user.id, function (err, user) {
      if (err) return next(err);
      user.server.password = req.body.password || '';
      user.save(function (err) {
        if (err) return next(err);
        exec(command, function (error, stdout, stderr) { 
          if (error !== null) {
            req.flash('errors', { msg: 'exec error: ' + error });
          }
          if (stderr !== '') {
            req.flash('errors', { msg: 'stderr: ' + stderr });
          }
          req.flash('success', { msg: 'stdout: ' + stdout });
          res.redirect('/server');
        });
      });
    });
  }


  if( req.body.password != '' ) {
    
  }else{

  }
};
