/**
 * Created by zhihan.dong on 2017/04/24.
 * updated by zhihan.dong on 2017/05/04.
 */
(function () {
    'use strict';
    angular.module('myApp').controller("inventAdjustToolCtl", function ($scope, $rootScope, $state, $timeout, $window, commonService, internalToolService, inventAdjustToolService) {
      $scope._goodsContent = false;
      $scope.array = [];
      $scope.goodsMoveCarts = false;
      $scope.operatingModeType = 1;
      $scope.dateModel = 'manufacture';
      $scope.regular = /((^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(10|12|0?[13578])([-\/\._])(3[01]|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(11|0?[469])([-\/\._])(30|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(0?2)([-\/\._])(2[0-8]|1[0-9]|0?[1-9])$)|(^([2468][048]00)([-\/\._])(0?2)([-\/\._])(29)$)|(^([3579][26]00)([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][0][48])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][0][48])([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][2468][048])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][2468][048])([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][13579][26])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][13579][26])([-\/\._])(0?2)([-\/\._])(29)$))/;
      $scope.operatingModeAll = function (e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13) {

          $scope.goodsMoveCarts = false;
        }
      };
      $scope.fclMovingDestination = function (e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13) {
          inventAdjustToolService.orgContainer($scope.destinationContainerName, function (data) {
            $scope.errMessage = '';
            $scope.destinationContainerCount = data.itemDataAmount;
            $scope.destinationId = data.id;
            $scope.fclMovingDestinationShow = true;
            $scope.errMessage = '';
          }, errMessageFun);
        }
      };

      $scope.validity = function () {
        if ($scope.dateModel == "manufacture") {

          $scope.checkDate($scope.year, $scope.month, $scope.day, $scope.dateUnits);
        } else if ($scope.dateModel == "expiration") {
          $scope.checkDate($scope.expiredYear, $scope.expiredMonth, $scope.expiredDay);
        }
      };

      $scope.inputValidityDateFocus = function (e, type) {
        var keycode = $window.event ? e.keyCode : e.which;
        if (keycode == 13) {
          $('#' + type).focus();
        }
      };

      $scope.scanningGoods = function (e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13) {
          //扫描商品 通用
          if ($scope.operatingModeType == 1) {
            inventAdjustToolService.adjustScanningItemDataGlobal($scope.sourceId, $scope.scanningGoodsName, function (data) {
                $scope.errMessage = '';
                  $scope.itemId = data.itemNo;
                  $scope.itemGlobalName = data.itemDataGlobal.name;
                  $scope.itemUnitName = data.itemDataGlobal.itemUnit.name;
                  $scope.scanningGoodsCount = data.amount;
                  $scope.volume = data.itemDataGlobal.width + "*" + data.itemDataGlobal.depth + "*" + data.itemDataGlobal.height;
                  $scope.weight = data.itemDataGlobal.weight;
                  $scope.name = data.itemDataGlobal.name;
                  $scope._goodsContent = true;
                  $scope.dateUnit = data.itemDataGlobal.lotUnit;
                  if (data.ItemDataGlobal.lotMandatory == true) {

                    //有效期弹窗
                    $('#validityAdjustId').parent().addClass("windowTitle");
                    $scope.validityWindow.setOptions({
                      width: 1000,
                      height: 300,
                      visible: false,
                      actions: false
                    });
                    $scope.validityWindow.center();
                    $scope.validityWindow.open();
                  }
                }, errMessageFun);
              } else {
                inventAdjustToolService.scanningGoods($scope.sourceId, $scope.scanningGoodsName, function (data) {
                  $scope.errMessage = '';
                  $scope.skuId = data.skuNo;
                  $scope.commodityName = data.commodityName;
                  $scope.volume = data.itemData.width + "*" + data.itemData.depth + "*" + data.itemData.height;
                  $scope.weight = data.itemData.weight;
                  $scope.name = data.itemData.name;
                  $scope.itemUnitName = data.itemData.itemUnit.name;
                  $scope.itemDataId = data.itemData.id;
                  $scope.clientName = data.itemData.client.name;
                  $scope._goodsContent = true;
                  $scope.scanningGoodsCount = data.amount;
                  if ($scope.operatingModeType == 1) {
                    $scope.showType = 'client';
                  } else if ($scope.operatingModeType == 3) {
                    $("#commodityMovementDestinationContainerInput").focus();
                    $scope.commodityMovementDestinationContainerShow = true;
                  } else if ($scope.operatingModeType == 4) {
                    $("#modifyAttributeModelInput").focus();
                    $scope.modifyAttributeModelShow = true;
                  } else if ($scope.operatingModeType == 2) {
                    $scope.commodityInventoriesCountShow = true;
                    $("#commodityInventoriesCountInput").focus();
                  }
                }, errMessageFun);
              }
            }
          };
          $scope.operatingModeTypeClick = function (model) {
            $scope.operatingModeType = model;
            //做初始化
            var arr = Object.keys($scope);
            arr.map(
              function (data) {
                if (data.indexOf("Show") != -1) {
                  if ($scope[data] == true) {
                    $scope[data] = false;
                  }
                }
              }
            );
            clear();
          };
          //商品盘赢    提交
          $scope.goodsDiskWin = function () {
            if ($scope.adjustReason &&
              $scope.commodityDiskWinCount &&
              $scope.client.id &&
              $scope.destinationId &&
              $scope.problemDestination &&
              $scope.itemId &&
              $scope.sourceId &&
              $scope.thoseResponsible &&
              $scope.commodityDiskWinModel) {
              var souce = {
                adjustReason: $scope.adjustReason,
                amount: $scope.commodityDiskWinCount,
                clientId: $scope.client.id,
                destinationId: $scope.destinationId,
                problemDestination: $scope.problemDestination,
                itemDataId: $scope.itemId,
                sourceId: $scope.sourceId,
                thoseResponsible: $scope.thoseResponsible,
                inventoryState: $scope.commodityDiskWinModel,
                useNotAfter: $scope.useNotAfter
              };
              inventAdjustToolService.overageGoods(souce, function (data) {
                $scope.errMessage = '';
                $scope.goodsMoveCarts = true;
                $scope.operatingModeTypeClick(1);
                $("#commodityDiskWinDestinationContainerInput").focus();
                $scope.array.push({
                  picture: '',
                  operation: '盘盈',
                  sku: $scope.skuId,
                  goodsName: $scope.itemGlobalName,
                  count: $scope.commodityDiskWinCount,
                  client: $scope.client.name,
                  type: $scope.itemUnitName,
                  time: kendo.format("{0:yyyy-MM-dd HH:mm:ss}", new Date())
                });
                clear();
              }, errMessageFun);
            }
          };
          //商品盘亏 提交
          $scope.goodsInventoryAhortage = function () {
            if ($scope.adjustReason &&
              $scope.commodityInventoriesCount &&
              $scope.problemDestination &&
              $scope.itemDataId &&
              $scope.sourceId &&
              $scope.thoseResponsible
            ) {
              var souce = {
                adjustReason: $scope.adjustReason,
                amount: $scope.commodityInventoriesCount,
                problemDestination: $scope.problemDestination,
                itemDataId: $scope.itemDataId,
                sourceId: $scope.sourceId,
                thoseResponsible: $scope.thoseResponsible
              };
              inventAdjustToolService.lossGoods(souce, function (data) {
                $scope.errMessage = '';
                $scope.goodsMoveCarts = true;
                $("#commodityInventoriesOriginalContainerInput").focus();
                $scope.array.push({
                  picture: '',
                  operation: '盘亏',
                  sku: $scope.skuId,
                  goodsName: $scope.name,
                  count: $scope.commodityInventoriesCount,
                  client: $scope.clientName,
                  type: $scope.itemUnitName,
                  time: kendo.format("{0:yyyy-MM-dd HH:mm:ss}", new Date())
                });
                $scope.orgContainerNameSuccess = $scope.orgContainerName;
                $scope.commodityInventoriesCountSuccess = $scope.commodityInventoriesCount;
                $scope.scanningGoodsNameSuccess = $scope.scanningGoodsName;
                clear();
              }, errMessageFun);
            }
          };
          //5整箱移动
          $scope.moveAll = function () {
            if ($scope.sourceId && $scope.destinationId) {
              var souse = {
                sourceId: $scope.sourceId,
                destinationId: $scope.destinationId
              };
              inventAdjustToolService.getItemData($scope.sourceId, function (datas) {
                $scope.errMessage = '';
                inventAdjustToolService.moveAllGoods(souse, function (data) {
                  datas.map(function (index) {
                    $scope.array.push({
                      picture: '',
                      operation: '整箱移动',
                      sku: index.itemData.skuNo,
                      goodsName: index.itemData.name,
                      count: index.amount,
                      client: index.itemData.client.name,
                      type: index.itemData.itemUnit.name,
                      time: kendo.format("{0:yyyy-MM-dd HH:mm:ss}", new Date())
                    });
                  });
                  $scope.orgContainerNameSuccess = $scope.orgContainerName;
                  $scope.destinationContainerNameSuccess = $scope.destinationContainerName;
                  $scope.sourceId = '';
                  $scope.destinationContainerName = '';
                  $scope.orgContainerName = '';
                  $scope.goodsMoveCarts = true;
                  clear();
                  $("#fclMovingOriginalContainerInput").focus();
                }, errMessageFun);
              }, errMessageFun);

              //  $scope.operatingModeTypeClick(5);

            }
          };
          //修改属性 提交
          $scope.changePermissions = function () {
            if ($scope.adjustReason && $scope.modifycount && $scope.destinationId && $scope.itemDataId && $scope.sourceId && $scope.modifyAttributeModel) {
              var souce = {
                adjustReason: $scope.adjustReason,
                amount: $scope.modifycount,
                destinationId: $scope.destinationId,
                itemDataId: $scope.itemDataId,
                sourceId: $scope.sourceId,
                inventoryState: $scope.modifyAttributeModel
              };
              inventAdjustToolService.adjustUpdateInventoryAttributes(souce, function (data) {
                $scope.errMessage = '';
                $scope.goodsMoveCarts = true;
                $scope.operatingModeTypeClick(4);
                $scope.array.push({
                  picture: '',
                  operation: '修改属性',
                  sku: $scope.skuId,
                  goodsName: $scope.name,
                  count: $scope.commodityCount,
                  client: $scope.clientName,
                  type: $scope.itemUnitName,
                  time: kendo.format("{0:yyyy-MM-dd HH:mm:ss}", new Date())
                });
                $("#commodityInventoriesOriginalContainerInput").focus();
                clear();
              }, errMessageFun);
            }
          };
          //用户选择事件改焦点
          $scope.clientSelect = function () {
            $("#commodityDiskWinModelInput").focus();
            $scope.showType = 'commodityDiskWinModel';
          };

          $scope.modifyAttributeModelSelect = function () {
            $("#modifyAttributeCountInput").focus();
            $scope.modifyAttributeCountShow = true;
          };
          //调整原因选择事件
          $scope.focusShowSelect = function () {
            $('#commodityInventoriesPersonLiableInput').focus();
            $scope['commodityInventoriesPersonLiableShow'] = true;
          };

          $scope.focusShow = function (e, type, model) {
            var keycode = e.keyCode ? e.keyCode : e.which;
            if (keycode == 13) {
              //原始容器请求
              if (model == 'originalContainer') {
                if ($scope.orgContainerName == '') return;
                inventAdjustToolService.orgContainer($scope.orgContainerName, function (data) {
                  $scope.errMessage = '';
                  $scope.originalContainerCount = data.itemDataAmount;
                  $scope.sourceId = data.id;
                  $('#' + type + "Input").focus();
                  $scope[type + 'Show'] = true;
                }, errMessageFun);
                //目的容器
              } else if (model == 'destinationContainer') {
                if ($scope.destinationContainerName == '') return;
                inventAdjustToolService.adjustScanningDestination($scope.sourceId, $scope.itemDataId, $scope.destinationContainerName, function (data) {
                  $scope.errMessage = '';
                  $scope.destinationContainerCount = data.itemDataAmount;
                  $scope.destinationId = data.id;
                  $('#' + type + "Input").focus();
                  $scope[type + 'Show'] = true;
                }, errMessageFun);
              } else if (model == 'checkUser') {
                if ($scope.thoseResponsible == '') return;
                inventAdjustToolService.adjustCheckUser($scope.thoseResponsible, function (data) {
                  $scope.errMessage = '';
                  $('#' + type + "Input").focus();
                  $scope[type + 'Show'] = true;
                }, errMessageFun);
              } else {
                $scope.thoseResponsible = '';
                $('#' + type + "Input").focus();
                $scope[type + 'Show'] = true;
              }
            }
          };

          $scope.modifyAttributeModelClick = function (model) {
            $scope.modifyAttributeModel = model;
            $("#modifyAttributeCountInput").focus();
          };
          $scope.moveCount = function (e) {
            var keycode = window.event ? e.keyCode : e.which;
            if (keycode == 13) {
              if ($scope.commodityCount && $scope.destinationId && $scope.itemDataId && $scope.sourceId) {
                var data = {
                  amount: $scope.commodityCount,
                  destinationId: $scope.destinationId,
                  itemDataId: $scope.itemDataId,
                  sourceId: $scope.sourceId
                };
                inventAdjustToolService.moveGoods(data, function (data) {
                  $scope.errMessage = '';
                  $scope.goodsMoveCarts = true;
                  $scope.array.push({
                    picture: '',
                    operation: '商品移动',
                    sku: $scope.skuId,
                    goodsName: $scope.name,
                    count: $scope.commodityCount,
                    client: $scope.clientName,
                    type: $scope.itemUnitName,
                    time: kendo.format("{0:yyyy-MM-dd HH:mm:ss}", new Date())
                  });
                  $scope.orgContainerNameSuccess = $scope.orgContainerName;
                  $scope.commodityCountSuccess = $scope.commodityCount;
                  $scope.destinationContainerNameSuccess = $scope.destinationContainerName;
                  clear();
                }, errMessageFun);
              }
            }
          };

          //盘盈类型选择
          $scope.commodityDiskWinModelClick = function (model) {
            $scope.commodityDiskWinModel = model;
          };
          $scope.selectTransferRecords = function () {
            $('#inventAdjustId').parent().addClass("windowTitle");
            $scope.inventAdjustWindow.setOptions({
              width: 1000,
              height: 500,
              visible: false,
              actions: false
            });
            $scope.inventAdjustWindow.center();
            $scope.inventAdjustWindow.open();
            $timeout(function () {
              //   $scope.inventAdjustGridOptions = internalToolService.reGrids($scope.array, columns, 350);
              var inventAdjust = $("#inventAdjustGrid").data("kendoGrid");
              inventAdjust.setOptions({
                dataSource: $scope.array,
                height: 350,
                columns: columns
              });
            }, 0);
          };

          $scope.checkDate = function (year, month, day, dateUnits) {
            $scope.useNotAfterTest = year + "-" + pad(month) + "-" + pad(day);
            $scope.manufacture = $scope.useNotAfterTest;
            if ($scope.regular.test($scope.useNotAfterTest)) {
              var date = new Date($scope.useNotAfterTest);
              if ($scope.dateUnit.toLowerCase() == "year") {
                date.setFullYear(date.getFullYear() + (dateUnits || 0));
              } else if ($scope.dateUnit.toLowerCase() == "month") {
                date.setMonth(date.getMonth() + (dateUnits || 0));
              } else if ($scope.dateUnit.toLowerCase() == "day") {
                date.setDate(date.getDate() + (dateUnits || 0));
              }
              $scope.useNotAfter = date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate());
              $scope.validityWindow.close();
            } else {
              $scope.year = "";
              $scope.month = "";
              $scope.day = "";
              $scope.dateUnits = "";
            }
          };

          //补位
          function pad(str) {
            str = str + "";
            var pad = "00";
            return (pad.length > str.length ? pad.substring(0, pad.length - str.length) + str : str);
          }

          var columns = [{
              field: "picture",
              width: 100,
              headerTemplate: "<span translate='PICTURE'></span>"
            },
            {
              field: "operation",
              headerTemplate: "<span translate='操作'></span>"
            },
            {
              field: "sku",
              headerTemplate: "<span translate='SKU'></span>"
            },
            /*    {
                  field: "picture",
                  width: 150,
                  headerTemplate: "<span translate='MS SKU Barcode'></span>"
                },*/
            {
              field: "goodsName",
              width: 200,
              headerTemplate: "<span translate='GOODS_NAME'></span>"
            },
            {
              field: "count",
              headerTemplate: "<span translate='COUNT'></span>"
            },
            {
              field: "type",
              headerTemplate: "<span translate='TYPE'></span>"
            },
            {
              field: "client",
              headerTemplate: "<span translate='CLIENT'></span>"
            },
            {
              field: "time",
              headerTemplate: "<span translate='操作时间'></span>"
            }
          ];

          $scope.adjustReasonSource = [{
              name: "收获错误",
              value: "receiveError"
            },
            {
              name: "上架错误",
              value: "stowError"
            },
            {
              name: "拣货错误",
              value: "pickError"
            }, {
              name: "盘点错误",
              value: "ICQAError"
            },
            {
              name: "其他",
              value: "otherError"
            }
          ];
          //错误方法
          function errMessageFun(data) {
            $scope.errMessage = data.data.message;
          }
          //初始化
          function clear() {
            //几个下拉框初始化
            var combobox = $(adjustReasonId).data("kendoComboBox");
            combobox.value("");
            combobox = $(diskWinAdjustReasonId).data("kendoComboBox");
            combobox.value("");
            combobox = $(adjustReasonModifyAttributeId).data("kendoComboBox");
            combobox.value("");
            combobox = $(clientSelectId).data("kendoComboBox");
            combobox.value("");
            //错误红色div初始化
            $scope.errMessage = '';

            $scope.thoseResponsible = '';
            $scope.problemDestination = '';
            $scope._goodsContent = false;
            $scope.goodsMoveCarts = false;
            $scope.orgContainerName = '';
            $scope.commodityInventoriesCount = '';
            $scope.scanningGoodsName = '';
            $scope.itemId = '';
            $scope.itemGlobalName = '';
            $scope.itemUnitName = '';
            $scope.destinationContainerName = '';
            $scope.destinationContainerCount = '';
            $scope.destinationId = '';
            $scope.skuId = '';
            $scope.commodityName = '';
            $scope.volume = '';
            $scope.weight = '';
            $scope.name = '';
            $scope.itemUnitName = '';
            $scope.clientName = '';
            $scope._goodsContent = '';
            $scope.scanningGoodsCount = '';
            $scope.destinationContainerCount = '';
            $scope.destinationId = '';
            $scope.sourceId = '';
            $scope.itemId = '';
            $scope.orgContainerName = '';
            $scope.commodityCount = '';
            $scope.scanningGoodsName = '';
            var arr = Object.keys($scope);
            arr.map(
              function (data) {
                if (data.indexOf("Show") != -1) {
                  if ($scope[data] == true) {
                    $scope[data] = false;
                  }
                }
              }
            );
          }
        });
    })();