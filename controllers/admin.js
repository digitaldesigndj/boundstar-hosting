var sys = require('sys')
var exec = require('child_process').exec;

/**
 * GET /admin
 * Admin page for selecting scripts to be run.
 */

exports.getAdmin = function(req, res) {
  res.render('admin', {
    title: 'Administer'
  });
};

/**
 * POST /admin
 * Runs Bash Scripts
 */

exports.postAdmin = function (req, res) {
  req.assert('script', 'Choose a script to run').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/admin');
  }

  var script = req.body.script;

  req.flash('success', { msg: 'You selected this script: ' + script });

  var command = 'cd ~; ls';
  if( script === 'restart' ) {
    command = 'bash ~/restart.sh';
  }
  if( script === 'backup' ) {
    command = 'bash ~/savespawn.sh';
  }

  exec(command, function (error, stdout, stderr) { 
    if (error !== null) {
      req.flash('errors', { msg: 'exec error: ' + error });
    }
    if (stderr !== '') {
      req.flash('errors', { msg: 'stderr: ' + stderr });
    }
    req.flash('success', { msg: 'stdout: ' + stdout });
    res.redirect('/admin');
  });
};