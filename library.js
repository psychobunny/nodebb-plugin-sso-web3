'use strict';

const user = require.main.require('./src/user');
const controllers = require('./lib/controllers');
const auth = require('./lib/auth');
const deauth = require('./lib/deauth');
const plugin = {};

plugin.init = async params => {
	const router = params.router;
	const middleware = params.middleware;

	router.get('/admin/plugins/sso/web3', middleware.admin.buildHeader, controllers.renderAdminPage);
	router.get('/api/admin/plugins/sso/web3', controllers.renderAdminPage);
	router.post('/deauth/web3', [middleware.requireUser, middleware.applyCSRF], controllers.deauth);

	auth.init();
};

plugin.addMenuItem = async header => {
	header.plugins.push({
		route: '/plugins/sso/web3',
		icon: 'fa-address-card',
		name: 'Web3 SSO',
	});

	return header;
};

plugin.filterAuthInit = async loginStrategies => {
	loginStrategies.push({
		name: 'web3',
		url: '/auth/web3',
		urlMethod: 'post',
		callbackURL: '/auth/web3/callback',
		icon: 'fa fa-address-card',
		scope: ''
	});

	return loginStrategies;
};

plugin.filterAuthList = async authList => {
	const { uid, associations } = authList;
	const address = await user.getUserField(uid, 'web3:address');

	if (address) {
		associations.push({
			associated: true,
			url: `https://www.blockchain.com/eth/address/${address}`,
			deauthUrl: '#',
			name: 'web3 address',
			icon: 'fa fa-address-card',
			component: 'web3/disassociate',
		});
	} else {
		associations.push({
			associated: false,
			name: 'web3 address',
			url: '#',
			icon: 'fa fa-address-card',
			component: 'web3/associate',
		});
	}

	return authList;
};

plugin.filterUserWhitelistFields = async data => {
	data.whitelist.push('web3:address');
	return data;
};

plugin.staticUserDelete = deauth.deleteUserData;

module.exports = plugin;
