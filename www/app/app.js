
var app = angular.module('cdvOnsNgApp', ['onsen', 'ngCordova']);

app.controller('tabbarCtrl',["$scope", function($scope) {

}]);

app.controller('homeCtrl', ["$scope",function($scope) {
    $scope.goto = function(page){
        $scope.ons.findComponent("#ons-navi").pushPage("app/views/"+page+".html");
    };
}]);

app.controller('inputCtrl', ["$scope",function($scope) {
}]);


app.controller('carouselCtrl',["$scope", function($scope) {
}]);

app.controller('geolocationCtrl', function($scope) {

    $scope.coords = JSON.parse(window.localStorage.getItem("coords"));

    $scope.clear = function(){
        $scope.coords = [];
        window.localStorage.setItem("coords","[]");
        $cordovaBadge.set(0).then(function() {
        }, function(err) {
        });
    }
    $scope.refresh = function(){
        $scope.coords = JSON.parse(window.localStorage.getItem("coords"));
    }
});

app.controller('pullHookCtrl', function($scope, $timeout) {
    $scope.items = [];

    $scope.load = function($done) {
      $timeout(function() {
        $scope.items.unshift($scope.items.length + 1);
        $done();
      }, 1000);
    };
  });

app.controller('popupNortificationsCtrl', ["$scope",function($scope) {
    $scope.showPop = function(type){
        switch (type) {
            case 'alert':
              navigator.notification.alert("4月24日21時15分\nセブン-イレブン\n利用金額5,332円", null, "JCBカードで\nお取引がありました。", '閉じる' );
              break;
            case 'confirm':
              navigator.notification.confirm("4月24日21時15分\nセブン-イレブン\n利用金額5,332円", $scope.onConfirm, "JCBカードで\nお取引がありました。", ['閉じる','確認する'] );
              break;
            case 'prompt':
              navigator.notification.prompt("prompt", null)
              break;
          }
    };

    $scope.dialogs = {};
    $scope.showDlg = function(dlg){
        if (!$scope.dialogs[dlg]) {
          ons.createDialog(dlg).then(function(dialog) {
            $scope.dialogs[dlg] = dialog;
            dialog.show();
          });
        } else {
          $scope.dialogs[dlg].show();
        }
    }

    $scope.onConfirm = function(num){
        navigator.notification.alert("button id :"+num+" pushed", null, "On Confirm", '閉じる' );
    }
}]);



app.controller('beepVibrateCtrl', ["$scope",function($scope) {
    $scope.action = function(type){
        switch (type) {
            case 'beep':
              navigator.notification.beep(1);
              break;
            case 'vibrate':
              navigator.notification.vibrate(3000);
              break;
          }
    };

}]);

app.controller('touchIdCtrl', ["$scope","$cordovaTouchID",function($scope,$cordovaTouchID) {
    $scope.authenticate=function(){
        $cordovaTouchID.checkSupport().then(function() {
           console.log("success, TouchID supported");
        }, function (error) {
           navigator.notification.alert(error,null, "Touch ID", 'OK' );
        });
        $cordovaTouchID.authenticate("Please authenticate by Touch ID").then(function() {
           navigator.notification.alert("Authenticated",null, "Touch ID", 'OK' );
        }, function () {
           navigator.notification.alert("Not Authenticated",null, "Touch ID", 'OK' );
        });
    }
}]);

app.controller('badgesCtrl',["$scope","$cordovaBadge", function($scope,$cordovaBadge) {

    $scope.setBadge=function(){
        num =  $scope.badgeCount;
        $cordovaBadge.set(num).then(function() {
            navigator.notification.alert("Badge count is set to "+num,null, "Badge", 'OK' );
        }, function(err) {
            navigator.notification.alert("Don't have a permission",null, "Badge", 'OK' );
        });
    }

}]);


app.controller('pushNortificationsCtrl', ["$scope","$rootScope",function($scope,$rootScope) {

    $scope.token = $rootScope.token;
/*
    if (typeof  $scope.ons.findComponent(".ons-navi").getCurrentPage().options.nortification !== 'undefined') {
        $scope.nortification = $scope.ons.findComponent(".ons-navi").getCurrentPage().options.nortification;
        console.log("pushNortificationsCtrl:",$scope.nortification );
    }
*/
}]);

app.controller('webviewCtrl', function($scope, $rootScope, $cordovaInAppBrowser) {


    $scope.openExtUrl=function(){
        event.preventDefault();
        window.open(encodeURI("http://www.jcb.co.jp/life/jcb_premo/index.html"), '_system', 'location=yes');
    }

});

app.controller('cameraCtrl', function($scope, $cordovaCamera) {

    $scope.camera = function(){
        var options = {
          quality: 50,
          destinationType: Camera.DestinationType.FILE_URI,
          sourceType: Camera.PictureSourceType.CAMERA,
          allowEdit: true,
          encodingType: Camera.EncodingType.JPEG,
          targetWidth: 100,
          targetHeight: 100,
          popoverOptions: CameraPopoverOptions,
          saveToPhotoAlbum: false,
          correctOrientation:true
        };

        $cordovaCamera.getPicture(options).then(function(imageURI) {
          var image = document.getElementById('myImage');
          console.log(image);
          console.log(imageURI);
          image.src = imageURI;
        }, function(err) {
          alert("error");
        });
    }
});

app.config(function($compileProvider){
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
})

app.run(function($rootScope,$cordovaPushV5,$cordovaBadge,$cordovaGeolocation) {

    console.log('app run! but device is not ready');

    function onDeviceReady() {

        console.log('device is ready, and start logging!!!');

        // set nortiication
        var pushConfig = {
            "android":  {
                "senderID":"181478742919"
            },
            "ios": {
                "alert": "true",
                "badge": "true",
                "sound": "true"
            }
        };

        console.log('$cordovaPushV5 initialize starts');
        $cordovaPushV5.initialize(pushConfig);

        $cordovaPushV5.register().then(function(token){
            console.log('$cordovaPushV5:REGISTERED',token);
            $rootScope.token = token;
            $cordovaPushV5.onError();
            $cordovaPushV5.onNotification();
        }, function(err){
            console.log('$cordovaPushV5:REGISTER_ERROR',err);
        });

        $rootScope.$on('$cordovaPushV5:notificationReceived', function(event, notification) {
            console.log("CordovaV5 nortified");
            console.log(JSON.stringify(notification));

            // set the badge if it's set in the nortification
            if(notification.additionalData.badgeCount){
                var badgeCount = notification.additionalData.badgeCount;
                $cordovaBadge.set(badgeCount);
            }

            // ここが上手く行かない。
            // $rootScope.ons.findComponent(".ons-navi").pushPage("views/push_nortifications.html",{"nortification":nortification});

        });

        $rootScope.$on('$cordovaPushV5:errorOccurred', function (event, error) {
            console.log("CordovaV5 error");
        });

        // Geolocation
        var coords = window.localStorage.getItem("coords");
        if (coords == null){
              window.localStorage.setItem("coords","[]");

              var watchOptions = {
                timeout : 30000,
                maximumAge: 30000,
                enableHighAccuracy: false // may cause errors if true
              };

              alert("start watching location!");

              var watch = $cordovaGeolocation.watchPosition(watchOptions);
              watch.then(
                null,
                function(err) {
                    alert("error location! "+JSON.stringify(err));
                },
                function(position) {
                    console.log(position);
                    var coords = JSON.parse(window.localStorage.getItem("coords"));
                    coords.unshift({
                              time:(new Date),
                              lat:position.coords.latitude,
                            lng:position.coords.longitude});

                    $cordovaBadge.get().then(function(badge) {
                        $cordovaBadge.set(badge+1).then(function() {});
                    });

                    window.localStorage.setItem("coords",JSON.stringify(coords));

              });
        }

        var posOptions = {timeout: 10000, enableHighAccuracy: false};
          $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function (position) {
                var coords = JSON.parse(window.localStorage.getItem("coords"));

                coords.unshift({
                        time:(new Date),
                        lat:position.coords.latitude,
                        lng:position.coords.longitude});

                window.localStorage.setItem("coords",JSON.stringify(coords));
            }, function(err) {
                alert("error location! "+JSON.stringify(err));
            });


    }

    //アプリ立ち上げ時に実行
    document.addEventListener("deviceready", onDeviceReady, false);

    //アプリ停止時に実行
    document.addEventListener("pause", function() {
        console.log("Cordova pause");
    });

    //アプリ再開時に実行
    document.addEventListener("resume", function() {
        console.log("Cordova resume");
    });
});
