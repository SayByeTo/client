/**
 * Created by frank.zhou on 2017/05/08.
 */
(function () {
  'use strict';

  angular.module('myApp').controller("pickPackCellCtl", function ($scope, $rootScope, $window, commonService, masterService) {

    $window.localStorage["currentItem"] = "pickPackCell";

    $rootScope.pickPackCellTypeSource = masterService.getDataSource({key: "getPickPackCellType", text: "name", value: "id"});
    $rootScope.pickPackWallSource = masterService.getDataSource({key: "getPickPackWall", text: "name", value: "id"});

    var columns = [
      {field: "name", template: "<a ui-sref='main.pickPackCellRead({id:dataItem.id})'>#: name # </a>", headerTemplate: "<span translate='NAME'></span>"},
      {field: "pickPackCellType.name",template: "<a ui-sref='main.pick_pack_cell_type'>#: pickPackCellType.name # </a>", headerTemplate: "<span translate='PICK_PACK_CELL_TYPE'></span>"},
      {field: "pickPackWall.name",template: "<a ui-sref='main.pick_pack_wall'>#: pickPackWall.name # </a>", headerTemplate: "<span translate='PICK_PACK_WALL'></span>"},
      {field: "xPos", headerTemplate: "<span translate='X_POS'></span>"},
      {field: "yPos", headerTemplate: "<span translate='Y_POS'></span>"},
      {field: "zPos", headerTemplate: "<span translate='Z_POS'></span>"},
      {field: "field", headerTemplate: "<span translate='FIELD'></span>"},
      {field: "fieldIndex", headerTemplate: "<span translate='FIELD_INDEX'></span>"},
      {field: "digitalLabel1", headerTemplate: "<span translate='DIGITAL_LABEL_FRONT'></span>", template: function(item){
        return item.digitalLabel1? item.digitalLabel1.name: "";
      }},
      {field: "digitalLabel2", headerTemplate: "<span translate='DIGITAL_LABEL_BACK'></span>", template: function(item){
        return item.digitalLabel2? item.digitalLabel2.name: "";
      }}
    ];
    $scope.pickPackCellGridOptions = commonService.gridMushiny({columns: columns, dataSource: masterService.getGridDataSource("pickPackCell")});

  }).controller("pickPackCellCreateCtl", function ($scope, $state, masterService){
    $scope.validate = function (event) {
      event.preventDefault();
      if ($scope.validator.validate()) {
        masterService.create("pickPackCell", {
          "name": $scope.name,
          "typeId": $scope.pickPackCellType? $scope.pickPackCellType.id: null,
          "pickPackWallId": $scope.pickPackWall? $scope.pickPackWall.id: null,
          "xPos": $scope.xPos,
          "yPos": $scope.yPos,
          "zPos": $scope.zPos,
          "field": $scope.field,
          "fieldIndex": $scope.fieldIndex,
          "orderIndex": $scope.orderIndex,
          "labelColor": $scope.labelColor
        }, function () {
          $state.go("main.pick_pack_cell");
        });
      }
    };
  }).controller("pickPackCellUpdateCtl", function ($scope, $state, $stateParams, masterService){
    $scope.digitalLabelSource = masterService.getDataSource({key: "getDigitalLabel", text: "name", value: "id"});
    //
    masterService.read("pickPackCell", $stateParams.id, function(data){
      for(var k in data) $scope[k] = data[k];
    });
    $scope.validate = function (event) {
      event.preventDefault();
      if ($scope.validator.validate()) {
        masterService.update("pickPackCell", {
          "id": $scope.id,
          "name": $scope.name,
          "typeId": $scope.pickPackCellType? $scope.pickPackCellType.id: null,
          "pickPackWallId": $scope.pickPackWall? $scope.pickPackWall.id: null,
          "xPos": $scope.xPos,
          "yPos": $scope.yPos,
          "zPos": $scope.zPos,
          "field": $scope.field,
          "fieldIndex": $scope.fieldIndex,
          "orderIndex": $scope.orderIndex,
          "labelColor": $scope.labelColor,
          "digitalLabel1Id": $scope.digitalLabel1? $scope.digitalLabel1.id: null,
          "digitalLabel2Id": $scope.digitalLabel2? $scope.digitalLabel2.id: null
        }, function () {
          $state.go("main.pick_pack_cell");
        });
      }
    };
  }).controller("pickPackCellReadCtl", function ($scope, $stateParams, masterService){
    masterService.read("pickPackCell", $stateParams.id, function(data){
      for(var k in data) $scope[k] = data[k];
    });
  });
})();