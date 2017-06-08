/**
 * Created by frank.zhou on 2017/04/18.
 */
(function () {
  'use strict';

  angular.module('myApp').controller("userCtl", function ($scope, $rootScope, $window, commonService, systemService) {

    $window.localStorage["currentItem"] = "user";

    var columns = [{
      field: "username",
      template: "<a ui-sref='main.userRead({id:dataItem.id})'>#: username # </a>",
      headerTemplate: "<span translate='USERNAME'></span>"
    },
    {field: "name", headerTemplate: "<span translate='NAME'></span>"},
    {field: "userGroup", headerTemplate: "<span translate='USERGROUP'></span>", template: function(item){
      return item.userGroup? item.userGroup.name: "";
    }},
    {field: "phone", headerTemplate: "<span translate='PHONE'></span>"},
    {field: "email", headerTemplate: "<span translate='EMAIL'></span>"},
    {field: "locale", headerTemplate: "<span translate='LOCALE'></span>"}];
    $scope.userGridOptions = commonService.gridMushiny({columns: columns, dataSource: systemService.getGridDataSource("user")});
    $rootScope.userGroupSource = systemService.getDataSource({key: "getUserGroup", text: "name", value: "id"});
    $rootScope.languageSource = systemService.getDataSource({
      key: "getSelectionBySelectionKey",
      value: "selectionValue",
      text: "resourceKey",
      data: {selectionKey: "LANGUAGE"}
    });
  }).controller("userCreateCtl", function ($scope, $state, systemService) {
    $scope.validate = function (event) {
      event.preventDefault();
      if ($scope.validator.validate()) {
        systemService.create("user", {
          "username": $scope.username,
          "password": $scope.password,
          "name": $scope.name,
          "email": $scope.email,
          "phone": $scope.phone,
          "locale": $scope.locale.selectionValue,
          "userGroupId": $scope.userGroup? $scope.userGroup.id: null,
          "clientId": $scope.client? $scope.client.id: null,
          "warehouseId": $scope.warehouse? $scope.warehouse.id: null
        }, function () {
          $state.go("main.user");
        });
      }
    }
  }).controller("userUpdateCtl", function ($scope, $state, $stateParams, systemService) {
    systemService.read("user", $stateParams.id, function (data) {
      for (var k in data) $scope[k] = (k=="locale"? systemService.toMap(data[k]): data[k]);
    });
    $scope.validate = function (event) {
      event.preventDefault();
      if ($scope.validator.validate()) {
        systemService.update("user", {
          "id": $scope.id,
          "username": $scope.username,
          "name": $scope.name,
          "email": $scope.email,
          "phone": $scope.phone,
          "locale": $scope.locale.selectionValue,
          "userGroupId": $scope.userGroup? $scope.userGroup.id: null,
          "clientId": $scope.client? $scope.client.id: null,
          "warehouseId": $scope.warehouse? $scope.warehouse.id: null
        }, function () {
          $state.go("main.user");
        });
      }
    }
  }).controller("userReadCtl", function ($scope, $stateParams, systemService) {
    systemService.read("user", $stateParams.id, function (data) {
      for (var k in data) $scope[k] = (k=="locale"? systemService.toMap(data[k]): data[k]);
    });
  });
})();