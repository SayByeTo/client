/**
 * Created by feiyu.pan on 2017/4/25.
 * Updated by feiyu.pan on 2017/5/31
 */
(function () {
  "use strict";

  angular.module('myApp').controller("deliveryShipmentsDetailCtl",function ($scope,$stateParams,outboundService,deliveryShipmentsDetailService) {
    $scope.checked=false;
    if($stateParams.params!=""){
      var params=angular.fromJson($stateParams.params);
      $scope.searchOption=params.sortCode;//搜索条件
      $scope.startTime=kendo.format("{0:yyyy-MM-dd}",new Date(params.startTime));//开始时间
      $scope.endTime=kendo.format("{0:yyyy-MM-dd}",new Date(params.endTime));//结束时间
      }else{
      $scope.startTime=kendo.format("{0:yyyy-MM-dd}",new Date());
      $scope.endTime=kendo.format("{0:yyyy-MM-dd}",new Date(new Date().setDate(new Date().getDate()+1)));
      $scope.searchOption="";
    }
    //获取所有exSD
    $scope.exSDOptions={
      dataSource:["All",1,2]
    };
    var columns=[
      {field:"date",width:80,headerTemplate:"<span translate='日期'></span>"},
      {field:"exSD",width:80,headerTemplate:"<span translate='ExSD'></span>"},
      {field:"shipmentId",width:100,headerTemplate:"<span translate='Shipment ID'></span>",template:"<a ui-sref='main.shipment_detail({shipment:dataItem.shipmentId})'>#: shipmentId #</a>"},
      {field:"ciperNo",width:80,headerTemplate:"<span translate='笼车号码'></span>",template:"<a ui-sref='main.query_cart({cartName:dataItem.ciperNo})'>#: ciperNo#</a>"},
      {field:"moveTime",width:120,headerTemplate:"<span translate='移包裹时间'></span>",template:function (item) {
        return kendo.format("{0:yyyy/MM/dd hh:mm:ss}",kendo.parseDate(item.moveTime))
      }},
      {field:"operator",width:80,headerTemplate:"<span translate='移包裹人员'></span>"},
      {field:"sortCode",width:110,headerTemplate:"<span translate='Sort Code区域'></span>"},
      {field:"state",width:80,headerTemplate:"<span translate='状态'></span>"}];
    $scope.deliverShipmentsDetailGridOptions=outboundService.reGrids("",columns,$(document.body).height()-203);
    //上面部分搜索
    $scope.determineSearchCriteria=function () {
      $scope.airTime=$scope.startTime;
                    $scope.finishTime=$scope.endTime;
      $scope.searchOption="";
      var dropDownList=$("#exSD").data("kendoDropDownList");
      $scope.exSD=dropDownList.value();
      if($scope.exSD="ALL"){
        $scope.exSD="";
      }
      $scope.search();
    };
    //按照搜索框搜索
    $scope.search=function(){
      deliveryShipmentsDetailService.getDeliveryShipmentsDetailData($scope.startTime,$scope.endTime,$scope.exSD, $scope.checked,$scope.searchOption,function (data) {
        var grid=$("#deliverShipmentsDetailGrid").data("kendoGrid");
        grid.setDataSource(new kendo.data.DataSource({data:data}));
      })
    };
    $scope.search();
  })
})();
