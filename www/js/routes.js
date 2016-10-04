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

    /*
     .state('cotacoes-abertas-list', {
     url: '/cotacoes-abertas-list',
     templateUrl: 'templates/cotacoesList.html',
     controller: 'CotacoesAbertasListCtrl'
     })*/

    /*$urlRouterProvider.otherwise(function($cordovaSQLite){

      var query = "SELECT idUsuario FROM usuario";
      alert();
      $cordovaSQLite.execute(db, query).then(function(res) {
        if(res.rows.length > 0) {
          for(var i = 0; i < res.rows.length; i++){
            if(res.rows.item(i).idUsuario) {
              $state.go('/home');
            } else {
              $state.go('/login');
            }
            // alert($rootScope.idUsuario);
          }
        }
      }, function (err) {
        console.error(err);
      });

      /!*var $state = $injector.get('$state');
      var Storage = $injector.get('usuario');

      if (Storage.has('idUsuario')) {
        $state.go('/home');
      } else {
        alert();
        $state.go('/login');
      }*!/

    });*/
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
