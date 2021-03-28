'use strict';

const controllers = require('./lib/controllers');
const auth = require('./lib/auth');
const routeHelpers = require.main.require('./src/routes/helpers');
const plugin = {};

plugin.init = async params => {
	const router = params.router;
	const middleware = params.middleware;

	router.get('/admin/plugins/sso/web3', middleware.admin.buildHeader, controllers.renderAdminPage);
	router.get('/api/admin/plugins/sso/web3', controllers.renderAdminPage);
	router.post('/deauth/web3', [middleware.requireUser, middleware.applyCSRF], controllers.deauth);
	routeHelpers.setupPageRoute(router, '/deauth/web3', middleware, [middleware.requireUser], controllers.renderDeauth);

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
	const uid = authList.uid;
	const associations = authList.associations;
};

module.exports = plugin;
