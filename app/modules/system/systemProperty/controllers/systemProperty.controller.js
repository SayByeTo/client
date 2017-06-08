/**
 * Created by frank.zhou on 2017/04/18.
 */
(function () {
  'use strict';

  angular.module('myApp').controller("systemPropertyCtl", function ($scope, $window, commonService, systemService) {

    $window.localStorage["currentItem"] = "systemProperty";

    var columns = [
      {field: "systemKey", headerTemplate: "<span translate='SYSTEM_KEY'></span>"},
      {field: "systemValue", headerTemplate: "<span translate='SYSTEM_VALUE'></span>"},
      {field: "workstation", headerTemplate: "<span translate='WORKSTATION'></span>"},
      {field: "groupName", headerTemplate: "<span translate='GROUP_NAME'></span>"},
      {field: "hidden", headerTemplate: "<span translate='HIDDEN'></span>"},
      {field: "description", headerTemplate: "<span translate='DESCRIPTION'></span>"}
    ];
    $scope.systemPropertyGridOptions = commonService.gridMushiny({columns: columns, dataSource: systemService.getGridDataSource('systemProperty')});

  }).controller("systemPropertyCreateCtl", function ($scope, $state, systemService) {
    $scope.hidden = "true";
    $scope.validate = function (event) {
      event.preventDefault();
      if ($scope.validator.validate()) {
        systemService.create("systemProperty", {
          "systemKey": $scope.systemKey,
          "systemValue": $scope.systemValue,
          "workstation": $scope.workstation,
          "groupName": $scope.groupName,
          "hidden": $scope.hidden,
          "description": $scope.description,
          "clientId": $scope.client.id
        }, function () {
          $state.go("main.system_property");
        });
      }
    }
  }).controller("systemPropertyUpdateCtl", function ($scope, $state, $stateParams, systemService) {
    systemService.read("systemProperty", $stateParams.id, function(data){
      for(var k in data){
        if(data[k] === true) data[k] = "true";
        else if(data[k] === false) data[k] = "false";
        $scope[k] = data[k];
      }
    });
    $scope.validate = function (event) {
      event.preventDefault();
      if ($scope.validator.validate()) {
        systemService.update("systemProperty", {
          "id": $scope.id,
          "systemKey": $scope.systemKey,
          "systemValue": $scope.systemValue,
          "workstation": $scope.workstation,
          "groupName": $scope.groupName,
          "hidden": $scope.hidden,
          "description": $scope.description,
          "clientId": $scope.client.id
        }, function () {
          $state.go("main.system_property");
        });
      }
    }
  }).controller("systemPropertyReadCtl", function ($scope, $stateParams, systemService) {
    systemService.read("systemProperty", $stateParams.id, function(data){
      for(var k in data){
        if(data[k] === true) data[k] = "true";
        else if(data[k] === false) data[k] = "false";
        $scope[k] = data[k];
      }
    });
  });
})();