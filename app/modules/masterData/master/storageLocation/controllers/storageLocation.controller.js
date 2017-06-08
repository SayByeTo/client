/**
 * Created by frank.zhou on 2017/04/21.
 */
(function () {
  'use strict';

  angular.module('myApp').controller("storageLocationCtl", function ($scope, $rootScope, $window, $state, commonService, masterService, storageLocationService) {

    $window.localStorage["currentItem"] = "storageLocation";

    $rootScope.storageLocationTypeDataSource = masterService.getDataSource({key: "getStorageLocationType", text: "name", value: "id" });
    $rootScope.dropZoneDataSource = masterService.getDataSource({key: "getDropZone", text: "name", value: "id" });
    $rootScope.faceDataSource = masterService.getDataSource({
      key: "getSelectionBySelectionKey",
      value: "selectionValue",
      text: "resourceKey",
      data: {selectionKey: "FACE"}
    });
    $rootScope.storageTypeSource = masterService.getDataSource({
      key: "getSelectionBySelectionKey",
      value: "selectionValue",
      text: "resourceKey",
      data: {selectionKey: "STORAGE_TYPE"}
    });

    $rootScope.changeClient = function(clientId){
      storageLocationService.getZone(clientId, function(itemDatas){
        var zoneDataComboBox = $("#zone").data("kendoComboBox");
        zoneDataComboBox.value("");
        zoneDataComboBox.setDataSource(new kendo.data.DataSource({data: itemDatas}));
      });
      storageLocationService.getArea(clientId, function(itemDatas){
        var areaDataComboBox = $("#area").data("kendoComboBox");
        areaDataComboBox.value("");
        areaDataComboBox.setDataSource(new kendo.data.DataSource({data: itemDatas}));
      });
    };

    var columns = [
      {field: "name",width: 120, template: "<a ui-sref='main.storageLocationRead({id:dataItem.id})'>#: name # </a>", headerTemplate: "<span translate='NAME'></span>"},
      {field: "zone", width: 110, headerTemplate: "<span translate='ZONE'></span>", template: function(dataItem){
        return (dataItem.zone? "<a ui-sref='main.zone'>"+ dataItem.zone.name+ "</a>": "");
      }},
      {width: 130, headerTemplate: "<span translate='POD'></span>", template: function(dataItem){
        return (dataItem.pod? "<a ui-sref='main.pod'>"+ dataItem.pod.name+ "</a>": "");
      }},
      {field: "area", width: 120, headerTemplate: "<span translate='AREA'></span>", template: function(dataItem){
        return (dataItem.area? "<a ui-sref='main.area'>"+ dataItem.area.name+ "</a>": "");
      }},
      {field: "storageLocationType", width: 120, headerTemplate: "<span translate='STORAGE_LOCATION_TYPE'></span>", template: function(dataItem){
        return (dataItem.storageLocationType? "<a ui-sref='main.storage_location_type'>"+ dataItem.storageLocationType.name+ "</a>": "");
      }},
      {field: "dropZone", width: 120, headerTemplate: "<span translate='DROP_ZONE'></span>", template: function(dataItem){
        return (dataItem.dropZone? "<a ui-sref='main.drop_zone'>"+ dataItem.dropZone.name+ "</a>": "");
      }},
      {field: "face", width: 70, headerTemplate: "<span translate='FACE'></span>"},
      {field: "color", width: 70, headerTemplate: "<span translate='COLOR'></span>"},
      {field: "xPos", width: 70, headerTemplate: "<span translate='X_POS'></span>"},
      {field: "yPos", width: 70, headerTemplate: "<span translate='Y_POS'></span>"},
      {field: "zPos", width: 70, headerTemplate: "<span translate='Z_POS'></span>"},
      {field: "orderIndex", width: 70, headerTemplate: "<span translate='ORDER_INDEX'></span>"},
      {field: "allocation", width: 100, headerTemplate: "<span translate='ALLOCATION'></span>"},
      {field: "allocationState", width: 100, headerTemplate: "<span translate='ALLOCATION_STATE'></span>"},
      {field: "stocktakingDate", width: 160, headerTemplate: "<span translate='STOCKTAKING_DATE'></span>", template: function(item){
        return item.stocktakingDate?  kendo.format("{0:yyyy-MM-dd HH:mm:ss}", kendo.parseDate(item.stocktakingDate)): "";
      }}
    ];
    $scope.storageLocationGridOptions = commonService.gridMushiny({columns: columns, dataSource: masterService.getGridDataSource("storageLocation")});

  }).controller("storageLocationCreateCtl", function ($scope, $state, masterService){
    $scope.validate = function (event) {
      event.preventDefault();
      if ($scope.validator.validate()) {
        masterService.create("storageLocation", {
          "name": $scope.name,
          "typeId": $scope.storageLocationType? $scope.storageLocationType.id: null,
        }, function () {
          $state.go("main.storage_location");
         });
      }
    };
  }).controller("storageLocationReadCtl", function ($scope, $state, $stateParams, masterService){
    masterService.read("storageLocation", $stateParams.id, function(data){
      for(var k in data) $scope[k] = data[k];
    });
  });
})();