var token = "";
var TELA_REDIRECT = '';
angular.module('app', ['ionic', 'app.controllers', 'app.services', 'app.directives', 'ng-mfb', 'ngAnimate', 'toastr', 'jett.ionic.filter.bar', 'ionic-multi-date-picker', 'ngMask', 'ngCordova', 'ui.utils.masks'])

  .run(function ($ionicPlatform, $ionicPopup, $rootScope) {

    $ionicPlatform.ready(function () {
      if (window.Connection) {
        if (navigator.connection.type == Connection.NONE) {
          $ionicPopup.alert({
              title: 'Não conectado à internet',
              content: 'Nenhuma conexão à internet foi encontrada.\n Favor conectar e tentar novamente.',
              cssClass: 'my-popup-body'
            })
            .then(function () {
              ionic.Platform.exitApp();
            });
        }
      }
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }

      var push = PushNotification.init({
        "android": {
          "senderID": "990686468351", icon: "icon", "sound": "true",
          "vibrate": "true"
        },

        "ios": {"alert": "true", "badge": "true", "sound": "true"},
        "windows": {}
      });


      /*

       Este é o evento que será chamado assim que o GCM responder a requisição

       com o id do dispositivo.

       É neste método que devendo mandar o id e armazenar em nosso servidor para enviarmos

       notificações posteriormente

       */

      push.on('registration', function (data) {
        token = data.registrationId;
        $rootScope.token = token;
      });

      // Este é o evento no qual implementando o comportamento do nosso app

      // quando o usuário clicar na notificação

      push.on('register', function (data) {

      });

      push.on('notification', function (data) {
        // $rootScope.tela = data.additionalData.tela;
        localStorage.setItem("redirectNotification", data.additionalData.tela);
        // alert('dentro '+data.additionalData.tela);
        // TELA_REDIRECT = data.additionalData.tela;
        // if(data.additionalData.tela == '#/side-menu21/agenda'){
        //   document.location.href = data.additionalData.tela;
        // $state.go('/side-menu21/agenda');
        // $location.url('/side-menu21/agenda');
        // }else if (data.additionalData.tela == 'cotacao_aberta'){
        //   TELA_REDIRECT = 'cotacao_aberta';
        // $location.url('/side-menu21/home');
        // }

        // alert('Notificação acionada, agora deve-se implementar a navegação no app de acordo com os dados: ' + JSON.stringify(data));

      });


      push.on('error', function (e) {

        alert('Erro ao registrar: ' + e.message);

      });

    });
  })

  .config(function ($stateProvider, $urlRouterProvider, $httpProvider, $ionicConfigProvider) {
    $ionicConfigProvider.views.transition('android');
    $stateProvider

      .state('menu.home', {
        url: '/home',
        views: {
          'side-menu21': {
            templateUrl: 'templates/home.html',
            controller: 'homeCtrl'
          }
        }
      })

      .state('menu.cotacoes-list/:status_cotacao', {
        url: '/cotacoes-list/:status_cotacao',
        views: {
          'side-menu21': {
            templateUrl: 'templates/cotacoesList.html',
            controller: 'CotacoesListCtrl'
          }
        }
      })

      .state('menu.cotacao/:id_cotacao', {
        url: '/cotacao/:id_cotacao',
        views: {
          'side-menu21': {
            templateUrl: 'templates/cotacao.html',
            controller: 'CotacaoCtrl'
          }
        }
      })

      .state('menu', {
        url: '/side-menu21',
        templateUrl: 'templates/menu.html',
        controller: 'menuCtrl',
        abstract: true
      })

      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'loginCtrl'
      })

      .state('menu.agenda', {
        url: '/agenda',
        views: {
          'side-menu21': {
            templateUrl: 'templates/agenda.html',
            controller: 'AgendaCtrl'
          }
        }
      })

      .state('recuperarSenha', {
        url: '/recuperarSenha',
        templateUrl: 'templates/recuperarSenha.html',
        controller: 'RecuperarSenhaCtrl'
      })

      .state('menu.alterarSenha', {
        url: '/alterarSenha',
        views: {
          'side-menu21': {
            templateUrl: 'templates/alterarSenha.html',
            controller: 'AlterarSenhaCtrl'
          }
        }
      });

    $urlRouterProvider.otherwise(function ($injector, $location) {
      var usuarioLogado = localStorage.getItem("usuarioLogado");
      var statusResetSenha = localStorage.getItem("statusResetSenha");

      if (usuarioLogado && statusResetSenha != 1) {
        if (localStorage.getItem("redirectNotification")) {
          $location.url(localStorage.getItem("redirectNotification"));
        } else {
          $location.url('/side-menu21/home');
        }
      } else {
        $location.url('/login');
      }
      return true;
    });

    $httpProvider.defaults.transformRequest = function (data) {
      if (data === undefined) {
        return data;
      }

      return serialize(data);
    };

    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';

    function serialize(obj, prefix) {
      var str = [];

      for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
          var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];

          str.push(typeof v == "object" ? serialize(v, k) : encodeURIComponent(k) + "=" + encodeURIComponent(v));
        }
      }

      return str.join("&");
    }
  });
