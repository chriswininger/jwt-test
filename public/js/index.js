(function(window) {
	window.addEventListener('load', function() {
		var authPanel = document.querySelector('.authentication-panel');
		var authenticatedPanel = document.querySelector('.authenticated-panel');
		var btnLogin = document.getElementById('btn-login');
		var btnLogout = document.getElementById('btn-logout');
		var btnAPIRequest = document.getElementById('btn-api-request');

		var webAuth = new auth0.WebAuth({
				domain: 'chriswininger.auth0.com',
				clientID: 'FVZUwjGZBkv077uy407_ZXq3CLLj-jDR',
				responseType: 'token id_token',
				audience: 'https://chriswininger.auth0.com/api/v2/',
				scope: 'openid',
				redirectUri: window.location.href
		});
	
		// on form load check for token hash and parse it
		authenticateForm(function(){
			// load the veiw based on authentication status
			showView();
		});

		// === event handlers ===
		btnLogin.addEventListener('click', function(e) {
			e.preventDefault();
			webAuth.authorize();
		});

		btnLogout.addEventListener('click', function(e) {
			e.preventDefault();
			logout();
		});

		btnAPIRequest.addEventListener('click', function(e) {
			e.preventDefault();
			axios.post('/api/test.json', { token: getToken() })
				.then(function(resp) {
					console.log('got data: ' + JSON.stringify(resp.data, null, 4));
				})
				.catch(function(err) {
					console.warn(err);
				});
		});

		// === helpers ===
		function showView() {
			if (isAuthenticated()) {
				authPanel.style.display = 'none';
				authenticatedPanel.style.display = 'block';
			} else {
				authPanel.style.display = 'block';
				authenticatedPanel.style.display = 'none';
			}
		}
	
		function authenticateForm(complete) {
			webAuth.parseHash(function(err, authResult) {
				if (authResult && authResult.accessToken && authResult.idToken) {
						window.location.hash = '';
						setSession(authResult);
				} else if (err) {
						console.log(err);
				}

				complete();
			});
		}
	
		function isAuthenticated() {
			var expiresAt = JSON.parse(localStorage.getItem('expires_at'));
			return new Date().getTime() < expiresAt;
		}
	
		function getToken() {
			return localStorage.getItem('access_token');
		}

		function setSession(authResult) {
			// Set the time that the access token will expire at
			var expiresAt = JSON.stringify(
			authResult.expiresIn * 1000 + new Date().getTime()
			);
			localStorage.setItem('access_token', authResult.accessToken);
			localStorage.setItem('id_token', authResult.idToken);
			localStorage.setItem('expires_at', expiresAt);
		}
	
		function logout() {
			// Remove tokens and expiry time from localStorage
			localStorage.removeItem('access_token');
			localStorage.removeItem('id_token');
			localStorage.removeItem('expires_at');
			showView();
		}
	});

})(window);
