(function() {
	
	angular
		.module('meanApp')
		.controller('profileCtrl', profileCtrl);

	profileCtrl.$inject = ['$routeParams', '$location', 'meanData', 'authentication'];
	function profileCtrl($routeParams, $location, meanData, authentication) {
		var vm = this;

		vm.user = {};

		if (authentication.isLoggedIn() && authentication.currentUser()._id === $routeParams.id)
			$location.path('/profile');

		if (!authentication.isLoggedIn())
			$location.path('/');
		else 
			meanData.getProfile($routeParams.id)
				.success(function(data) {
					vm.user = data;
					console.log(data);
				})
				.error(function(e) {
					console.log(e);
				});
	}

})();