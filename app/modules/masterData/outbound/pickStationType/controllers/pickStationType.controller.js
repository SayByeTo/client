/**
 * Created by frank.zhou on 2017/05/08.
 */
(function () {
  'use strict';

  angular.module('myApp').controller("pickStationTypeCtl", function ($scope, $rootScope, $translate, $window, commonService, masterService) {
    // ===================================================stationType====================================================
    $window.localStorage["currentItem"] = "pickStationType";

    $rootScope.pickPackWallTypeSource = masterService.getDataSource({key: "getPickPackWallType", text: "name", value: "id"});

    var columns = [
      {field: "name", template: "<a ui-sref='main.pickStationTypeRead({id:dataItem.id})'>#: name # </a>", headerTemplate: "<span translate='NAME'></span>"},
      {field: "pickPackWallType", headerTemplate: "<span translate='PICK_PACK_WALL_TYPE'></span>", template: function(item){
        return item.pickPackWallType? item.pickPackWallType.name: "";
      }},
      {field: "description", headerTemplate: "<span translate='DESCRIPTION'></span>"}
    ];
    $scope.pickStationTypeGridOptions = commonService.gridMushiny({columns: columns, dataSource: masterService.getGridDataSource("pickStationType")});

    // =================================================stationTypePosition===============================================
    // 函数
    function stateEditor(container, options){
      var source = masterService.getDataSource({
        key: "getSelectionBySelectionKey", value: "selectionValue", text: "resourceKey",
        data: {selectionKey: "INVENTORY_STATE"}
      });
      masterService.selectEditor(container, options, source);
    }
    // stationTypePosition-column
    var stationTypePositionColumns = [
      {field: "positionIndex", editor: masterService.numberEditor, headerTemplate: "<span translate='POSITION_INDEX'></span>"},
      {field: "positionState", editor: stateEditor, headerTemplate: "<span translate='POSITION_STATE'></span>", template: function(item){
        return item.positionState? (typeof item.positionState === "string"? $translate.instant(item.positionState): item.positionState.resourceKey): "";
      }}
    ];
    $rootScope.stationTypePositionGridOptions = masterService.editGrid({
      height: Math.max(300, $rootScope.mainHeight- 20- 34*3- 10- 20- 20- 40),
      columns: stationTypePositionColumns
    });

  }).controller("pickStationTypeCreateCtl", function ($scope, $state, masterService) {
    $scope.validate = function (event) {
      event.preventDefault();
      if ($scope.validator.validate()) {
        var stationTypePositionGrid = $("#stationTypePositionGrid").data("kendoGrid"), datas = stationTypePositionGrid.dataSource.data();
        for(var i = 0, details = []; i < datas.length; i++){
          var data = datas[i];
          details.push({"positionIndex": data.positionIndex, "positionState": data.positionState? data.positionState.selectionValue: ""});
        }
        masterService.create("pickStationType", {
          "name": $scope.name,
          "pickPackWallTypeId": $scope.pickPackWallType? $scope.pickPackWallType.id: null,
          "description": $scope.description,
          "positions": details
        }, function () {
          $state.go("main.pick_station_type");
        });
      }
    };
  }).controller("pickStationTypeUpdateCtl", function ($scope, $state, $stateParams, masterService) {
    masterService.read("pickStationType", $stateParams.id, function(data){
      for(var k in data) $scope[k] = data[k];
      var grid = $("#stationTypePositionGrid").data("kendoGrid");
      grid.setDataSource(new kendo.data.DataSource({data: data.positions}));
    });
    $scope.validate = function (event) {
      event.preventDefault();
      if ($scope.validator.validate()) {
        var stationTypePositionGrid = $("#stationTypePositionGrid").data("kendoGrid"), datas = stationTypePositionGrid.dataSource.data();
        for(var i = 0, details = []; i < datas.length; i++){
          var data = datas[i];
          details.push({"id": data.id || null, "positionIndex": data.positionIndex, "positionState": data.positionState? data.positionState.selectionValue: ""});
        }
        masterService.update("pickStationType", {
          "id": $scope.id,
          "name": $scope.name,
          "pickPackWallTypeId": $scope.pickPackWallType? $scope.pickPackWallType.id: null,
          "description": $scope.description,
          "positions": details
        }, function () {
          $state.go("main.pick_station_type");
        });
      }
    };
  }).controller("pickStationTypeReadCtl", function ($scope, $stateParams, masterService) {
    masterService.read("pickStationType", $stateParams.id, function(data){
      for(var k in data) $scope[k] = data[k];
      var grid = $("#stationTypePositionGrid").data("kendoGrid");
      grid.setOptions({"editable": false});
      grid.setDataSource(new kendo.data.DataSource({data: data.positions}));
    });
  });
})();