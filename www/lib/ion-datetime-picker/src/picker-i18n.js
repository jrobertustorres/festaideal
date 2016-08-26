angular.module("ion-datetime-picker")
    .factory("$ionicPickerI18n", function($window) {
        return  {
            ok: "OK",
            cancel: "Cancelar",
            weekdays: $window.moment ? $window.moment.weekdaysMin() : ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"],
            months: $window.moment ? $window.moment.months() : ["Janeiro", "February", "March", "April", "May", "June", "July", "Agosto", "September", "October", "November", "December"]
        };
    });
