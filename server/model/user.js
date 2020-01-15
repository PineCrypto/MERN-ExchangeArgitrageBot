//model/comment.js

'use strict';

//import dependency
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var Schema = mongoose.Schema;

//create instance of mongoose.schema. Schema takes an object
//that shows the shape/structure of db entries

var UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: false
    },
    apiKeys: {
        type: String 
        //store encrypted object as apiKeys
        //decrypted: {
        //              exchange1: {apiKey: exchange1apikey, 
        //                          secret: exchange1apikeysecret}, 
        //              exchange2: {...},
        //              ...
        //            }
    },
    depositXRP: {
        bittrex: { type: String },
        bitfinex: { type: String },
        bitstamp: { type: String },
        hitbtc: { type: String },
        binance: { type: String },
        poloniex: { type: String },
        kraken: { type: String },
        exmo: { type: String },
        cexio: { type: String },
        gateio: { type: String }
    },
    role: {
        type: String,
        required: false
    },
    blocked: {
        type: Boolean,
        required: false
    },
    createdAt: {
        type: Date,
        required: false,
    },
    lastPayAt: {
        type: Date,
        required: false
    },
}, { runSettersOnQuery: true });

//export module to use in server.js
const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserByEmail = function (email, callback) {
    // User.update({email: "admin.tradegrp@outlook.com"},
    //     {"$set": { email: 'lowerat@outlook.de', blocked: false, role: 'admin'} }, {"multi": true},
    //     (err, writeResult) => {console.log('temp log ' + JSON.stringify(writeResult))});

    const query = { email: email };
    User.findOne(query, callback);
}

module.exports.getUserByToken = function (token, callback) {
    const query = { token: token };
    User.findOne(query, callback);
}

module.exports.addUser = function (newUser, callback) {
    if (!newUser.password) {
        newUser.save(callback);
        return;
    }
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save((err, callback));
        });
    });
}

module.exports.validatePassword = function (password, hash, callback) {
    // const query = {email: email};
    // const currUser = User.findOne(query, null);
    // if (currUser.password) {
    bcrypt.compare(password, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    });
    // }
}

module.exports.comparePassword = function (password, hash, callback) {
    bcrypt.compare(password, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    });
}

module.exports.editUser = function (modUser, newPassword, callback) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newPassword, salt, (err, hash) => {
            if (err) throw err;
            modUser.password = hash;
            modUser.save((err, callback));
        });
    });
}

module.exports.approveUser = function (modUser, flag, callback) {
    modUser.blocked = flag;
    if (flag) {
        modUser.lastPayAt = new Date();
    }
    modUser.save(callback);
}

module.exports.removeUser = function (modUser, callback) {
    modUser.save(callback);
}


