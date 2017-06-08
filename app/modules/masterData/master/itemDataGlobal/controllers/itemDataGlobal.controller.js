
/**
 * Created by frank.zhou on 2017/04/21.
 * Updated by frank.zhou on 2017/04/27.
 */
(function () {
  'use strict';

  angular.module('myApp').controller("itemDataGlobalCtl", function ($scope, $window, $rootScope, $state, commonService, masterService) {

    $window.localStorage["currentItem"] = "itemDataGlobal";

    $rootScope.itemGroupSource =  masterService.getDataSource({key: "getItemGroup", text: "name", value: "id"});
    $rootScope.handingUnitSource =  masterService.getDataSource({key: "getItemUnit", text: "name", value: "id"});
    $rootScope.serialRecordTypeSource = masterService.getDataSource({
      key: "getSelectionBySelectionKey",
      value: "selectionValue",
      text: "resourceKey",
      data: {selectionKey: "SERIAL_RECORD"}
    });
    $rootScope.lotTypeSource = masterService.getDataSource({
      key: "getSelectionBySelectionKey",
      value: "selectionValue",
      text: "resourceKey",
      data: {selectionKey: "LOT_TYPE"}
    });
    $rootScope.lotUnitSource = masterService.getDataSource({
      key: "getSelectionBySelectionKey",
      value: "selectionValue",
      text: "resourceKey",
      data: {selectionKey: "LOT_UNIT"}
    });
    //
    var columns = [
      {field: "itemNo", width:140, template: "<a ui-sref='main.itemDataGlobalRead({id:dataItem.id})'>#: itemNo # </a>", headerTemplate: "<span translate='ITEM_NO'></span>"},
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
      {field: "weight", width:100, headerTemplate: "<span translate='WEIGHT'><span>(g)</span></span>"},

      {field: "multiplePart", width:70, headerTemplate: "<span translate='MULTIPLE_PART'></span>"},
      {field: "multiplePartAmount", width:65, headerTemplate: "<span translate='MULTIPLE_PART_AMOUNT'></span>"},
      {field: "preferOwnBox", width:70, headerTemplate: "<span translate='PREFER_OWN_BOX'></span>"},
      {field: "preferBag", width:70, headerTemplate: "<span translate='PREFER_BAG'></span>"},
      {field: "useBubbleFilm", width:70, headerTemplate: "<span translate='USE_BUBBLE_FILM'></span>"}
     ];
    $scope.itemDataGlobalGridOptions = commonService.gridMushiny({columns: columns, dataSource: masterService.getGridDataSource("itemDataGlobal")});

  }).controller("itemDataGlobalCreateCtl", function ($scope, $rootScope, $state, $translate, commonService, masterService, itemDataGlobalService){
    $scope.lotMandatory = "true";
    $scope.measured = "true";
    $scope.multiplePart = "true";
    $scope.preferOwnBox = "true";
    $scope.preferBag = "true";
    $scope.useBubbleFilm = "true";

    // 检查sku
    $scope.checkSKU = function(skuNo){
      itemDataGlobalService.checkSKU(skuNo, function(datas){
        if(!datas.length) return;
        commonService.dialogMushiny($scope.window, {
          title: "<span style='font-size:12px;'>"+ $translate.instant("SKU_HAS_GOODS")+ "</span>",
          width: 470,
          height: 230,
          url: "modules/masterData/master/itemDataGlobal/templates/itemDataGlobal_sku.html",
          open: function(){
            var columns= [
              {field: "itemNo", headerTemplate: "<span translate='ITEM_NO'></span>"},
              {field: "name", headerTemplate: "<span translate='NAME'></span>"}
            ];
            $rootScope.skuListGridOptions = {selectable: "row", height: 195, sortable: true, columns: columns, dataSource: datas};
          }
        });
      });
    };

    // 保存
    $scope.validate = function (event) {
      event.preventDefault();
     if ($scope.validator.validate()) {
       masterService.create("itemDataGlobal", {
         "skuNo": $scope.skuNo,
         "name": $scope.name,
         "description": $scope.description,
         "safetyStock": $scope.safetyStock,
         "itemGroupId": $scope.itemGroup? $scope.itemGroup.id: null,

         "lotMandatory": $scope.lotMandatory,
         "lotType": $scope.lotType? $scope.lotType.selectionValue: null,
         "lotUnit": $scope.lotUnit? $scope.lotUnit.selectionValue: null,
         "lotThreshold": $scope.lotThreshold,
         "serialRecordType": $scope.serialRecordType? $scope.serialRecordType.selectionValue: null,
         "serialRecordLength": $scope.serialRecordLength,
         "handlingUnitId": $scope.itemUnit? $scope.itemUnit.id: null,

         "measured": $scope.measured,
         "height": $scope.height,
         "width": $scope.width,
         "depth": $scope.depth,
         "volume": $scope.height*$scope.width*$scope.depth,
         "weight": $scope.weight,

         "multiplePart": $scope.multiplePart,
         "multiplePartAmount": $scope.multiplePartAmount,
         "preferOwnBox": $scope.preferOwnBox,
         "preferBag": $scope.preferBag,
         "useBubbleFilm": $scope.useBubbleFilm
        }, function () {
          $state.go("main.item_data_global");
        });
      }
    };
  }).controller("itemDataGlobalUpdateCtl", function ($scope, $stateParams, $state, masterService){
    masterService.read("itemDataGlobal", $stateParams.id, function(data){
      for (var k in data){
        if(data[k] === true) data[k] = "true";
        else if(data[k] === false) data[k] = "false";
        $scope[k] = (k==="serialRecordType"? masterService.toMap(data[k]): data[k]);
      }
      $scope.lotType = {selectionValue: data.lotType};
      $scope.lotUnit = {selectionValue: data.lotUnit};
    });

    $scope.validate = function (event) {
      event.preventDefault();
      if ($scope.validator.validate()) {
        masterService.update("itemDataGlobal", {
          "id": $scope.id,
          "skuNo": $scope.skuNo,
          "name": $scope.name,
          "description": $scope.description,
          "safetyStock": $scope.safetyStock,
          "itemGroupId": $scope.itemGroup? $scope.itemGroup.id: null,

          "lotMandatory": $scope.lotMandatory,
          "lotType": $scope.lotType? $scope.lotType.selectionValue: null,
          "lotUnit": $scope.lotUnit? $scope.lotUnit.selectionValue: null,
          "lotThreshold": $scope.lotThreshold,
          "serialRecordType": $scope.serialRecordType? $scope.serialRecordType.selectionValue: null,
          "serialRecordLength": $scope.serialRecordLength,
          "handlingUnitId": $scope.itemUnit? $scope.itemUnit.id: null,

          "measured": $scope.measured,
          "height": $scope.height,
          "width": $scope.width,
          "depth": $scope.depth,
          "volume": $scope.height*$scope.width*$scope.depth,
          "weight": $scope.weight,

          "multiplePart": $scope.multiplePart,
          "multiplePartAmount": $scope.multiplePartAmount,
          "preferOwnBox": $scope.preferOwnBox,
          "preferBag": $scope.preferBag,
          "useBubbleFilm": $scope.useBubbleFilm
        }, function () {
          $state.go("main.item_data_global");
        });
      }
    };
  }).controller("itemDataGlobalReadCtl", function ($scope, $state, $stateParams, masterService){
    masterService.read("itemDataGlobal", $stateParams.id, function(data){
      for(var k in data){
        if(data[k] === true) data[k] = "true";
        else if(data[k] === false) data[k] = "false";
        $scope[k] = (k==="serialRecordType"? masterService.toMap(data[k]): data[k]);
      }
      $scope.lotType = {selectionValue: data.lotType};
      $scope.lotUnit = {selectionValue: data.lotUnit};
    });
  });
})();