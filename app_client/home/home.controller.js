(function() {
  
  angular
    .module('meanApp')
    .controller('homeCtrl', homeCtrl);

    homeCtrl.$inject = ['authentication', '$routeParams', '$location']

    function homeCtrl (authentication, $routeParams, $location) {
      console.log('Home controller is running');
      if (authentication.isLoggedIn())
			$location.path('/profile');
    }

})();