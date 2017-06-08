/**
 * Created by frank.zhou on 2017/05/02.
 */
(function () {
  'use strict';

  angular.module('myApp').controller("workstationCtl", function ($scope, $rootScope, $window, commonService, masterService) {
    // ===================================================workstation====================================================
    $window.localStorage["currentItem"] = "workstation";

    $rootScope.workstationTypeSource = masterService.getDataSource({key: "getWorkstationType", text: "name", value: "id"});
    $rootScope.pickPackWallSource = masterService.getDataSource({key: "getPickPackWall", text: "name", value: "id"});

    var columns = [
      {field: "name", template: "<a ui-sref='main.workstationRead({id:dataItem.id})'>#: name # </a>", headerTemplate: "<span translate='NAME'></span>"},
      {field: "workstationType.name", template: "<a ui-sref='main.workstation_type'>#: workstationType.name # </a>", headerTemplate: "<span translate='WORKSTATION_TYPE'></span>"},
      {field: "pickPackWall", headerTemplate: "<span translate='PICK_PACK_WALL'></span>", template: function(item){
        return item.pickPackWall? item.pickPackWall.name: "";
      }}
    ];
    $scope.workstationGridOptions = commonService.gridMushiny({columns: columns, dataSource: masterService.getGridDataSource("workstation")});

    // =================================================workstationPosition===============================================
    // 函数
    function digitalLabelEditor(container, options){
      var source = masterService.getDataSource({key: "getDigitalLabel", text: "name", value: "id"});
      masterService.selectEditor(container, options, source);
    }
    // workstationPosition-column
    var workstationPositionColumns = [
      {field: "positionNo", headerTemplate: "<span translate='POSITION_NO'></span>"},
      {field: "positionIndex", editor: masterService.numberEditor, headerTemplate: "<span translate='POSITION_INDEX'></span>"},
      {field: "digitalLabel", editor: digitalLabelEditor, headerTemplate: "<span translate='DIGITAL_LABEL'></span>", template: function(item){
        return item.digitalLabel? item.digitalLabel.name: "";
      }}
    ];
    $rootScope.workstationPositionGridOptions = masterService.editGrid({
      height: Math.max(300, $rootScope.mainHeight- 20- 34*3- 10- 20- 20- 40),
      columns: workstationPositionColumns
    });

  }).controller("workstationCreateCtl", function ($scope, $state, masterService) {
    $scope.fixedScanner = "true";
    $scope.validate = function (event) {
      event.preventDefault();
      if ($scope.validator.validate()) {
        var workstationPositionGrid = $("#workstationPositionGrid").data("kendoGrid"), datas = workstationPositionGrid.dataSource.data();
        for(var i = 0, details = []; i < datas.length; i++){
          var data = datas[i];
          details.push({
            "positionNo": data.positionNo,
            "positionIndex": data.positionIndex,
            "digitalLabelId": data.digitalLabel? data.digitalLabel.id: ""
          });
        }
        masterService.create("workstation", {
          "name": $scope.name,
          "typeId": $scope.workstationType? $scope.workstationType.id: "",
          "pickPackWallId": $scope.pickPackWall? $scope.pickPackWall.id: "",
          "fixedScanner": $scope.fixedScanner,
          "positions": details
        }, function () {
          $state.go("main.workstation");
        });
      }
    };
  }).controller("workstationUpdateCtl", function ($scope, $state, $stateParams, masterService) {
    masterService.read("workstation", $stateParams.id, function(data){
      for(var k in data){
        if(data[k] === true) data[k] = "true";
        else if(data[k] === false) data[k] = "false";
        $scope[k] = data[k];
      }
      var grid = $("#workstationPositionGrid").data("kendoGrid");
      grid.setDataSource(new kendo.data.DataSource({data: data.positions}));
    });
    $scope.validate = function (event) {
      event.preventDefault();
      if ($scope.validator.validate()) {
        var workstationPositionGrid = $("#workstationPositionGrid").data("kendoGrid"), datas = workstationPositionGrid.dataSource.data();
        for(var i = 0, details = []; i < datas.length; i++){
          var data = datas[i];
          details.push({
            "id": data.id || null,
            "positionNo": data.positionNo,
            "positionIndex": data.positionIndex,
            "digitalLabelId": data.digitalLabel? data.digitalLabel.id: ""
          });
        }
        masterService.update("workstation", {
          "id": $scope.id,
          "name": $scope.name,
          "typeId": $scope.workstationType? $scope.workstationType.id: "",
          "pickPackWallId": $scope.pickPackWall? $scope.pickPackWall.id: "",
          "fixedScanner": $scope.fixedScanner,
          "positions": details
        }, function () {
          $state.go("main.workstation");
        });
      }
    };
  }).controller("workstationReadCtl", function ($scope, $state, $stateParams, masterService) {
    masterService.read("workstation", $stateParams.id, function(data){
      for(var k in data){
        if(data[k] === true) data[k] = "true";
        else if(data[k] === false) data[k] = "false";
        $scope[k] = data[k];
      }
      var grid = $("#workstationPositionGrid").data("kendoGrid");
      grid.setOptions({"editable": false});
      grid.setDataSource(new kendo.data.DataSource({data: data.positions}));
    });
  });
})();