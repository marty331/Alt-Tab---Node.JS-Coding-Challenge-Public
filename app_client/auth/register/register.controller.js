(function () {

  angular
    .module('meanApp')
    .controller('registerCtrl', registerCtrl);

  registerCtrl.$inject = ['$location', 'authentication'];
  function registerCtrl($location, authentication) {
    var vm = this;

    vm.credentials = {
      name : "",
      email : "",
      password : ""
    };

    vm.onSubmit = function () {
      console.log('Submitting registration ', vm.credentials);
      authentication
        .register(vm.credentials)
        .error(function(err){
          alert('register error =', err);
        })
        .then(function(){
          $location.path('profile');
        });
    };

  }

})();