/**
 * Created by frank.zhou on 2017/04/25.
 */
(function () {
  'use strict';

  angular.module('myApp').controller("stowStationTypeCtl", function ($scope, $rootScope, $translate, $window, commonService, masterService) {
    // ===================================================stationType====================================================
    $window.localStorage["currentItem"] = "stowStationType";

    var columns = [
      {field: "name", template: "<a ui-sref='main.stowStationTypeRead({id:dataItem.id})'>#: name # </a>", headerTemplate: "<span translate='NAME'></span>"},
      {field: "description", headerTemplate: "<span translate='DESCRIPTION'></span>"}
    ];
    $scope.stowStationTypeGridOptions = commonService.gridMushiny({columns: columns, dataSource: masterService.getGridDataSource("stowStationType")});

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
      height: Math.max(300, $rootScope.mainHeight- 20- 34*2- 10- 20- 20- 40),
      columns: stationTypePositionColumns
    });

  }).controller("stowStationTypeCreateCtl", function ($scope, $state, masterService) {
    $scope.validate = function (event) {
      event.preventDefault();
      if ($scope.validator.validate()) {
        var stationTypePositionGrid = $("#stationTypePositionGrid").data("kendoGrid"), datas = stationTypePositionGrid.dataSource.data();
        for(var i = 0, details = []; i < datas.length; i++){
          var data = datas[i];
          details.push({"positionIndex": data.positionIndex, "positionState": data.positionState? data.positionState.selectionValue: ""});
        }
        masterService.create("stowStationType", {
          "name": $scope.name,
          "description": $scope.description,
          "positions": details
        }, function () {
          $state.go("main.stow_station_type");
        });
      }
    };
  }).controller("stowStationTypeUpdateCtl", function ($scope, $state, $stateParams, masterService) {
    masterService.read("stowStationType", $stateParams.id, function(data){
      for(var k in data) $scope[k] = data[k];
      $scope.client = {id: data.clientId};
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
        masterService.update("stowStationType", {
          "id": $scope.id,
          "name": $scope.name,
          "description": $scope.description,
          "positions": details
        }, function () {
          $state.go("main.stow_station_type");
        });
      }
    };
  }).controller("stowStationTypeReadCtl", function ($scope, $state, $stateParams, masterService) {
    masterService.read("stowStationType", $stateParams.id, function(data){
      for(var k in data) $scope[k] = data[k];
      var grid = $("#stationTypePositionGrid").data("kendoGrid");
      grid.setOptions({"editable": false});
      grid.setDataSource(new kendo.data.DataSource({data: data.positions}));
    });
  });
})();