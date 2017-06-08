/**
 * Created by feiyu.pan on 2017/4/24.
 * Updated by feiyu.pan on 2017/5/31
 */
(function () {
  'use strict';
  
  angular.module("myApp").controller("cartQueryShipmentCtl",function ($scope,outboundService,$stateParams,cartQueryShipmentService) {
    $scope.searchOption=$stateParams.cartName;//获取查询的小车名称
    var columns=[
      {field:"sortCode",headerTemplate:"<span translate='Sort Code'></span>"},
      {field:"shipmentId",headerTemplate:"<span translate='shipment ID'></span>",template:"<a ui-sref='main.shipment_detail({shipment:dataItem.shipment})'>#:shipment#</a>"},
      {field:"movePackageDate",headerTemplate:"<span translate='移包裹时间'></span>"}];
    $scope.cartShipmentGridOptions=outboundService.reGrids("",columns,$(document.body).height()-158);
    //搜索
    $scope.search=function () {
      if($scope.searchOption!=="") {
        cartQueryShipmentService.getCartQueryShipmentData($scope.searchOption, function (data) {
          var grid = $("#cartShipmentGrid").data("kendoGrid");
          grid.setDataSource(new kendo.data.DataSource({data:data}))
        })
      }
    };
    $scope.search()
  })
})();