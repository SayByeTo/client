/**
 * Created by bian on 2016/12/5.
 */
(function () {
  'use strict';
  angular.module('myApp').controller("measureToolCtl", function ($scope, $rootScope, $state, $timeout, commonService, measureService) {
    $scope.sourceErr = '';
    $scope.goodsErr = '';
    var arr = [];
    $timeout(function () {
      $("#sourceId").focus();
    }, 100);
//扫描原始容器
    $scope.sources = function (e) {
      var keycode = window.event ? e.keyCode : e.which;
      if (keycode == 13) {
        measureService.scanningSource($scope.source, function (data) {
          $timeout(function () {
            $("#itemNoId").focus();
          }, 100);
          $scope.sourceId = data.id;
          $scope.sourceErr = '';
          $scope.errMessage = "";
        }, function (data) {
          $scope.goodsErr = 'err';
          $scope.errMessage = data.message;
          $scope.source = "";
          $timeout(function () {
            $("#sourceId").focus();
          }, 100);
        });
      }
    };

    $scope.itemNos = function (e) {
      var keycode = window.event ? e.keyCode : e.which;

      if (keycode == 13) {
        measureService.scanningItemData($scope.itemNo, $scope.sourceId, function (data) {
          $scope.goodName = data.name;
          $scope.itemNOk = $scope.itemNo;
          $scope.itemId = data.itemData.id;
          $scope.itemUnitName = data.itemData.itemUnit.name;
          $timeout(function () {
            $("#widthId").focus();
          }, 100);
          $scope.goodsErr = '';
          $scope.errMessage = "";
        }, function (data) {
          $scope.errMessage = data.message;
          $scope.goodsErr = 'err';
          $scope.itemNo = "";
          $timeout(function () {
            $("#itemNoId").focus();
          }, 100);
        });

      }
    };


    $scope.widths = function (e) {
      var keycode = window.event ? e.keyCode : e.which;
      if (keycode == 13) {
        $timeout(function () {
          $("#depthId").focus();
        }, 100);
      }
    };

    $scope.depths = function (e) {
      var keycode = window.event ? e.keyCode : e.which;
      if (keycode == 13) {
        $timeout(function () {
          $("#heightId").focus();
        }, 100);
      }
    };

    $scope.heights = function (e) {
      var keycode = window.event ? e.keyCode : e.which;
      if (keycode == 13) {
        $timeout(function () {
          $("#weightId").focus();
        }, 100);
      }
    };

    $scope.weights = function (e) {
      var keycode = window.event ? e.keyCode : e.which;
      if (keycode == 13) {
        $timeout(function () {
          $("#destinationId").focus();
        }, 100);
      }
    };

    $scope.destinations = function (e) {
      var keycode = window.event ? e.keyCode : e.which;
      if (keycode == 13) {
        measureService.scanningDestination($scope.sourceId, $scope.itemId, $scope.destination, function (data) {
          $scope.errMessage = "";
          measureService.saveMeasure({
            sourceId: $scope.sourceId,
            itemDataId: $scope.itemId,
            width: $scope.width,
            depth: $scope.depth,
            height: $scope.height,
            weight: $scope.weight,
            destinationId: data.id
          }, function (data) {
            var date = new Date();
            arr.push({
              itemNo: $scope.itemNOk,
              width: $scope.width,
              depth: $scope.depth,
              height: $scope.height,
              weight: $scope.weight,
              name: $scope.goodName,
              itemUnitName: $scope.itemUnitName,
              operatingTime: kendo.format("{0:yyyy-MM-dd HH:mm:ss}", date)
            });
            $timeout(function () {
              $("#sourceId").focus();
            }, 100);
            $scope.source = "";
            $scope.itemNo = "";
            $scope.width = "";
            $scope.depth = "";
            $scope.height = "";
            $scope.weight = "";
            $scope.destination = "";
            $('#saveMeasureId').parent().addClass("windowTitle");
            $scope.measureSaveWindow.setOptions({
              width: 600,
              height: 150,
              visible: false,
              actions: false
            });
            $scope.measureSaveWindow.center();
            $scope.measureSaveWindow.open();
          }, function (data) {
            $scope.goodsErr = 'err';
            $scope.errMessage = data.message;
            $scope.destination = "";
          });
        }, function (data) {
          $scope.goodsErr = 'err';
          $scope.errMessage = data.message;
          $scope.destination = "";
        });
      }
    };

    $scope.saveMeasureSure = function () {
      $scope.measureSaveWindow.close();
    };

    var columns = [
      // {field: "picture", width:100, headerTemplate: "<span translate='PICTURE'></span>"},
      {
        field: "itemNo",
        width: 80,
        headerTemplate: "<span translate='SKU'></span>"
      },
      {
        field: "width",
        width: 30,
        headerTemplate: "<span translate='LENGTH'></span><span>(mm)</span>"
      },
      {
        field: "depth",
        width: 30,
        headerTemplate: "<span translate='WIDTH'></span><span>(mm)</span>"
      },
      {
        field: "height",
        width: 30,
        headerTemplate: "<span translate='HEIGHT'></span><span>(mm)</span>"
      },
      {
        field: "weight",
        width: 30,
        headerTemplate: "<span translate='WEIGHT'></span><span>(g)</span>"
      },
      {
        field: "name",
        width: 250,
        headerTemplate: "<span translate='GOODS_NAME'></span>",
        attributes: {
          style: "text-align:left"
        }
      },
      // {field: "count",width:"80px",headerTemplate: "<span translate='COUNT'></span>" },
      {
        field: "itemUnitName",
        width: 30,
        headerTemplate: "<span translate='HANDING_UNIT'></span>"
      },
      {
        field: "operatingTime",
        width: 80,
        headerTemplate: "<span translate='操作时间'></span>"
      }
    ];


    $scope.selectTransferRecords = function () {
      var width = 1200,
        height = 500;
      var url = "modules/internalTool/base/templates/readInWindow.html";
      commonService.dialogMushiny($scope.window, {
        title: "查看测量记录", //"<span>"+ $translate.instant("READ_"+ options.title)+ "</span>",
        width: width,
        height: height,
        url: url,
        open: function () {
          $rootScope.readGridOptions = {
            selectable: "row",
            dataSource: arr,
            height: 385,
            sortable: true,
            columns: columns
          };
          $("#mushinyWindow_wnd_title").css("font-size", "25px");
          $("#mushinyWindow_wnd_title").css("text-align", "center");
          $("#mushinyWindow_wnd_title").parent().css("z-index", "99");
          $("#mushinyWindow_wnd_title").parent().css("height", "30px");
        }
      });
    };
  });
})();