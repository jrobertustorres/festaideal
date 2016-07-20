var servidor = "http://localhost";
// var servidor = "http://festaideal.com.br/ws_mobile";
var idFornecedor = 1;
// var idFornecedor = 0;
var status_header = "";

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
        $http.get(servidor + '/v1/api.php?req=doLogin&login=' + $scope.login + '&senha=' + $scope.senha)
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

  // .controller('CotacoesAbertasListCtrl', function ($scope, $state, $location, $http, $ionicConfig, $stateParams) {
  //   $ionicConfig.backButton.text("");
  //   console.log('dados 1111 ==> '+$stateParams.status_cotacao)
  //   $http.get(servidor + '/v1/api.php?req=getCotacoesStatusList&status_cotacao=ABERTA&idFornecedor=' + idFornecedor)
  //     .success(function (data) {
  //       $scope.dados = data;
  //     });
  //
  // })

  .controller('CotacoesListCtrl', function ($scope, $state, $location, $http, $ionicConfig, $stateParams, $rootScope) {
    $ionicConfig.backButton.text("");
    $rootScope.status_cotacao = $stateParams.status_cotacao;
    $scope.pagetitle = 'Cotação '+$scope.status_cotacao;
    $http.get(servidor + '/v1/api.php?req=getCotacoesStatusList&status_cotacao=' + $stateParams.status_cotacao + '&idFornecedor=' + idFornecedor)
      .success(function (data) {
        $scope.dados = data;
      });

    $scope.IsVisible = false;
    $scope.ShowHide = function () {
      //If DIV is visible it will be hidden and vice versa.
      $scope.IsVisible = $scope.IsVisible ? false : true;
    }

  })
  //FAZER UM CONTROLLER SÓ E TAMBÉM UM HTML SÓ PRA TODOS OS STATUS
  .controller('CotacaoCtrl', function ($scope, $state, $location, $http, $stateParams, toastr, $rootScope, $ionicHistory, $ionicModal) {

    $ionicModal.fromTemplateUrl('templates/modal-1.html', {
      id: '1', // We need to use and ID to identify the modal that is firing the event!
      scope: $scope,
      backdropClickToClose: false,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.oModal1 = modal;
    });

    // Modal 2
    $ionicModal.fromTemplateUrl('templates/modal-2.html', {
      id: '2', // We need to use and ID to identify the modal that is firing the event!
      scope: $scope,
      backdropClickToClose: false,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.oModal2 = modal;
    });

    $scope.openModal = function(index) {
      if (index == 1) $scope.oModal1.show();
      else $scope.oModal2.show();
    };

    $scope.closeModal = function(index) {
      if (index == 1) $scope.oModal1.hide();
      else $scope.oModal2.hide();
    };

    /* Listen for broadcasted messages */

    $scope.$on('modal.shown', function(event, modal) {
    });

    $scope.$on('modal.hidden', function(event, modal) {
    });

    $scope.$on('$destroy', function() {
      $scope.oModal1.remove();
      $scope.oModal2.remove();
    });

    $http.get(servidor + '/v1/api.php?req=getCotacaoStatusById&id_cotacao=' + $stateParams.id_cotacao)
      .success(function (data) {
        $scope.dados = data;
        $scope.pagetitle = 'Dados cotação '+$rootScope.status_cotacao;
      });

    $scope.cotacaoAberta = {};
    var msg = '';
    $scope.submeter = function () {
      // if ($scope.cotacaoAbertaForm.$valid) {
      console.log('testesssssss ');

      if ($rootScope.status_cotacao == 'aberta') {
        $scope.cotacaoAberta.status_cotacao = 'PENDENTE';
        msg = 'enviada';
      } else if ($rootScope.status_cotacao == 'escolhida') {
        $scope.cotacaoAberta.status_cotacao = 'CONCLUIDA';
        msg = 'concluida';
      }

      $scope.cotacaoAberta.id_cotacao = $stateParams.id_cotacao;
      editaCotacao();
      // }
    };

    function editaCotacao() {
      $http.post(servidor + '/v1/api.php?req=editaCotacao', $scope.cotacaoAberta)
        .success(function (data) {
          toastr.success('Cotação ' + msg + ' com sucesso!');
          $ionicHistory.nextViewOptions({
            disableBack: true
          });
          $location.path('side-menu21/home');
        })
        .error(function (erro) {
          console.log(erro);
        });
    }

    $scope.rejeitarCotacao = function (id_cotacao) {
      console.log('id cotacaosss  '+$scope.cotacaoAberta.id_cotacao);
      console.log('motivo ==> '+$scope.cotacaoAberta.motivo);
      $scope.cotacaoAberta.id_cotacao = id_cotacao;
      if ($rootScope.status_cotacao == 'escolhida' || $rootScope.status_cotacao == 'concluida') {
        $scope.cotacaoAberta.status_cotacao = 'CANCELADA';
        msg = 'cancelada';
      } else {
        $scope.cotacaoAberta.status_cotacao = 'REJEITADA';
        msg = 'rejeitada';
      }
      editaCotacao();
    }

  })

  /*.directive('searchBar', [function () {
    return {
      scope: {
        ngModel: '='
      },
      require: ['^ionNavBar', '?ngModel'],
      restrict: 'E',
      replace: true,
      template: '<ion-nav-buttons side="right">' +
      '<div class="searchBar">' +
      '<div class="searchTxt" ng-show="ngModel.show">' +
      '<div class="bgdiv"></div>' +
      '<div class="bgtxt">' +
      '<input type="text" placeholder="Procurar..." ng-model="ngModel.txt">' +
      '</div>' +
      '</div>' +
      '<i class="icon placeholder-icon" ng-click="ngModel.txt=\'\';ngModel.show=!ngModel.show"></i>' +
      '</div>' +
      '</ion-nav-buttons>',

      compile: function (element, attrs) {
        var icon = attrs.icon
          || (ionic.Platform.isAndroid() && 'ion-android-search')
          || (ionic.Platform.isIOS() && 'ion-ios7-search')
          || 'ion-search';
        angular.element(element[0].querySelector('.icon')).addClass(icon);

        return function ($scope, $element, $attrs, ctrls) {
          var navBarCtrl = ctrls[0];
          $scope.navElement = $attrs.side === 'right' ? navBarCtrl.rightButtonsElement : navBarCtrl.leftButtonsElement;

        };
      },
      controller: ['$scope', '$ionicNavBarDelegate', function ($scope, $ionicNavBarDelegate) {
        var title, definedClass;
        $scope.$watch('ngModel.show', function (showing, oldVal, scope) {
          if (showing !== oldVal) {
            if (showing) {
              if (!definedClass) {
                var numicons = $scope.navElement.children().length;
                angular.element($scope.navElement[0].querySelector('.searchBar')).addClass('numicons' + numicons);
              }

              title = $ionicNavBarDelegate.getTitle();
              $ionicNavBarDelegate.setTitle('');
            } else {
              $ionicNavBarDelegate.setTitle(title);
            }
          } else if (!title) {
            title = $ionicNavBarDelegate.getTitle();
          }
        });
      }]
    };
  }])*/

  /*.controller('CotacoesPendentesListCtrl', function ($scope, $state, $location, $http, $ionicConfig) {
   $ionicConfig.backButton.text("");
   $http.get(servidor + '/v1/api.php?req=getCotacoesStatusList&status=PENDENTE&idFornecedor=' + idFornecedor)
   .success(function (data) {
   $scope.dados = data;
   });

   })

   .controller('CotacaoPendenteCtrl', function ($scope, $state, $location, $http, $stateParams) {
   $http.get(servidor + '/v1/api.php?req=getCotacaoPendenteById&id_cotacao=' + $stateParams.id_cotacao)
   .success(function (data) {
   $scope.dados = data;
   });
   })

   .controller('CotacoesEscolhidasListCtrl', function ($scope, $state, $location, $http, $ionicConfig) {
   $ionicConfig.backButton.text("");
   $http.get(servidor + '/v1/api.php?req=getCotacoesStatusList&status=ABERTA&idFornecedor=' + idFornecedor)
   .success(function (data) {
   $scope.dados = data;
   });

   })*/

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
