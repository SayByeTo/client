
/**
 * Created by frank.zhou on 2017/04/21.
 */
(function () {
  'use strict';

  angular.module('myApp').controller("itemDataCtl", function($scope, $window, $rootScope, $state, commonService, masterService) {

    $window.localStorage["currentItem"] = "itemData";

    //
    var columns = [
      {field: "itemNo", width:140, template: "<a ui-sref='main.itemDataRead({id:dataItem.id})'>#: itemNo # </a>", headerTemplate: "<span translate='ITEM_NO'></span>"},
      {field: "skuNo", width:140, headerTemplate: "<span translate='SKU_NO'></span>"},
      {field: "name", width:180, headerTemplate: "<span translate='NAME'></span>"},
      //{field: "description", width:100, headerTemplate: "<span translate='DESCRIPTION'></span>"},
      {field: "safetyStock", width:100, headerTemplate: "<span translate='SAFETY_STOCK'></span>"},
      {field: "itemGroup.name", width:100, template: "<a ui-sref='main.item_group'>#: itemGroup.name # </a>", headerTemplate: "<span translate='ITEM_GROUP'></span>"},

      {field: "lotMandatory", width:70, headerTemplate: "<span translate='LOT_MANDATORY'></span>"},
      //{field: "lotType", width:70, headerTemplate: "<span translate='LOT_TYPE'></span>"},
      //{field: "lotUnit", width:70, headerTemplate: "<span translate='LOT_UNIT'></span>"},
      {field: "lotThreshold", width:65, headerTemplate: "<span translate='LOT_THRESHOLD'></span>"},
      {field: "itemUnit.name", width:100, template: "<a ui-sref='main.item_unit'>#: itemUnit.name # </a>", headerTemplate: "<span translate='HANDING_UNIT'></span>"},

      {field: "measured", width:70, headerTemplate: "<span translate='MEASURED'></span>"},
      {field: "width", width:100, headerTemplate: "<span translate='LENGTH'></span><span>(mm)</span>"},
      {field: "depth", width:100, headerTemplate: "<span translate='WIDTH'></span><span>(mm)</span>"},
      {field: "height", width:100, headerTemplate: "<span translate='HEIGHT'></span><span>(mm)</span>"},
      //{field: "volume", width:100, headerTemplate: "<span translate='VOLUME'></span>"},
      {field: "weight", width:100, headerTemplate: "<span translate='WEIGHT'></span><span>(g)</span>"},

      {field: "multiplePart", width:70, headerTemplate: "<span translate='MULTIPLE_PART'></span>"},
      {field: "multiplePartAmount", width:65, headerTemplate: "<span translate='MULTIPLE_PART_AMOUNT'></span>"},
      {field: "preferOwnBox", width:70, headerTemplate: "<span translate='PREFER_OWN_BOX'></span>"},
      {field: "preferBag", width:70, headerTemplate: "<span translate='PREFER_BAG'></span>"},
      {field: "useBubbleFilm", width:70, headerTemplate: "<span translate='USE_BUBBLE_FILM'></span>"},
      {field: "itemSellingDegree", width:100, headerTemplate: "<span translate='ITEM_SELLING_DEGREE'></span>"}
     ];
    $scope.itemDataGridOptions = commonService.gridMushiny({columns: columns, dataSource: masterService.getGridDataSource("itemData")});
  }).controller("itemDataCreateCtl", function ($scope, $rootScope, $state, masterService){
    // 选择itemDataGlobal
    $scope.selectItemDataGlobal = function(){
      $rootScope.selectInWindow({
        title: "ITEM_DATA_GLOBAL",
        srcKey: "itemDataGlobal",
        srcColumns: [
          {field: "skuNo", headerTemplate: "<span translate='SKU_NO'></span>"},
          {"field": "name", headerTemplate: "<span translate='NAME'></span>"},
          {field: "itemNo", headerTemplate: "<span translate='ITEM_NO'></span>"}
        ],
        init: function(options){
          options.showSkuNo = true;
        },
        back: function(data){
          $scope.itemDataGlobal = data;
        }
      });
    };
    // 保存
    $scope.validate = function (event) {
      event.preventDefault();
      if ($scope.validator.validate()) {
        masterService.create("itemData", {
          "name": $scope.itemDataGlobal.name,
          "description": $scope.itemDataGlobal.description,
          "safetyStock": $scope.itemDataGlobal.safetyStock,
          "itemDataGlobalId": $scope.itemDataGlobal.id,
          "clientId": $scope.client? $scope.client.id: null
        }, function () {
          $state.go("main.item_data");
        });
      }
    };
  }).controller("itemDataUpdateCtl", function ($scope, $rootScope, $stateParams, $state, masterService){
    masterService.read("itemData", $stateParams.id, function(data){
      for (var k in data){
        if(data[k] === true) data[k] = "true";
        else if(data[k] === false) data[k] = "false";
        $scope[k] = (k==="serialRecordType"? masterService.toMap(data[k]): data[k]);
      }
      $scope.client = {id: data.clientId};
    });
    // 选择itemDataGlobal
    $scope.selectItemDataGlobal = function(){
      $rootScope.selectInWindow({
        title: "ITEM_DATA_GLOBAL",
        srcKey: "itemDataGlobal",
        srcColumns: [
          {field: "skuNo", headerTemplate: "<span translate='SKU_NO'></span>"},
          {"field": "name", headerTemplate: "<span translate='NAME'></span>"},
          {field: "itemNo", headerTemplate: "<span translate='ITEM_NO'></span>"}
        ],
        init: function(options){
          options.showSkuNo = true;
        },
        back: function(data){
          $scope.itemDataGlobal = data;
        }
      });
    };
    // 修改
    $scope.validate = function (event) {
      event.preventDefault();
      if ($scope.validator.validate()) {
        masterService.update("itemData", {
          "id": $scope.id,
          "name": $scope.name,
          "description": $scope.description,
          "safetyStock": $scope.safetyStock,
          "itemDataGlobalId": $scope.itemDataGlobalId,
          "clientId": $scope.client? $scope.client.id: null
        }, function () {
          $state.go("main.item_data");
        });
      }
    };
  }).controller("itemDataReadCtl", function ($scope, $state, $stateParams, masterService){
    masterService.read("itemData", $stateParams.id, function(data){
      for (var k in data){
        if(data[k] === true) data[k] = "true";
        else if(data[k] === false) data[k] = "false";
        $scope[k] = (k==="serialRecordType"? masterService.toMap(data[k]): data[k]);
      }
    });
  });
})();