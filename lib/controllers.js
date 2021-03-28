'use strict';

const controllers = {};
const nconf = require.main.require('nconf');
const deauth = require('./deauth');

controllers.renderAdminPage = async (req, res) => {
	res.render('admin/plugins/sso/web3', {});
};

controllers.renderDeauth = async (req, res) => {
	res.render('plugins/sso-web3/deauth', {
		service: 'Web3',
	});
};

controllers.deauth = async (req, res) => {
	await deauth.deleteUserData({ uid: req.user.uid });
	res.redirect(nconf.get('relative_path') + '/me/edit');
};

module.exports = controllers;
