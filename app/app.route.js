/**
 * Created by frank.zhou on 2017/04/14.
 * Updated by frank.zhou on 2017/05/10.
 */
(function () {
  "use strict";

  angular.module('myApp').config(function ($stateProvider, $urlRouterProvider) {
    // ====================================================================================================================
    // 基础
    function getJsonForBase(name) {
      return {
        url: "/" + name,
        templateUrl: "modules/" + name + "/templates/" + name + ".html",
        controller: name + "Ctl"
      };
    }
    // 菜单
    function getJsonForMenu(name, folder) {
      folder == null && (folder = name);
      return {
        url: "/" + name,
        views: {
          "menu": {
            templateUrl: "modules/" + folder + "/templates/" + name + ".html"
          },
          "container": {
            templateUrl: "modules/main/templates/mainContainer.html",
            controller: "mainContainerCtl"
          }
        }
      };
    }
    // 用户信息
    function getJsonForUser(name) {
      return {
        url: "/" + name,
        views: {
          "menu": {
            templateUrl: "modules/main/templates/mainMenu.html"
          },
          "container": {
            templateUrl: "modules/main/templates/" + name + ".html",
            controller: name + "Ctl"
          }
        }
      };
    }
    // 模块
    function getJsonForModule(firstName, secondName, thirdName) {
      return {
        url: "/" + firstName + "/" + secondName+ (thirdName? "/"+ thirdName: ""),
        views: {
          "menu": {
            templateUrl: "modules/main/templates/subMenu.html",
            controller: "subMenuCtl"
          },
          "container": {
            templateUrl: "modules/" + firstName + "/" + secondName + (thirdName? "/"+ thirdName: "")+ "/templates/" + (thirdName || secondName) + ".html",
            controller: (thirdName || secondName) + "Ctl"
          }
        }
      };
    }
    // 模块-CRU
    function getJsonForCRU(firstName, secondName, operate) {
      var other = (operate === "Detail" ? ",:name" : "");
      return {
        url: "/" + firstName + "/" + secondName + "/" + operate.toLowerCase() + (["Read", "Update", "Container", "Detail"].indexOf(operate) >= 0 ? "/:id" + other : ""),
        views: {
          "menu": {
            templateUrl: "modules/main/templates/subMenu.html",
            controller: "subMenuCtl"
          },
          "container": {
            templateUrl: "modules/" + firstName + "/" + secondName + "/templates/" + secondName + "_" + operate.substring(0, 1).toLowerCase() + operate.substring(1) + ".html",
            controller: secondName + operate + "Ctl"
          }
        }
      };
    }
    // 模块-master
    function getJsonForMaster(firstName, secondName, thirdName, operate) {
      return {
        url: "/" + firstName + "/" + secondName + "/" + thirdName+ "/"+ operate.toLowerCase() + (["Read", "Update"].indexOf(operate) >= 0 ? "/:id" : ""),
        views: {
          "menu": {
            templateUrl: "modules/main/templates/subMenu.html",
            controller: "subMenuCtl"
          },
          "container": {
            templateUrl: "modules/" + firstName + "/" + secondName + "/"+ thirdName+ "/templates/" + thirdName + "_" + operate.substring(0, 1).toLowerCase() + operate.substring(1) + ".html",
            controller: thirdName + operate + "Ctl"
          }
        }
      };
    }
    // 模块-其它操作
    function getJsonForOthers(firstName, secondName, operate) {
      return {
        url: "/" + firstName + "/" + secondName + "/" + operate.toLowerCase() + "/:id",
        views: {
          "menu": {
            templateUrl: "modules/main/templates/subMenu.html",
            controller: "subMenuCtl"
          },
          "container": {
            templateUrl: "modules/" + firstName + "/" + secondName + "/templates/" + secondName + "_" + operate.toLowerCase() + ".html",
            controller: secondName + operate + "Ctl"
          }
        }
      };
    }

    // ====================================================================================================================
    $urlRouterProvider.otherwise("/login");
    $stateProvider
      .state("login", getJsonForBase("login"))
      .state("main", getJsonForBase("main"))
      .state("main.mainMenu", getJsonForMenu("mainMenu", "main"))
      .state("main.subMenu", getJsonForMenu("subMenu", "main"))
      .state("main.userInfo", getJsonForUser("userInfo"))
      .state("main.userPassword", getJsonForUser("userPassword"))
      // ===============================================system=========================================================
      // client
      .state("main.client", getJsonForModule("system", "client"))
      .state("main.clientCreate", getJsonForCRU("system", "client", "Create"))
      .state("main.clientRead", getJsonForCRU("system", "client", "Read"))
      .state("main.clientUpdate", getJsonForCRU("system", "client", "Update"))
      // menu
      .state("main.menu", getJsonForModule("system", "menu"))
      // module
      .state("main.module", getJsonForModule("system", "module"))
      .state("main.moduleCreate", getJsonForCRU("system", "module", "Create"))
      .state("main.moduleRead", getJsonForCRU("system", "module", "Read"))
      .state("main.moduleUpdate", getJsonForCRU("system", "module", "Update"))
      // resource
      .state("main.resource", getJsonForModule("system", "resource"))
      .state("main.resourceCreate", getJsonForCRU("system", "resource", "Create"))
      .state("main.resourceRead", getJsonForCRU("system", "resource", "Read"))
      .state("main.resourceUpdate", getJsonForCRU("system", "resource", "Update"))
      // rfMenu
      .state("main.rf_menu", getJsonForModule("system", "rfMenu"))
      // role
      .state("main.role", getJsonForModule("system", "role"))
      .state("main.roleCreate", getJsonForCRU("system", "role", "Create"))
      .state("main.roleRead", getJsonForCRU("system", "role", "Read"))
      .state("main.roleUpdate", getJsonForCRU("system", "role", "Update"))
      // roleModule
      .state("main.role_module", getJsonForModule("system", "roleModule"))
      // selection
      .state("main.selection", getJsonForModule("system", "selection"))
      .state("main.selectionCreate", getJsonForCRU("system", "selection", "Create"))
      .state("main.selectionRead", getJsonForCRU("system", "selection", "Read"))
      .state("main.selectionUpdate", getJsonForCRU("system", "selection", "Update"))
      // systemProperty
      .state("main.system_property", getJsonForModule("system", "systemProperty"))
      .state("main.systemPropertyCreate", getJsonForCRU("system", "systemProperty", "Create"))
      .state("main.systemPropertyRead", getJsonForCRU("system", "systemProperty", "Read"))
      .state("main.systemPropertyUpdate", getJsonForCRU("system", "systemProperty", "Update"))
      // user
      .state("main.user", getJsonForModule("system", "user"))
      .state("main.userCreate", getJsonForCRU("system", "user", "Create"))
      .state("main.userRead", getJsonForCRU("system", "user", "Read"))
      .state("main.userUpdate", getJsonForCRU("system", "user", "Update"))
      // userGroup
      .state("main.usergroup", getJsonForModule("system", "userGroup"))
      .state("main.userGroupCreate", getJsonForCRU("system", "userGroup", "Create"))
      .state("main.userGroupRead", getJsonForCRU("system", "userGroup", "Read"))
      .state("main.userGroupUpdate", getJsonForCRU("system", "userGroup", "Update"))
      // userWarehouse
      .state("main.user_warehouse", getJsonForModule("system", "userWarehouse"))
      // userWarehouseRole
      .state("main.user_warehouse_role", getJsonForModule("system", "userWarehouseRole"))
      // warehouse
      .state("main.warehouse", getJsonForModule("system", "warehouse"))
      .state("main.warehouseCreate", getJsonForCRU("system", "warehouse", "Create"))
      .state("main.warehouseRead", getJsonForCRU("system", "warehouse", "Read"))
      .state("main.warehouseUpdate", getJsonForCRU("system", "warehouse", "Update"))
      // warehouseClient
      .state("main.warehouse_client", getJsonForModule("system", "warehouseClient"))
      // ===============================================masterData=====================================================
      // master-area
      .state("main.area", getJsonForModule("masterData", "master", "area"))
      .state("main.areaCreate", getJsonForMaster("masterData", "master", "area", "Create"))
      .state("main.areaRead", getJsonForMaster("masterData", "master", "area", "Read"))
      .state("main.areaUpdate", getJsonForMaster("masterData", "master", "area", "Update"))
      // master-dropZone
      .state("main.drop_zone", getJsonForModule("masterData", "master", "dropZone"))
      .state("main.dropZoneCreate", getJsonForMaster("masterData", "master", "dropZone", "Create"))
      .state("main.dropZoneRead", getJsonForMaster("masterData", "master", "dropZone", "Read"))
      .state("main.dropZoneUpdate", getJsonForMaster("masterData", "master", "dropZone", "Update"))
      // master-hardware
      .state("main.hardware", getJsonForModule("masterData", "master", "hardware"))
      .state("main.hardwareCreate", getJsonForMaster("masterData", "master", "hardware", "Create"))
      .state("main.hardwareRead", getJsonForMaster("masterData", "master", "hardware", "Read"))
      .state("main.hardwareUpdate", getJsonForMaster("masterData", "master", "hardware", "Update"))
      // master-hardwareWorkstation
      .state("main.hardware_workstation", getJsonForModule("masterData", "master", "hardwareWorkstation"))
      // master-itemData
      .state("main.item_data", getJsonForModule("masterData", "master", "itemData"))
      .state("main.itemDataCreate", getJsonForMaster("masterData", "master", "itemData", "Create"))
      .state("main.itemDataRead", getJsonForMaster("masterData", "master", "itemData", "Read"))
      .state("main.itemDataUpdate", getJsonForMaster("masterData", "master", "itemData", "Update"))
      // master-itemDataGlobal
      .state("main.item_data_global", getJsonForModule("masterData", "master", "itemDataGlobal"))
      .state("main.itemDataGlobalCreate", getJsonForMaster("masterData", "master", "itemDataGlobal", "Create"))
      .state("main.itemDataGlobalRead", getJsonForMaster("masterData", "master", "itemDataGlobal", "Read"))
      .state("main.itemDataGlobalUpdate", getJsonForMaster("masterData", "master", "itemDataGlobal", "Update"))
      // master-itemGroup
      .state("main.item_group", getJsonForModule("masterData", "master", "itemGroup"))
      .state("main.itemGroupCreate", getJsonForMaster("masterData", "master", "itemGroup", "Create"))
      .state("main.itemGroupRead", getJsonForMaster("masterData", "master", "itemGroup", "Read"))
      .state("main.itemGroupUpdate", getJsonForMaster("masterData", "master", "itemGroup", "Update"))
      // master-itemUnit
      .state("main.item_unit", getJsonForModule("masterData", "master", "itemUnit"))
      .state("main.itemUnitCreate", getJsonForMaster("masterData", "master", "itemUnit", "Create"))
      .state("main.itemUnitRead", getJsonForMaster("masterData", "master", "itemUnit", "Read"))
      .state("main.itemUnitUpdate", getJsonForMaster("masterData", "master", "itemUnit", "Update"))
      // master-pod
      .state("main.pod", getJsonForModule("masterData", "master", "pod"))
      .state("main.podCreate", getJsonForMaster("masterData", "master", "pod", "Create"))
      .state("main.podRead", getJsonForMaster("masterData", "master", "pod", "Read"))
      // master-podType
      .state("main.pod_type", getJsonForModule("masterData", "master", "podType"))
      .state("main.podTypeCreate", getJsonForMaster("masterData", "master", "podType", "Create"))
      .state("main.podTypeRead", getJsonForMaster("masterData", "master", "podType", "Read"))
      .state("main.podTypeUpdate", getJsonForMaster("masterData", "master", "podType", "Update"))
      //master-semblence
      .state("main.sku_semblence",getJsonForModule("masterData", "master", "semblence"))
      .state("main.semblenceCreate", getJsonForMaster("masterData", "master", "semblence", "Create"))
      .state("main.semblenceRead", getJsonForMaster("masterData", "master", "semblence", "Read"))
      // master-storageLocation
      .state("main.storage_location", getJsonForModule("masterData", "master", "storageLocation"))
      .state("main.storageLocationCreate", getJsonForMaster("masterData", "master", "storageLocation", "Create"))
      .state("main.storageLocationRead", getJsonForMaster("masterData", "master", "storageLocation", "Read"))
      // master-storageLocationType
      .state("main.storage_location_type", getJsonForModule("masterData", "master", "storageLocationType"))
      .state("main.storageLocationTypeCreate", getJsonForMaster("masterData", "master", "storageLocationType", "Create"))
      .state("main.storageLocationTypeRead", getJsonForMaster("masterData", "master", "storageLocationType", "Read"))
      .state("main.storageLocationTypeUpdate", getJsonForMaster("masterData", "master", "storageLocationType", "Update"))
      // master-zone
      .state("main.zone", getJsonForModule("masterData", "master", "zone"))
      .state("main.zoneCreate", getJsonForMaster("masterData", "master", "zone", "Create"))
      .state("main.zoneRead", getJsonForMaster("masterData", "master", "zone", "Read"))
      .state("main.zoneUpdate", getJsonForMaster("masterData", "master", "zone", "Update"))
      // master-zoneItemGroup
      .state("main.zone_item_group", getJsonForModule("masterData", "master", "zoneItemGroup"))
      // master-workstation
      .state("main.workstation", getJsonForModule("masterData", "master", "workstation"))
      .state("main.workstationCreate", getJsonForMaster("masterData", "master", "workstation", "Create"))
      .state("main.workstationRead", getJsonForMaster("masterData", "master", "workstation", "Read"))
      // master-workstationType
      .state("main.workstation_type", getJsonForModule("masterData", "master", "workstationType"))
      .state("main.workstationTypeCreate", getJsonForMaster("masterData", "master", "workstationType", "Create"))
      .state("main.workstationTypeRead", getJsonForMaster("masterData", "master", "workstationType", "Read"))
      .state("main.workstationTypeUpdate", getJsonForMaster("masterData", "master", "workstationType", "Update"))
      // inbound-adviceRequest
      .state("main.advice_request", getJsonForModule("masterData", "inbound", "adviceRequest"))
      .state("main.adviceRequestCreate", getJsonForMaster("masterData", "inbound", "adviceRequest", "Create"))
      .state("main.adviceRequestRead", getJsonForMaster("masterData", "inbound", "adviceRequest", "Read"))
      // inbound-goodsReceipt
      .state("main.goods_receipt", getJsonForModule("masterData", "inbound", "goodsReceipt"))
      .state("main.goodsReceiptRead", getJsonForMaster("masterData", "inbound", "goodsReceipt", "Read"))
      .state("main.goodsReceiptActivate", getJsonForMaster("masterData", "inbound", "goodsReceipt", "Activate"))
      // inbound-receiveCategory
      .state("main.receive_category", getJsonForModule("masterData", "inbound", "receiveCategory"))
      .state("main.receiveCategoryCreate", getJsonForMaster("masterData", "inbound", "receiveCategory", "Create"))
      .state("main.receiveCategoryUpdate", getJsonForMaster("masterData", "inbound", "receiveCategory", "Update"))
      // inbound-receiveCategoryRule
      .state("main.receive_category_rule", getJsonForModule("masterData", "inbound", "receiveCategoryRule"))
      .state("main.receiveCategoryRuleUpdate", getJsonForMaster("masterData", "inbound", "receiveCategoryRule", "Update"))
      // inbound-receiveDestination
      .state("main.receive_destination", getJsonForModule("masterData", "inbound", "receiveDestination"))
      .state("main.receiveDestinationCreate", getJsonForMaster("masterData", "inbound", "receiveDestination", "Create"))
      .state("main.receiveDestinationRead", getJsonForMaster("masterData", "inbound", "receiveDestination", "Read"))
      .state("main.receiveDestinationUpdate", getJsonForMaster("masterData", "inbound", "receiveDestination", "Update"))
      // inbound-receiveEligibility
      .state("main.receive_eligibility", getJsonForModule("masterData", "inbound", "receiveEligibility"))
      // inbound-receiveStation
      .state("main.receive_station", getJsonForModule("masterData", "inbound", "receiveStation"))
      .state("main.receiveStationCreate", getJsonForMaster("masterData", "inbound", "receiveStation", "Create"))
      .state("main.receiveStationRead", getJsonForMaster("masterData", "inbound", "receiveStation", "Read"))
      // inbound-receiveStationType
      .state("main.receive_station_type", getJsonForModule("masterData", "inbound", "receiveStationType"))
      .state("main.receiveStationTypeCreate", getJsonForMaster("masterData", "inbound", "receiveStationType", "Create"))
      .state("main.receiveStationTypeRead", getJsonForMaster("masterData", "inbound", "receiveStationType", "Read"))
      .state("main.receiveStationTypeUpdate", getJsonForMaster("masterData", "inbound", "receiveStationType", "Update"))
      // inbound-receiveThreshold
      .state("main.receive_threshold", getJsonForModule("masterData", "inbound", "receiveThreshold"))
      .state("main.receiveThresholdCreate", getJsonForMaster("masterData", "inbound", "receiveThreshold", "Create"))
      .state("main.receiveThresholdRead", getJsonForMaster("masterData", "inbound", "receiveThreshold", "Read"))
      .state("main.receiveThresholdUpdate", getJsonForMaster("masterData", "inbound", "receiveThreshold", "Update"))
      // inbound-replenishStrategy
      .state("main.replenish_strategy", getJsonForModule("masterData", "inbound", "replenishStrategy"))
      .state("main.replenishStrategyCreate", getJsonForMaster("masterData", "inbound", "replenishStrategy", "Create"))
      .state("main.replenishStrategyUpdate", getJsonForMaster("masterData", "inbound", "replenishStrategy", "Update"))
      // inbound-stowStation
      .state("main.stow_station", getJsonForModule("masterData", "inbound", "stowStation"))
      .state("main.stowStationCreate", getJsonForMaster("masterData", "inbound", "stowStation", "Create"))
      .state("main.stowStationRead", getJsonForMaster("masterData", "inbound", "stowStation", "Read"))
      // inbound-stowStationType
      .state("main.stow_station_type", getJsonForModule("masterData", "inbound", "stowStationType"))
      .state("main.stowStationTypeCreate", getJsonForMaster("masterData", "inbound", "stowStationType", "Create"))
      .state("main.stowStationTypeRead", getJsonForMaster("masterData", "inbound", "stowStationType", "Read"))
      .state("main.stowStationTypeUpdate", getJsonForMaster("masterData", "inbound", "stowStationType", "Update"))
      // outbound-boxType
      .state("main.box_type", getJsonForModule("masterData", "outbound", "boxType"))
      .state("main.boxTypeCreate", getJsonForMaster("masterData", "outbound", "boxType", "Create"))
      .state("main.boxTypeRead", getJsonForMaster("masterData", "outbound", "boxType", "Read"))
      .state("main.boxTypeUpdate", getJsonForMaster("masterData", "outbound", "boxType", "Update"))
      // outbound-carrier
      .state("main.carrier", getJsonForModule("masterData", "outbound", "carrier"))
      .state("main.carrierCreate", getJsonForMaster("masterData", "outbound", "carrier", "Create"))
      .state("main.carrierRead", getJsonForMaster("masterData", "outbound", "carrier", "Read"))
      .state("main.carrierUpdate", getJsonForMaster("masterData", "outbound", "carrier", "Update"))
      // outbound-digitalLabel
      .state("main.digital_label", getJsonForModule("masterData", "outbound", "digitalLabel"))
      .state("main.digitalLabelCreate", getJsonForMaster("masterData", "outbound", "digitalLabel", "Create"))
      .state("main.digitalLabelRead", getJsonForMaster("masterData", "outbound", "digitalLabel", "Read"))
      .state("main.digitalLabelUpdate", getJsonForMaster("masterData", "outbound", "digitalLabel", "Update"))
      // outbound-goodsOutDoor
      .state("main.goods_out_door", getJsonForModule("masterData", "outbound", "goodsOutDoor"))
      .state("main.goodsOutDoorCreate", getJsonForMaster("masterData", "outbound", "goodsOutDoor", "Create"))
      .state("main.goodsOutDoorRead", getJsonForMaster("masterData", "outbound", "goodsOutDoor", "Read"))
      .state("main.goodsOutDoorUpdate", getJsonForMaster("masterData", "outbound", "goodsOutDoor", "Update"))
      // outbound-labelController
      .state("main.label_controller", getJsonForModule("masterData", "outbound", "labelController"))
      .state("main.labelControllerCreate", getJsonForMaster("masterData", "outbound", "labelController", "Create"))
      .state("main.labelControllerRead", getJsonForMaster("masterData", "outbound", "labelController", "Read"))
      .state("main.labelControllerUpdate", getJsonForMaster("masterData", "outbound", "labelController", "Update"))
      // outbound-orderStrategy
      .state("main.order_strategy", getJsonForModule("masterData", "outbound", "orderStrategy"))
      .state("main.orderStrategyCreate", getJsonForMaster("masterData", "outbound", "orderStrategy", "Create"))
      .state("main.orderStrategyUpdate", getJsonForMaster("masterData", "outbound", "orderStrategy", "Update"))
      // outbound-packingStation
      .state("main.packing_station", getJsonForModule("masterData", "outbound", "packingStation"))
      .state("main.packingStationCreate", getJsonForMaster("masterData", "outbound", "packingStation", "Create"))
      .state("main.packingStationRead", getJsonForMaster("masterData", "outbound", "packingStation", "Read"))
      // outbound-packingStationType
      .state("main.packing_station_type", getJsonForModule("masterData", "outbound", "packingStationType"))
      .state("main.packingStationTypeCreate", getJsonForMaster("masterData", "outbound", "packingStationType", "Create"))
      .state("main.packingStationTypeRead", getJsonForMaster("masterData", "outbound", "packingStationType", "Read"))
      .state("main.packingStationTypeUpdate", getJsonForMaster("masterData", "outbound", "packingStationType", "Update"))
      // outbound-pickingArea
      .state("main.picking_area", getJsonForModule("masterData", "outbound", "pickingArea"))
      .state("main.pickingAreaCreate", getJsonForMaster("masterData", "outbound", "pickingArea", "Create"))
      .state("main.pickingAreaRead", getJsonForMaster("masterData", "outbound", "pickingArea", "Read"))
      // outbound-pickingAreaEligibility
      .state("main.picking_area_eligibility", getJsonForModule("masterData", "outbound", "pickingAreaEligibility"))
      // outbound-pickingCategory
      .state("main.picking_category", getJsonForModule("masterData", "outbound", "pickingCategory"))
      .state("main.pickingCategoryCreate", getJsonForMaster("masterData", "outbound", "pickingCategory", "Create"))
      .state("main.pickingCategoryUpdate", getJsonForMaster("masterData", "outbound", "pickingCategory", "Update"))
      // outbound-pickingProcessEligibility
      .state("main.picking_process_eligibility", getJsonForModule("masterData", "outbound", "pickingProcessEligibility"))
      // outbound-pickPackCell
      .state("main.pick_pack_cell", getJsonForModule("masterData", "outbound", "pickPackCell"))
      .state("main.pickPackCellCreate", getJsonForMaster("masterData", "outbound", "pickPackCell", "Create"))
      .state("main.pickPackCellRead", getJsonForMaster("masterData", "outbound", "pickPackCell", "Read"))
      .state("main.pickPackCellUpdate", getJsonForMaster("masterData", "outbound", "pickPackCell", "Update"))
      // outbound-pickPackCellType
      .state("main.pick_pack_cell_type", getJsonForModule("masterData", "outbound", "pickPackCellType"))
      .state("main.pickPackCellTypeCreate", getJsonForMaster("masterData", "outbound", "pickPackCellType", "Create"))
      .state("main.pickPackCellTypeRead", getJsonForMaster("masterData", "outbound", "pickPackCellType", "Read"))
      .state("main.pickPackCellTypeUpdate", getJsonForMaster("masterData", "outbound", "pickPackCellType", "Update"))
      // outbound-pickPackCellTypeBoxType
      .state("main.pick_pack_cell_type_box_type", getJsonForModule("masterData", "outbound", "pickPackCellTypeBoxType"))
      // outbound-pickPackFieldType
      .state("main.pick_pack_field_type", getJsonForModule("masterData", "outbound", "pickPackFieldType"))
      .state("main.pickPackFieldTypeCreate", getJsonForMaster("masterData", "outbound", "pickPackFieldType", "Create"))
      .state("main.pickPackFieldTypeRead", getJsonForMaster("masterData", "outbound", "pickPackFieldType", "Read"))
      .state("main.pickPackFieldTypeUpdate", getJsonForMaster("masterData", "outbound", "pickPackFieldType", "Update"))
      // outbound-pickPackWall
      .state("main.pick_pack_wall", getJsonForModule("masterData", "outbound", "pickPackWall"))
      .state("main.pickPackWallCreate", getJsonForMaster("masterData", "outbound", "pickPackWall", "Create"))
      .state("main.pickPackWallRead", getJsonForMaster("masterData", "outbound", "pickPackWall", "Read"))
      .state("main.pickPackWallUpdate", getJsonForMaster("masterData", "outbound", "pickPackWall", "Update"))
      // outbound-pickPackWallType
      .state("main.pick_pack_wall_type", getJsonForModule("masterData", "outbound", "pickPackWallType"))
      .state("main.pickPackWallTypeCreate", getJsonForMaster("masterData", "outbound", "pickPackWallType", "Create"))
      .state("main.pickPackWallTypeRead", getJsonForMaster("masterData", "outbound", "pickPackWallType", "Read"))
      .state("main.pickPackWallTypeUpdate", getJsonForMaster("masterData", "outbound", "pickPackWallType", "Update"))
      // outbound-pickStation
      .state("main.pick_station", getJsonForModule("masterData", "outbound", "pickStation"))
      .state("main.pickStationCreate", getJsonForMaster("masterData", "outbound", "pickStation", "Create"))
      .state("main.pickStationRead", getJsonForMaster("masterData", "outbound", "pickStation", "Read"))
      // outbound-pickStationType
      .state("main.pick_station_type", getJsonForModule("masterData", "outbound", "pickStationType"))
      .state("main.pickStationTypeCreate", getJsonForMaster("masterData", "outbound", "pickStationType", "Create"))
      .state("main.pickStationTypeRead", getJsonForMaster("masterData", "outbound", "pickStationType", "Read"))
      .state("main.pickStationTypeUpdate", getJsonForMaster("masterData", "outbound", "pickStationType", "Update"))
      // outbound-processPath
      .state("main.process_path", getJsonForModule("masterData", "outbound", "processPath"))
      .state("main.processPathCreate", getJsonForMaster("masterData", "outbound", "processPath", "Create"))
      .state("main.processPathRead", getJsonForMaster("masterData", "outbound", "processPath", "Read"))
      .state("main.processPathUpdate", getJsonForMaster("masterData", "outbound", "processPath", "Update"))
      // outbound-processPathType
      .state("main.process_path_type", getJsonForModule("masterData", "outbound", "processPathType"))
      .state("main.processPathTypeCreate", getJsonForMaster("masterData", "outbound", "processPathType", "Create"))
      .state("main.processPathTypeRead", getJsonForMaster("masterData", "outbound", "processPathType", "Read"))
      .state("main.processPathTypeUpdate", getJsonForMaster("masterData", "outbound", "processPathType", "Update"))
      // outbound-rebatchSlot
      .state("main.rebatch_slot", getJsonForModule("masterData", "outbound", "rebatchSlot"))
      .state("main.rebatchSlotCreate", getJsonForMaster("masterData", "outbound", "rebatchSlot", "Create"))
      .state("main.rebatchSlotRead", getJsonForMaster("masterData", "outbound", "rebatchSlot", "Read"))
      .state("main.rebatchSlotUpdate", getJsonForMaster("masterData", "outbound", "rebatchSlot", "Update"))
      // outbound-rebatchStation
      .state("main.rebatch_station", getJsonForModule("masterData", "outbound", "rebatchStation"))
      .state("main.rebatchStationCreate", getJsonForMaster("masterData", "outbound", "rebatchStation", "Create"))
      .state("main.rebatchStationRead", getJsonForMaster("masterData", "outbound", "rebatchStation", "Read"))
      // outbound-rebatchStationType
      .state("main.rebatch_station_type", getJsonForModule("masterData", "outbound", "rebatchStationType"))
      .state("main.rebatchStationTypeCreate", getJsonForMaster("masterData", "outbound", "rebatchStationType", "Create"))
      .state("main.rebatchStationTypeRead", getJsonForMaster("masterData", "outbound", "rebatchStationType", "Read"))
      .state("main.rebatchStationTypeUpdate", getJsonForMaster("masterData", "outbound", "rebatchStationType", "Update"))
      // outbound-rebinCell
      .state("main.rebin_cell", getJsonForModule("masterData", "outbound", "rebinCell"))
      .state("main.rebinCellCreate", getJsonForMaster("masterData", "outbound", "rebinCell", "Create"))
      .state("main.rebinCellRead", getJsonForMaster("masterData", "outbound", "rebinCell", "Read"))
      .state("main.rebinCellUpdate", getJsonForMaster("masterData", "outbound", "rebinCell", "Update"))
      // outbound-rebinCellType
      .state("main.rebin_cell_type", getJsonForModule("masterData", "outbound", "rebinCellType"))
      .state("main.rebinCellTypeCreate", getJsonForMaster("masterData", "outbound", "rebinCellType", "Create"))
      .state("main.rebinCellTypeRead", getJsonForMaster("masterData", "outbound", "rebinCellType", "Read"))
      .state("main.rebinCellTypeUpdate", getJsonForMaster("masterData", "outbound", "rebinCellType", "Update"))
      // outbound-rebinStation
      .state("main.rebin_station", getJsonForModule("masterData", "outbound", "rebinStation"))
      .state("main.rebinStationCreate", getJsonForMaster("masterData", "outbound", "rebinStation", "Create"))
      .state("main.rebinStationRead", getJsonForMaster("masterData", "outbound", "rebinStation", "Read"))
      // outbound-rebinStationType
      .state("main.rebin_station_type", getJsonForModule("masterData", "outbound", "rebinStationType"))
      .state("main.rebinStationTypeCreate", getJsonForMaster("masterData", "outbound", "rebinStationType", "Create"))
      .state("main.rebinStationTypeRead", getJsonForMaster("masterData", "outbound", "rebinStationType", "Read"))
      .state("main.rebinStationTypeUpdate", getJsonForMaster("masterData", "outbound", "rebinStationType", "Update"))
      // outbound-rebinWall
      .state("main.rebin_wall", getJsonForModule("masterData", "outbound", "rebinWall"))
      .state("main.rebinWallCreate", getJsonForMaster("masterData", "outbound", "rebinWall", "Create"))
      .state("main.rebinWallRead", getJsonForMaster("masterData", "outbound", "rebinWall", "Read"))
      .state("main.rebinWallUpdate", getJsonForMaster("masterData", "outbound", "rebinWall", "Update"))
      // outbound-rebinWallType
      .state("main.rebin_wall_type", getJsonForModule("masterData", "outbound", "rebinWallType"))
      .state("main.rebinWallTypeCreate", getJsonForMaster("masterData", "outbound", "rebinWallType", "Create"))
      .state("main.rebinWallTypeRead", getJsonForMaster("masterData", "outbound", "rebinWallType", "Read"))
      .state("main.rebinWallTypeUpdate", getJsonForMaster("masterData", "outbound", "rebinWallType", "Update"))
      // outbound-sortingStation
      .state("main.sorting_station", getJsonForModule("masterData", "outbound", "sortingStation"))
      .state("main.sortingStationCreate", getJsonForMaster("masterData", "outbound", "sortingStation", "Create"))
      .state("main.sortingStationRead", getJsonForMaster("masterData", "outbound", "sortingStation", "Read"))
      // outbound-sortingStationType
      .state("main.sorting_station_type", getJsonForModule("masterData", "outbound", "sortingStationType"))
      .state("main.sortingStationTypeCreate", getJsonForMaster("masterData", "outbound", "sortingStationType", "Create"))
      .state("main.sortingStationTypeRead", getJsonForMaster("masterData", "outbound", "sortingStationType", "Read"))
      .state("main.sortingStationTypeUpdate", getJsonForMaster("masterData", "outbound", "sortingStationType", "Update"))
      // robot-robot
      .state("main.robot", getJsonForModule("masterData", "robot", "robot"))
      .state("main.robotCreate", getJsonForMaster("masterData", "robot", "robot", "Create"))
      .state("main.robotRead", getJsonForMaster("masterData", "robot", "robot", "Read"))
      .state("main.robotUpdate", getJsonForMaster("masterData", "robot", "robot", "Update"))
      // robot-robotType
      .state("main.robot_type", getJsonForModule("masterData", "robot", "robotType"))
      .state("main.robotTypeCreate", getJsonForMaster("masterData", "robot", "robotType", "Create"))
      .state("main.robotTypeRead", getJsonForMaster("masterData", "robot", "robotType", "Read"))
      .state("main.robotTypeUpdate", getJsonForMaster("masterData", "robot", "robotType", "Update"))
      // robot-batterConfig
      .state("main.batter_config", getJsonForModule("masterData", "robot", "batterConfig"))
      .state("main.batterConfigCreate", getJsonForMaster("masterData", "robot", "batterConfig", "Create"))
      .state("main.batterConfigRead", getJsonForMaster("masterData", "robot", "batterConfig", "Read"))
      .state("main.batterConfigUpdate", getJsonForMaster("masterData", "robot", "batterConfig", "Update"))
      // ===============================================inbound========================================================
      .state("main.receiving", getJsonForModule("inbound", "receiving"))
        .state("main.receivingContainer", getJsonForCRU("inbound", "receiving", "Container"))
        .state("main.receivingSingle", getJsonForCRU("inbound", "receiving", "Single"))
        .state("main.receivingPallet", getJsonForCRU("inbound", "receiving", "Pallet"))
        .state("main.receivingTote", getJsonForCRU("inbound", "receiving", "Tote"))
      .state("main.stow", getJsonForModule("inbound", "stow"))


      // ===========================================inboundProblem=====================================================
      // ibp-ibpStation
      .state("main.ibp_station", getJsonForModule("inboundProblem", "ibpStation"))
      .state("main.ibpStationCreate", getJsonForCRU("inboundProblem", "ibpStation", "Create"))
      .state("main.ibpStationRead", getJsonForCRU("inboundProblem", "ibpStation", "Read"))
      // ibp-ibpStationType
      .state("main.ibp_station_type", getJsonForModule("inboundProblem", "ibpStationType"))
      .state("main.ibpStationTypeCreate", getJsonForCRU("inboundProblem", "ibpStationType", "Create"))
      .state("main.ibpStationTypeRead", getJsonForCRU("inboundProblem", "ibpStationType", "Read"))
      .state("main.ibpStationTypeUpdate", getJsonForCRU("inboundProblem", "ibpStationType", "Update"))
      // ibp-problemInbound
      .state("main.inbound_problem_disposal", getJsonForModule("inboundProblem", "problemInbound"))
      .state("main.problemInboundRead", getJsonForCRU("inboundProblem", "problemInbound", "Read"))
      // ibp-problemInboundManage
      .state("main.inbound_problem_manage", getJsonForModule("inboundProblem", "problemInboundManage"))
      .state("main.problemInboundManageDetail", getJsonForCRU("inboundProblem", "problemInboundManage", "Detail"))
      // ===========================================outboundProblem=====================================================
      // obp-obpCell
      .state("main.obp_cell", getJsonForModule("outboundProblem", "obpCell"))
      .state("main.obpCellCreate", getJsonForCRU("outboundProblem", "obpCell", "Create"))
      .state("main.obpCellRead", getJsonForCRU("outboundProblem", "obpCell", "Read"))
      .state("main.obpCellUpdate", getJsonForCRU("outboundProblem", "obpCell", "Update"))
      // obp-obpCellType
      .state("main.obp_cell_type", getJsonForModule("outboundProblem", "obpCellType"))
      .state("main.obpCellTypeCreate", getJsonForCRU("outboundProblem", "obpCellType", "Create"))
      .state("main.obpCellTypeRead", getJsonForCRU("outboundProblem", "obpCellType", "Read"))
      .state("main.obpCellTypeUpdate", getJsonForCRU("outboundProblem", "obpCellType", "Update"))
      // obp-obpStation
      .state("main.obp_station", getJsonForModule("outboundProblem", "obpStation"))
      .state("main.obpStationCreate", getJsonForCRU("outboundProblem", "obpStation", "Create"))
      .state("main.obpStationRead", getJsonForCRU("outboundProblem", "obpStation", "Read"))
      // obp-obpStationType
      .state("main.obp_station_type", getJsonForModule("outboundProblem", "obpStationType"))
      .state("main.obpStationTypeCreate", getJsonForCRU("outboundProblem", "obpStationType", "Create"))
      .state("main.obpStationTypeRead", getJsonForCRU("outboundProblem", "obpStationType", "Read"))
      .state("main.obpStationTypeUpdate", getJsonForCRU("outboundProblem", "obpStationType", "Update"))
      // obp-obpWall
      .state("main.obp_wall", getJsonForModule("outboundProblem", "obpWall"))
      .state("main.obpWallCreate", getJsonForCRU("outboundProblem", "obpWall", "Create"))
      .state("main.obpWallRead", getJsonForCRU("outboundProblem", "obpWall", "Read"))
      .state("main.obpWallUpdate", getJsonForCRU("outboundProblem", "obpWall", "Update"))
      // obp-obpWallType
      .state("main.obp_wall_type", getJsonForModule("outboundProblem", "obpWallType"))
      .state("main.obpWallTypeCreate", getJsonForCRU("outboundProblem", "obpWallType", "Create"))
      .state("main.obpWallTypeRead", getJsonForCRU("outboundProblem", "obpWallType", "Read"))
      .state("main.obpWallTypeUpdate", getJsonForCRU("outboundProblem", "obpWallType", "Update"))
      // obp-problemOutbound
      .state("main.outbound_problem_disposal", getJsonForModule("outboundProblem", "problemOutbound"))
      .state("main.problemOutboundDetail", getJsonForCRU("outboundProblem", "problemOutbound", "Detail"))
      .state("main.problemOutboundForced", getJsonForCRU("outboundProblem", "problemOutbound", "Forced"))
      .state("main.problemOutboundGoods", getJsonForCRU("outboundProblem", "problemOutbound", "Goods"))
      .state("main.problemOutboundPick", getJsonForCRU("outboundProblem", "problemOutbound", "Pick"))
      .state("main.problemOutboundShipment", getJsonForCRU("outboundProblem", "problemOutbound", "Shipment"))
      .state("main.problemOutboundWall", getJsonForCRU("outboundProblem", "problemOutbound", "Wall"))
      // obp-problemOutboundManage
      .state("main.outbound_problem_manage", getJsonForModule("outboundProblem", "problemOutboundManage"))
      .state("main.problemOutboundManageDetail", getJsonForCRU("outboundProblem", "problemOutboundManage", "Detail"))
      // obp-problemOutboundVerify
      .state("main.outbound_problem_verify", getJsonForModule("outboundProblem", "problemOutboundVerify"))
      .state("main.problemOutboundVerifyRead", getJsonForCRU("outboundProblem", "problemOutboundVerify", "Read"))
      // ==============================================icqa====================================================
      .state("main.icqa_create", getJsonForModule("icqa", "icqaCreate"))
      .state("main.icqa_detail", getJsonForModule("icqa", "icqaDetail"))
      .state("main.icqa_andon", getJsonForModule("icqa", "icqaAndon"))
      .state("main.icqa_adjustment", getJsonForModule("icqa", "icqaAdjustment"))
      // icqa-stocktakingStation
      .state("main.stocktaking_station", getJsonForModule("icqa", "stocktakingStation"))
      .state("main.stocktakingStationCreate", getJsonForCRU("icqa", "stocktakingStation", "Create"))
      .state("main.stocktakingStationRead", getJsonForCRU("icqa", "stocktakingStation", "Read"))
      // icqa-stocktakingStationType
      .state("main.stocktaking_station_type", getJsonForModule("icqa", "stocktakingStationType"))
      .state("main.stocktakingStationTypeCreate", getJsonForCRU("icqa", "stocktakingStationType", "Create"))
      .state("main.stocktakingStationTypeRead", getJsonForCRU("icqa", "stocktakingStationType", "Read"))
      .state("main.stocktakingStationTypeUpdate", getJsonForCRU("icqa", "stocktakingStationType", "Update"))
      // ==============================================outbound========================================================
      // =================================================main.customerOrder========================================================
        .state("main.customer_order", getJsonForModule("outbound", "customerOrder"))
        .state("main.customerOrderCreate", getJsonForCRU("outbound", "customerOrder", "Create"))
        .state("main.customerOrderRead", getJsonForCRU("outbound", "customerOrder", "Read"))
        .state("main.customerOrderUpdate", getJsonForCRU("outbound", "customerOrder", "Update"))
        // ================================================main.customerShipment========================================================
        .state("main.customer_shipment", getJsonForModule("outbound", "customerShipment"))
        .state("main.customerShipmentRead", getJsonForCRU("outbound", "customerShipment", "Read"))
        // ==============================================outbound========================================================
     //rebin
      .state("main.re_bin", getJsonForModule("outbound", "rebin"))
      .state("main.reBinMain", getJsonForCRU("outbound", "rebin", "Main"))
      //rebatch
      .state("main.rebatch",getJsonForModule("outbound","rebatch"))
      //包装
      .state("main.pack", getJsonForModule("outbound", "pack"))
      .state("main.packScanGoods",getJsonForCRU("outbound","pack","ScanGoods"))
      .state("main.packNoScanGoods",getJsonForCRU("outbound","pack","NoScanGoods"))
      .state("main.rebin_pack",getJsonForModule("outbound","reBinPack"))
      .state("main.pick", getJsonForModule("outbound", "pick"))
        .state("main.pickToPack",getJsonForCRU("outbound","pick","ToPack"))
        .state("main.pickToPackMain",getJsonForCRU("outbound","pick","ToPackMain"))
        .state("main.pickToTote",getJsonForCRU("outbound","pick","ToTote"))
        .state("main.pickToToteMain",getJsonForCRU("outbound","pick","ToToteMain"))
      //出货系统
      .state("main.delivery_system",getJsonForModule("outbound","deliverySystem"))
      .state("main.deliverySystemPrint",{
        url:"/outbound/deliverySystem/Print/:params",
        views:{
          "menu":{templateUrl:"modules/main/templates/subMenu.html", controller: "subMenuCtl"},
          "container":{
            templateUrl:"modules/outbound/deliverySystem/templates/deliverySystem_print.html",
            controller:"deliverySystemPrintCtl"
          }
        }
      })
      .state("main.delivery_shipments_detail",{
        url:"/outbound/deliveryShipmentsDetail/:params",
        views:{
          "menu":{templateUrl:"modules/main/templates/subMenu.html", controller: "subMenuCtl"},
          "container":{
            templateUrl:"modules/outbound/deliveryShipmentsDetail/templates/deliveryShipmentsDetail.html",
            controller:"deliveryShipmentsDetailCtl"
          }
        }
      })
      .state("main.shipment_detail",{
        url:"/outbound/shipmentsDetail/:shipment",
        views:{
          "menu":{templateUrl:"modules/main/templates/subMenu.html",controller:"subMenuCtl"},
          "container":{
            templateUrl:"modules/outbound/shipmentDetail/templates/shipmentDetail.html",
            controller:"shipmentDetailCtl"
          }
        }
      })
      .state("main.query_cart",{
        url:"/outbound/queryCart/:cartName",
        views:{
          "menu":{templateUrl:"modules/main/templates/subMenu.html",controller:"subMenuCtl"},
          "container":{
            templateUrl:"modules/outbound/queryCart/templates/queryCart.html",
            controller:"queryCartCtl"
          }
        }
      })
      .state("main.cart_query_shipment",{
        url:"/outbound/cartQueryShipment/:cartName",
        views:{
          "menu":{templateUrl:"modules/main/templates/subMenu.html",controller:"subMenuCtl"},
          "container":{
            templateUrl:"modules/outbound/cartQueryShipment/templates/cartQueryShipment.html",
            controller:"cartQueryShipmentCtl"
          }
        }
      })
      // ==============================================report========================================================
      //
         .state("main.pick_query", getJsonForModule("report", "pickQuery"))
      .state("main.capacity", getJsonForModule("report", "capacity"))
      .state("main.capacity_side", getJsonForOthers("report", "capacity","Side"))
      .state("main.capacity_bin", getJsonForOthers("report", "capacity","Bin"))
      // ppr
      .state("main.ppr", getJsonForModule("report", "PPR"))
      .state("main.pprItem", getJsonForOthers("report", "PPR","Item"))
      // fud
      .state("main.fud", getJsonForModule("report", "fud"))
      // workflow
      .state("main.workflow", {
        url: "/report/workflow/workflow/:params",
        views: {
          "menu": {
            templateUrl: "modules/main/templates/subMenu.html",
            controller: "subMenuCtl"
          },
          "container": {
            templateUrl: "modules/report/workflow/templates/workflow.html",
            controller: "workflowCtl"
          }
        }
      })
      .state("main.workflowDetail", getJsonForCRU("report", "workflow", "Detail"))
     // .state("main.workflowProcessPathWorkPool", getJsonForCRU("report", "workflow", "ProcessPathWorkPool"))
      .state("main.workflowProcessPathWorkPool", {
        url: "/report/workflow/workflowProcessPathWorkPool/:params",
        views: {
          "menu": {
            templateUrl: "modules/main/templates/subMenu.html",
            controller: "subMenuCtl"
          },
          "container": {
            templateUrl: "modules/report/workflow/templates/workflow_processPathWorkPool.html",
            controller: "workflowProcessPathWorkPoolCtl"
          }
        }
      })
      .state("main.workflowProcessPathWorkPoolDetail", {
        url: "/report/workflow/processPathWorkPoolDetail/:params",
        views: {
          "menu": {
            templateUrl: "modules/main/templates/subMenu.html",
            controller: "subMenuCtl"
          },
          "container": {
            templateUrl: "modules/report/workflow/templates/workflow_processPathWorkPoolDetail.html",
            controller: "workflowProcessPathWorkPoolDetailCtl"
          }
        }
      })
  //    .state("main.workflowWorkPoolProcessPath", getJsonForCRU("report", "workflow", "WorkPoolProcessPath"))
          .state("main.workflowWorkPoolProcessPath", {
        url: "/report/workflow/workflowWorkPoolProcessPath/:params",
        views: {
          "menu": {
            templateUrl: "modules/main/templates/subMenu.html",
            controller: "subMenuCtl"
          },
          "container": {
            templateUrl: "modules/report/workflow/templates/workflow_workPoolProcessPath.html",
            controller: "workflowWorkPoolProcessPathCtl"
          }
        }
      })
      .state("main.workflowWorkPoolProcessPathDetail", {
        url: "/report/workflow/workPoolProcessPathDetail/:params",
        views: {
          "menu": {
            templateUrl: "modules/main/templates/subMenu.html",
            controller: "subMenuCtl"
          },
          "container": {
            templateUrl: "modules/report/workflow/templates/workflow_workPoolProcessPathDetail.html",
            controller: "workflowWorkPoolProcessPathDetailCtl"
          }
        }
      })
      // ==============================================INTERNAL_TOOL========================================================
      .state("main.move_tool", getJsonForModule("internalTool", "moveTool"))
      .state("main.sku_tool", getJsonForModule("internalTool", "skuTool"))
      .state("main.input_validity_tool", getJsonForModule("internalTool", "inputValidityTool"))
      .state("main.invent_adjust_tool", getJsonForModule("internalTool", "inventAdjustTool"))
      .state("main.input_validity_query", getJsonForModule("internalTool", "inputValidityQuery"))
      .state("main.measure_query", getJsonForModule("internalTool", "measureQuery"))
      .state("main.bar_code_tool", getJsonForModule("internalTool", "barCodeTool"))
      .state("main.measure_tool", getJsonForModule("internalTool", "measureTool"))
      .state("main.container_tool", getJsonForModule("internalTool", "containerTool"))
    // ===================================================TOT==============================================================
    // tot-processPaths
    .state("main.process_paths", getJsonForModule("tot", "processPaths"))
    .state("main.processPathsCreate", getJsonForCRU("tot", "processPaths", "Create"))
    .state("main.processPathsRead", getJsonForCRU("tot", "processPaths", "Read"))
    .state("main.processPathsUpdate", getJsonForCRU("tot", "processPaths", "Update"))
    // tot-processPathTypes
    .state("main.process_path_types", getJsonForModule("tot", "processPathTypes"))
    .state("main.processPathTypesCreate", getJsonForCRU("tot", "processPathTypes", "Create"))
    .state("main.processPathTypesRead", getJsonForCRU("tot", "processPathTypes", "Read"))
    .state("main.processPathTypesUpdate", getJsonForCRU("tot", "processPathTypes", "Update"))

  });
})();