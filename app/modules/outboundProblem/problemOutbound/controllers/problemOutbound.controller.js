/**
 * Created by thoma.bian on 2017/5/10.
 * Updated by frank.zhou on 2017/05/15.
 */
(function () {
  'use strict';

  angular.module('myApp').controller("problemOutboundCtl", function ($scope, $state, $rootScope, problemOutboundService) {
    $scope.outboundProblem = 'workStationPage';
    $scope.workingStation = false;
    $scope.problemCart = false;

    // 扫描工作站
    $scope.workStation = function (e) {
      var keycode = window.event ? e.keyCode : e.which;
      if (keycode != 13) return;
      problemOutboundService.getOutboundProblemStation($scope.workstation, function(data){
        $rootScope.obpStationId = data.obpStation.id;
        $rootScope.obpStationName = data.obpStation.name;
         $scope.outboundProblem = 'problemCarPage';
        setTimeout(function(){ $("#obp_wall").focus();}, 0);
      }, function(){
        $scope.workingStation = true;
      });
    };

    // 扫描问题处理车
    $scope.problemHandingCarts = function(e){
      var keycode = window.event ? e.keyCode : e.which;
      if (keycode != 13) return;
      problemOutboundService.getOutboundProblemHandingCar($scope.problemHandingCar, function(data){
        $rootScope.obpWallId = data.id;
        $rootScope.obpWallName = data.name;
        $state.go("main.problemOutboundShipment");
      }, function(){
        $scope.problemCart = true;
      });
    };

    // 初始化
    setTimeout(function(){ $("#obp_station").focus();}, 0);
  });
})();