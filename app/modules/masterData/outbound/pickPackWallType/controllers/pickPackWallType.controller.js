/**
 * Created by frank.zhou on 2017/05/08.
 */
(function () {
  'use strict';

  angular.module('myApp').controller("pickPackWallTypeCtl", function ($scope, $rootScope, $window, commonService, masterService) {
    // ===================================================pickPackWallType====================================================
    $window.localStorage["currentItem"] = "pickPackWallType";

    var columns = [
      {field: "name", template: "<a ui-sref='main.pickPackWallTypeRead({id:dataItem.id})'>#: name # </a>", headerTemplate: "<span translate='NAME'></span>"},
      {width:350, headerTemplate: "<span translate='PICK_PACK_FIELD_TYPE'></span>", template: function(item){
        var pickPackFieldTypes = item.pickPackFieldTypes || [];
        for(var i = 0, datas = []; i < pickPackFieldTypes.length; i= i+2){
          var pickPackFieldType = pickPackFieldTypes[i], next = pickPackFieldTypes[i+1];
          var htmlStr = "<div style='margin:1px;'>";
          pickPackFieldType && (htmlStr += "<div class='gridCellList'>"+ pickPackFieldType.name+ "</div>");
          next && (htmlStr += "<div class='gridCellList' style='margin-left:5px;'>"+ next.name+ "</div>");
          htmlStr += "</div>";
          datas.push(htmlStr);
        }
        return datas.join("");
      }},
      {field: "description", headerTemplate: "<span translate='DESCRIPTION'></span>"}
    ];
    $scope.pickPackWallTypeGridOptions = commonService.gridMushiny({columns: columns, dataSource: masterService.getGridDataSource("pickPackWallType")});

    // =================================================pickPackWallTypePosition===============================================
    // 函数
    function pickPackFieldEditor(container, options){
      var source = masterService.getDataSource({key: "getPickPackFieldType", value: "id", text: "name"});
      masterService.selectEditor(container, options, source);
    }
    // stationTypePosition-column
    var stationTypePositionColumns = [
      {field: "orderIndex", editor: masterService.numberEditor, headerTemplate: "<span translate='ORDER_INDEX'></span>"},
      {field: "pickPackFieldType", editor: pickPackFieldEditor, headerTemplate: "<span translate='PICK_PACK_FIELD_TYPE'></span>", template: function(item){
        return item.pickPackFieldType? item.pickPackFieldType.name: "";
      }}
    ];
    $rootScope.stationTypePositionGridOptions = masterService.editGrid({
      height: Math.max(300, $rootScope.mainHeight- 20- 34*2- 10- 20- 20- 40),
      columns: stationTypePositionColumns
    });

  }).controller("pickPackWallTypeCreateCtl", function ($scope, $state, masterService){
    // 保存
    $scope.validate = function (event) {
      event.preventDefault();
      if ($scope.validator.validate()) {
        var stationTypePositionGrid = $("#stationTypePositionGrid").data("kendoGrid"), datas = stationTypePositionGrid.dataSource.data();
        for(var i = 0, details = []; i < datas.length; i++){
          var data = datas[i];
          details.push({"orderIndex": data.orderIndex, "fieldTypeId": data.pickPackFieldType? data.pickPackFieldType.id: ""});
        }
        masterService.create("pickPackWallType", {
          "name": $scope.name,
          "description": $scope.description,
          "positions": details
        }, function () {
          $state.go("main.pick_pack_wall_type");
        });
      }
    };
  }).controller("pickPackWallTypeUpdateCtl", function ($scope, $state, $stateParams, masterService){
    masterService.read("pickPackWallType", $stateParams.id, function(data){
      for(var k in data) $scope[k] = data[k];
      var grid = $("#stationTypePositionGrid").data("kendoGrid");
      grid.setDataSource(new kendo.data.DataSource({data: data.positions}));
    });
    // 修改
    $scope.validate = function (event) {
      event.preventDefault();
      if ($scope.validator.validate()) {
        var stationTypePositionGrid = $("#stationTypePositionGrid").data("kendoGrid"), datas = stationTypePositionGrid.dataSource.data();
        for(var i = 0, details = []; i < datas.length; i++){
          var data = datas[i];
          details.push({"id": data.id || null, "orderIndex": data.orderIndex, "fieldTypeId": data.pickPackFieldType? data.pickPackFieldType.id: ""});
        }
        masterService.update("pickPackWallType", {
          "id": $scope.id,
          "name": $scope.name,
          "description": $scope.description,
          "positions": details
        }, function () {
          $state.go("main.pick_pack_wall_type");
        });
      }
    };
  }).controller("pickPackWallTypeReadCtl", function ($scope, $stateParams, masterService){
    masterService.read("pickPackWallType", $stateParams.id, function(data){
      for(var k in data) $scope[k] = data[k];
      var grid = $("#stationTypePositionGrid").data("kendoGrid");
      grid.setOptions({"editable": false});
      grid.setDataSource(new kendo.data.DataSource({data: data.positions}));
    });
  });
})();