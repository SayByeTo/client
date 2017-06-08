/**
 * Created by frank.zhou 2017/04/20.
 * Updated by frank.zhou 2017/05/04.
 */
(function(){
  "use strict";

  // ==========================================================================================================
  function transformItem(str){
    for(var i = 0, outs = [], preIdx = 0; i < str.length; i++){
      var c = str.charAt(i);
      if(i == str.length - 1){
        var last = str.substring(preIdx);
        outs.push(last.substring(0, 1).toLowerCase()+ last.substring(1));
      }
      if(c < "A" || c > "Z") continue;
      var mid = str.substring(preIdx, i);
      outs.push(outs.length? mid.substring(0, 1).toLowerCase()+ mid.substring(1): mid);
      outs.push("-");
      preIdx = i;
    }
    return outs.join("");
  }

  // ==========================================================================================================
  var masterOne = ["area", "dropZone", "hardware", "itemData", "itemDataGlobal", "itemGroup", "itemUnit"];
  var masterTwo = ["pod", "podType", "storageLocation", "storageLocationType", "zone", "workstation", "workstationType"];
  //var masterThree = ["semblence"];
  //var masterFour = ["client"];
  var inboundOne = ["adviceRequest", "goodsReceipt", "receiveCategoryRule", "receiveDestination"];
  var inboundTwo = ["receiveStation", "receiveStationType", "receiveThreshold", "stowStation", "stowStationType"];
  var robotOne = ["robot", "robotType", "batterConfig"];
  var outboundOne = ["boxType", "carrier", "digitalLabel", "goodsOutDoor", "labelController", "packingStation", "packingStationType"];
  var outboundTwo = ["pickingArea", "pickPackCell", "pickPackCellType", "pickPackFieldType", "pickPackWall", "pickPackWallType"];
  var outboundThree = ["pickStation", "pickStationType", "processPath", "processPathType", "rebatchSlot", "rebatchStation", "rebatchStationType"];
  var outboundFour = ["rebinCell", "rebinCellType", "rebinStation", "rebinStationType", "rebinWall", "rebinWallType", "sortingStation", "sortingStationType"];
  var items = masterOne.concat(masterTwo, inboundOne, inboundTwo, robotOne, outboundOne, outboundTwo, outboundThree, outboundFour);
  var baseConstant = {};
  for(var i = 0; i < items.length; i++){
    var item = items[i], key = item.substring(0, 1).toUpperCase()+ item.substring(1);
    var mid = (i<14? "": (i<23? "inbound/": (i<26? "robot/": "outbound/")));
    item = "masterdata/"+ mid + transformItem(item); // 转换item
    baseConstant["find"+ key] = item+ "s";
    baseConstant["create"+ key] = item+ "s"+ (item === "masterdata/pod"? "/storage-locations": "");
    baseConstant["get"+ key] = item+ "s";
    baseConstant["read"+ key] = item+ "s/#id#";
    baseConstant["update"+ key] = item+ "s";
    baseConstant["delete"+ key] = item+ "s/#id#";
  }
  angular.module("myApp").constant("MASTER_FILTER", {
    // *****************************************************master****************************************************
    "area": [{field: "client.id"}, {"field": "name"}],
    "dropZone": [{"field": "name"}],
    "hardware": [{"field": "name"}],
    "itemData": [{field: "client.id"}, {"field": "itemNo"}, {"field": "skuNo"}, {"field": "name"}],
    "itemDataGlobal": [{"field": "itemNo"}, {"field": "skuNo"}, {"field": "name"}],
    "itemGroup": [{"field": "name"}],
    "itemUnit": [{"field": "name"}],
    "pod": [{field: "client.id"}, {"field": "name"}],
    "podType": [{"field": "name"}],
    "storageLocation": [{field: "client.id"},{"field": "name"}],
    "storageLocationType": [{"field": "name"},{"field": "storageType"}],
    "zone": [{field: "client.id"}, {"field": "name"}],
    "workstation": [{"field": "name"}],
    "workstationType": [{"field": "name"}],
    // *****************************************************inbound*****************************************************
    "adviceRequest": [{"field": "adviceNo"}, {"field": "entityLock", operator: "eq"}],
    "goodsReceipt": [{"field": "grNo"}],
    "receiveCategory": [{"field": "entityLock", operator: "eq"}],
    "receiveCategoryRule": [{"field": "name"}, {"field": "entityLock", operator: "eq"}],
    "receiveDestination": [{"field": "name"}, {"field": "entityLock", operator: "eq"}],
    "receiveStation": [{"field": "name"}, {"field": "entityLock", operator: "eq"}],
    "receiveStationType": [{"field": "name"}, {"field": "entityLock", operator: "eq"}],
    "receiveThreshold": [{"field": "name"}, {"field": "entityLock", operator: "eq"}],
    "replenishStrategy": [{"field": "entityLock", operator: "eq"}],
    "stowStation": [{"field": "name"}, {"field": "entityLock", operator: "eq"}],
    "stowStationType": [{"field": "name"}, {"field": "entityLock", operator: "eq"}],
    // *****************************************************outbound****************************************************
    "boxType": [{"field": "name"}, {"field": "entityLock", operator: "eq"}],
    "carrier": [{"field": "name"}, {"field": "entityLock", operator: "eq"}],
    "digitalLabel": [{"field": "name"}, {"field": "entityLock", operator: "eq"}],
    "goodsOutDoor": [{"field": "name"}, {"field": "entityLock", operator: "eq"}],
    "labelController": [{"field": "name"}, {"field": "entityLock", operator: "eq"}],
    "orderStrategy": [{"field": "name"}, {"field": "entityLock", operator: "eq"}],
    "packingStation": [{"field": "name"}, {"field": "entityLock", operator: "eq"}],
    "packingStationType": [{"field": "name"}, {"field": "entityLock", operator: "eq"}],
    "pickingArea": [{"field": "name"}, {"field": "entityLock", operator: "eq"}],
    "pickPackCell": [{"field": "name"}, {"field": "entityLock", operator: "eq"}],
    "pickPackCellType": [{"field": "name"}, {"field": "entityLock", operator: "eq"}],
    "pickPackFieldType": [{"field": "name"}, {"field": "entityLock", operator: "eq"}],
    "pickPackWall": [{"field": "name"}, {"field": "entityLock", operator: "eq"}],
    "pickPackWallType": [{"field": "name"}, {"field": "entityLock", operator: "eq"}],
    "pickStation": [{"field": "name"}, {"field": "entityLock", operator: "eq"}],
    "pickStationType": [{"field": "name"}, {"field": "entityLock", operator: "eq"}],
    "processPath": [{"field": "name"}, {"field": "entityLock", operator: "eq"}],
    "processPathType": [{"field": "name"}, {"field": "entityLock", operator: "eq"}],
    "rebatchSlot": [{"field": "name"}, {"field": "entityLock", operator: "eq"}],
    "rebatchStation": [{"field": "name"}, {"field": "entityLock", operator: "eq"}],
    "rebatchStationType": [{"field": "name"}, {"field": "entityLock", operator: "eq"}],
    "rebinCell": [{"field": "name"}, {"field": "entityLock", operator: "eq"}],
    "rebinCellType": [{"field": "name"}, {"field": "entityLock", operator: "eq"}],
    "rebinStation": [{"field": "name"}, {"field": "entityLock", operator: "eq"}],
    "rebinStationType": [{"field": "name"}, {"field": "entityLock", operator: "eq"}],
    "rebinWall": [{"field": "name"}, {"field": "entityLock", operator: "eq"}],
    "rebinWallType": [{"field": "name"}, {"field": "entityLock", operator: "eq"}],
    "sortingStation": [{"field": "name"}, {"field": "entityLock", operator: "eq"}],
    "sortingStationType": [{"field": "name"}, {"field": "entityLock", operator: "eq"}],
    // ***************************************************robot*********************************************************
    "batterConfig": [{"field": "name"}],
    "robot": [{"field": "robotId"}],
    "robotType": [{"field": "name"}]
  }).constant("MASTER_CONSTANT", angular.extend(baseConstant, {
    "getWarehouse": "system/warehouses",
    "getClient": "system/clients",
    "getSelectionBySelectionKey": "system/selections",
    // ******************************************************master*****************************************************
    "checkSKU": "masterdata/item-data-globals",
    // hardware-workstation
    "getWorkstationList": "masterdata/workstation-hardware/workstations",
    "getUnassignedHardwareByWorkstation": "masterdata/workstations/#id#/hardwares/unassigned",
    "getAssignedHardwareByWorkstation": "masterdata/workstations/#id#/hardwares/assigned",
    "saveHardwaresByWorkstation": "masterdata/workstations/#id#/hardwares",
    // zone-itemGroup
    "getZonesByClient": "masterdata/zones",
    "getUnassignedItemGroupByZone": "masterdata/zones/#id#/item-groups/unassigned",
    "getAssignedItemGroupByZone": "masterdata/zones/#id#/item-groups/assigned",
    "saveItemGroupsByZone": "masterdata/zones/#id#/item-groups",
    "getSelectItemGroup": "masterdata/item-groups",
    "getUnassignedZoneByItemGroup": "masterdata/item-groups/#id#/zones/unassigned",
    "getAssignedZoneByItemGroup": "masterdata/item-groups/#id#/zones/assigned",
    "saveZonesByItemGroup": "masterdata/item-groups/#id#/zones",
    /*********************************semblence 相似度************************************/
    // "semblence": "masterdata/outbound/getallsemblence",
    // "createSemblence": "masterdata/master/postsemblence",
    // "readSemblence": "masterdata/master/semblence",
    // "updateSemblence":"masterdata/master/semblence",
    // "getSemblenceClient":"masterdata/master/getallclient",
    // "getItemGroup":"masterdata/master/getallgroup",
      // ********************************inbound*****************************************************
    "scanDN": "masterdata/inbound/receive/scanning/dn",
    "activateDN": "masterdata/inbound/receive/activating/dn",
    // receiveCategory
    "findReceiveCategory": "masterdata/inbound/receive-categories",
    "createReceiveCategory": "masterdata/inbound/receive-categories",
    "readReceiveCategory": "masterdata/inbound/receive-categories/#id#",
    "updateReceiveCategory": "masterdata/inbound/receive-categories",
    "deleteReceiveCategory": "masterdata/inbound/receive-categories/#id#",
    // receiveEligibility
    "getSelectUser": "masterdata/inbound/user-threshold/users",
    "getAssignedThresholdByUser": "masterdata/inbound/users/#id#/thresholds/assigned",
    "getUnassignedThresholdByUser": "masterdata/inbound/users/#id#/thresholds/unassigned",
    "saveThresholdsByUser": "masterdata/inbound/users/#id#/thresholds",
    // replenishStrategy
    "findReplenishStrategy": "masterdata/inbound/replenish-strategies",
    "createReplenishStrategy": "masterdata/inbound/replenish-strategies",
    "readReplenishStrategy": "masterdata/inbound/replenish-strategies/#id#",
    "updateReplenishStrategy": "masterdata/inbound/replenish-strategies",
    "deleteReplenishStrategy": "masterdata/inbound/replenish-strategies/#id#",
    // *****************************************************outbound****************************************************
    "getDigitalLabelByLabel": "masterdata/outbound/digital-labels/labelId/#ids#",
    // orderStrategy
    "findOrderStrategy": "masterdata/outbound/order-strategies",
    "createOrderStrategy": "masterdata/outbound/order-strategies",
    "getOrderStrategy": "masterdata/outbound/order-strategies",
    "readOrderStrategy": "masterdata/outbound/order-strategies/#id#",
    "updateOrderStrategy": "masterdata/outbound/order-strategies",
    "deleteOrderStrategy": "masterdata/outbound/order-strategies/#id#",
    // pickingCategory
    "findPickingCategory": "wms/picking-categories",
    "createPickingCategory": "wms/picking-categories",
    "readPickingCategory": "wms/picking-categories/#id#",
    "updatePickingCategory": "wms/picking-categories",
    "deletePickingCategory": "wms/picking-categories/#id#",
    // pickingCategoryRule
    "getPickingCategoryRule": "wms/picking-category-rules",
    // pickingAreaEligibility
    "getPickingAreaByClient": "masterdata/outbound/picking-areas",
    "getAssignedUserByPickingArea": "masterdata/outbound/picking-area-eligibility/picking-areas/#id#/users/assigned",
    "getUnassignedUserByPickingArea": "masterdata/outbound/picking-area-eligibility/picking-areas/#id#/users/unassigned",
    "saveUsersByPickingArea": "masterdata/outbound/picking-area-eligibility/picking-areas/#id#/users",
    // pickingProcessEligibility
    "getSelectProcessPath": "masterdata/outbound/process-paths",
    "getAssignedUserByProcessPath": "masterdata/outbound/picking-process-eligibility/process-paths/#id#/users/assigned",
    "getUnassignedUserByProcessPath": "masterdata/outbound/picking-process-eligibility/process-paths/#id#/users/unassigned",
    "saveUsersByProcessPath": "masterdata/outbound/picking-process-eligibility/process-paths/#id#/users",
    // pickPackCellTypeBoxType
    "getBoxTypeByClient": "masterdata/outbound/pick-pack-cell-type/box-types",
    "getAssignedPickPackCellTypeByBoxType": "masterdata/outbound/box-types/#id#/pick-pack-cell-types/assigned",
    "getUnassignedPickPackCellTypeByBoxType": "masterdata/outbound/box-types/#id#/pick-pack-cell-types/unassigned",
    "savePickPackCellTypesByBoxType": "masterdata/outbound/box-types/#id#/pick-pack-cell-types"
  }));
})();