angular.module('app.services', [])

  .factory('BlankFactory', [function () {

  }])

  .service('getNomeFornecedorService', ['$http', function ($http) {
    this.getNomeFornecedor = function () {
      return $http.get(servidor + '/v1/api.php?req=getNomeFornecedor&idFornecedor=' + localStorage.getItem('fornecedorLogado'));
    }
  }])

  .service('UserService', function () {
    // For the purpose of this example I will store user data on ionic local storage but you should save it on a database
    var setUser = function (user_data) {
      // window.localStorage.starter_facebook_user = JSON.stringify(user_data);
    };

    var getUser = function () {
      return JSON.parse(window.localStorage.starter_facebook_user || '{}');
    };

    return {
      getUser: getUser,
      setUser: setUser
    };
  })

  .service('setTokenIdUsuario', ['$http', function ($http) {
    this.setTokenIdUsuarioServico = function (setToken) {
      var redirectNotification = localStorage.getItem("redirectNotification");
      if (redirectNotification != null && redirectNotification != '') {
        document.location.href = redirectNotification;
      } else {
        $http.post(servidor + '/v1/api.php?req=setTokenIdUsuario', setToken)
          .success(function (data) {
          });
        document.location.href = '#/side-menu21/home';
      }
    }
  }])

  .service('getCockpitServico', ['$http', function ($http) {
    this.getCockpit = function () {
      return $http.get(servidor + '/v1/api.php?req=getCockpit&idFornecedor=' + idFornecedor);
    }
  }])

