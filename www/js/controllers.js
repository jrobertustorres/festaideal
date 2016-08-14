var servidor = "http://localhost";
// var servidor = "http://festaideal.com.br/ws_mobile";
var idFornecedor = 1;
// var idFornecedor = 0;

angular.module('app.controllers', [])

  .controller('homeCtrl', function ($scope, $http, $ionicLoading) {

    $scope.$on('$ionicView.enter', function () {
      $scope.pagetitle = 'Cotações';
      $ionicLoading.show({template: '<ion-spinner icon="spiral"></ion-spinner>'});

      $http.get(servidor + '/v1/api.php?req=getCockpit&idFornecedor=' + idFornecedor)
        .success(function (data) {
          $ionicLoading.hide();
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
        okText: 'Sair'
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
    $scope.clearMessage = function () {
      $scope.mensagem = "";
    }

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

  .controller('CotacoesListCtrl', function ($scope, $state, $location, $http, $ionicConfig, $stateParams, $rootScope, $ionicFilterBar) {
    $ionicConfig.backButton.text("");
    $rootScope.status_cotacao = $stateParams.status_cotacao;
    $scope.pagetitle = 'Cotação ' + $scope.status_cotacao;
    var filterBarInstance;

    $http.get(servidor + '/v1/api.php?req=getCotacoesStatusList&status_cotacao=' + $stateParams.status_cotacao + '&idFornecedor=' + idFornecedor)
      .success(function (data) {
        $scope.dados = data;
        // $scope.items = data;
      });

    $scope.showFilterBar = function () {
      filterBarInstance = $ionicFilterBar.show({
        items: $scope.dados,
        update: function (filteredItems, filterText) {
          $scope.items = filteredItems;
          if (filterText) {
            console.log(filterText);
          }
        }
      });
    };

    $scope.refreshItems = function () {
      if (filterBarInstance) {
        filterBarInstance();
        filterBarInstance = null;
      }

      /*$timeout(function () {
       // getItems();
       $scope.$broadcast('scroll.refreshComplete');
       }, 1000);*/
    };
  })

  .controller('CotacaoCtrl', function ($scope, $state, $location, $http, $stateParams, toastr, $rootScope, $ionicHistory, $ionicModal, $ionicLoading, $ionicPopup, $filter) {
    $scope.cotacao = {};

    $ionicModal.fromTemplateUrl('templates/modal-1.html', {
      id: '1', // We need to use and ID to identify the modal that is firing the event!
      scope: $scope,
      backdropClickToClose: false,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.oModal1 = modal;
    });

    // Modal 2
    $ionicModal.fromTemplateUrl('templates/modal-2.html', {
      id: '2', // We need to use and ID to identify the modal that is firing the event!
      scope: $scope,
      backdropClickToClose: false,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.oModal2 = modal;
    });

    $scope.openModal = function (index) {
      if (index == 1 && $scope.dados.status_cotacao == "ABERTA") {
        var confirmPopup = $ionicPopup.confirm({
          title: 'Deseja realmente rejeitar\n esta cotação?',
          cancelText: 'Não',
          okText: 'Sim'
        });
        confirmPopup.then(function (res) {
          if (res) {
            $scope.rejeitaCotacao();
            $ionicHistory.nextViewOptions({
              disableBack: true
            });
            $location.path("/side-menu21/home");
          } else {
          }
        });
      } else if ($scope.dados.status_cotacao != "ABERTA") {
        $scope.oModal1.show();
      } else {
        $scope.oModal2.show();
      }
    };

    $scope.closeModal = function (index) {
      if (index == 1) $scope.oModal1.hide();
      else $scope.oModal2.hide();
      $scope.cotacao = {};
    };

    $scope.$on('modal.shown', function (event, modal) {
    });

    $scope.$on('modal.hidden', function (event, modal) {
    });

    $scope.$on('$destroy', function () {
      $scope.oModal1.remove();
      $scope.oModal2.remove();
    });
    $ionicLoading.show();

    $http.get(servidor + '/v1/api.php?req=getCotacaoStatusById&id_cotacao=' + $stateParams.id_cotacao)
      .success(function (data) {
        $ionicLoading.hide();
        $scope.dados = data;
        $scope.pagetitle = 'Dados cotação ' + $scope.dados.status_cotacao;
      });

    var msg = '';

    $scope.rejeitaCotacao = function () {
      $scope.cotacao.status_cotacao = 'REJEITADA';
      msg = 'rejeitada';
      enviaEditar();
    }

    $scope.cancelarCotacao = function () {
      if ($scope.cotacao.motivo) {
        $scope.cotacao.status_cotacao = 'CANCELADA';
        msg = 'cancelada';
        enviaEditar();
      }
    }

    $scope.responderCotacao = function () {
      var itemsLength = Object.keys($scope.cotacao).length;
      if (itemsLength == 5) {
        $scope.cotacao.status_cotacao = 'PENDENTE';
        msg = 'enviada';
        enviaEditar();

        // if ($rootScope.status_cotacao == 'aberta') {
        /*$scope.cotacao.status_cotacao = 'PENDENTE';
         msg = 'enviada';*/
        /*} else if ($scope.dados.status_cotacao == 'escolhida') {
         $scope.cotacao.status_cotacao = 'CONCLUIDA';
         msg = 'concluida';
         }*/
      }
    }

    $scope.editaCotacao = function () {
      console.log('$scope.cotacao.motivo ' + $scope.cotacao.motivo);
      console.log('$scope.cotacao.status_cotacao ' + $rootScope.status_cotacao);
      // function editaCotacao() {
      // $scope.cotacao.id_cotacao = $scope.dados.id_cotacao;
      if ($scope.cotacao.motivo && $rootScope.status_cotacao != 'ABERTA') {
        if ($rootScope.status_cotacao == 'escolhida' || $rootScope.status_cotacao == 'concluida') {
          $scope.cotacao.status_cotacao = 'CANCELADA';
          msg = 'cancelada';
        } else {
          console.log('dentro do else');
          $scope.cotacao.status_cotacao = 'REJEITADA';
          msg = 'rejeitada';
        }
        enviaEditar();

      } else {
        // if ($rootScope.status_cotacao == 'aberta') {
        //   $scope.cotacao.status_cotacao = 'REJEITADA';
        //   msg = 'rejeitada';
        //   enviaEditar();
        // } else {
        /*var itemsLength = Object.keys($scope.cotacao).length;
         if (itemsLength == 6) {
         if ($rootScope.status_cotacao == 'aberta') {
         $scope.cotacao.status_cotacao = 'PENDENTE';
         msg = 'enviada';
         } else if ($scope.dados.status_cotacao == 'escolhida') {
         $scope.cotacao.status_cotacao = 'CONCLUIDA';
         msg = 'concluida';
         }
         enviaEditar();
         }*/
      }
    }

    function enviaEditar() {
      $scope.cotacao.id_fornecedor = idFornecedor;
      $scope.cotacao.id_cotacao = $scope.dados.id_cotacao;
      $scope.cotacao.data_entrega = $filter('date')($scope.cotacao.data_entrega, "yyyy-MM-dd HH:mm:ss");
      $scope.cotacao.validade = $filter('date')($scope.cotacao.validade, "yyyy-MM-dd HH:mm:ss");
      $http.post(servidor + '/v1/api.php?req=editaCotacao', $scope.cotacao)
        .success(function (data) {
          toastr.success('Cotação ' + msg + ' com sucesso!');
          $ionicHistory.nextViewOptions({
            disableBack: true
          });
          $scope.closeModal(1);
          $scope.closeModal(2);
          $location.path('side-menu21/home');
        })
        .error(function (erro) {
          console.log(erro);
        });
    }

    $scope.concluirCotacao = function () {
      msg = 'concluida';
      var confirmPopup = $ionicPopup.confirm({
        title: 'Deseja realmente concluir\n esta cotação?',
        cancelText: 'Não',
        okText: 'Sim'
      });
      confirmPopup.then(function (res) {
        if (res) {
          $scope.cotacao.status_cotacao = 'CONCLUIDA';
          enviaEditar();
          /*$ionicHistory.nextViewOptions({
           disableBack: true
           });*/
          // $location.path("/side-menu21/home");
        } else {
        }
      });
    }

    $scope.compareDates = function () {
      // $scope.cotacao.data_entrega = new Date($scope.cotacao.data_entrega);
      $scope.cotacao.data_entrega = $scope.cotacao.data_entrega;
      $scope.dados.data_evento = $scope.dados.data_evento;

      $scope.cotacao.data_entrega = $filter('date')($scope.cotacao.data_entrega, "dd-MM-yyyy");
      $scope.dados.data_evento = $filter('date')($scope.dados.data_evento, "dd-MM-yyyy");
      $scope.dados.data_evento = $scope.dados.data_evento.split('/').join('-');

      console.log('data do evento ' + $scope.dados.data_evento);
      console.log('data da entrega ' + $scope.cotacao.data_entrega);

      // var myDate = $scope.cotacao.data_entrega;
      $scope.cotacao.data_entrega = $scope.cotacao.data_entrega.split("-");
      $scope.cotacao.data_entrega = $scope.cotacao.data_entrega[1] + "/" + $scope.cotacao.data_entrega[0] + "/" + $scope.cotacao.data_entrega[2];
      console.log("data da entrega " + new Date($scope.cotacao.data_entrega).getTime());

      $scope.dados.data_evento = $scope.dados.data_evento.split("-");
      $scope.dados.data_evento = $scope.dados.data_evento[1] + "/" + $scope.dados.data_evento[0] + "/" + $scope.dados.data_evento[2];
      console.log("data do evento " + new Date($scope.dados.data_evento).getTime());


      if ($scope.cotacao.data_entrega > $scope.dados.data_evento) {
        console.log('data com erro');
      } else {
        console.log('data ok');
      }
    }

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
