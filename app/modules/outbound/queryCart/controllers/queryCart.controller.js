/**
 * Created by feiyu.pan on 2017/4/24.
 * Updated by feiyu.pan on 2017/5/31
 */
(function () {
  'use strict';
  angular.module("myApp").controller("queryCartCtl",function ($scope,outboundService,$stateParams,queryCartService) {
    $scope.searchOption=$stateParams.cartName;//获取查询信息
    var columns=[
      {field:"sortCode",headerTemplate:"<span translate='Sort Code'></span>"},
      {field:"ciperNo",headerTemplate:"<span translate='笼车号码'></span>",template:"<a ui-sref='main.cart_query_shipment({cartName:dataItem.cartName})'>#:cartName#</a>"},
      {field:"ciperShipmentNum",headerTemplate:"<span translate='笼车内Shipment数量'></span>"},
      {field:"state",headerTemplate:"<span translate='STATE'></span>"}];
    $scope.cartGridOptions=outboundService.reGrids("",columns,$(document.body).height()-158);
    //搜索
    $scope.search=function () {
      if($scope.searchOption!=="") {
        queryCartService.getQueryCartData($scope.searchOption, function (data) {
          var grid = $("#cartGrid").data("kendoGrid");
          grid.setDataSource(new kendo.data.DataSource({data:data}))
        })
      }
    };
    $scope.search()
  })
})();