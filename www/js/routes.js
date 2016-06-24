angular.module('app.routes', [])

  .config(function ($stateProvider, $urlRouterProvider) {

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

      .state('menu.cart', {
        url: '/page2',
        views: {
          'side-menu21': {
            templateUrl: 'templates/cotacoesAbertasList.html',
            controller: 'cartCtrl'
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

      .state('menu.cotacao-pendente/:id', {
        url: '/cotacao-pendente/:id',
        views: {
          'side-menu21': {
            templateUrl: 'templates/cotacaoPendente.html',
            controller: 'CotacaoPendenteCtrl'
          }
        }
      })

      // .state('cotacoes-pendentes-list', {
      //   url: '/cotacoes-pendentes-list',
      //   templateUrl: 'templates/cotacoesPendentesList.html',
      //   controller: 'CotacoesPendentesListCtrl'
      // })

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

      .state('cotacoes-abertas-list', {
        url: '/cotacoes-abertas-list',
        templateUrl: 'templates/cotacoesAbertasList.html',
        controller: 'CotacoesAbertasListCtrl'
      })

    $urlRouterProvider.otherwise('/login')


  });
