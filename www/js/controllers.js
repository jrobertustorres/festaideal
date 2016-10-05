var servidor = "http://localhost";
// var servidor = "http://festaideal.com.br/ws_mobile";
var idFornecedor = 1;
// var idFornecedor = 0;
var idUsuario = 1;
// var idUsuario = 0;

angular.module('app.controllers', [])

  .controller('homeCtrl', function ($scope, $http, $ionicLoading, $rootScope) {

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
        })
        .error(function (erro) {
          toastr.error('Desculpe, ocorreu um erro. Tente novamente...');
        });
    });

    $scope.doRefresh = function () {
      $http.get(servidor + '/v1/api.php?req=getCockpit&idFornecedor=' + idFornecedor)
        .success(function (data) {
          $scope.cotacao_aberta = data.cotacao_aberta ? data.cotacao_aberta : 0;
          $scope.cotacao_pendente = data.cotacao_pendente ? data.cotacao_pendente : 0;
          $scope.cotacao_escolhida = data.cotacao_escolhida ? data.cotacao_escolhida : 0;
          $scope.cotacao_cancelada = data.cotacao_cancelada ? data.cotacao_cancelada : 0;
          $scope.cotacao_concluida = data.cotacao_concluida ? data.cotacao_concluida : 0;
        }).finally(function () {
        $scope.$broadcast('scroll.refreshComplete');
      });
    }

    $scope.usuario = {};
    $scope.usuario.idUsuario = idUsuario;
    $scope.usuario.tokenPush = $rootScope.token;
    $http.post(servidor + '/v1/api.php?req=setToken', {'usuario': $scope.usuario})
      .success(function (data) {
      });
  })

  .controller('menuCtrl', function ($scope, $ionicPopup, $ionicHistory, $location) {
    $scope.doLogout = function () {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Deseja realmente sair?',
        cancelText: 'Cancelar',
        okText: 'Sair'
      });
      confirmPopup.then(function (res) {
        if (res) {
          idFornecedor = 0;
          idUsuario = 0;
          $ionicHistory.nextViewOptions({
            disableBack: true
          });
          $location.path("/side-menu21/login");

          /*$http.get(servidor + '/v1/api.php?req=doLogOut&idUsuario=' + idUsuario)
           .success(function (data) {
           idFornecedor = 0;
           idUsuario = 0;
           if (data) {
           $ionicHistory.nextViewOptions({
           disableBack: true
           });
           $location.path("/side-menu21/login");
           } else {
           toastr.error('Desculpe, ocorreu um erro. Tente novamente...');
           }
           });*/
        } else {

        }
      });
    }

    /*function executeDeleteUsuario() {
     var query = "DELETE FROM usuario";
     $cordovaSQLite.execute(db, query).then(function(res) {
     }, function (err) {
     console.error(err);
     });
     }*/
  })

  .controller('loginCtrl', function ($scope, $state, $ionicLoading, $location, $http, $ionicHistory) {

    // $scope.clearForm = false;

    $scope.submeter = function () {
      $scope.clearForm = false;
      console.log('campo email '+$scope.login);
      if ($scope.loginForm.$valid) {
        console.log('dentro do if '+$scope.mensagem);
        $ionicLoading.show();
        // $http.get(servidor + '/v1/api.php?req=doLogin&login=' + $scope.login + '&senha=' + $scope.senha + '&cookie=' + $rootScope.token)
        $http.get(servidor + '/v1/api.php?req=doLogin&login=' + $scope.login + '&senha=' + $scope.senha)
          .success(function (data) {
            $ionicLoading.hide();
            idFornecedor = data.idFornecedor;
            idUsuario = data.idUsuario;
            if (data) {
              $ionicHistory.nextViewOptions({
                disableBack: true
              });
              $location.path("/side-menu21/home");
            } else {
              $scope.mensagem = "usuário ou senha inválido";
              console.log('mensagem '+$scope.mensagem);
            }
          });
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
  })

  .controller('CotacoesListCtrl', function ($scope, $state, $location, $http, $ionicConfig, $stateParams, $rootScope, toastr) {
    // $scope.$on('$ionicView.enter', function () {
      getCotacoesList();
    // });
    $ionicConfig.backButton.text("");
    $rootScope.status_cotacao = $stateParams.status_cotacao;
    $scope.pagetitle = 'Cotação ' + $scope.status_cotacao;

    $rootScope.mostraFiltro = false;
    $scope.toggle = function () {
      $rootScope.mostraFiltro = !$rootScope.mostraFiltro;
    };

    $scope.clearSearch = function () {
      $scope.filter = '';
      $rootScope.mostraFiltro = false;
    };

    // var filterBarInstance;

    function getCotacoesList() {
      $http.get(servidor + '/v1/api.php?req=getCotacoesStatusList&status_cotacao=' + $stateParams.status_cotacao + '&idFornecedor=' + idFornecedor)
        .success(function (data) {
          $scope.dados = data;
        })
        .error(function (erro) {
          toastr.error('Desculpe, ocorreu um erro. Tente novamente...');
        });
    }
  })

  .controller('CotacaoCtrl', function ($scope, $state, $location, $http, $stateParams, toastr, $rootScope, $ionicHistory, $ionicModal, $ionicLoading, $ionicPopup, $filter, $timeout, $ionicScrollDelegate) {

    $ionicLoading.show();
    $scope.cotacao = {};
    $http.get(servidor + '/v1/api.php?req=getCotacaoStatusById&id_cotacao=' + $stateParams.id_cotacao)
      .success(function (data) {
        $ionicLoading.hide();
        $scope.dados = data;
      }).error(function (erro) {
      toastr.error('Desculpe, ocorreu um erro. Tente novamente...');
    });

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
      $scope.closeMfbMenu = 'closed';
      if (index == 1 && $scope.dados.status_cotacao == "ABERTA") {
        var confirmPopup = $ionicPopup.confirm({
          title: 'Deseja realmente rejeitar\n esta cotação?',
          cancelText: 'Cancelar',
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
          } else {
          }
        });
      } else if ($scope.dados.status_cotacao != "ABERTA") {
        $scope.oModal1.show();
      } else {
        $scope.oModal2.show();
      }
    };

    $scope.hideSpan = false;
    $scope.closeModal = function (index) {
      if (index == 1) $scope.oModal1.hide();
      else $scope.oModal2.hide();
      $scope.cotacao = {};
      $scope.hideSpan = true;
      $scope.clearMessageErro();
      $ionicScrollDelegate.scrollTop();
    };

    $scope.$on('modal.shown', function (event, modal) {
    });

    $scope.$on('modal.hidden', function (event, modal) {
    });

    $scope.$on('$destroy', function () {
      $scope.oModal1.remove();
      $scope.oModal2.remove();
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

    $scope.responderCotacao = function (formValid) {
      if (formValid && !$scope.mensagemErro && !$scope.mensagemErroValidade) {
        $scope.cotacao.status_cotacao = 'PENDENTE';
        msg = 'enviada';
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
      } else {
      }
    }

    function enviaEditar() {
      $scope.cotacao.id_fornecedor = idFornecedor;
      $scope.cotacao.id_cotacao = $scope.dados.id_cotacao;
      $scope.cotacao.idEventoTipoServico = $scope.dados.idEventoTipoServico;
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
          $timeout(function () {
            $location.path("/side-menu21/home");
          }, 3000);
        })
        .error(function (erro) {
          toastr.error('Desculpe, ocorreu um erro. Tente novamente...');
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
        } else {
        }
      });
    }

    $scope.clearMessageErro = function () {
      $scope.mensagemErro = "";
      $scope.mensagemErroValidade = "";
    }

    $scope.compareDates = function () {
      var data_entrega = $filter('date')($scope.cotacao.data_entrega, "dd/MM/yyyy");
      var validade = $filter('date')($scope.cotacao.validade, "dd/MM/yyyy");

      if (data_entrega > $scope.dados.data_evento) {
        $scope.mensagemErro = "data da entrega superior à data do evento";
      }

      if (validade < $scope.dados.data_evento) {
        $scope.mensagemErroValidade = "data de validade inferior à data do evento";
      }
    }

    $scope.$on('$locationChangeStart', function () {
      $scope.closeMfbMenu = 'closed';
    });

  })

  .controller('AgendaCtrl', function ($scope, $ionicModal, $ionicPopup, $filter, $rootScope, $http, toastr, $ionicLoading, $ionicScrollDelegate) {
      var weekDaysList = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
      var monthList = ["Janeiro", "Feveiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
      $scope.agenda = {};
      $scope.dadosAgenda = {};
      getAgenda();
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
          getAgenda();
        } else {
          $scope.numeroMes = $scope.numeroMes - 1;
          getMes($scope.numeroMes);
          getAgenda();
        }
      }

      $scope.getNextMonth = function () {
        $scope.resultMes = angular.equals($scope.numeroMes, 12);
        if ($scope.resultMes == true) {
          $scope.numeroMes = 1;
          getMes($scope.numeroMes);
          $scope.anoAtual = parseInt($scope.anoAtual) + 1;
          getAgenda();
        } else {
          $scope.numeroMes = $scope.numeroMes + 1;
          getMes($scope.numeroMes);
          getAgenda();
        }
      }

      $ionicLoading.show();
      function getAgenda() {
        $http.get(servidor + '/v1/api.php?req=getAgendaList&idFornecedor=' + idFornecedor + '&idUsuario=' + idUsuario + '&mesSelecionado=' + $scope.numeroMes + '&anoSelecionado=' + $scope.anoAtual)
          .success(function (data) {
            $ionicLoading.hide();
            $scope.dados = data;
          }).error(function (erro) {
          toastr.error('Desculpe, ocorreu um erro. Tente novamente...');
        });
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
              toastr.error('Desculpe, ocorreu um erro. Tente novamente...');
            });
        }
      };

      $scope.hideSpan = false;

      $scope.closeModal = function (index) {
        $scope.oModal3.hide();
        $scope.dadosAgenda = {};
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
        {tipoNotificacao: 'SEM_NOTIFICACAO', label: 'Sem notificação'},
        {tipoNotificacao: 'HORA_DO_EVENTO', label: 'Hora do evento'},
        {tipoNotificacao: 'TRINTA_MINUTO_ANTES', label: '30 minutos antes'},
        {tipoNotificacao: 'UMA_HORA_ANTES', label: '1 hora antes'},
        {tipoNotificacao: 'UM_DIA_ANTES', label: '1 dia antes'},
        {tipoNotificacao: 'UMA_SEMANA_ANTES', label: '1 semana antes'}
      ];

      $scope.tiposAgenda = [
        {tipoAgenda: 'USUARIO', label: 'Evento do usuário'},
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
                getAgenda();
                toastr.success('Agenda alterada com sucesso!');
                $scope.closeModal(3);
              })
              .error(function (erro) {
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
                toastr.error('Desculpe, ocorreu um erro. Tente novamente...');
              });
          }
        } else {
          $scope.hideSpan = false;
        }
      }

      $scope.removerAgenda = function (dado) {
        var confirmPopup = $ionicPopup.confirm({
          title: 'Esta agenda será excluida.\nConfirma exclusão?',
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
                  title: 'Não foi possível remover!',
                  content: ''
                }).then(function (res) {
                });
              });
            toastr.success('Agenda excluida com sucesso!');
          } else {
          }
        });
      }

      // $scope.selectedDates = [s1, s2, s3, s4, s0, s5, s6, s7];
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
        //showErrors: true, // true (default), false
        //errorLanguage: 'RU', // EN | RU

        //fromDate: new Date(2015, 9),
        //toDate: new Date(2016, 1),

        selectedDates: $scope.selectedDates,
        //viewMonth: $scope.selectedDates, //
        // disabledDates: disabledDates,

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
        $scope.dadosAgenda.dataInicialModal = date;
        $scope.dadosAgenda.dataFinalModal = date;
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
            $scope.nomeMes = 'Março';
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

      $scope.compareDatesAgenda = function () {
        var dataInicialModal = $filter('date')($scope.dadosAgenda.dataInicialModal, "dd/MM/yyyy");
        var dataFinalModal = $filter('date')($scope.dadosAgenda.dataFinalModal, "dd/MM/yyyy");
        var horaInicialModal = $filter('date')($scope.dadosAgenda.horaInicialModal, "HH:mm");
        var horaFinalModal = $filter('date')($scope.dadosAgenda.horaFinalModal, "HH:mm");

        if (dataFinalModal < dataInicialModal || horaFinalModal < horaInicialModal) {
          $scope.mensagemErro = "data/hora final menor que a inicial";
        }
      }

      $scope.compareHoraAgenda = function () {
        var horaInicialModal = $filter('date')($scope.dadosAgenda.horaInicialModal, "HH:mm");
        var horaFinalModal = $filter('date')($scope.dadosAgenda.horaFinalModal, "HH:mm");

        if (horaFinalModal < horaInicialModal) {
          $scope.mensagemErroHora = "hora final menor que a hora inicial";
        }

      }

      $scope.clearMessageErroAgenda = function () {
        $scope.mensagemErro = "";
      }

      $scope.clearMessageErroHoraAgenda = function () {
        $scope.mensagemErroHora = "";
      }
    }
  )

  .controller('usuarioCtrl', function ($scope, $state, $q, UserService, $ionicLoading, $location, $http, $ionicHistory, Token) {
    $scope.answer = Token.token($scope.token);
    $http.get(servidor + '/v1/api.php?req=setToken&idFornecedor=' + $idFornecedor)
      .success(function (data) {
        // idFornecedor = data.id_fornecedor;
        // if (data) {
        //     $ionicHistory.nextViewOptions({
        //         disableBack: true
        //     });
        //     $location.path("/side-menu21/home");
        // } else {
        //     $scope.mensagem = "usuário ou senha inválido";
        // }
      });
  })

  .controller('AlterarSenhaCtrl', function ($scope, $stateParams, $http, $ionicHistory, toastr, $location, $timeout) {

    $scope.result;
    $scope.senhaOk = false;
    $scope.senhaAtualOk = false;
    $scope.novaSenha = {};
    $scope.hideSpan = false;
    $scope.novaSenha.idFornecedor = idFornecedor;
    $scope.novaSenha.idUsuario = idFornecedor;

    $scope.verificaSenha = function () {
      $http.post(servidor + '/v1/api.php?req=verificaSenha', $scope.novaSenha)
        .success(function (data) {
          if (data) {
            $scope.senhaAtualOk = true;
            $scope.mensagemSenha = "";
          } else {
            $scope.mensagemSenha = "senha atual não confere";
          }
        });
    }

    $scope.verificaContrasenha = function () {
      $scope.result = angular.equals($scope.novaSenha.confSenha, $scope.novaSenha.senha);
      if ($scope.result == false) {
        $scope.mensagem = "as senhas não conferem";
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
              toastr.success('Senha alterada com sucesso!');
              $timeout(function () {
                $location.path("/side-menu21/home");
              }, 3000);
              clearFormNovaSenha();

            })
            .error(function (erro) {
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
  })

  .controller('RecuperarSenhaCtrl', function ($scope, $stateParams, $http, toastr, $ionicPopup, $ionicHistory, $location, $ionicLoading, $ionicConfig) {
    $ionicConfig.backButton.text("");
    var recuperarSenha = {};
    $scope.submeter = function () {
      $scope.hideSpan = false;
      if ($scope.recuperarSenhaForm.$valid) {
        recuperarSenha.email = $scope.recuperarSenha.email;
        recuperarSenha.idUsuario = idUsuario;
        $ionicLoading.show();
        $http.post(servidor + '/v1/api.php?req=enviarEmailSenha', {'recuperarSenha': recuperarSenha})
          .success(function (data) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
              title: 'Um link com a nova senha foi enviado para seu e-mail!',
              buttons: [
                {
                  text: '<b>Ok</b>',
                  type: 'button-positive'
                }
              ]
            }).then(function (res) {
              clearFormResetSenha();
              $ionicHistory.nextViewOptions({
                disableBack: true
              });
              $location.path("/side-menu21/login");
            });
          })
          .error(function (erro) {
            toastr.error('Desculpe, ocorreu um erro. Tente novamente...');
          });
      }
    }

    function clearFormResetSenha() {
      $scope.recuperarSenha = {};
      $scope.hideSpan = true;
    }

    $scope.$on('$locationChangeStart', function () {
      // $scope.clearMessageSenha();
      clearFormResetSenha();
    });
  })
;
