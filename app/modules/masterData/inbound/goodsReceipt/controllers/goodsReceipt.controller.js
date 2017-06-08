/**
 * Created by frank.zhou on 2017/04/25.
 */
(function () {
  'use strict';

  angular.module('myApp').controller("goodsReceiptCtl", function ($scope, $window, commonService, masterService) {

    $window.localStorage["currentItem"] = "goodsReceipt";

    var columns = [
      {field: "grNo", headerTemplate: "<span translate='GR_NO'></span>"},
      {field: "relatedAdvice.adviceNo", template: "<a ui-sref='main.goodsReceiptRead({id:dataItem.id})'>#: relatedAdvice.adviceNo # </a>", headerTemplate: "<span translate='ADVICE_NO'></span>"},
      {field: "receiptDate", headerTemplate: "<span translate='RECEIPT_DATE'></span>"},
      {field: "receiptState", headerTemplate: "<span translate='RECEIPT_STATE'></span>"}
    ];
    $scope.goodsReceiptGridOptions = commonService.gridMushiny({columns: columns, dataSource: masterService.getGridDataSource("goodsReceipt")});

  }).controller("goodsReceiptActivateCtl", function($scope, $state, goodsReceiptService){
    $scope.doActivate = function(){
      goodsReceiptService.activateDN($scope.adviceNo, function(){
        $state.go("main.goods_receipt");
      });
    };
  }).controller("goodsReceiptReadCtl", function ($scope, $state, $stateParams, masterService) {
    // goodsReceiptPosition
    var columns = [
      {field: "stockUnit.itemData.itemNo", width:60, headerTemplate: "<span translate='ITEM_NO'></span>"},
      {field: "stockUnit.itemData.name", width:100, headerTemplate: "<span translate='ITEM_DATA'></span>"},
      {field: "amount", width: 100, headerTemplate: "<span translate='AMOUNT'></span>"},
      {field: "receiptType", width:100, headerTemplate: "<span translate='RECEIPT_TYPE'></span>"},
      {field: "lot", width:60, headerTemplate: "<span translate='LOT'></span>"},
      {field: "state", width:80, headerTemplate: "<span translate='STATE'></span>"}
    ];
    $scope.goodsReceiptPositionGridOptions = {
      selectable: "row",
      height: 300,
      sortable: true,
      scrollable: true,
      pageable: false,
      editable: false,
      columns: columns
    };
    //
    masterService.read("goodsReceipt", $stateParams.id, function(data){
      for(var k in data) $scope[k] = data[k];
      var grid = $("#goodsReceiptPositionGrid").data("kendoGrid");
      grid.setDataSource(new kendo.data.DataSource({data: data.positions}));
    });
  });
})();