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
	db.getObjectField('web3:address:uid', address, async (err, uid) => {
		if (err) { return cb(err); }
		if (uid) { return cb(null, { uid: uid }); }

		if (meta.settings.disableRegistration == 'on') {
			return cb('[[error:sso-registration-disabled, Web3]]');
		}

		const username = await getUniqueUsername();
	
		user.create({ username: username }, async (err, uid) => {
			if (err) { return cb(err); }

			await user.setUserField(uid, 'web3:address', address);
			await db.setObjectField('web3:address:uid', address, uid);
			// await user.email.confirmByUid(uid); todo: add modal to set email 
			return cb(err, { uid: uid });
		});
	});
};

const getUniqueUsername = async () => {
	const { uniqueNamesGenerator, adjectives, animals } =  require('unique-names-generator');

	let username;
	do {
		username = uniqueNamesGenerator({
			dictionaries: [adjectives, animals],
			separator: '',
			style: 'capital',
		});
	} while (await user.getUidByUsername(username) !== null)

	return username;
};

module.exports = auth;