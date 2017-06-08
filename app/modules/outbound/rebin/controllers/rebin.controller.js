/**
 * Created by frank.zhou on 2017/01/17.
 */
(function () {
  'use strict';
  angular.module('myApp').controller("rebinCtl", function ($scope, $stateParams, $rootScope, $state, rebinService) {
    // 扫描工作站
    $scope.scanStation = function (e) {
      var keyCode = window.event ? e.keyCode : e.which;
      if (keyCode != 13) return;
      rebinService.scanStation($scope.rebinStationName, function (data) {
        $rootScope.rebinStation = data;
        if ($rootScope.rebinStation.rebinInfo) {
          $scope.rebinOperate = 'stationRebining';
          $scope.batchNumber = $rootScope.rebinStation.rebinInfo.pickingOrderNumber;
          $scope.rebinWallCount = $rootScope.rebinStation.rebinInfo.numRebinWall;
          $scope.containerNumber = $rootScope.rebinStation.rebinInfo.containerNames.join();
          $scope.ExSD = $rootScope.rebinStation.rebinInfo.deliveryTimes.map(function (params) {
            return params ? kendo.format("{0:yyyy-MM-dd HH:mm:ss}", kendo.parseDate(params)) : ""
          }).join();
        } else {
          $scope.rebinOperate = "scanPickingOrder";
          setTimeout(function () {
            $("#rebin_pickingOrder").focus();
          }, 100);
        }
      },function (data) {
          if(data.message == "EX_REBIN_STATION_NOT_EXISTS"){
              $scope.message = "条码 "+$scope.rebinStationName+" 不是一个有效工作站，请重新扫描";
              $scope.messageOperate="show";
              $scope.pickPackStationName = "";
          }
          if(data.message == "EX_REBIN_STATION_NOT_EXISTS"){
              $scope.message = "工作站已分配给员工"+data.values+"，请重新扫描";
              $scope.messageOperate="show";
              $scope.pickPackStationName = "";
          }
      });
    };
    // 扫描批次号
    $scope.scanPickingOrder = function (e) {
      var keyCode = window.event ? e.keyCode : e.which;
      if (keyCode != 13) return;
      rebinService.scanPickingOrder($scope.pickingOrderNo, $rootScope.rebinStation.id, function (data) {
        $rootScope.pickingOrder = data;
        if ($rootScope.pickingOrder.rebinWallNames != 0) {
          $scope.rebinOperate = 'orderRebining';
          $scope.batchNumber = $rootScope.pickingOrder.pickingOrderNumber;
          $scope.rebinWallCount = $rootScope.pickingOrder.numRebinWall;
          $scope.containerNumber = $rootScope.pickingOrder.containerNames.join();
          $scope.ExSD = $rootScope.pickingOrder.deliveryTimes.map(function (params) {
            return params ? kendo.format("{0:yyyy-MM-dd HH:mm:ss}", kendo.parseDate(params)) : ""
          }).join();
        } else {
          $state.go("main.rebinMain");
        }
      });
    };
    //站台存在遗留任务   

    $scope.stationRebiningSure = function () {
      $state.go("main.rebinMain");
    }
    $scope.stationRebiningCanel = function () {
      $scope.rebinOperate = "scanPickingOrder";
      $rootScope.rebinStation.rebinInfo = null;
      $("#rebin_pickingOrder").focus();
    }
    //批次已经做过部分Rebin
    $scope.OrderRebiningSure = function () {
      $state.go("main.rebinMain");
    }
    $scope.OrderRebiningCanel = function () {
      $scope.rebinOperate = "scanPickingOrder";
      $scope.pickingOrderNo = "";
      $rootScope.pickingOrder.rebinWallNames = null;
      $("#rebin_pickingOrder").focus();
    }
    // 初始化信息
    if ($rootScope.rebinContinue) {
      $scope.rebinOperate = "scanPickingOrder"; // 继续rebin 扫描批次号
      $rootScope.pickingOrder = {};
      $rootScope.rebinContinue=false;
      setTimeout(function () {
        $("#rebin_pickingOrder").focus();
      }, 100);
    } else {
      $rootScope.rebinContinue = false;
      $rootScope.rebinStation = {};
      $rootScope.pickingOrder = {};
      $scope.rebinOperate = "scanStation"; // 初始扫描工作站
      setTimeout(function () {
        $("#rebin_station").focus();
      }, 200);
    }
  })
})();