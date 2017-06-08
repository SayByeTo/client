/**
 * Created by frank.zhou on 2016/10/10.
 */
(function(){
    "use strict";

    angular.module("myApp").constant("INBOUND_CONSTANT", {
        "GENUINE":"GENUINE",
        "DAMAGED":"DAMAGED",
        "MEASURED":"MEASURED",
        "SINGLE":"SINGLE",
        "ALL":"ALL",
        "PALLET":"PALLET",
        "BIN":"BIN",
        "CONTAINER":"CONTAINER",
        "TO_INVESTIGATE":"TO_INVESTIGATE",
        "NOTGETPOD":"获取pod信息失败,请重新扫描",
        "WAITPODINFO":"等待获取POD信息",
        "SCANDN":"请扫描DN条码",
        "RESCANDN":"请重新扫描DN条码",
        "SCANITEM":"请检查并扫描商品/扫描DN号",
        "SCANITEMS":"扫描商品条码",
        "RESCANITEM":"请重新扫描商品条码",
        "INPUTNUM":"请输入收货数量",
        "ITEMSCANSUCCESS":"商品扫描成功",
        "INPUTAVATIME":"请输入商品有效期",
        "SELECTPMENU":"请选择问题菜单",
        "FINISHMENU":"请确认是否结束收货",
        "FINISHRECEIVECONTENT":"是否确认退出Pallet Receive To Stow系统？",
        "RESCANLOCATION":"请重新扫描货筐",
        "SCANMEASURE":"请扫描测量货筐",
        "SCANCIPER":"请扫描上架车牌",
        "SCANINVESTAGETE":"请扫描待调查货筐",
        "SCANDAMAGED":"请扫描残品货筐,并将货筐放在指定位置",
        "SUREUSELOCATION":"请确认是否使用当前货筐",
        "SCANSERIALNO":"请扫描商品序列号",
        "CANTBECURRENTTIME":"到期日期不能小于当前日期",
        "serialNoTip":"如果均无法扫描，请按登记序列号扫描，并将商品放置到待调查货筐中",
        "SCANLOCATIONORDN":"请扫描上架货位号码",
        "alwaysrecord": "ALWAYS_RECORD",
        "getWarehouse": "warehouses",
        "getClient": "clients",
        "getSelectionBySelectionKey": "selections",
        "getArea": "areas",
        "getItemData": "item-datas",
        "findItemData": "item-datas",
        "scanDN": "receiving/scanning/dn",
        "activateDN": "receiving/activating/dn",
        // receivingCategory
        "findReceivingCategory": "receiving-categories",
        "createReceivingCategory": "receiving-categories",
        "readReceivingCategory": "receiving-categories/#id#",
        "updateReceivingCategory": "receiving-categories",
        "deleteReceivingCategory": "receiving-categories/#id#",
        // replenishStrategy
        "findReplenishStrategy": "replenish-strategies",
        "createReplenishStrategy": "replenish-strategies",
        "readReplenishStrategy": "replenish-strategies/#id#",
        "updateReplenishStrategy": "replenish-strategies",
        "deleteReplenishStrategy": "replenish-strategies/#id#",
        // receiving
        "scanStation": "inbound/receiving/scanstation",
        "deleteallprocess":"inbound/receiving/deleteallprocess",
        "getlocationtypes":"inbound/receiving/getlocationtypes",
        "bindlocationtypes":"inbound/receiving/bindstationlocationtype",
        "getpodinfo":"inbound/receiving/getpod",
        "scanstoragelocation":"inbound/receiving/scan-container",
        "bindstoragelocation":"inbound/receiving/bind-container",
        "scandn":"inbound/receiving/scan-dn",
        "scanitem":"inbound/receiving/scan-item",
        "checksn":"inbound/receiving/checks-sn",
        "checkavatime":"inbound/receiving/checks-sku-avatime",
        "scannotgenuine":"inbound/receiving/scan-not-genuine",
        "checkbin":"inbound/receiving/check-bin",
        "checkcontainer":"inbound/receiving/check-container",
        "finishreceive":"inbound/receiving/finish-receive-process",
        "finishinnormalreceive":"inbound/receiving/finish-innormal-process",
        "scanstowstation":"inbound/stow/scanstowstation",
        "autofullstowlocation":"inbound/stow/autofulllocation",
        "bindlocationtypestostow":"inbound/stow/bindstowlocationtype",
        "scanstowcontainer":"inbound/stow/scan-stowcontainer",
        "scanstowciper":"inbound/stow/scan-stowciper",
        "scanstowitem":"inbound/stow/scan-stowitem",
        "checkstowbin":"inbound/stow/check-stowbin",
        "finishstow":"inbound/stow/finishstow",
        "scanDestination": "inbound/receiving/scanning/receiving-destination",
        "scanContainer": "inbound/receiving/scanning/container",
        "getReceivingContainer": "inbound/receiving/receiving-process-containers",
        "saveReceivingContainer": "receiving/receiving-process-container",
        "replaceContainer": "receiving/receiving-process-container",
        "deleteReceivingContainer": "receiving/receiving-process-containers",
        "scanReceiving": "receiving/scanning/dn",
        "scanItemData": "receiving/scanning/sku",
        "screenReceivingDestination": "receiving/screening/receiving-destination",
        "checkContainer": "receiving/checking/container",
      "exitReceiveStation":"inbound/receiving/exitstation",
      "exitStowStation":"inbound/stow/exitstation",
        "receivingGoodsToCubiScan": "receiving/receiving-goods",
        "receivingGoodsToStockUnit": "receiving/receiving-goods",
        "receivingGoodsToDamage": "receiving/receiving-goods",
        // andon
        "findAndonInbound": "andon-inbounds",
        "updateAndonInbound": "andon-inbounds",
        "getAndonInboundRecords": "andon-inbounds/records",
        "getGoodsInformation": "andon-inbounds/item",
        "getProblemProductsNumber": "andon-inbound-locations",
        "getAnalysis": "andon-inbounds/record/analysis",
        "getGoodsInformationProcessSearch":"andon-inbounds/process",
        "getAndonState":"andon-inbound-record",
        "getAndonOpen":"andon-inbounds/universalSearch",
        "getAndonManage":"andon-inbound-record/universalSearch",
        "updateInboundAndonList":"andon-inbounds/updateCloses",
        "getInboundDeal":"andon-inboundeal",
        // 上架多货
        "getStowingOverage": "inventory/stowing-overage",
        // 上架少货
        "getStowingLoss": "inventory/stowing-loss",
        // 移动
        "getMoveGoods": "merging/goods",
        // 盘盈
        "getOverageGoods": "inventory/overage",
        // 盘亏
        "getLossGoods": "inventory/loss",
        // 商品
        "getContainerGoods": "inventory/container/sku",
        "getClientGoods": "inventory/client/sku"
    });
})();