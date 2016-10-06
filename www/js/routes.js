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

      /*.state('menu.recuperarSenha', {
       url: '/recuperarSenha',
       templateUrl: 'templates/recuperarSenha.html',
       controller: 'RecuperarSenhaCtrl'
       })*/

      /*.state('app.recuperar-senha', {
       url: '/recuperar-senha',
       views: {
       'menuContent': {
       templateUrl: 'templates/recuperarSenha.html',
       controller: 'RecuperarSenhaCtrl'
       }
       }
       })*/

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
      })

    /*if (idUsuario == 1) {
      console.log('avvvvvvvvvvv '+idUsuario);
      // $state.go('menu.home');
      $urlRouterProvider.otherwise('/home');
    } else {
      console.log('vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv '+idUsuario);
    }*/
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
