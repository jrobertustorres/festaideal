// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var token = "";
var db = null;
angular.module('app', ['ionic', 'app.controllers', 'app.routes', 'app.services', 'app.directives', 'ng-mfb', 'ngAnimate', 'toastr', 'jett.ionic.filter.bar', 'ionic-multi-date-picker', 'ngMask', 'ngCordova'])

  .run(function ($ionicPlatform, $ionicPopup, $rootScope, $ionicLoading, $location, $http, $cordovaSQLite) {

    $ionicPlatform.ready(function () {
      // criaDataBase($cordovaSQLite);
      // verificaUsuario($cordovaSQLite, $rootScope);
      if (window.Connection) {
        if (navigator.connection.type == Connection.NONE) {
          $ionicPopup.alert({
              title: 'Não conectado à internet',
              content: 'Nenhuma conexão à internet detectada.\n Favor conectar e tentar novamente.',
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
        "android": {"senderID": "990686468351", icon: "icon"},

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

      push.on('notification', function (data) {

        // alert('Notificação acionada, agora deve-se implementar a navegação no app de acordo com os dados: ' + JSON.stringify(data));

      });


      push.on('error', function (e) {

        alert('registration error: ' + e.message);

      });

    });
  })

// function criaDataBase($cordovaSQLite) {
  // if (window.cordova) {
  //   db = $cordovaSQLite.openDB({name: "festaideal.db"}); //device
  // } else {
  //   db = window.openDatabase("festaideal.db", '1', 'my', 1024 * 1024 * 100); // browser
  // }
  // $cordovaSQLite.execute(db, "DROP TABLE usuario");
  // $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS usuario (id integer primey key, idUsuario integer)");
  // $cordovaSQLite.execute(db, "DROP DATABASE festaideal");
  // this.deleteDatabase("festaideal.db");
// }

/*function verificaUsuario($cordovaSQLite, $rootScope, event) {
  var query = "SELECT idUsuario FROM usuario";
  $rootScope.idUsuario = 0;
  $cordovaSQLite.execute(db, query).then(function(res) {
    if(res.rows.length > 0) {
      for(var i = 0; i < res.rows.length; i++){
        $rootScope.idUsuario = res.rows.item(i).idUsuario;
        // alert($rootScope.idUsuario);
      }
    }
  }, function (err) {
    console.error(err);
  });
}*/

  /*.factory('Token', function () {
    return token;
  })*/
