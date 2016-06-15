var servidor = "http://localhost";

angular.module('app.controllers', [])

.controller('homeCtrl', function($scope) {

})

.controller('cartCtrl', function($scope) {

})

.controller('menuCtrl', function($scope, $ionicPopup, $ionicHistory, $location) {
  console.log('teste');
  $scope.doLogout = function () {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Deseja realmente sair?',
      cancelText: 'Não',
      okText: 'Sim'
    });
    confirmPopup.then(function (res) {
      if (res) {
        $ionicHistory.nextViewOptions({
          disableBack: true
        });
        $location.path("/side-menu21/login");
      } else {

      }
    });
  }
})

.controller('loginCtrl', function($scope, $state, $q, UserService, $ionicLoading, $location, $http, $ionicHistory) {
  $scope.submeter = function () {
    if ($scope.loginForm.$valid) {
      $http.get(servidor + '/v1/api.php?req=doLogin&login=' + $scope.email + '&senha=' + $scope.senha)
        .success(function (data) {
        console.log('email ' + data.email);
        console.log('senha ' + data.senha);
        if (data) {
          console.log('dentro do data');
          $ionicHistory.nextViewOptions({
            disableBack: true
          });
          // $location.path('#/home');
          $location.path("/side-menu21/home");
        } else {
          $scope.mensagem = "usuário ou senha inválido";
        }

      });
    }


  }

})
