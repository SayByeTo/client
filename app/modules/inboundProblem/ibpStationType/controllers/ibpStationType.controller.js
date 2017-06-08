/**
 * Created by frank.zhou on 2017/05/10.
 */
(function () {
  'use strict';

  angular.module('myApp').controller("ibpStationTypeCtl", function ($scope, $rootScope, $window, $translate, $state, commonService, problemInboundBaseService) {
    // ===================================================stationType====================================================
    $window.localStorage["currentItem"] = "ibpStationType";

    var columns = [
      {field: "name", template: "<a ui-sref='main.ibpStationTypeRead({id:dataItem.id})'>#: name # </a>", headerTemplate: "<span translate='NAME'></span>"},
      {field: "description", headerTemplate: "<span translate='DESCRIPTION'></span>"}
    ];
    $scope.ibpStationTypeGridOptions = commonService.gridMushiny({columns: columns, dataSource: problemInboundBaseService.getGridDataSource("ibpStationType")});

    // =================================================stationTypePosition===============================================
    // 函数
    function stateEditor(container, options){
      var source = problemInboundBaseService.getDataSource({
        key: "getSelectionBySelectionKey", value: "selectionValue", text: "resourceKey",
        data: {selectionKey: "INVENTORY_STATE"}
      });
      problemInboundBaseService.selectEditor(container, options, source);
    }
    // stationTypePosition-column
    var stationTypePositionColumns = [
      {field: "positionIndex", editor: problemInboundBaseService.numberEditor, headerTemplate: "<span translate='POSITION_INDEX'></span>"},
      {field: "positionState", editor: stateEditor, headerTemplate: "<span translate='POSITION_STATE'></span>", template: function(item){
        return item.positionState? (typeof item.positionState === "string"? $translate.instant(item.positionState): item.positionState.resourceKey): "";
      }}
    ];
    $rootScope.stationTypePositionGridOptions = problemInboundBaseService.editGrid({
      height: Math.max(300, $rootScope.mainHeight- 20- 34*2- 10- 20- 20- 40),
      columns: stationTypePositionColumns
    });

  }).controller("ibpStationTypeCreateCtl", function ($scope, $state, problemInboundBaseService){
    $scope.validate = function (event) {
      event.preventDefault();
      if ($scope.validator.validate()) {
        var stationTypePositionGrid = $("#stationTypePositionGrid").data("kendoGrid"), datas = stationTypePositionGrid.dataSource.data();
        for(var i = 0, details = []; i < datas.length; i++){
          var data = datas[i];
          details.push({"positionIndex": data.positionIndex, "positionState": data.positionState? data.positionState.selectionValue: ""});
        }
        problemInboundBaseService.create("ibpStationType", {
          "name": $scope.name,
          "description": $scope.description,
          "positions": details
        }, function () {
          $state.go("main.ibp_station_type");
        });
      }
    };
  }).controller("ibpStationTypeUpdateCtl", function ($scope, $state, $stateParams, problemInboundBaseService){
    problemInboundBaseService.read("ibpStationType", $stateParams.id, function(data){
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
        problemInboundBaseService.update("ibpStationType", {
          "id": $scope.id,
          "name": $scope.name,
          "description": $scope.description,
          "positions": details
        }, function () {
          $state.go("main.ibp_station_type");
        });
      }
    };
  }).controller("ibpStationTypeReadCtl", function ($scope, $state, $stateParams, problemInboundBaseService){
    problemInboundBaseService.read("ibpStationType", $stateParams.id, function(data){
      for(var k in data) $scope[k] = data[k];
      var grid = $("#stationTypePositionGrid").data("kendoGrid");
      grid.setOptions({"editable": false});
      grid.setDataSource(new kendo.data.DataSource({data: data.positions}));
    });
  });
})();