/**
 * Created by frank.zhou on 2017/05/04.
 */
(function () {
  'use strict';

  angular.module('myApp').controller("labelControllerCtl", function ($scope, $rootScope, $window,  $state, commonService, masterService) {

    $window.localStorage["currentItem"] = "labelController";

    var columns = [
      {field: "name", width: 200, template: "<a ui-sref='main.labelControllerRead({id:dataItem.id})'>#: name # </a>", headerTemplate: "<span translate='NAME'></span>"},
      {headerTemplate: ""}
    ];
    $scope.labelControllerGridOptions = commonService.gridMushiny({columns: columns, dataSource: masterService.getGridDataSource("labelController")});

  }).controller("labelControllerCreateCtl", function ($scope, $state, masterService){
    $scope.validate = function (event) {
      event.preventDefault();
      if ($scope.validator.validate()) {
        masterService.create("labelController", {
          "name": $scope.name
        }, function () {
          $state.go("main.label_controller");
        });
      }
    };
  }).controller("labelControllerUpdateCtl", function ($scope, $state, $stateParams, masterService){
    masterService.read("labelController", $stateParams.id, function(data){
      for(var k in data) $scope[k] = data[k];
    });
    $scope.validate = function (event) {
      event.preventDefault();
      if ($scope.validator.validate()) {
        masterService.update("labelController", {
          "id": $scope.id,
          "name": $scope.name
        }, function () {
          $state.go("main.label_controller");
        });
      }
    };
  }).controller("labelControllerReadCtl", function ($scope, $state, $stateParams, masterService){
    masterService.read("labelController", $stateParams.id, function(data){
      for(var k in data) $scope[k] = data[k];
    });
  });
})();