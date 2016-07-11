angular.module('app.routes', [])

  .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
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
/*
      .state('menu.cotacoes-abertas-list/:status_cotacao', {
        url: '/cotacoes-abertas-list/:status_cotacao',
        views: {
          'side-menu21': {
            templateUrl: 'templates/cotacoesList.html',
            controller: 'CotacoesAbertasListCtrl'
          }
        }
      })
*/

      .state('menu.cotacao-aberta/:id_cotacao', {
        url: '/cotacao-aberta/:id_cotacao',
        views: {
          'side-menu21': {
            templateUrl: 'templates/cotacaoAberta.html',
            controller: 'CotacaoCtrl'
          }
        }
      })

      .state('menu.cotacoes-pendentes-list', {
        url: '/cotacoes-pendentes-list',
        views: {
          'side-menu21': {
            templateUrl: 'templates/cotacoesPendentesList.html',
            controller: 'CotacoesPendentesListCtrl'
          }
        }
      })

      .state('menu.cotacao-pendente/:id_cotacao', {
        url: '/cotacao-pendente/:id_cotacao',
        views: {
          'side-menu21': {
            templateUrl: 'templates/cotacaoPendente.html',
            controller: 'CotacaoPendenteCtrl'
          }
        }
      })

      .state('menu.cotacoes-escolhidas-list', {
        url: '/cotacoes-escolhidas-list',
        views: {
          'side-menu21': {
            templateUrl: 'templates/cotacoesEscolhidasList.html',
            controller: 'CotacoesEscolhidasListCtrl'
          }
        }
      })

      .state('menu.cotacao-escolhida/:id_cotacao', {
        url: '/cotacao-escolhida/:id_cotacao',
        views: {
          'side-menu21': {
            templateUrl: 'templates/cotacaoEscolhida.html',
            controller: 'CotacaoEscolhidaCtrl'
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

      .state('recuperar-senha', {
        url: '/recuperar-senha',
        templateUrl: 'templates/recuperarSenha.html',
        controller: 'RecuperarSenhaCtrl'
      })
/*
      .state('cotacoes-abertas-list', {
        url: '/cotacoes-abertas-list',
        templateUrl: 'templates/cotacoesList.html',
        controller: 'CotacoesAbertasListCtrl'
      })*/

    $urlRouterProvider.otherwise('/login')

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
