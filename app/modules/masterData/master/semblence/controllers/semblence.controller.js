/**
 * Created by frank.zhou on 2017/04/21.
 */
(function () {
  'use strict';

  angular.module('myApp').controller("semblemceCtl", function ($scope, $rootScope, $window, $state, commonService, semblenceService) {

    $window.localStorage["currentItem"] = "semblence";

    var columns = [
      {field: "semblence",width: 120, template: "<a ui-sref='main.semblenceRead({id:dataItem.semblence})'>#: name # </a>", headerTemplate: "<span translate='NAME'></span>"},
        {field: "client", width: 70, headerTemplate: "<span translate='CLIENT'></span>"},
        {field: "itemGroup", width: 70, headerTemplate: "<span translate='ITEMGROUP'></span>"}
    ];
    $scope.semblenceGridOptions = commonService.gridMushiny({columns: columns, dataSource: commonService.getGridDataSource("semblence")});

  }).controller("semblemceCreateCtl", function ($scope, $state, semblenceService){
    $scope.validate = function (event) {
      event.preventDefault();
      if ($scope.validator.validate()) {
          semblenceService.createSemblence({
          "clientId": $scope.clientId,
          "itemGroupId": $scope.itemGroupId,
          "semblence": $scope.semblence,
        }, function () {
          $state.go("main.semblence");
         });
      }
    };
  }).controller("semblemceReadCtl", function ($scope, $state, $stateParams, semblenceService){
    masterService.read("semblemce", $stateParams.id, function(data){
      for(var k in data) $scope[k] = data[k];
    });
  });
})();