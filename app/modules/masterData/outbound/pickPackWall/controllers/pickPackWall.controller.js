/**
 * Created by frank.zhou on 2017/05/08.
 */
(function () {
  'use strict';

  angular.module('myApp').controller("pickPackWallCtl", function ($scope, $rootScope, $window, commonService, masterService) {

    $window.localStorage["currentItem"] = "pickPackWall";

    $rootScope.pickPackWallTypeSource =  masterService.getDataSource({key: "getPickPackWallType", text: "name", value: "id"});
    $rootScope.labelControllerSource =  masterService.getDataSource({key: "getLabelController", text: "name", value: "id"});

    var columns = [
      {field: "name", template: "<a ui-sref='main.pickPackWallRead({id:dataItem.id})'>#: name # </a>", headerTemplate: "<span translate='NAME'></span>"},
      {field: "pickPackWallType.name",template: "<a ui-sref='main.pick_pack_wall_type'>#: pickPackWallType.name # </a>", headerTemplate: "<span translate='PICK_PACK_WALL_TYPE'></span>"},
      {field: "numberOfRows", headerTemplate: "<span translate='NUMBER_OF_ROWS'></span>"},
      {field: "numberOfColumns", headerTemplate: "<span translate='NUMBER_OF_COLUMNS'></span>"},
      {field: "description", headerTemplate: "<span translate='DESCRIPTION'></span>"}
    ];
    $scope.pickPackWallGridOptions = commonService.gridMushiny({columns: columns, dataSource: masterService.getGridDataSource("pickPackWall")});

  }).controller("pickPackWallCreateCtl", function ($scope, $state, masterService, pickPackWallService){
    // 转数组
    $scope.toItems = function(number){
      return new Array(number);
    };

    // 选择pickPackWallType
    $scope.changeWallType = function(pickPackWallType){
      masterService.read("pickPackWallType", pickPackWallType.id, function(data){
        var pickPackFieldTypes = data.pickPackFieldTypes;
        $scope.pickPackFieldTypes = pickPackFieldTypes;
        for(var i = 0, width = 0, fieldTypeIds = []; i < pickPackFieldTypes.length; i++){
          var fieldType = pickPackFieldTypes[i];
          fieldTypeIds.push(fieldType.id);
          width += 120*fieldType.numberOfColumns;
        }
        $scope.frontTableWidth = width;
        $scope.backTableWidth = width;
        $scope.fieldTypeIds = fieldTypeIds;
      });
    };

    // 选择标签控制器
    $scope.changeLabelController = function(labelController){
      if(!labelController.length){
        $scope.digitalLabelSource = [];
        return;
      }
      // 标签控制器
      for(var i = 0, ids = []; i < labelController.length; i++) ids.push(labelController[i].id);
      // 取所有电子标签
      pickPackWallService.getDigitalLabelByLabel(ids, function(data){
        $scope.digitalLabelSource = data;
      });
    };

    // 保存
    $scope.validate = function (event) {
      event.preventDefault();
      if ($scope.validator.validate()) {
        // 电子标签
        var digitalLabel1 = [], digitalLabel2 = [];
        $scope.pickPackFieldTypes.forEach(function(fieldType){
          // 电子标签正面
          $("input[class~=front"+ fieldType.name+ "][data-role=combobox]").each(function(){
            var comboBox = $(this).data("kendoComboBox"), value = comboBox.value();
            digitalLabel1.push(value!=""? value: null);
          });
          // 电子标签反面
          $("input[class~=back"+ fieldType.name+ "][data-role=combobox]").each(function(){
            var comboBox = $(this).data("kendoComboBox"), value = comboBox.value();
            digitalLabel2.push(value!=""? value: null);
          });
        });
        // 保存
        masterService.create("pickPackWall", {
          "name": $scope.name,
          "numberOfRows": $scope.numberOfRows,
          "numberOfColumns": $scope.numberOfColumns,
          "typeId": $scope.pickPackWallType? $scope.pickPackWallType.id: null,
          "description": $scope.description,
          "digitalLabel1": digitalLabel1,
          "digitalLabel2": digitalLabel2,
          "pickPackFieldTypeNames": $scope.fieldTypeIds
         }, function () {
          $state.go("main.pick_pack_wall");
        });
      }
    };
  }).controller("pickPackWallUpdateCtl", function ($scope, $state, $stateParams, masterService){
    masterService.read("pickPackWall", $stateParams.id, function(data){
      for(var k in data) $scope[k] = data[k];
    });
    $scope.validate = function (event) {
      event.preventDefault();
      if ($scope.validator.validate()) {
        masterService.update("pickPackWall", {
          "id": $scope.id,
          "name": $scope.name,
          "numberOfRows": $scope.numberOfRows,
          "numberOfColumns": $scope.numberOfColumns,
          "typeId": $scope.pickPackWallType? $scope.pickPackWallType.id: null,
          "description": $scope.description
        }, function () {
          $state.go("main.pick_pack_wall");
        });
      }
    };
  }).controller("pickPackWallReadCtl", function ($scope, $stateParams, masterService){
    masterService.read("pickPackWall", $stateParams.id, function(data){
      for(var k in data) $scope[k] = data[k];
    });
  });
})();