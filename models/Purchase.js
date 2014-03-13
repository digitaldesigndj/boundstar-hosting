var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');

var purchaseSchema = new mongoose.Schema({
  // email: { type: String, unique: true },

  url_hash: { type: String, default: '', unique: true },

  email: { type: String, default: '' },
  permalink: { type: String, default: '' },
  price: { type: String, default: '' },
  currency: { type: String, default: '' },
  
  claimed: { type: Boolean, default: false },
  // Locked to email address of registerd user?
  locked: { type: Boolean, default: false },

  // If Confirmed by GumRoad
  seller_id: { type: String, default: '' },
  product_id: { type: String, default: '' },
  product_name: { type: String, default: '' },
  permalink: { type: String, default: '' },
  product_permalink: { type: String, default: '' },
  email: { type: String, default: '' },
  price: { type: String, default: '' },
  currency: { type: String, default: '' },
  order_number: { type: String, default: '' },

});

module.exports = mongoose.model('Purchase', purchaseSchema);
