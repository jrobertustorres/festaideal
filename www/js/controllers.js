var servidor = "http://localhost";
var idFornecedor = 1;
// var idFornecedor = 0;

angular.module('app.controllers', [])

  .controller('homeCtrl', function ($scope, $http) {

    $scope.$on('$ionicView.enter', function () {
      $http.get(servidor + '/v1/api.php?req=getCockpit&idFornecedor=' + idFornecedor)
        .success(function (data) {
          $scope.cotacao_aberta = data.cotacao_aberta ? data.cotacao_aberta : 0;
          $scope.cotacao_pendente = data.cotacao_pendente ? data.cotacao_pendente : 0;
          $scope.cotacao_escolhida = data.cotacao_escolhida ? data.cotacao_escolhida : 0;
          $scope.cotacao_cancelada = data.cotacao_cancelada ? data.cotacao_cancelada : 0;
          $scope.cotacao_concluida = data.cotacao_concluida ? data.cotacao_concluida : 0;
        });
    });

    /*$scope.hideNavBar = function () {
      document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
    };

    $scope.hideHeader = function () {
      $scope.hideNavBar();
      $scope.noHeader();
    };

    $scope.noHeader = function () {
      var content = document.getElementsByTagName('ion-content');
      for (var i = 0; i < content.length; i++) {
        if (content[i].classList.contains('has-header')) {
          content[i].classList.toggle('has-header');
        }
      }
    };*/

  })

  .controller('menuCtrl', function ($scope, $ionicPopup, $ionicHistory, $location) {
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

  .controller('loginCtrl', function ($scope, $state, $q, UserService, $ionicLoading, $location, $http, $ionicHistory) {

    $scope.submeter = function () {
      if ($scope.loginForm.$valid) {
        $http.get(servidor + '/v1/api.php?req=doLogin&login=' + $scope.email + '&senha=' + $scope.senha)
          .success(function (data) {
            idFornecedor = data.id_fornecedor;
            console.log('id fornecedor ' + data.id_fornecedor);
            if (data) {
              $ionicHistory.nextViewOptions({
                disableBack: true
              });
              $location.path("/side-menu21/home");
            } else {
              $scope.mensagem = "usuário ou senha inválido";
            }
          });
      }
    }
  })

  .controller('CotacoesAbertasListCtrl', function ($scope, $state, $location, $http, $ionicConfig) {
    $ionicConfig.backButton.text("");
    $http.get(servidor + '/v1/api.php?req=getCotacoesStatusList&status=ABERTA&idFornecedor='+idFornecedor)
      .success(function (data) {
      $scope.dados = data;
    });

  })
//FAZER UM CONTROLLER SÓ E TAMBÉM UM HTML SÓ PRA TODOS OS STATUS
  .controller('CotacaoAbertaCtrl', function ($scope, $state, $location, $http, $stateParams) {
    $http.get(servidor + '/v1/api.php?req=getCotacaoStatusById&id_cotacao='+$stateParams.id_cotacao)
      .success(function (data) {
        $scope.dados = data;
      });
  })

  .controller('CotacoesPendentesListCtrl', function ($scope, $state, $location, $http, $ionicConfig) {
    $ionicConfig.backButton.text("");
    $http.get(servidor + '/v1/api.php?req=getCotacoesStatusList&status=PENDENTE&idFornecedor='+idFornecedor)
      .success(function (data) {
      $scope.dados = data;
    });

  })

  .controller('CotacaoPendenteCtrl', function ($scope, $state, $location, $http, $stateParams) {
    console.log('cotação pendente ** '+$stateParams.id_cotacao);
    $http.get(servidor + '/v1/api.php?req=getCotacaoPendenteById&id_cotacao='+$stateParams.id_cotacao)
      .success(function (data) {
      $scope.dados = data;
    });
  })

  .controller('RecuperarSenhaCtrl', function ($scope, $stateParams, $http) {

    $scope.recuperarSenha = {};
    recuperarSenha = {};
    $scope.submeter = function () {
      if ($scope.recuperarSenhaForm.$valid) {
        recuperarSenha.email = $scope.recuperarSenha.email;
        // recuperarSenha.id_pessoa = id_pessoa;
        // recuperarSenha.md5 = Math.random().toString(36).substr(2);
        $http.post(servidor + '/v1/api.php?req=enviarEmailSenha', {'recuperarSenha': recuperarSenha}).success(function (data) {
            // enviarEmailSenha($scope.recuperarSenha.email);

            var alertPopup = $ionicPopup.alert({
              title: 'Um link para editar sua senha, foi enviado para seu e-mail!',
              buttons: [
                {
                  text: '<b>Ok</b>',
                  type: 'button-positive'
                }
              ]
            });
          })
          .error(function (erro) {
            console.log(erro);
          });
      }
    }

  })
