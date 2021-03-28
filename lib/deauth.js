'use strict';

const deauth = {};
const winston = require.main.require('winston');

deauth.deleteUserData = async data => {
	const uid = data.uid;
	const oAuthIdToDelete = await user.getUserField(uid, 'web3address');

	try {
		await db.deleteObjectField('web3address:uid', oAuthIdToDelete);
		await db.deleteObjectField('user:' + uid, 'web3address', next);
	} catch (err) {
		winston.error(`[sso-web3] Could not remove Web3 Address for uid ${uid}. Error: ${err}`);
	}

	return uid;
};

module.exports = deauth;
