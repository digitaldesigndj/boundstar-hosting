var fs = require('fs');
var request = require('request');
var _ = require('underscore');

var STARRYBOUND_PLAYERS_DIR = '/root/starbound/starrybound/players/';
var SERVER_STATUS_ENDPOINT = 'http://boundstar.com/status/server/status';

var url = '/upgrade';

/**
 * GET /upgrade
 * Upgrade player page
 */

exports.upgradeForm = function(req, res){
  res.render('upgrade', { title: 'Register' });
}

/**
 * POST /upgrade
 * Upgrades Starrybound players by placing them in a new group.
 */

exports.upgradePlayer = function ( req, res ) {
  req.assert('name', 'Name cannot be blank').notEmpty();
  var errors = req.validationErrors();
  if (errors) {
    req.flash('errors', errors);
    return res.redirect( url );
  }
  var name = req.body.name;
  var player_json = STARRYBOUND_PLAYERS_DIR + name.toLowerCase() + '.json';
  fs.exists( player_json, function (exists) {
    if ( exists ) {
      request( SERVER_STATUS_ENDPOINT, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          data = JSON.parse( body );
          if ( _.contains( data.playersOnline, name ) ) {
            req.flash('info', { msg: 'You need to logout before we can promote you.' });
            return res.redirect( url );
          } else {
            fs.readFile( player_json, 'utf8', function (err, contents) {
              if (err) { console.log('Error: ' + err); return; }
              player = JSON.parse(contents);
              player.groupName = "player";
              fs.writeFile( player_json, JSON.stringify(player, null, 4) , function(err) {
                if(err) { console.log(err); return; } 
                else {
                  req.flash('info', { msg: 'You\'re all set! Login and have fun!' });
                  return res.redirect( url );
                }
              }); 
            });
          }
        }
      });
    } else {
      req.flash('info', { msg: 'You need to login to the server at least once for this to work. Do that, logout and come back.' });
      return res.redirect( url );
    }
  });
}
