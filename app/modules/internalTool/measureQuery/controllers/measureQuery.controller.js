/**
 * Created by zhihan.dong on 2017/04/24.
 * updated by zhihan.dong on 2017/05/04.
 */
(function () {
    'use strict';
    angular.module('myApp').controller("measureQueryCtl", function ($scope, $rootScope, $state, commonService, internalToolService, measureQueryService) {

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

            headerTemplate: "<span translate='原尺寸长*宽*高（mm）'></span>",
            template: function (item) {
              return "<span>" + item.fromWidth + "*" + item.fromDepth + "*" + item.fromHeight + "</span>";
            }
          },
          {
            field: "fromWeight",
            headerTemplate: "<span translate='原重量（g）'></span>"
          },
          {
            headerTemplate: "<span translate='新尺寸长*宽*高（mm）'></span>",
            template: function (item) {
              return "<span>" + item.toWidth + "*" + item.toDepth + "*" + item.toHeight + "</span>";
            }
          },
          {
            field: "toWeight",
            headerTemplate: "<span translate='新重量（g）'></span>"
          },
          {
            field: "client.name",
            headerTemplate: "<span translate='CLIENT'></span>"
          },
          {
            field: "modifiedBy",
            headerTemplate: "<span translate='OPERATOR'></span>"
          },
          {
            headerTemplate: "<span translate='操作时间'></span>",
               template: function (dataItem) {
          return dataItem.modifiedDate ? kendo.format("{0:yyyy-MM-dd HH:mm:ss}", kendo.parseDate(dataItem.modifiedDate)) : "";
        }
          }
        ];



        //查询
        function searchs() {

          measureQueryService.getMeasureQuery(function (data) {
              var measureQueryGrid = $("#measureQueryGrid").data("kendoGrid");
              measureQueryGrid.setOptions({
                  dataSource: data,
                  height: $(document.body).height() - 206,
                  columns: columns,
                  selectable: "multiple,row",
                  change: function () {
                    var grid = $("#measureQueryGrid").data("kendoGrid");
                    var row = grid.select();
                    var item = grid.dataItem(row);
                    $scope.popup();
                    measureQueryService.getMeasureQuery(function (data) {
                      $scope.skuNo = data[0].skuNo;
                      $scope.skuId = data[0].skuId;
                      $scope.skuName = data[0].skuName;
                      $scope.volume = data[0].depth + "*" + data[0].width + "*" + data[0].height + "mm";
                      $scope.weight = data[0].weight + "g";
                      //measureQueryService.getSizeChangeRecordGrid(item.skuNo, function (data) {
                      var validityChangeRecordGrid = $("#sizeChangeRecordGrid").data("kendoGrid");
                      validityChangeRecordGrid.setOptions({
                        dataSource: data,
                        height: $("#sizeChangeRecord").height() - 42.5
                      });
                      //});
                    }, item.itemNo);

                  }
                });
              }, $scope.term, $scope.startTime, $scope.endTime);
          }


          $scope.search = function () {
            searchs();
          };
          $scope.search();
          var sizeChangeRecordColumns = [{
              field: "updatedDate",
              headerTemplate: "<span translate='修改时间'></span>",
              //  template: function (dataItem) {
              //    return dataItem.updatedDate ? kendo.format("{0:yyyy-MM-dd HH:mm:ss}", kendo.parseDate(dataItem.updatedDate)) : "";
              //   }
            },
            {
              field: "toDepth",
              headerTemplate: "<span translate='LENGTH'></span><sapn>(mm)</sapn>"
            },
            {
              field: "toWidth",
              headerTemplate: "<span translate='WIDTH'></span><sapn>(mm)</sapn>"
            },
            {
              field: "toHeight",
              headerTemplate: "<span translate='HEIGHT'></span><sapn>(mm)</sapn>"
            },
            {
              field: "volume",
              headerTemplate: "<span translate='VOLUME'></span><sapn>(mm3)</sapn>",
              template: function (item) {
                return "<span>" + item.toWidth * item.toDepth * tiem.toHeight + "</span>";
              }
            },
            {
              field: "toWeight",
              headerTemplate: "<span translate='WEIGHT'></span><span>(g)</span>"
            },
            {
              field: "operator",
              headerTemplate: "<span translate='OPERATOR'></span>"
            },
            {
              field: "warehouse",
              headerTemplate: "<span translate='WAREHOUSE'></span>"
            }
          ];

          $scope.sizeChangeRecordOptions = internalToolService.reGrids("", sizeChangeRecordColumns);

          $scope.popup = function () {
            $scope.measureQueryWindow.setOptions({
              width: $(document.body).width() * 0.95,
              height: $(document.body).height() * 0.85,
              closable: true
            });
            $scope.measureQueryWindow.center();
            $scope.measureQueryWindow.open();
          };
        });
    })();