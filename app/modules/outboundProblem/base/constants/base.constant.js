/**
 * Created by thoma.bian on 2017/5/10.
 * Updated by frank.zhou on 2017/05/10.
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
  var items = ["obpCell", "obpCellType", "obpStation", "obpStationType", "obpWall", "obpWallType"];
  var baseConstant = {};
  for(var i = 0; i < items.length; i++){
    var item = items[i], key = item.substring(0, 1).toUpperCase()+ item.substring(1);
    item = "masterdata/obp/"+ transformItem(item); // 转换item
    baseConstant["find"+ key] = item+ "s";
    baseConstant["create"+ key] = item+ "s";
    baseConstant["get"+ key] = item+ "s";
    baseConstant["read"+ key] = item+ "s/#id#";
    baseConstant["update"+ key] = item+ "s";
    baseConstant["delete"+ key] = item+ "s/#id#";
  }
  angular.module("myApp").constant("OBP_FILTER", {
    "obpCell": [{"field": "name"}],
    "obpCellType": [{"field": "name"}],
    "obpStation": [{"field": "name"}],
    "obpStationType": [{"field": "name"}],
    "obpWall": [{"field": "name"}],
    "obpWallType": [{"field": "name"}]
  }).constant("PROBLEM_OUTBOUND", angular.extend(baseConstant, {
    "getWarehouse": "system/warehouses",
    "getClient": "system/clients",
    "getSelectionBySelectionKey": "system/selections",
    "getWorkstation": "masterdata/workstations",
    //
    "getOutboundProblemStation": "outboundproblem/scanning/obp-station",
    "getOutboundProblemHandingCar": "outboundproblem/scanning/obp-wall",
    "getShipmentDealProblem": "outboundproblem/scanning/shipment",
    "exitShipment": "outboundproblem/obp-solve/sign-out-station",
    "problemCellPlaceGoods": "outboundproblem/obp-cell",
    "bindCell": "outboundproblem/obp-bindCell",
     "getOrderDetails": "modules/outboundProblem/problemOutbound/data/getOrderDetails.json",
     "getOrderGoodsDetails": "modules/outboundProblem/problemOutbound/data/getOrderGoodsDetails.json",
    //"getOrderDetails": "outboundproblem/scanning/shipment",
    //"getOrderGoodsDetails": "outboundproblem/obp-solve/shipment-position",
    "saveGoodsBySN": "outboundproblem/obp-solve/scan-sn",
    "saveGoodsInformation": "outboundproblem/obp-solve/scan-goods",
    "damageConfirm": "outboundproblem/obp-damaged/confirm-damage",
    "damageGoods": "outboundproblem/obp-damaged/damaged-to-container",
    "saveGoodsToGenuine": "outboundproblem/obp-damaged/to-normal",
    "releaseQuestionCell": "outboundproblem/obp-unbindCell",
    "generateNewPickingTasks": "outboundproblem/obp-damaged/generate-hot-pick",
    "getAssignedLocation": "outboundproblem/obp-damaged/get-location",
    "assignedPicking": "outboundproblem/obp-damaged/allocation-location",
    "demolitionShip": "outboundproblem/obp-damaged/dismantle-shipment",
    "deleteOrderSuccess": "outboundproblem/obp-damaged/delete-shipment",
    "deleteOrderScanGoods": "outboundproblem/obp-damaged/delete-shipment-scan-goods",
    "markUpBarcode": "outboundproblem/obp-damaged/obp-unable-to-scan/print-sku",
    "getInvestigated": "outboundproblem/obp-damaged/obp-unable-to-scan/to-investigated",
    "moveShelvesLicensePlate": "outboundproblem/obp-delete-shipment",
    "scanPickingLicensePlate":"outboundproblem/obp-solve/get-cell-container",
    "checkScanGoods": "outboundproblem/obp-solve/get-cell-itemNo",
    "scanPickingGoods": "outboundproblem/obp-solve/get-cell-location",
    "forcedDeleteGrid": "outboundproblem/obp-delete-shipment/batch",
    "forcedDeleteOrder": "outboundproblem/obp-delete-shipment",
    "putForceDeleteGoodsToContainer": "outboundproblem/obp-solve/force-delete",
    //
    "getOutboundProblem": "outboundproblem/universalSearch",
    "updateOutboundProblemVerify": "outboundproblem",
    "findOutboundProblem": "outboundproblem",
    "getGoodsInformation": "outboundproblem/item",
    "getRebinCarRecords": "outboundproblem/findList",
    "outboundProblemRecord": "outboundproblem/records",
    "getProblemProductsNumber": "outboundproblem/obp-solve-check",
    //
    "findOverageGoods": "outboundproblem/find-overage-goods",
    "findLossGoods": "outboundproblem/find-loss-goods",
    "updateOutboundProblemList": "outboundproblem/updateCloses",
    "getStowingOverage": "outboundproblem/stow-overage-goods",
    "getStowingLoss": "outboundproblem/stow-loss-goods",
    "getOverageGoods": "outboundproblem/overage-goods",
    "getLossGoods": "outboundproblem/loss-goods",
    "getAnalysis": "outboundproblem/analysis",
    "getMoveGoods": "outboundproblem/moving",
    "getRule": "outboundproblem"
  }));
})();