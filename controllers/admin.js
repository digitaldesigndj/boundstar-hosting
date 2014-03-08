/**
 * GET /
 * Home page.
 */

exports.getAdmin = function(req, res) {
  res.render('admin', {
    title: 'Administer'
  });
};

exports.postAdmin = function(req, res) {
  req.assert('script', 'Choose a script to run').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/admin');
  }

  var script = req.body.script;
  console.log( script );
  req.flash('success', { msg: 'You selected this script: ' + script });
  res.redirect('/admin');
};