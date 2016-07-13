(function() {

	angular
		.module('meanApp')
		.service('meanData', meanData);

	meanData.$inject = ['$http', 'authentication'];
	function meanData ($http, authentication) {

		var getProfile = function(id) {
			if (!id)
				return $http.get('/api/user/current', {
					headers: {
						Authorization: 'Bearer '+ authentication.getToken()
					}
				});
			else
				return $http.get('/api/user/' + id);
			
		};

		return {
			getProfile: getProfile
		};
	}

})();