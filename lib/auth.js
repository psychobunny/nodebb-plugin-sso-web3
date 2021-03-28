'use strict';

const passport = require.main.require('passport');

const Web3Strategy = require('passport-dapp-web3');
const db = require.main.require('./src/database');
const meta = require.main.require('./src/meta');
const user = require.main.require('./src/user');

const auth = {};

auth.init = () => {
	passport.use(new Web3Strategy(onAuth));
};

const onAuth = (address, message, signature, cb) => {
	db.getObjectField('web3:address:uid', address, (err, uid) => {
		if (err) { return cb(err); }
		if (uid) { return cb(null, { uid: uid }); }

		if (meta.settings.disableRegistration == 'on') {
			return cb('[[error:sso-registration-disabled, Web3]]');
		}

		user.create({ username: address }, async (err, uid) => {
			if (err) { return cb(err); }

			await user.setUserField(uid, 'web3:address', address);
			await db.setObjectField('web3:address:uid', address, uid);
			// await user.email.confirmByUid(uid); todo: add modal to set email 
			return cb(err, { uid: uid });
		});
	});
};

module.exports = auth;