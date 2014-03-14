var passport = require('passport');
var _ = require('underscore');
var User = require('../models/User');
var fs = require('fs');

/**
 * GET /login
 * Login page.
 */

exports.getLogin = function(req, res) {
  if (req.user) return res.redirect('/');
  res.redirect('/auth/google');
};

/**
 * GET /logout
 * Log out.
 */

exports.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};

/**
 * GET /account
 * Profile page.
 */

exports.getAccount = function(req, res) {
  res.render('account/profile', {
    title: 'Account Management'
  });
};
