angular.module('app.directives', [])

  .directive('formatDate', function formatDate() {
    return {
      require: 'ngModel',
      link: function (scope, elem, attr, modelCtrl) {
        modelCtrl.$formatters.push(function (modelValue) {
          return new Date(modelValue);
        })
      }
    }
  })

  .directive('formattedTime', function ($filter) {
    return {
      require: '?ngModel',
      link: function (scope, elem, attr, ngModel) {
        if (!ngModel)
          return;
        if (attr.type !== 'time')
          return;

        ngModel.$formatters.unshift(function (value) {
          return value.replace(/:[0-9]+.[0-9]+$/, '');
        });
      }
    };
  });
