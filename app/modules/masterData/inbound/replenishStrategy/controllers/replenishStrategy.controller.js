/**
 * Created by frank.zhou on 2017/04/25.
 */
(function () {
  'use strict';

  angular.module('myApp').controller("replenishStrategyCtl", function ($scope, $rootScope, $window, commonService, masterService) {

    $window.localStorage["currentItem"] = "replenishStrategy";

    $rootScope.rtSource = ["RTL", "ZERO"];
    $rootScope.fsSource = ["CATCH_UP", "NOT_CATCH_UP"];
    $rootScope.rpSource = ["OPEN", "CLOSED"];
    $rootScope.rpsSource = ["RECEIVE_DOC_TRIGGER", "SAFETY_DOC_TRIGGER"];
    $rootScope.ssrSource = ["EXECUTE", "NO_EXECUTE"];
    $rootScope.smtSource = ["EXECUTE", "NO_EXECUTE"];

    // 列
    var columns = [
      {field: "minSkuUnits", headerTemplate: "<span translate='MIN_SKU_UNITS'></span>"},
      {field: "shipmentDay", headerTemplate: "<span translate='SHIPMENT_DAY'></span>"},
      {field: "unitsShipment", headerTemplate: "<span translate='UNITS_SHIPMENT'></span>"},
      {field: "replenishTrigger", headerTemplate: "<span translate='REPLENISH_TRIGGER'></span>"},
      {field: "fudStrategy", headerTemplate: "<span translate='FUD_STRATEGY'></span>"},
      {field: "replenishPadTime", headerTemplate: "<span translate='REPLENISH_PAD_TIME'></span>"},
      {field: "receivePrime", headerTemplate: "<span translate='RECEIVE_PRIME'></span>"},
      {field: "receivePrimeStrategy", headerTemplate: "<span translate='RECEIVE_PRIME_STRATEGY'></span>"},
      {field: "skuStowRule", headerTemplate: "<span translate='SKU_STOW_RULE'></span>"},
      {field: "skuMaxType", headerTemplate: "<span translate='SKU_MAX_TYPE'></span>"},
      {field: "stowingType", headerTemplate: "<span translate='STOWING_TYPE'></span>"},
      {field: "problemLocation", headerTemplate: "<span translate='PROBLEM_LOCATION'></span>"}
    ];
    $scope.replenishStrategyGridOptions = commonService.gridMushiny({columns: columns, dataSource: masterService.getGridDataSource("replenishStrategy")});

  }).controller("replenishStrategyCreateCtl", function ($scope, $state, masterService) {
    $scope.validate = function (event) {
      event.preventDefault();
      if ($scope.validator.validate()) {
        masterService.create("replenishStrategy", {
          "minSkuUnits": $scope.minSkuUnits,
          "shipmentDay": $scope.shipmentDay,
          "unitsShipment": $scope.unitsShipment,
          "replenishTrigger": $scope.replenishTrigger,
          "fudStrategy": $scope.fudStrategy,
          "replenishPadTime": $scope.replenishPadTime,
          "receivePrime": $scope.receivePrime,
          "receivePrimeStrategy": $scope.receivePrimeStrategy,
          "skuStowRule": $scope.skuStowRule,
          "skuMaxType": $scope.skuMaxType,
          "stowingType": $scope.stowingType,
          "problemLocation": $scope.problemLocation,
          "clientId": $scope.client? $scope.client.id: null
        }, function () {
          $state.go("main.replenish_strategy");
        });
      }
    };
  }).controller("replenishStrategyUpdateCtl", function ($scope, $state, $stateParams, masterService) {
    masterService.read("replenishStrategy", $stateParams.id, function(data){
      for(var k in data) $scope[k] = data[k];
      $scope.client = {id: data.clientId};
    });
    $scope.validate = function (event) {
      event.preventDefault();
      if ($scope.validator.validate()) {
        masterService.update("replenishStrategy", {
          "id": $scope.id,
          "minSkuUnits": $scope.minSkuUnits,
          "shipmentDay": $scope.shipmentDay,
          "unitsShipment": $scope.unitsShipment,
          "replenishTrigger": $scope.replenishTrigger,
          "fudStrategy": $scope.fudStrategy,
          "replenishPadTime": $scope.replenishPadTime,
          "receivePrime": $scope.receivePrime,
          "receivePrimeStrategy": $scope.receivePrimeStrategy,
          "skuStowRule": $scope.skuStowRule,
          "skuMaxType": $scope.skuMaxType,
          "stowingType": $scope.stowingType,
          "problemLocation": $scope.problemLocation,
          "clientId": $scope.client? $scope.client.id: null
        }, function () {
          $state.go("main.replenish_strategy");
        });
      }
    };
  }).controller("replenishStrategyReadCtl", function ($scope, $stateParams, masterService) {
    masterService.read("replenishStrategy", $stateParams.id, function(data){
      for(var k in data) $scope[k] = data[k];
    });
  });
})();