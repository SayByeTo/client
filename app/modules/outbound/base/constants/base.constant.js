/**
 * Created by frank.zhou on 2016/12/04.
 * Updated by feiyu,pan on 2017/5/19
 */
(function () {
  "use strict";

    // ===================================================================================================================
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
    // =================================================================================================================
    var itemOne = ["boxType", "customerOrder", "customerShipment", "packingStation", "packingStationType", "pickingArea"];
    var itemTwo = ["collateProfile", "collateTemplate", "processPath", "processPathType", "reBatchSlot", "reBatchStation", "reBatchStationType"];
    var itemThree = ["reBinCellType", "reBinStation", "reBinStationType", "reBinWall", "reBinWallType"];
    var items = itemOne.concat(itemTwo, itemThree);
    var baseConstant = {};
    for(var i = 0; i < items.length; i++){
        var item = items[i], key = item.substring(0, 1).toUpperCase()+ item.substring(1);
        item = "outbound/"+ transformItem(item);
        baseConstant["find"+ key] = item+ "s";
        baseConstant["create"+ key] = item+ "s";
        baseConstant["get"+ key] = item+ "s";
        baseConstant["read"+ key] = item+ "s/#id#";
        baseConstant["update"+ key] = item+ "s";
        baseConstant["delete"+ key] = item+ "s/#id#";
    }

  angular.module("myApp").constant("OUTBOUND_FILTER", {
      "customerOrder": [{"field": "customerName"}, {"field": "entityLock", operator: "eq"}],
      "customerShipment": [{"field": "customerOrder.orderNo"}, {"field": "entityLock", operator: "eq"}],
  }).constant("OUTBOUND_CONSTANT", angular.extend(baseConstant, {
      "getWarehouse": "system/warehouses",
      "getClient": "system/clients",
      "getSelectionBySelectionKey": "system/selections",
    // reBatch
    "scanReBatchStations": "outbound/rebatch-stations",
    "scanReBatchContainer": "outbound/rebatch-positions",
    "scanReBatchSlot": "outbound/rebatch-positions/{positionId}/finish",
    "getReBatchInfo": "outbound/rebatch-requests/open",
    "doReBatch": "outbound/rebatch-requests/{requestId}/finish",
    //rebin
    "scanStation": "outbound/rebin-stations",
    "scanPickingOrder": "outbound/rebin-requests",
    "rebinWalls": "outbound/rebin-requests/{requestId}/rebin-walls/assign",
    "rebinfromUnitloads": "outbound/rebin-requests/{requestId}/rebinfrom-unitloads",
    "scanReBinWall": "outbound/rebin-requests/{requestId}/rebin-walls",
    "scanPickingContainer": "outbound/rebin-requests/{requestId}/rebinfrom-unitloads",
    "scanGoods": "outbound/rebin-requests/{requestId}/rebin-positions",
    "rebinPosition": "outbound/rebin-requests/{requestId}/rebin-positions/{positionId}/finish",
    "rebinEnd": "outbound/rebin-requests/{requestId}/finish",
    //包装
    "getGoods": "outbound/pack/pickpackcell/find",
    "checkPackStation": "outbound/pack/packStation/check",
    "checkPickPackWall": "outbound/pack/pickPackWall/scan",
    "checkRebinWall": "outbound/pack/rebinWall/find",
    "weigh": "outbound/pack/shipment/weight",
    "packing": "outbound/pack/item/scan",
    "checkItem": "outbound/pack/item/find",
    "packFinish": "outbound/pack/scanBox/finished",
    "checkProblemContainer": "outbound/pack/storageLocation/scan ",
    "stopPack": "outbound/pack/finish",
    "submitQuestion": "outboundproblem/generate-obp",
    "getWeight":"outWeight",
    "informationInquiry": "modules/outbound/pack/data/pack.json",
    //发货系统
    "getDeliverySystemData": "outgoods/searchpagedata",
    "changeState":"outgoods/chagngecurrentstate",
    "getDockDoor":"outgoods/getbinddoors",
    "bindDockDoor":"outgoods/bindoutdoor",
    "reload":"outgoods/reloadgoods",
    "getSortCodePrintInfo":"outgoods/getinterreceipt",
    "print":"outgoods",
    "getDeliveryShipmentsDetailData": "outgoods/searchshipment",
    "getShipmentInformation": "outgoods/shipmentdetail",
    "getQueryCartData": "outgoods/outgoods/searchstorageone",
    "getCartQueryShipmentData": "outgoods/searchstoragetwo",
    //扫描工作站
    "checkStation": "outbound/pick/pickStation/check",
    //扫描pickpackwall
    "findPickPackWall": "outbound/pick/pickPackWall/find",
    //扫描三种货筐
    "checkStorageLocation": "outbound/pick/pickingUnitLoad/check",
      //货筐有商品时，仍然使用该货筐
    "bindStorageLocation":"outbound/pick/pickingUnitLoad/bind",
      //扫描pod
    "findPod": "outbound/pick/pod/find",
    //获取orderposition
    "getOrderPosition": "outbound/pick/pickOrderPosition/find",
    //结满工作站货筐
    "fullAllStorage": "outbound/pick/pickingUnitLoad/reBind",
    //扫描商品
    "scanSKU": "outbound/pick/pickToPack/confirm",
    //确认扫描序列号
    "confirmSerialNo": "outbound/pick/sku/serialNo/confirm",
    //扫描序列号
      "scanSerialNo":"outbound/pick/sku/serialNo/scan",
    //结满货筐
    "fullstorage": "outbound/pick/pickingUnitLoad/fullStorage",
    //货位扫描
    "scanBin": "outbound/pick/storageLocation/scan",
    //获取工作站所有货筐信息
    "getAllstorageInfo": "outbound/pick/pickingUnitLoad/findAll",
    //问题商品扫描
    "scanProItem": "outbound/pick/problemItem/scan",
    //已扫描完所有商品
      "haveScanedAll":"outbound/pick/haveScanAll",
    //停止工作
    "stopWorking": "outbound/pick/pickStation/disBind",

    //////////////////////////////////picktotote//////////////////////////////////
    //扫描picktotote工作站
    "scanPickToToteStation": "/outbound/pick/pickToTote/checkStation",
    //检查工作站绑定 2 种问题货筐没
    "checkStorage": "outbound/pick/pickToTote/checkStorage",
    //绑定货筐到工作站
    "bindStorage": "outbound/pick/pickToTote/bindStorage",
    //检查batch对应的货筐
    "checkOrder": "outbound/pick/pickToTote/checkOrderPosition",
    //获取拣货任务
    "getOrder": "outbound/pick/pickToTote/getOrder",
    //扫描商品确认拣货
    "confirmItem": "outbound/pick/pickToTote/confirm",
    //问题货筐里有商品时，继续使用该货筐
    "bindStorageWithItem": "outbound/pick/pickToTote/bind",
    //商品报残
    "scanDamagedItem":"outbound/pick/pickToTote/confirmDamaged",
    //////////////////////////////////////////////outbound问题处理//////////////////////////
    "obproblem": "outboundproblem/generate-obp/generateOBProblem",
    ////////////////////拍下灯，获取拍灯信息////////////////////
    "clickDigitalLabel":"/digital/state/check"


  }));
})();