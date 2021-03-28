'use strict';

const deauth = {};
const winston = require.main.require('winston');
const user = require.main.require('./src/user');
const db = require.main.require('./src/database');

deauth.deleteUserData = async data => {
	const uid = data.uid;
	const oAuthIdToDelete = await user.getUserField(uid, 'web3:address');

	try {
		await db.deleteObjectField('web3:address:uid', oAuthIdToDelete);
		await db.deleteObjectField(`user:${uid}`, 'web3:address');
	} catch (err) {
		winston.error(`[sso-web3] Could not remove Web3 Address for uid ${uid}. Error: ${err}`);
	}

	return uid;
};

module.exports = deauth;
