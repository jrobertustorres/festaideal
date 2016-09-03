var servidor = "http://localhost";
// var servidor = "http://festaideal.com.br/ws_mobile";
var idFornecedor = 1;
// var idFornecedor = 0;

angular.module('app.controllers', [])

.controller('homeCtrl', function($scope, $http, $ionicLoading, Token) {

    $scope.$on('$ionicView.enter', function() {
        $scope.pagetitle = 'Cotações';
        $ionicLoading.show({ template: '<ion-spinner icon="spiral"></ion-spinner>' });

        $http.get(servidor + '/v1/api.php?req=getCockpit&idFornecedor=' + idFornecedor)
            .success(function(data) {
                $ionicLoading.hide();
                $scope.cotacao_aberta = data.cotacao_aberta ? data.cotacao_aberta : 0;
                $scope.cotacao_pendente = data.cotacao_pendente ? data.cotacao_pendente : 0;
                $scope.cotacao_escolhida = data.cotacao_escolhida ? data.cotacao_escolhida : 0;
                $scope.cotacao_cancelada = data.cotacao_cancelada ? data.cotacao_cancelada : 0;
                $scope.cotacao_concluida = data.cotacao_concluida ? data.cotacao_concluida : 0;
            })
    });

    $scope.doRefresh = function() {
        $http.get(servidor + '/v1/api.php?req=getCockpit&idFornecedor=' + idFornecedor)
            .success(function(data) {
                $scope.cotacao_aberta = data.cotacao_aberta ? data.cotacao_aberta : 0;
                $scope.cotacao_pendente = data.cotacao_pendente ? data.cotacao_pendente : 0;
                $scope.cotacao_escolhida = data.cotacao_escolhida ? data.cotacao_escolhida : 0;
                $scope.cotacao_cancelada = data.cotacao_cancelada ? data.cotacao_cancelada : 0;
                $scope.cotacao_concluida = data.cotacao_concluida ? data.cotacao_concluida : 0;
            }).finally(function() {
                // Stop the ion-refresher from spinning
                $scope.$broadcast('scroll.refreshComplete');
            });
    }

    $scope.usuario = {};
    $scope.usuario.idFornecedor = idFornecedor;
    $scope.usuario.tokenPush = Token.token;
    $http.post(servidor + '/v1/api.php?req=setToken', { 'usuario': $scope.usuario })
        .success(function(data) {});

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

.controller('menuCtrl', function($scope, $ionicPopup, $ionicHistory, $location) {
    $scope.doLogout = function() {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Deseja realmente sair?',
            cancelText: 'Não',
            okText: 'Sair'
        });
        confirmPopup.then(function(res) {
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
    $scope.clearMessage = function() {
        $scope.mensagem = "";
    }

    $scope.submeter = function() {
        if ($scope.loginForm.$valid) {
            $http.get(servidor + '/v1/api.php?req=doLogin&login=' + $scope.login + '&senha=' + $scope.senha)
                .success(function(data) {
                    idFornecedor = data.id_fornecedor;
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

.controller('CotacoesListCtrl', function($scope, $state, $location, $http, $ionicConfig, $stateParams, $rootScope, $ionicFilterBar, $timeout, $ionicScrollDelegate) {

    $ionicConfig.backButton.text("");
    $rootScope.status_cotacao = $stateParams.status_cotacao;
    $scope.pagetitle = 'Cotação ' + $scope.status_cotacao;

    $rootScope.mostraFiltro = false;
    $scope.toggle = function() {
        $rootScope.mostraFiltro = !$rootScope.mostraFiltro;
    };

    $scope.clearSearch = function() {
        $scope.filter = '';
        $rootScope.mostraFiltro = false;
    };

    // var filterBarInstance;

    $http.get(servidor + '/v1/api.php?req=getCotacoesStatusList&status_cotacao=' + $stateParams.status_cotacao + '&idFornecedor=' + idFornecedor)
        .success(function(data) {
            $scope.dados = data;
        });

    /*$scope.showFilterBar2 = function () {
     filterBarInstance = $ionicFilterBar.show({
     // items: $scope.dados,
     items: $scope.items,
     update: function (filteredItems, filterText) {
     $scope.items = filteredItems;

     console.log('aaaaaaaaaaaaa '+filteredItems.length);
     console.log('bbbbbbbbbbbbb '+$scope.items);
     if (filterText) {
     console.log(filterText);
     }
     }
     });
     };*/

    /*$scope.refreshItems = function () {
     console.log('dentro ==> ');
     if (filterBarInstance) {
     filterBarInstance();
     filterBarInstance = null;
     }

     $timeout(function () {
     getItems();
     $scope.$broadcast('scroll.refreshComplete');
     }, 1000);
     };*/
})

.controller('CotacaoCtrl', function($scope, $state, $location, $http, $stateParams, toastr, $rootScope, $ionicHistory, $ionicModal, $ionicLoading, $ionicPopup, $filter, $timeout) {

    $ionicLoading.show();
    $scope.cotacao = {};
    $scope.pagetitle = 'Dados cotação ' + $rootScope.status_cotacao;
    console.log('titulo pagina ' + $rootScope.status_cotacao);
    $http.get(servidor + '/v1/api.php?req=getCotacaoStatusById&id_cotacao=' + $stateParams.id_cotacao)
        .success(function(data) {
            $ionicLoading.hide();
            $scope.dados = data;
        });

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
        if (index == 1 && $scope.dados.status_cotacao == "ABERTA") {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Deseja realmente rejeitar\n esta cotação?',
                cancelText: 'Não',
                okText: 'Sim'
            });
            confirmPopup.then(function(res) {
                if (res) {
                    $scope.rejeitaCotacao();
                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });
                    $location.path("/side-menu21/home");
                } else {}
            });
        } else if ($scope.dados.status_cotacao != "ABERTA") {
            $scope.oModal1.show();
        } else {
            $scope.oModal2.show();
        }
    };

    /*function callAtTimeout() {
     console.log("Timeout occurred");
     }*/

    $scope.closeModal = function(index) {
        if (index == 1) $scope.oModal1.hide();
        else $scope.oModal2.hide();
        $scope.cotacao = {};
    };

    $scope.$on('modal.shown', function(event, modal) {});

    $scope.$on('modal.hidden', function(event, modal) {});

    $scope.$on('$destroy', function() {
        $scope.oModal1.remove();
        $scope.oModal2.remove();
    });

    var msg = '';

    $scope.rejeitaCotacao = function() {
        $scope.cotacao.status_cotacao = 'REJEITADA';
        msg = 'rejeitada';
        enviaEditar();
    }

    $scope.cancelarCotacao = function() {
        if ($scope.cotacao.motivo) {
            $scope.cotacao.status_cotacao = 'CANCELADA';
            msg = 'cancelada';
            enviaEditar();
        }
    }

    $scope.responderCotacao = function(formValid) {
        if (formValid && !$scope.mensagemErro && !$scope.mensagemErroValidade) {
            $scope.cotacao.status_cotacao = 'PENDENTE';
            msg = 'enviada';
            enviaEditar();
        } else {
            console.log('Form is not valid');
        }
        // var itemsLength = Object.keys($scope.cotacao).length;
        /*if (itemsLength == 6) {
         $scope.cotacao.status_cotacao = 'PENDENTE';
         msg = 'enviada';
         enviaEditar();

         // if ($rootScope.status_cotacao == 'aberta') {
         /!*$scope.cotacao.status_cotacao = 'PENDENTE';
         msg = 'enviada';*!/
         /!*} else if ($scope.dados.status_cotacao == 'escolhida') {
         $scope.cotacao.status_cotacao = 'CONCLUIDA';
         msg = 'concluida';
         }*!/
         }*/
    }

    $scope.editaCotacao = function() {
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

        } else {}
    }

    function enviaEditar() {
        console.log('dentro do enviar00');
        $scope.cotacao.id_fornecedor = idFornecedor;
        $scope.cotacao.id_cotacao = $scope.dados.id_cotacao;
        $scope.cotacao.data_entrega = $filter('date')($scope.cotacao.data_entrega, "yyyy-MM-dd HH:mm:ss");
        $scope.cotacao.validade = $filter('date')($scope.cotacao.validade, "yyyy-MM-dd HH:mm:ss");
        $http.post(servidor + '/v1/api.php?req=editaCotacao', $scope.cotacao)
            .success(function(data) {
                toastr.success('Cotação ' + msg + ' com sucesso!');
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                $scope.closeModal(1);
                $scope.closeModal(2);
                $location.path('side-menu21/home');
            })
            .error(function(erro) {});
    }

    $scope.concluirCotacao = function() {
        msg = 'concluida';
        var confirmPopup = $ionicPopup.confirm({
            title: 'Deseja realmente concluir\n esta cotação?',
            cancelText: 'Não',
            okText: 'Sim'
        });
        confirmPopup.then(function(res) {
            if (res) {
                $scope.cotacao.status_cotacao = 'CONCLUIDA';
                enviaEditar();
                /*$ionicHistory.nextViewOptions({
                 disableBack: true
                 });*/
                // $location.path("/side-menu21/home");
            } else {}
        });
    }

    $scope.clearMessageErro = function() {
        $scope.mensagemErro = "";
        $scope.mensagemErroValidade = "";
    }

    $scope.compareDates = function() {

        var data_entrega = $filter('date')($scope.cotacao.data_entrega, "dd/MM/yyyy");
        var validade = $filter('date')($scope.cotacao.validade, "dd/MM/yyyy");

        if (data_entrega > $scope.dados.data_evento) {
            $scope.mensagemErro = "data da entrega superior à data do evento";
        } else {
            // $scope.mensagemErro = "";
        }

        if (validade < $scope.dados.data_evento) {
            $scope.mensagemErroValidade = "data da validade inferior à data do evento";
        } else {
            // console.log('data ok aaaaaaaaaa');
        }
    }

})

.controller('AgendaCtrl', function($scope) {
    var weekDaysList = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    var monthList = ["Janeiro", "Feveiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    /* var h0 = new Date(2015, 11, 11)
     , h1 = new Date(2015, 11, 9)
     , h2 = new Date(2015, 11, 3)
     , h3 = new Date(2015, 11, 10)
     , h4 = new Date(2015, 10, 30)
     , h5 = new Date(2015, 11, 16)
     , h6 = new Date(2015, 11, 6)
     , calendar0 = [h0, h1, h2, h3, h4, h5, h6];

     var c0 = new Date(2015, 11, 11)
     , c1 = new Date(2015, 11, 9)
     , c2 = new Date(2015, 12, 3)
     , c3 = new Date(2015, 11, 10)
     , c4 = new Date(2015, 11, 12)
     , c5 = new Date(2015, 11, 16)
     , c6 = new Date(2015, 11, 18)
     , c7 = new Date(2015, 11, 19)
     , c8 = new Date(2015, 11, 22)
     , c9 = new Date(2015, 11, 27)
     , c10 = new Date(2015, 11, 25)
     , c11 = new Date(2015, 11, 6)
     , calendar1 = [c0, c1]
     , calendar2 = [c2, c3]
     , calendar3 = [c4]
     , calendar4 = [c2, c5, c11]
     , calendar5 = [c4, c10]
     , calendar6 = [c6, c7, c8, c9]
     , calendar7 = [c5, c6, c11];

     var d0 = new Date(2015, 11, 16)
     , d1 = new Date(2015, 11, 17)
     , d2 = new Date(2015, 11, 17)
     , d3 = new Date(2015, 10, 30)
     , d4 = new Date(2015, 12, 1)
     , disabledDates = [d0, d1, d2, d3, d4];*/

    // var s0 = new Date(2015, 10, 31)  // preview month
    //   , s1 = new Date(2015, 11, 10) // holiday
    //   , s2 = new Date(2015, 11, 11) // holiday
    //   , s7 = new Date(2015, 11, 6) //
    //   , s3 = new Date(2015, 11, 12) //
    //   , s4 = new Date(2015, 11, 12) // clone
    //   , s5 = new Date(2015, 11, 17) // conflict with disabled
    //   , s6 = new Date(2015, 12, 1); // conflict with disabled, next month
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

        /*calendar0: calendar0,
         calendar0Class: '',
         calendar0Name: 'holidays',

         calendar1: calendar1,
         //calendar1Class: '',
         calendar1Name: 'same days',

         calendar2: calendar2,
         calendar2Class: '',
         //calendar2Name: 'calendar 2',

         calendar3: calendar3,
         calendar3Class: '',
         calendar3Name: 'birthdays',

         calendar4: calendar4,
         calendar4Class: 'cal-color-black',
         calendar4Name: 'date-picker',

         calendar5: calendar5,
         calendar5Class: '',
         calendar5Name: 'vacation',

         calendar6: calendar6,
         calendar6Class: '',
         calendar6Name: 'red days',

         calendar7: calendar7,
         calendar7Class: '',
         calendar7Name: 'same dates',*/

        conflictSelectedDisabled: 'DISABLED', // SELECTED | DISABLED

        closeOnSelect: false,

        mondayFirst: false,
        weekDaysList: weekDaysList,
        monthList: monthList,

        callback: function(dates) { //Mandatory
            retSelectedDates(dates);
        }
    };

    var retSelectedDates = function(dates) {
        $scope.selectedDates.length = 0;
        for (var i = 0; i < dates.length; i++) {
            $scope.selectedDates.push(angular.copy(dates[i]));
        }
    };

})

.controller('usuarioCtrl', function($scope, $state, $q, UserService, $ionicLoading, $location, $http, $ionicHistory, Token) {
    $scope.answer = Token.token($scope.token);
    alert($scope.answer);
    $http.get(servidor + '/v1/api.php?req=setToken&idFornecedor=' + $idFornecedor)
        .success(function(data) {
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

.controller('AlterarSenhaCtrl', function($scope, $stateParams, $http, $ionicPopup) {

    $scope.result;
    $scope.senhaOk = false;
    $scope.verificaContrasenha = function() {
        $scope.result = angular.equals($scope.novasenha.conf_senha, $scope.novasenha.senha);
        if ($scope.result == false) {
            $scope.mensagem = "as senhas não conferem";
        } else {
            $scope.senhaOk = true;
            $scope.mensagem = "";
            submeter();
        }
    }

    $scope.novasenha = {};

    function submeter() {
        if ($scope.senhaOk) {
            if ($scope.alterarSenhaForm.$valid) {
                console.log('senhas ok');
                // $scope.novasenha.id_pessoa = id_pessoa;
                // $http.post(servidor + '/v2/api.php?req=editSenha', {'novasenha': $scope.novasenha}).success(function (data) {
                //     var alertPopup = $ionicPopup.alert({
                //       title: 'Alterado com sucesso!'
                //     });
                //   })
                //   .error(function (erro) {
                //     console.log(erro);
                //   });
            }
        }
    }
})

.controller('RecuperarSenhaCtrl', function($scope, $stateParams, $http) {

    $scope.recuperarSenha = {};
    recuperarSenha = {};
    $scope.submeter = function() {
        if ($scope.recuperarSenhaForm.$valid) {
            recuperarSenha.email = $scope.recuperarSenha.email;
            // recuperarSenha.id_pessoa = id_pessoa;
            // recuperarSenha.md5 = Math.random().toString(36).substr(2);
            $http.post(servidor + '/v1/api.php?req=enviarEmailSenha', { 'recuperarSenha': recuperarSenha }).success(function(data) {
                    // enviarEmailSenha($scope.recuperarSenha.email);

                    var alertPopup = $ionicPopup.alert({
                        title: 'Um link para editar sua senha, foi enviado para seu e-mail!',
                        buttons: [{
                            text: '<b>Ok</b>',
                            type: 'button-positive'
                        }]
                    });
                })
                .error(function(erro) {
                    console.log(erro);
                });
        }
    }
})