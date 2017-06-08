/**
 * Created by frank.zhou on 2017/04/24.
 */
(function () {
  'use strict';

  angular.module('myApp').controller("podCtl", function ($scope, $rootScope, $window, commonService, podService, masterService) {

    $window.localStorage["currentItem"] = "pod";

    var columns = [
      {field: "name", template: "<a ui-sref='main.podRead({id:dataItem.id})'>#: name # </a>", headerTemplate: "<span translate='NAME'></span>"},
      {field: "podType.name", template: "<a ui-sref='main.pod_type'>#: podType.name # </a>", headerTemplate: "<span translate='POD_TYPE'></span>"},
      {field: "zone", headerTemplate: "<span translate='ZONE'></span>", template: function(dataItem){
        return dataItem.zone? dataItem.zone.name: "";
      }},
      {field: "placeMark", headerTemplate: "<span translate='PLACE_MARK'></span>"},
      {field: "sellingDegree", headerTemplate: "<span translate='ITEM_SELLING_DEGREE'></span>"},
      {field: "description", headerTemplate: "<span translate='DESCRIPTION'></span>"},
      {field: "podIndex", headerTemplate: "<span translate='POD_INDEX'></span>"}
    ];
    $scope.podGridOptions = commonService.gridMushiny({columns: columns, dataSource: masterService.getGridDataSource("pod")});

    $rootScope.podTypeSource =  masterService.getDataSource({key: "getPodType", text: "name", value: "id"});

    $rootScope.changeClient =  function(clientId){
      podService.getZone(clientId, function(zones){
        var zoneComboBox = $("#zone").data("kendoComboBox");
        zoneComboBox.value("");
        zoneComboBox.setDataSource(new kendo.data.DataSource({data: zones}));
      });
      podService.getArea(clientId, function(areas){
        var areaComboBox = $("#area").data("kendoComboBox");
        areaComboBox.value("");
        areaComboBox.setDataSource(new kendo.data.DataSource({data: areas}));
      });
    };

  }).controller("podCreateCtl", function ($scope, $state, masterService){
    $scope.validate = function (event) {
      event.preventDefault();
      if ($scope.validator.validate()) {
        masterService.create("pod", {
          "zoneId": $scope.zone? $scope.zone.id: null,
          "fromPod": $scope.podFrom,
          "toPod": $scope.podTo,
          "podTypeId": $scope.podType? $scope.podType.id: null,
          "areaId": $scope.area? $scope.area.id: null,
          "description": $scope.description,
          "clientId": $scope.client? $scope.client.id: null
        }, function (){
          $state.go("main.pod");
        });
      }
    }
  }).controller("podUpdateCtl", function ($scope, $stateParams, $state, masterService){
    masterService.read("pod", $stateParams.id, function(data){
      for(var k in data) $scope[k] = data[k];
      $scope.client = {id: data.clientId};
    });
    $scope.validate = function (event) {
      event.preventDefault();
      if ($scope.validator.validate()) {
        masterService.update("pod", {
          "id": $scope.id,
          "zoneId": $scope.zone? $scope.zone.id: null,
          "fromPod": $scope.podFrom,
          "toPod": $scope.podTo,
          "podTypeId": $scope.podType? $scope.podType.id: null,
          "areaId": $scope.area? $scope.area.id: null,
          "description": $scope.description,
          "clientId": $scope.client? $scope.client.id: null
        }, function () {
          $state.go("main.pod");
        });
      }
    };
  }).controller("podReadCtl", function ($scope, $state, $stateParams, masterService){
    masterService.read("pod", $stateParams.id, function(data){
      for(var k in data) $scope[k] = data[k];
    });
  });
})();