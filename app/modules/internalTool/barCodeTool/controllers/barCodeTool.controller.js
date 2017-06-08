/**
 * Created by zhihan.dong on 2017/04/24.
 * updated by zhihan.dong on 2017/05/04.
 */
(function () {
  'use strict';
  angular.module('myApp').controller("barCodeToolCtl", function ($scope, $rootScope, $state, $timeout, commonService, barCodeToolService, internalToolService) {
    $scope._goodsContent = false;
    $scope.barCodeSku = false;
    $scope.continueGoods = false;
    $scope.goodsBarCode = function (e) {
      var keycode = window.event ? e.keyCode : e.which;
      if (keycode == 13) {
        barCodeToolService.barcodeScanningSKU($scope.goodName, function (data) {

          $scope.barCodeSku = true;
          $scope.goodsBarCodeShow = true;

          var grid = $("#barCodeProductsGrid").data("kendoGrid");
          grid.setOptions({
            dataSource: data,
            columns: barCodeColumns,
            selectable: "multiple,row"
          });

          grid.bind("change", function () {
            var grid = $("#barCodeProductsGrid").data("kendoGrid");
            var row = grid.select();
            var item = grid.dataItem(row);
            $scope._goodsContent = true;
            $scope.skuId = item.skuNo;
            $scope.itemNo = item.itemNo;
            $scope.goodName = item.name;
            $scope.width = item.width;
            $scope.depth = item.depth;
            $scope.height = item.height;
            $scope.weigth = item.weigth;
            $timeout(function () {
              $scope.barCodeProductsWindow.close();
            }, 0);
          });
          /*          $scope.barCodeProductsGridOptions = {
                      dataSource: data,
                      columns: barCodeColumns,
                      editable: "inline",
                      change: function () {
                        var grid = $("#barCodeProductsGrid").data("kendoGrid");
                        var row = grid.select();
                        var item = grid.dataItem(row);
                        $scope.skuId = item.skuNo;
                      }
                    };*/

          $('#barCodeProductsId').parent().addClass("windowTitle");
          $scope.barCodeProductsWindow.setOptions({
            width: 1200,
            height: 500,
            visible: false,
            actions: false
          });
          $scope.barCodeProductsWindow.center();
          $scope.barCodeProductsWindow.open();


        });

      }
    };
    $scope.skuIdClick = function () {
      $("#printQuantityInput").focus();
      $scope.skuIdShow = true;
    };
    var barCodeColumns = [
      /*{
              field: "picture",
              headerTemplate: "<span translate='PICTURE'></span>"
            },*/
      {
        field: "itemNo",
        headerTemplate: "<span translate='SKU'></span>"
      },
      {
        field: "skuNo",
        headerTemplate: "<span translate='SKU	MS SKU Barcode'></span>"
      },
      /*      {
              field: "client",
              headerTemplate: "<span translate='CLIENT'></span>"
            },*/
      {
        field: "name",
        headerTemplate: "<span translate='GOODS_NAME'></span>"
      }
    ];


    $scope.barCodeProductsSure = function () {
      $scope.barCodeProductsWindow.close();
      $scope._goodsContent = true;
      $scope.barCodeSku = true;
    };

    $scope.numberOfPrints = function (e) {
      var keycode = window.event ? e.keyCode : e.which;
      if (keycode == 13) {
        $scope.continueGoods = true;
      }
    };

    $scope.nextGoods = function () {
      $scope._goodsContent = false;
      $scope.barCodeSku = false;
      $scope.continueGoods = false;
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
    };

    $scope.selectTransferRecords = function () {
      $('#barCodeId').parent().addClass("windowTitle");
      $scope.barCodeWindow.setOptions({
        width: 1000,
        height: 500,
        visible: false,
        actions: false
      });
      $scope.moveGoodsSelectGridOptions = internalToolService.reGrids($scope.arr, columns);
      console.dir( $scope.moveGoodsSelectGridOptions);
      $scope.barCodeWindow.center();
      $scope.barCodeWindow.open();
    };

    var columns = [{
        field: "picture",
        width: 100,
        headerTemplate: "<span translate='PICTURE'></span>"
      },
      {
        field: "sku",
        headerTemplate: "<span translate='SKU'></span>"
      },
      {
        field: "picture",
        width: 150,
        headerTemplate: "<span translate='SKU Print ID'></span>"
      },
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
  });
})();