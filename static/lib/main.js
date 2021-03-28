'use strict';
/* globals document, web3, $ */

$(document).ready(() => {
	const showWelcomeMessage = () => {
		if (ajaxify.data.template.name.startsWith('account')) {
			return;
		}

		$('#user_label').popover({
			content: `<p>Welcome, <strong>${app.user.username}</strong>!</p> <p>Click me to edit your profile. Please confirm your email address to fully activate your account.</p>`,
			placement: 'bottom',
			trigger: 'focus',
			viewport: '#content',
			html: true,
		}).popover('show');

		$('window, #user_label').one('click', function() {
			$('#user_label').popover('destroy');
		});
	}

	if (config.uid && config.requireEmailConfirmation && !app.user.email) {
		showWelcomeMessage();
	}

	if (config.uid || !window.ethereum) {
		return;
	}

	require(['web3'], (Web3) => {
		window.web3 = new Web3(window.ethereum);
		window.ethereum.enable().then(() => {
			web3.eth.getAccounts().then(sign);
		}, err => {
			throw new Error(err);
		});
	});

	const sign = accounts => {
		if (!accounts.length) {
			throw new Error('No accounts set up.');
		}
		
		const address = accounts[0];
		const message = config.termsOfUse ? config.termsOfUse : `Welcome to ${config.siteTitle || 'NodeBB'}`;

		web3.eth.personal.sign(message, address).then(signed => {
			fetch(config.relative_path + '/auth/web3', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json', 'x-csrf-token': config.csrf_token },
				body: JSON.stringify({
					address: address,
					message: message,
					signed: signed,
				}),
			}).then(() => {
				window.location.reload();
			}).catch(err => { console.log(err); });
		}).catch(err => { console.log(err); });
	}
});