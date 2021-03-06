// var servidor = "http://localhost";
var servidor = "http://festaideal.com.br/ws_mobile";
// var idFornecedor = 1;
var idFornecedor = 0;
// var idUsuario = 1;
var idUsuario = 0;

angular.module('app.controllers', [])

  .controller('redirectViewCtrl', function($timeout, $location, $http, $scope, setTokenIdUsuario, $ionicLoading,
                                           doLoginByIdUsuarioService, doLogoutService) {
    try {
      $ionicLoading.show();

      var promise = doLoginByIdUsuarioService.doLoginByIdUsuario(localStorage.getItem('usuarioLogado'));
      promise.success(function (data) {
        if (data) {
          $timeout(function () {
            $scope.setToken = {};
            $scope.setToken.usuarioLogado = localStorage.getItem('usuarioLogado');
            $scope.setToken.token = localStorage.getItem('token');
            idFornecedor = localStorage.getItem('fornecedorLogado');
            setTokenIdUsuario.setTokenIdUsuarioServico($scope.setToken);
            $ionicLoading.hide();
          }, 1000);
        }
        else {
          $ionicLoading.hide();
          doLogoutService.doLogout();
        }

      }).error(function (erro) {
        $ionicLoading.hide();
        toastr.error('Desculpe, ocorreu um erro. Tente novamente...');
      });

      // $ionicLoading.show();
      // $timeout(function () {
      //   var promiseLogin = doLoginService.doLogin();
      //     promiseLogin.success(function () {
      //     $ionicLoading.hide();
      //     $scope.setToken = {};
      //     $scope.setToken.usuarioLogado = localStorage.getItem('usuarioLogado');
      //     $scope.setToken.token = localStorage.getItem('token');
      //     idFornecedor = localStorage.getItem('fornecedorLogado');
      //     setTokenIdUsuario.setTokenIdUsuarioServico($scope.setToken);
      //   })
      // }, 1000);

    } catch (err) {
      $ionicLoading.hide();
      toastr.error('Desculpe, algo deu errado.', 'Tente novamente...');
    }
  })

  .controller('homeCtrl', function ($scope, $http, $ionicLoading, $rootScope, $ionicScrollDelegate, $timeout,
                                    getCockpitServico, toastr) {

    try {

      $scope.$on("$ionicView.beforeEnter", function () {

        try {

          $ionicScrollDelegate.scrollTop();
          idFornecedor = localStorage.getItem("fornecedorLogado");
          idUsuario = localStorage.getItem("usuarioLogado");
          $scope.viewEntered = true;
          $ionicLoading.show();

          $scope.doRefresh();

          // var promise = getCockpitServico.getCockpit();
          // promise.success(function (data) {
          //   $scope.dado = data;
          //
          //   $timeout(function () {
          //     $ionicLoading.hide();
          //   }, 500);
          //
          // }).error(function (erro) {
          //   $ionicLoading.hide();
          //   toastr.error('Desculpe, ocorreu um erro. Tente novamente...');
          // });

        } catch (err) {
          $ionicLoading.hide();
          toastr.error('Desculpe, algo deu errado.', 'Tente novamente...');
        }

      });

      $scope.$on("$ionicView.beforeLeave", function () {
        $scope.viewEntered = false;
      });

      $scope.doRefresh = function () {
        var promise = getCockpitServico.getCockpit();
        promise.success(function (data) {
          $scope.dado = data;

          $timeout(function () {
            $ionicLoading.hide();
          }, 500);

        }).error(function (erro) {
          $ionicLoading.hide();
          toastr.error('Desculpe, ocorreu um erro. Tente novamente...');
        });
        // getCockpitServico.getCockpit()
        //   .success(function (data) {
        //     $scope.dado = data;
        //     $timeout(function () {
        //       $ionicLoading.hide();
        //     }, 500);
        //
        //   }).error(function (erro) {
        //     $ionicLoading.hide();
        //     toastr.error('Desculpe, ocorreu um erro. Tente novamente...');
        //   });

        $scope.$broadcast('scroll.refreshComplete');
      }

      $scope.$on('$locationChangeStart', function () {
        localStorage.removeItem("redirectNotification");
        delete $scope.dado;
      });

    } catch (err) {
      $ionicLoading.hide();
      toastr.error('Desculpe, algo deu errado.', 'Tente novamente...');
    }

  })

  .controller('menuCtrl', function($scope, $ionicPopup, $ionicHistory, $location, $ionicLoading,
                                   getNomeFornecedorService, doLogoutService) {

    try {

      getNomeFornecedorService.getNomeFornecedor()
        .success(function (data) {
          $scope.nomeFornecedor = data;
        });

      $scope.doLogoutBtn = function () {
        var confirmPopup = $ionicPopup.confirm({
          title: 'Deseja realmente sair?',
          cancelText: 'Cancelar',
          okText: 'Sair do app'
        });
        confirmPopup.then(function (res) {
          if (res) {
            $ionicHistory.nextViewOptions({
              disableBack: true
            });
            doLogoutService.doLogout();
          }
        });
      }

    } catch (err) {
      $ionicLoading.hide();
      toastr.error('Desculpe, algo deu errado.', 'Tente novamente...');
    }

  })

  .controller('loginCtrl', function ($scope, $state, $ionicLoading, $location, $http, $ionicHistory, $rootScope,
                                     setTokenIdUsuario, $timeout) {

    try {

      $scope.submeterLogin = function () {

        try {

          $scope.clearForm = false;
          if ($scope.loginForm.$valid) {
            $ionicLoading.show();
            $http.get(servidor + '/v1/api.php?req=doLogin&login=' + $scope.login + '&senha=' + $scope.senha)
              .success(function (data) {

                idFornecedor = data.idFornecedor;
                idUsuario = data.idUsuario;
                $rootScope.statusReset = data.statusReset;
                localStorage.setItem("usuarioLogado", idUsuario);
                localStorage.setItem("fornecedorLogado", idFornecedor);
                localStorage.setItem("statusResetSenha", data.statusReset);
                if (data) {
                  if ($rootScope.statusReset != 0) {
                    $ionicLoading.hide();
                    $location.path("/side-menu21/alterarSenha");
                  } else {
                    $ionicHistory.nextViewOptions({
                      disableBack: true
                    });
                    if (localStorage.getItem("redirectNotification")) {
                      $ionicLoading.hide();
                      $location.path(localStorage.getItem("redirectNotification"));
                    } else {
                      // $location.path("/side-menu21/home");
                      $timeout(function () {
                        $scope.setToken = {};
                        $scope.setToken.usuarioLogado = localStorage.getItem('usuarioLogado');
                        $scope.setToken.token = localStorage.getItem('token');
                        setTokenIdUsuario.setTokenIdUsuarioServico($scope.setToken);
                        $ionicLoading.hide();
                      }, 1000);
                    }
                  }
                } else {
                  $ionicLoading.hide();
                  document.getElementById("senha").focus();
                  document.getElementById("senha").value = '';
                  $scope.mensagem = "usu??rio ou senha inv??lido";
                }

              }).error(function (erro) {
              $ionicLoading.hide();
              toastr.error('Desculpe, ocorreu um erro. Tente novamente...');
            });
          }

        } catch (err) {
          $ionicLoading.hide();
          toastr.error('Desculpe, algo deu errado.', 'Tente novamente...');
        }
      }

      $scope.$on('$locationChangeStart', function () {
        $scope.clearForm = true;
        $scope.login = "";
        $scope.senha = "";
        $scope.clearMessage();
      });

      $scope.clearMessage = function () {
        $scope.mensagem = "";
      }

    } catch (err) {
      $ionicLoading.hide();
      toastr.error('Desculpe, algo deu errado.', 'Tente novamente...');
    }
  })

  .controller('CotacoesListCtrl', function($scope, $state, $location, $http, $ionicConfig, $stateParams, $rootScope,
                                           toastr, $ionicLoading, $timeout) {

    try {

      $scope.viewEntered = false;
      $scope.$on("$ionicView.enter", function () {
        $scope.viewEntered = true;
        getCotacoesList();
      });
      $scope.$on("$ionicView.beforeLeave", function () {
        $scope.viewEntered = false;
      });

      $ionicConfig.backButton.text("");
      $rootScope.status_cotacao = $stateParams.status_cotacao;
      $scope.pagetitle = $scope.status_cotacao + 's';

      $rootScope.mostraFiltro = false;
      $scope.toggle = function () {
        $rootScope.mostraFiltro = !$rootScope.mostraFiltro;
      };

      $scope.clearSearch = function () {
        $scope.filter = '';
        $rootScope.mostraFiltro = false;
      };

      function getCotacoesList() {
        $ionicLoading.show();
        $http.get(servidor + '/v1/api.php?req=getCotacoesStatusList&status_cotacao=' + $stateParams.status_cotacao + '&idFornecedor=' + localStorage.getItem('fornecedorLogado'))
          .success(function (data) {
            $timeout(function () {
              $ionicLoading.hide();
            }, 500);
            $scope.dadosCotacaoList = data;
          })
          .error(function (erro) {
            $ionicLoading.hide();
            toastr.error('Desculpe, ocorreu um erro. Tente novamente...');
          });

        $scope.goBackHome = function () {
          $location.path("/side-menu21/home");
        }
      }

    } catch (err) {
      $ionicLoading.hide();
      toastr.error('Desculpe, algo deu errado.', 'Tente novamente...');
    }
  })

  .controller('CotacaoCtrl', function ($scope, $state, $location, $http, $stateParams, toastr, $rootScope,
                                       $ionicHistory, $ionicModal, $ionicLoading, $ionicPopup, $filter, $timeout,
                                       $ionicScrollDelegate, ModalService) {

    try{

      $scope.cotacao = {};
      $scope.$on("$ionicView.beforeLeave", function () {
        $scope.viewEntered = false;
      });
      $scope.viewEntered = false;
      $scope.$on("$ionicView.enter", function () {
        $scope.viewEntered = true;
        $ionicLoading.show();

        $http.get(servidor + '/v1/api.php?req=getCotacaoStatusById&id_cotacao=' + $stateParams.id_cotacao)
          .success(function (data) {
            $timeout(function () {
              $ionicLoading.hide();
            }, 500);
            $scope.dados = data;
          }).error(function (erro) {
          $ionicLoading.hide();
          toastr.error('Desculpe, ocorreu um erro. Tente novamente...');
        });
      });

      $ionicModal.fromTemplateUrl('templates/modal-1.html', {
        id: '1',
        scope: $scope,
        backdropClickToClose: false,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $scope.oModal1 = modal;
      });
      //
      // // Modal 2
      // $ionicModal.fromTemplateUrl('templates/modal-2.html', {
      //   id: '2',
      //   scope: $scope,
      //   backdropClickToClose: false,
      //   animation: 'slide-in-up'
      // }).then(function (modal) {
      //   $scope.oModal2 = modal;
      // });

      $scope.openModal = function (index) {
        $scope.closeMfbMenu = 'closed';
        if (index == 1 && $scope.dados.status_cotacao == "ABERTA") {
          var confirmPopup = $ionicPopup.confirm({
            title: 'Deseja realmente rejeitar\n esta cota????o?',
            cancelText: 'Manter',
            okText: 'Rejeitar'
          });
          confirmPopup.then(function (res) {
            if (res) {
              $scope.rejeitaCotacao();
              $ionicHistory.nextViewOptions({
                disableBack: true
              });
              $timeout(function () {
                $location.path("/side-menu21/home");
              }, 3000);
            }
          });
        } else if ($scope.dados.status_cotacao != "ABERTA") {
          $scope.oModal1.show();
        } else {
          // $scope.oModal2.show();
        }
      };

      $scope.hideSpan = false;
      $scope.closeModal = function (index) {
        try {
          $scope.cotacao = {};
          $scope.hideSpan = true;
          $scope.clearMessageErro();
          $ionicScrollDelegate.scrollTop();

          if (index == 1) {
            $scope.oModal1.hide();
          }
          // else {
          //   $scope.oModal2.hide();
          // }
        } catch (err) {
        }
      };

      $scope.$on('modal.shown', function (event, modal) {
      });

      $scope.$on('modal.hidden', function (event, modal) {
      });

      $scope.$on('$destroy', function () {
        $scope.oModal1.remove();
        // $scope.oModal2.remove();
      });

      $scope.compareDates = function () {

        var dataHoje = new Date();
        dataHoje.setHours(0);
        dataHoje.setMinutes(0);
        dataHoje.setSeconds(0);
        dataHoje.setMilliseconds(0);
        if ($scope.cotacao.data_entrega) {
          if ($scope.cotacao.data_entrega.getTime() < dataHoje.getTime()) {
            $scope.mensagemDataHoje = "data da entrega n??o pode ser menor que a data de hoje";
          }
        }
        if ($scope.cotacao.data_entrega) {
          if ($scope.cotacao.data_entrega.getTime() > $scope.dados.data_evento) {
            $scope.mensagemErro = "data da entrega superior ?? data do evento";
          }
        }
        if ($scope.cotacao.validade) {
          if ($scope.cotacao.validade.getTime() > $scope.dados.data_evento) {
            $scope.mensagemErroValidade = "data de validade superior ?? data do evento";
          }
        }
      }

      $scope.modal2 = function () {
        ModalService
          .init('modal2.html', $scope)
          .then(function (modalForm) {
            try {
              modalForm.show();
              $scope.closeMfbMenu = 'closed';
            } catch (err) {
              $ionicLoading.hide();
              toastr.error('Desculpe, algo deu errado.', 'Tente novamente...');
            }
          });
      };

      var msg = '';

      $scope.rejeitaCotacao = function () {
        $scope.cotacao.statusCotacaoAntes = $scope.cotacao.status_cotacao;
        $scope.cotacao.status_cotacao = 'REJEITADA';
        msg = 'rejeitada';
        enviaEditar();
      }

      $scope.cancelarCotacao = function () {
        if ($scope.cotacao.motivo) {
          $scope.cotacao.statusCotacaoAntes = $scope.cotacao.status_cotacao;
          $scope.cotacao.status_cotacao = 'CANCELADA';
          msg = 'cancelada';
          enviaEditar();
        }
      }

      $scope.responderCotacao = function (formValid) {
        if (formValid && !$scope.mensagemErro && !$scope.mensagemErroValidade) {
          $scope.cotacao.statusCotacaoAntes = $scope.cotacao.status_cotacao;
          $scope.cotacao.status_cotacao = 'PENDENTE';
          msg = 'respondida';
          enviaEditar();
        } else {
          $scope.hideSpan = false;
        }
      }

      $scope.editaCotacao = function () {
        if ($scope.cotacao.motivo && $rootScope.status_cotacao != 'ABERTA') {
          if ($rootScope.status_cotacao == 'escolhida' || $rootScope.status_cotacao == 'concluida') {
            $scope.cotacao.status_cotacao = 'CANCELADA';
            msg = 'cancelada';
          } else {
            $scope.cotacao.status_cotacao = 'REJEITADA';
            msg = 'rejeitada';
          }
          enviaEditar();
        }
      }

      $scope.concluirCotacao = function () {
        msg = 'concluida';
        var confirmPopup = $ionicPopup.confirm({
          title: 'Deseja realmente concluir\n esta cota????o?',
          cancelText: 'N??o',
          okText: 'Sim'
        });
        confirmPopup.then(function (res) {
          if (res) {
            $scope.cotacao.status_cotacao = 'CONCLUIDA';
            enviaEditar();
          }
        });
      }

      function enviaEditar() {
        try {

          $ionicLoading.show();
          $scope.cotacao.id_fornecedor = idFornecedor;
          $scope.cotacao.id_cotacao = $scope.dados.id_cotacao;
          $scope.cotacao.idEventoTipoServico = $scope.dados.idEventoTipoServico;
          $scope.cotacao.data_entrega = $filter('date')($scope.cotacao.data_entrega, "yyyy-MM-dd HH:mm:ss");
          $scope.cotacao.validade = $filter('date')($scope.cotacao.validade, "yyyy-MM-dd HH:mm:ss");

          $http.post(servidor + '/v1/api.php?req=editaCotacao', $scope.cotacao)
            .success(function (data) {
              $scope.closeModal(1);
              $ionicLoading.hide();
              toastr.success('Cota????o ' + msg + ' com sucesso!');
              $ionicHistory.nextViewOptions({
                disableBack: true
              });
              $timeout(function () {
                $scope.cotacao = {};
                $scope.hideSpan = true;
                $scope.clearMessageErro();
                $ionicScrollDelegate.scrollTop();
                if ($scope.dados.status_cotacao == 'ABERTA') {
                  $location.path("/side-menu21/cotacoes-list/aberta");
                } else if ($scope.dados.status_cotacao == 'PENDENTE') {
                  $location.path("/side-menu21/cotacoes-list/pendente");
                } else if ($scope.dados.status_cotacao == 'ESCOLHIDA') {
                  $location.path("/side-menu21/cotacoes-list/escolhida");
                } else if ($scope.dados.status_cotacao == 'CONCLUIDA') {
                  $location.path("/side-menu21/cotacoes-list/concluida");
                }
              }, 3000);
            })
            .error(function (erro) {
              $ionicLoading.hide();
              toastr.error('Desculpe, ocorreu um erro. Tente novamente...');
            });

        } catch (err) {
          $ionicLoading.hide();
          toastr.error('Desculpe, ocorreu um erro. Tente novamente...');
        }
      }

      $scope.clearMessageErro = function () {
        $scope.mensagemErro = "";
        $scope.mensagemErroValidade = "";
        $scope.mensagemDataHoje = "";
      }

      $scope.$on('$locationChangeStart', function () {
        $scope.closeMfbMenu = 'closed';
        delete $scope.dados;
        delete $scope.cotacao;
      });

    } catch (err) {
      $ionicLoading.hide();
      toastr.error('Desculpe, algo deu errado.', 'Tente novamente...');
    }

  })

  .controller('AgendaCtrl', function ($scope, $ionicModal, $ionicPopup, $filter, $rootScope, $http, toastr,
                                      $ionicLoading, $ionicScrollDelegate, $timeout) {

    try {

      $scope.$on("$ionicView.enter", function () {
        $scope.viewEntered = true;
        $scope.getAgenda();
        idUsuario = localStorage.getItem("usuarioLogado");
        idFornecedor = localStorage.getItem("fornecedorLogado");
      });
      $scope.$on("$ionicView.beforeLeave", function () {
        $scope.viewEntered = false;
      });

      $ionicLoading.show();

      $scope.getAgenda = function () {
        $http.get(servidor + '/v1/api.php?req=getAgendaList&idFornecedor=' + idFornecedor + '&idUsuario=' + idUsuario + '&mesSelecionado=' + $scope.numeroMes + '&anoSelecionado=' + $scope.anoAtual)
          .success(function (data) {
            $timeout(function () {
              $ionicLoading.hide();
            }, 500);
            $scope.dados = data;
          }).error(function (erro) {
          $ionicLoading.hide();
          toastr.error('Desculpe, ocorreu um erro. Tente novamente...');
        });
      }

      var weekDaysList = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "S??b"];
      var monthList = ["Janeiro", "Feveiro", "Mar??o", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
      $scope.agenda = {};
      $scope.dadosAgenda = {};

      var dataHoje = new Date();
      $scope.numeroMes = dataHoje.getMonth() + 1;
      $scope.anoAtual = dataHoje.getFullYear();
      getMes($scope.numeroMes);

      $scope.getPreviousMonth = function () {
        $scope.resultMes = angular.equals($scope.numeroMes, 1);
        if ($scope.resultMes == true) {
          $scope.numeroMes = 12;
          getMes($scope.numeroMes);
          $scope.anoAtual = parseInt($scope.anoAtual) - 1;
          $scope.getAgenda();
        } else {
          $scope.numeroMes = $scope.numeroMes - 1;
          getMes($scope.numeroMes);
          $scope.getAgenda();
        }
      }

      $scope.getNextMonth = function () {
        $scope.resultMes = angular.equals($scope.numeroMes, 12);
        if ($scope.resultMes == true) {
          $scope.numeroMes = 1;
          getMes($scope.numeroMes);
          $scope.anoAtual = parseInt($scope.anoAtual) + 1;
          $scope.getAgenda();
        } else {
          $scope.numeroMes = $scope.numeroMes + 1;
          getMes($scope.numeroMes);
          $scope.getAgenda();
        }
      }

      // Modal 3 - Agenda
      $ionicModal.fromTemplateUrl('templates/modal-3.html', {
        id: '3',
        scope: $scope,
        backdropClickToClose: false,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $scope.oModal3 = modal;
      });

      $scope.openModal = function (index, idAgenda) {
        $scope.oModal3.show();
        $scope.idAgenda = idAgenda;

        if (idAgenda) {
          $http.get(servidor + '/v1/api.php?req=getAgendaById&idAgenda=' + idAgenda)
            .success(function (data) {
              $scope.dadosAgenda = data;
              $scope.dadosAgenda.dataInicialModal = new Date($scope.dadosAgenda.dataInicial);
              $scope.dadosAgenda.dataFinalModal = new Date($scope.dadosAgenda.dataFinal);
              $scope.dadosAgenda.horaInicialModal = new Date($scope.dadosAgenda.dataInicial);
              $scope.dadosAgenda.horaFinalModal = new Date($scope.dadosAgenda.dataFinal);
            })
            .error(function (erro) {
              $ionicLoading.hide();
              toastr.error('Desculpe, ocorreu um erro. Tente novamente...');
            });
        }
      };

      $scope.hideSpan = false;

      $scope.closeModal = function (index) {
        $scope.getAgenda();
        $scope.oModal3.hide();
        $scope.dadosAgenda = {};
        $scope.idAgenda = null; // TESTAR ISSO
        $scope.dadosAgenda.tituloAgenda = "";
        $scope.dadosAgenda.descricao = "";
        $scope.hideSpan = true;
        $scope.clearMessageErroAgenda();
        $scope.clearMessageErroHoraAgenda();
        $ionicScrollDelegate.scrollTop();
      };

      $scope.$on('modal.shown', function (event, modal) {
      });

      $scope.$on('modal.hidden', function (event, modal) {
      });

      $scope.$on('$destroy', function () {
        $scope.oModal3.remove();
      });

      $scope.tiposNotificacao = [
        {tipoNotificacao: 'SEM_NOTIFICACAO', label: 'Sem notifica????o'},
        {tipoNotificacao: 'HORA_DO_EVENTO', label: 'Hora do evento'},
        {tipoNotificacao: 'TRINTA_MINUTO_ANTES', label: '30 minutos antes'},
        {tipoNotificacao: 'UMA_HORA_ANTES', label: '1 hora antes'},
        {tipoNotificacao: 'UM_DIA_ANTES', label: '1 dia antes'},
        {tipoNotificacao: 'UMA_SEMANA_ANTES', label: '1 semana antes'}
      ];

      $scope.tiposAgenda = [
        {tipoAgenda: 'USUARIO', label: 'Evento do usu??rio'},
        {tipoAgenda: 'FORNECEDOR', label: 'Evento do fornecedor'}
      ];

      $scope.incluirAgenda = function (formValid) {
        $scope.dadosAgenda.idFornecedor = idFornecedor;
        $scope.dadosAgenda.idUsuario = idUsuario;
        $scope.dadosAgenda.idAgenda = $scope.idAgenda;

        var dia = $scope.dadosAgenda.dataInicialModal.getDate();
        var mes = $scope.dadosAgenda.dataInicialModal.getMonth();
        var ano = $scope.dadosAgenda.dataInicialModal.getFullYear();
        var hora = $scope.dadosAgenda.horaInicialModal.getHours();
        var minutos = $scope.dadosAgenda.horaInicialModal.getMinutes();
        $scope.dadosAgenda.dataInicial = new Date(ano, mes, dia, hora, minutos, 00, 000).toLocaleString();

        var diaF = $scope.dadosAgenda.dataFinalModal.getDate();
        var mesF = $scope.dadosAgenda.dataFinalModal.getMonth();
        var anoF = $scope.dadosAgenda.dataFinalModal.getFullYear();
        var horaF = $scope.dadosAgenda.horaFinalModal.getHours();
        var minutosF = $scope.dadosAgenda.horaFinalModal.getMinutes();
        $scope.dadosAgenda.dataFinal = new Date(anoF, mesF, diaF, horaF, minutosF, 00, 000).toLocaleString();
        $scope.compareDatesAgenda();
        if (formValid && !$scope.mensagemErro && !$scope.mensagemErroHora) {
          if ($scope.idAgenda) {
            $http.post(servidor + '/v1/api.php?req=editAgenda', $scope.dadosAgenda)
              .success(function (data) {
                $scope.getAgenda();
                toastr.success('Agenda alterada com sucesso!');
                $scope.closeModal(3);
              })
              .error(function (erro) {
                $ionicLoading.hide();
                toastr.error('Desculpe, ocorreu um erro. Tente novamente...');
              });
          } else {
            $http.post(servidor + '/v1/api.php?req=incluirAgenda', $scope.dadosAgenda)
              .success(function (data) {
                $scope.dadosAgenda.dataInicial = $scope.dadosAgenda.dataInicialModal.toLocaleDateString();
                $scope.dadosAgenda.idAgenda = data;
                $scope.dados.push($scope.dadosAgenda);
                toastr.success('Agenda salva com sucesso!');
                $scope.closeModal(3);
                $scope.dadosAgenda = {};
              })
              .error(function (erro) {
                $ionicLoading.hide();
                toastr.error('Desculpe, ocorreu um erro. Tente novamente...');
              });
          }
        } else {
          $scope.hideSpan = false;
        }
      }

      $scope.removerAgenda = function (dado) {
        var confirmPopup = $ionicPopup.confirm({
          title: 'Esta agenda ser?? excluida.\nConfirma exclus??o?',
          cancelText: 'Cancelar',
          okText: 'Excluir'
        });
        confirmPopup.then(function (res) {
          if (res) {
            $http.post(servidor + '/v1/api.php?req=removeAgenda&idAgenda=' + dado.idAgenda, dado)
              .success(function (data) {
                var indiceAg = $scope.dados.indexOf(dado);
                $scope.dados.splice(indiceAg, 1);
              })
              .error(function (erro) {
                $ionicPopup.alert({
                  title: 'N??o foi poss??vel remover!',
                  content: ''
                }).then(function (res) {
                });
              });
            toastr.success('Agenda excluida com sucesso!');
          }
        });
      }

      $scope.selectedDates = [];
      $scope.datepickerObject = {
        templateType: 'POPUP', // POPUP | MODAL
        modalFooterClass: 'bar-light',
        //header: 'multi-date-picker',
        headerClass: 'royal-bg light',
        btnsIsNative: false,
        btnOk: 'OK',
        btnOkClass: 'button-clear cal-green',
        btnCancel: 'Fechar',
        btnCancelClass: 'button-clear button-dark',
        //btnTodayShow: true,
        btnToday: 'Today',
        btnTodayClass: 'button-clear button-dark',
        //btnClearShow: true,
        btnClear: 'Clear',
        btnClearClass: 'button-clear button-dark',
        selectType: 'SINGLE', // SINGLE | PERIOD | MULTI
        tglSelectByWeekShow: false, // true | false (default)
        tglSelectByWeek: 'By week',
        isSelectByWeek: false, // true (default) | false
        selectByWeekMode: 'NORMAL', // INVERSION (default), NORMAL
        tglSelectByWeekClass: 'toggle-positive',
        titleSelectByWeekClass: 'positive positive-border',
        accessType: 'WRITE', // READ | WRITE
        //fromDate: new Date(2015, 9),
        //toDate: new Date(2016, 1),
        selectedDates: $scope.selectedDates,
        conflictSelectedDisabled: 'DISABLED', // SELECTED | DISABLED
        closeOnSelect: false,
        mondayFirst: false,
        weekDaysList: weekDaysList,
        monthList: monthList,

        callback: function (dates) { //Mandatory
          retSelectedDates(dates);
          openModalAgenda();
        }
      };

      var openModalAgenda = function () {
        $scope.oModal3.show();
      };

      var retSelectedDates = function (dates) {
        var date = new Date(dates);
        if (date == 'Invalid Date') {
          $scope.dadosAgenda.dataInicialModal = new Date();
          $scope.dadosAgenda.dataFinalModal = new Date();
        } else {
          $scope.dadosAgenda.dataInicialModal = date;
          $scope.dadosAgenda.dataFinalModal = date;
        }
        $scope.dadosAgenda.horaInicialModal = new Date();
        $scope.dadosAgenda.horaFinalModal = new Date();
      };

      function getMes(mes) {
        switch (mes) {
          case 1:
            $scope.nomeMes = 'Janeiro';
            $scope.numeroMes = 1;
            break;
          case 2:
            $scope.nomeMes = 'Fevereiro';
            $scope.numeroMes = 2;
            break;
          case 3:
            $scope.nomeMes = 'Mar??o';
            $scope.numeroMes = 3;
            break;
          case 4:
            $scope.nomeMes = 'Abril';
            $scope.numeroMes = 4;
            break;
          case 5:
            $scope.nomeMes = 'Maio';
            $scope.numeroMes = 5;
            break;
          case 6:
            $scope.nomeMes = 'Junho';
            $scope.numeroMes = 6;
            break;
          case 7:
            $scope.nomeMes = 'Julho';
            $scope.numeroMes = 7;
            break;
          case 8:
            $scope.nomeMes = 'Agosto';
            $scope.numeroMes = 8;
            break;
          case 9:
            $scope.nomeMes = 'Setembro';
            $scope.numeroMes = 9;
            break;
          case 10:
            $scope.nomeMes = 'Outubro';
            $scope.numeroMes = 10;
            break;
          case 11:
            $scope.nomeMes = 'Novembro';
            $scope.numeroMes = 11;
            break;
          case 12:
            $scope.nomeMes = 'Dezembro';
            $scope.numeroMes = 12;
            break;
        }
      }

      var horaInicialModal = "";
      var horaFinalModal = "";
      var dataInicialModal = "";
      var dataFinalModal = "";

      $scope.compareDatesAgenda = function () {
        if ($scope.dadosAgenda.diaInteiro != 1) {
          horaInicialModal = $filter('date')($scope.dadosAgenda.horaInicialModal, "HH:mm");
          horaFinalModal = $filter('date')($scope.dadosAgenda.horaFinalModal, "HH:mm");
        } else {
          horaInicialModal = '0';
          horaFinalModal = '0';
        }
        dataInicialModal = $filter('date')($scope.dadosAgenda.dataInicialModal, "dd/MM/yyyy");
        dataFinalModal = $filter('date')($scope.dadosAgenda.dataFinalModal, "dd/MM/yyyy");

        if (dataFinalModal < dataInicialModal || horaFinalModal < horaInicialModal) {
          $scope.mensagemErro = "data/hora final menor que a inicial";
        }
      }
      $scope.clearMessageErroAgenda = function () {
        $scope.mensagemErro = "";
      }
      $scope.clearMessageErroHoraAgenda = function () {
        $scope.mensagemErroHora = "";
      }
      $scope.$on('$locationChangeStart', function () {
        localStorage.removeItem("redirectNotification");
      });

    } catch (err) {
      $ionicLoading.hide();
      toastr.error('Desculpe, algo deu errado.', 'Tente novamente...');
    }

  })

  .controller('usuarioCtrl', function($scope, $state, $q, UserService, $ionicLoading, $location, $http) {

    try {

      $http.get(servidor + '/v1/api.php?req=setTokenIdUsuario&idUsuario=' + idUsuario + '&token=' + localStorage.getItem('token'))
        .success(function (data) {
        });

    } catch (err) {
      $ionicLoading.hide();
      toastr.error('Desculpe, algo deu errado.', 'Tente novamente...');
    }
  })

  .controller('AlterarSenhaCtrl', function ($scope, $stateParams, $http, $ionicHistory,
                                            toastr, $location, $timeout, $rootScope, $ionicSideMenuDelegate, $ionicLoading) {

    try {

      $scope.result;
      $scope.senhaOk = false;
      $scope.senhaAtualOk = false;
      $scope.novaSenha = {};
      $scope.hideSpan = false;
      $scope.novaSenha.idFornecedor = idFornecedor;
      $scope.novaSenha.idUsuario = idUsuario;

      $scope.$on('$ionicView.beforeEnter', function (e, data) {
        $scope.$root.showMenuIcon = false;
        if ($rootScope.statusReset == 1) {
          $scope.$root.showMenuIcon = false;
          $ionicSideMenuDelegate.canDragContent(false);
        } else {
          $scope.$root.showMenuIcon = true;
        }
      });

      $scope.verificaSenha = function () {
        $http.post(servidor + '/v1/api.php?req=verificaSenha', $scope.novaSenha)
          .success(function (data) {
            if (data) {
              localStorage.setItem("usuarioLogado", idUsuario);
              $scope.senhaAtualOk = true;
              $scope.mensagemSenha = "";
            } else {
              $scope.mensagemSenha = "senha atual n??o confere";
            }
          })
          .error(function (erro) {
            $ionicLoading.hide();
            toastr.error('Desculpe, ocorreu um erro. Tente novamente...');
          });
      }

      $scope.verificaContrasenha = function () {
        $scope.result = angular.equals($scope.novaSenha.confSenha, $scope.novaSenha.senha);
        if ($scope.result == false) {
          $scope.mensagem = "as senhas n??o conferem";
        } else {
          $scope.senhaOk = true;
          $scope.mensagem = "";
          submeter();
        }
      }

      function submeter() {
        $scope.hideSpan = false;
        if ($scope.senhaOk && $scope.senhaAtualOk) {
          if ($scope.alterarSenhaForm.$valid) {
            $http.post(servidor + '/v1/api.php?req=editSenha', {'novaSenha': $scope.novaSenha})
              .success(function (data) {
                $ionicHistory.nextViewOptions({
                  disableBack: true
                });
                toastr.success('Senha alterada com sucesso! Aguarde...');
                $timeout(function () {
                  $location.path("/side-menu21/home");
                }, 3000);
                clearFormNovaSenha();
              })
              .error(function (erro) {
                $ionicLoading.hide();
                toastr.error('Desculpe, ocorreu um erro. Tente novamente...');
              });
          }
        }
      }

      function clearFormNovaSenha() {
        $scope.novaSenha.senha = "";
        $scope.novaSenha.confSenha = "";
        $scope.novaSenha.senhaAtual = "";
        $scope.clearMessageSenha();
        $scope.hideSpan = true;
      }

      $scope.clearMessageSenha = function () {
        $scope.mensagemSenha = "";
        $scope.mensagem = "";
      }

      $scope.$on('$locationChangeStart', function () {
        $scope.clearMessageSenha();
        clearFormNovaSenha();
      });


    } catch (err) {
      $ionicLoading.hide();
      toastr.error('Desculpe, algo deu errado.', 'Tente novamente...');
    }

  })

  .controller('RecuperarSenhaCtrl', function($scope, $stateParams, $http, toastr, $ionicPopup, $ionicHistory, $location, $ionicLoading) {

    try {

      var recuperarSenha = {};
      $scope.submeterNovaSenha = function () {
        $scope.hideSpan = false;
        if ($scope.recuperarSenhaForm.$valid) {
          recuperarSenha.email = $scope.recuperarSenha.email;
          $ionicLoading.show();
          $http.post(servidor + '/v1/api.php?req=enviarEmailSenha', {'recuperarSenha': recuperarSenha})
            .success(function (data) {
              $ionicLoading.hide();
              var alertPopup = $ionicPopup.alert({
                title: 'Uma nova senha foi enviada para seu e-mail!',
                buttons: [
                  {
                    text: '<b>Ok</b>',
                    type: 'button-positive'
                  }
                ]
              }).then(function (res) {
                $scope.clearFormResetSenha();
                $ionicHistory.nextViewOptions({
                  disableBack: true
                });
                $location.path("/side-menu21/login");
              });
            })
            .error(function (erro) {
              $ionicLoading.hide();
              $scope.mensagem = "e-mail n??o encontrado!";
            });
        }
      }

      $scope.clearFormResetSenha = function () {
        $scope.recuperarSenha = {};
        $scope.hideSpan = true;
        $scope.mensagem = "";
      }

      $scope.$on('$locationChangeStart', function () {
        $scope.clearFormResetSenha();
      });

    } catch (err) {
      $ionicLoading.hide();
      toastr.error('Desculpe, algo deu errado.', 'Tente novamente...');
    }

  });
