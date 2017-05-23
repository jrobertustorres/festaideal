angular.module('app.services', [])

  .factory('BlankFactory', [function () {

  }])

  .service('getNomeFornecedorService', ['$http', function ($http) {
    this.getNomeFornecedor = function () {
      return $http.get(servidor + '/v1/api.php?req=getNomeFornecedor&idFornecedor=' + localStorage.getItem('fornecedorLogado'));
    }
  }])

  .service('ModalService', function ($ionicModal, $rootScope) {

    var init = function (tpl, $scope) {
      var promise;
      $scope = $scope || $rootScope.$new();

      promise = $ionicModal.fromTemplateUrl(tpl, {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $scope.modal = modal;
        return modal;
      });

      $scope.openModal = function () {
        $scope.modal.show();
      };
      $scope.closeModal = function () {
        $scope.modal.hide();
      };
      $scope.$on('$destroy', function () {
        $scope.modal.remove();
      });

      return promise;
    }

    return {
      init: init
    }

  })

  .service('doLoginByIdUsuarioService', ['$http', function ($http) {
    this.doLoginByIdUsuario = function (idUsuario) {
      return $http.get(servidor + '/v1/api.php?req=doLoginByIdUsuario&idUsuario=' +  idUsuario);
    }
  }])

  .service('doLogoutService', function () {
    console.log('chamos doLogoutService');
    this.doLogout = function () {
      localStorage.removeItem('usuarioLogado');
      localStorage.removeItem('fornecedorLogado');
      localStorage.removeItem('statusResetSenha');
      localStorage.removeItem('token');
      localStorage.removeItem('redirectNotification');
      idFornecedor = null;
      idUsuario = null;
      document.location.href = '#/login';
    }
  })

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
      return $http.get(servidor + '/v1/api.php?req=getCockpit&idFornecedor=' + localStorage.getItem('fornecedorLogado'));
    }
  }])

