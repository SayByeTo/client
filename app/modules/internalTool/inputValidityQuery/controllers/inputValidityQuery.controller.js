/**
 * Created by zhihan.dong on 2017/04/24.
 * updated by zhihan.dong on 2017/05/04.
 */
(function () {
  'use strict';
  angular.module('myApp').controller("inputValidityQueryCtl", function ($scope, $rootScope, $state, $timeout, commonService, internalToolService, inputValidityQueryService) {
    $scope.skuNo = "";
    var columns = [{
        field: "sku",
        headerTemplate: "<span translate='SKU'></span>"
      },
      {
        field: "itemNo",
        headerTemplate: "<span translate='MS SKU Barcode'></span>"
      },
      {
        field: "itemDateName",
        width: 200,
        headerTemplate: "<span translate='GOODS_NAME'></span>"
      },
      {
        field: "fromStorageLocation",
        headerTemplate: "<span translate='原始容器'></span>"
      },
      {
        field: "amount",
        headerTemplate: "<span translate='数量'></span>"
      },
      {
        field: "fromUseNotAfter",
        headerTemplate: "<span translate='原到期日期'></span>"
      },
      {
        field: "toUseNotAfter",
        headerTemplate: "<span translate='新到期日期'></span>"
      },
      {
        field: "client.name",
        headerTemplate: "<span translate='客户'></span>"
      },
      {
        field: "modifiedBy",
        headerTemplate: "<span translate='操作员'></span>"
      },
      {
        headerTemplate: "<span translate='操作时间'></span>",
        template: function (dataItem) {
          return dataItem.modifiedDate ? kendo.format("{0:yyyy-MM-dd HH:mm:ss}", kendo.parseDate(dataItem.modifiedDate)) : "";
        }
      }
    ];
    $scope.search = function () {
      inputValidityQueryService.getBySearchTerm(function (data) {
        var inputValidityQueryGrid = $("#inputValidityQueryGrid").data("kendoGrid");
        inputValidityQueryGrid.setOptions({
          dataSource: data,
          height: $(document.body).height() - 206,
          columns: columns,
          selectable: "multiple,row",
          change: function () {
            var grid = $("#inputValidityQueryGrid").data("kendoGrid");
            var row = grid.select();
            var item = grid.dataItem(row);
            $scope.popup();
            inputValidityQueryService.getBySearchTerm(function (data) {
              $scope.skuNo = data[0].sku;
              $scope.skuId = data[0].itemNo;
              $scope.skuName = data[0].itemDateName;
              $scope.volume = data[0].width + "*" + data[0].depth + "*" + data[0].height + "mm";
              $scope.weight = data[0].weight + "g";
              var validityChangeRecordGrid = $("#validityChangeRecordGrid").data("kendoGrid");
              validityChangeRecordGrid.setOptions({
                dataSource: data,
                height: $("#validityChangeRecord").height() - 42.5
              });
            }, item.sku);
          }
        });

      }, $scope.term, $scope.startTime, $scope.endTime);
    };
    var validityChangeRecordColumns = [{
        field: "updatedDate",
        headerTemplate: "<span translate='修改时间'></span>",
        template: function (dataItem) {
          return dataItem.updatedDate ? kendo.format("{0:yyyy-MM-dd HH:mm:ss}", kendo.parseDate(dataItem.updatedDate)) : "";
        }
      },
      {
        field: "container",
        headerTemplate: "<span translate='容器'></span>"
      },
      {
        field: "originalDueDate",
        headerTemplate: "<span translate='原到期日期'></span>",
        template: function (dataItem) {
          return dataItem.originalDueDate ? kendo.format("{0:yyyy-MM-dd}", kendo.parseDate(dataItem.originalDueDate)) : "";
        }
      },
      {
        field: "newDueDate",
        headerTemplate: "<span translate='新到期日期'></span>",
        template: function (dataItem) {
          return dataItem.newDueDate ? kendo.format("{0:yyyy-MM-dd}", kendo.parseDate(dataItem.newDueDate)) : "";
        }
      },
      {
        field: "operator",
        headerTemplate: "<span translate='操作人员'></span>"
      },
      {
        field: "updatedDate",
        headerTemplate: "<span translate='使用工具'></span>"
      }
    ];
    $scope.validityChangeRecordOptions = internalToolService.reGrids("", validityChangeRecordColumns);
    $scope.popup = function () {
      $scope.inputValidityQueryWindow.setOptions({
        width: $(document.body).width() * 0.95,
        height: $(document.body).height() * 0.85,
        closable: true
      });
      $scope.inputValidityQueryWindow.center();
      $scope.inputValidityQueryWindow.open();
    };
    $scope.search();
  });
})();