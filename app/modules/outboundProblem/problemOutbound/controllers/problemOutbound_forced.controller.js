/**
 * Created by thoma.bian on 2017/5/10.
 */
(function () {
  'use strict';
  angular.module('myApp').controller("problemOutboundForcedCtl", function ($scope, $state, problemOutboundService,problemOutboundBaseService) {

    $scope.forcedDelete = 'ONE';
    $scope.deleteListContent='deleteList';
    $scope.state ="solved";
    $scope.selectTwo = "NG";
    var option = {"startDate":$scope.startDate,"endDate":$scope.startDate,"shipmentNo":$scope.shipmentNo,"state": $scope.state,"obpStationId":$scope.obpStationId,"obpWallId":$scope.obpWallId};
    $("#solvingButtonId").addClass("buttonColorGray");

    $scope.solvingGrid = function(){
      $scope.state = "solving";
      $("#solvingButtonId").removeClass("buttonColorGray");
      $("#deleteButtonId").addClass("buttonColorGray");
      deleteShipment(option);
    };

    $scope.deleteGrid = function(){
      $scope.state = "solved";
      $("#solvingButtonId").addClass("buttonColorGray");
      $("#deleteButtonId").removeClass("buttonColorGray");
      deleteShipment(option);
    };

    function deleteShipment(data){
      problemOutboundService.forcedDeleteGrid(data,function(res){
        var v = res[0];
        $scope.shipmentGoods = [];
        $scope.shipmentNo = v.shipmentNo;
        $scope.container = v.container;
        $scope.container = '00000006AA02';
        if(v.solveShipmentPositions.length>0 && $scope.selectTwo == "OK"){
          $scope.forcedDelete = 'TWO';
          $scope.deleteListSuccess = true;

          $scope.shipmentDate = [{"shipmentNo":v.shipmentNo,"exSD":v.exSD,"timeCondition":v.timeCondition,"container":v.container}];
          for(var i = 0; i < v.solveShipmentPositions.length; i++){
            var goods = v.solveShipmentPositions[i];
            $scope.shipmentGoods.push({"itemNo":goods.itemNo,"itemName":goods.itemName,"amountScaned":goods.amountScaned,"amount":goods.amount,"scaned":goods.scaned,"serialRecordType":goods.serialRecordType,"serialNo":goods.serialNo,"lotMandatory":goods.lotMandatory,"lotType":goods.lotType,"count":goods.count});
          }

          //
          var shipmentDateGrid = $("#shipmentGridId").data("kendoGrid");
          shipmentDateGrid.setDataSource(new kendo.data.DataSource({data: $scope.shipmentDate}));

          //
          var shipmentGoodsGrid = $("#outGoodsProblemGridId").data("kendoGrid");
          shipmentGoodsGrid.setDataSource(new kendo.data.DataSource({data:  $scope.shipmentGoods}));
        }else{
          if( $scope.state == 'solving'){
            $scope.solvingCount = res.length;
          }else{
            $scope.solvedCount = res.length;
          }
          var grid = $("#problemForciblyDeleteListGrid").data("kendoGrid");
          grid.setDataSource(new kendo.data.DataSource({data: res}));
        }
      })
    }

    var columns = [
      {field: "shipmentNo",headerTemplate: "<span translate='订单号码'></span>"},
      {field: "exSD", headerTemplate: "<span translate='预计发货时间'></span>"},
      {field: "solveDate",  headerTemplate: "<span translate='删单时间'></span>"},
      {field: "description", width: 400,headerTemplate: "<span translate='删单原因'></span>"},
      {field: "solveBy",headerTemplate: "<span translate='删单人员'></span>"}];
    $scope.problemForciblyDeleteListGridOptions  = problemOutboundBaseService.grid("", columns,$(document.body).height() - 250);
    deleteShipment(option);

    $scope.deleteListInput = function(e){
      var keycode = window.event ? e.keyCode : e.which;
      if (keycode == 13) {
        $scope.selectTwo = "OK";
        deleteShipment(option);
      }
    };

    //时间搜索
    $scope.dateSearch = function(){
      deleteShipment(option);
    };

    //shipmentN搜索
    $scope.shipmentNoSearch = function(){
      $scope.selectTwo = "OK";
      deleteShipment(option);
    };

    var shipmentColumns = [
      {field: "shipmentNo",headerTemplate: "<span translate='订单号码'></span>"},
      {field: "exSD", headerTemplate: "<span translate='预计发货时间'></span>"},
      {field: "timeCondition",  headerTemplate: "<span translate='距离发货时间'></span>"},
      {field: "container ", headerTemplate: "<span translate='问题车牌'></span>"}];
    $scope.shipmentGridOptions =  problemOutboundBaseService.grid("",shipmentColumns,80);

    var goodsColumns = [
      {field: "number", headerTemplate: "<span translate='编号'></span>"},
      {field: "itemNo", headerTemplate: "<span translate='商品条码'></span>"},
      {field: "itemName", width: 300, headerTemplate: "<span translate='GOODS_NAME'></span>"},
      {field: "amountScaned", headerTemplate: "<span translate='扫描数/总数'></span>"},
      {field: "amount", headerTemplate: "<span translate='总数量'></span>"},
      {field: "scaned", headerTemplate: "<span translate='备注'></span>", template: function (item) {
        var scaned = item.scaned;
        if(scaned == "unscaned"){
          scaned = "待扫描";
        }
        setTimeout(function () {
          var grid = $("#outGoodsProblemGridId").data("kendoGrid");
          grid.tbody.find('tr').each(function () {
            if ($(this).find('td:last-child').text() == "scaned") {
              scaned = "扫描完成";
              $(this).css("background", "#c5e0b4")
            }
            else if ($(this).find('td:last-child').text() == "scaneding") {
              scaned = "正在扫描";
              $(this).css("background", "#deebf7")
            }
          })
        }, 0);
        return scaned;
      }}
    ];
    $scope.outGoodsProblemOptions = problemOutboundBaseService.grid("", goodsColumns,250);

    //删除订单
    $scope.deleteList = function(){
      $("#deleteListId").parent().addClass("myWindow");
      $scope.deleteListWindow.setOptions({
        width: 700,
        height: 270,
        visible: false,
        actions: false
      });
      $scope.deleteListWindow.center();
      $scope.deleteListWindow.open();
    };

    //删除订单确认
    $scope.deleteListSure = function(){
      problemOutboundService.forcedDeleteOrder({"shipmentNo":$scope.shipmentNo,"container":$scope.container,"deleteReason":$scope.deleteReason},function(){
        $scope.deleteListSuccess = false;
        $scope.deleteListWindow.close();
        $scope.deleteListContent = 'problemCar';
      });
    };

    $scope.deleteCars = function(e){
      var keycode = window.event ? e.keyCode : e.which;
      if (keycode == 13) {
        problemOutboundService.putForceDeleteGoodsToContainer({"containerName":$scope.container,"shipmentNo":"","itemNo":"","serialNo":"","useNotAfter":"","amount":""},function(){
          $scope.deleteListContent = 'checkGoodsContent';
        });
      }
    };

    $scope.checkGoodsContents = function(e){
      var keycode = window.event ? e.keyCode : e.which;
      if (keycode == 13) {
        var goodsNumber = 0;
        var grid = $("#outGoodsProblemGridId").data("kendoGrid");
        var datas = grid.dataSource.data();
        for (var i = 0; i < datas.length; i++) {
          var data = datas[i];
          //商品是否存在
          if (data.itemNo == $scope.checkGoodContent) {
            $scope.serialRecordType = grid.dataSource.at(i).get("serialRecordType");
            $scope.serialNo = grid.dataSource.at(i).get("serialNo");
            $scope.lotMandatory = grid.dataSource.at(i).get("lotMandatory");
            $scope.lotType = grid.dataSource.at(i).get("lotType");
            $scope.count =  grid.dataSource.at(i).get("count");
            $scope.amount =  grid.dataSource.at(i).get("amount");
            $scope.itemNo =  grid.dataSource.at(i).get("itemNo");
            $scope.saveGoods = {"containerName":$scope.container,"shipmentNo":$scope.shipmentNo,"serialNo":$scope.serialNo,"itemNo": $scope.itemNo,"useNotAfter":"","amount": $scope.amount};
            if (data.scanAmount == data.amount) {
              return;
            }else {
              goodsNumber++;
            }
          }
        }
        if (datas.length == goodsNumber) {
          return;
        } else {
          if ($scope.serialRecordType == "ALWAYS_RECORD") {
            $scope.errorWindow("#goodsNumberId", $scope.goodsNumberWindow);
          }else if( $scope.lotMandatory == true){
            if($scope.lotType == "EXPIRATION"){
              $scope.goodDate = 'maturity';
            }else{
              $scope.goodDate = 'produce';
            }
            $scope.errorWindow("#commodityValidId", $scope.commodityValidWindow,400);
          }
          else{
            checkSuccess();
          }
        }
      }
    };

    //扫描序列号
    $scope.serialNumbers = function (e) {
      var keycode = window.event ? e.keyCode : e.which;
      if (keycode == 13) {
        if ($scope.serialNumber == $scope.serialNo) {
          checkSuccess();
          $scope.goodsNumberWindow.close();
        }
      }
    };

    function checkSuccess(){
      problemOutboundService.putForceDeleteGoodsToContainer($scope.saveGoods, function () {
        var totalCount = 0, numCount = 0;
        var grid = $("#outGoodsProblemGridId").data("kendoGrid");
        var datas = grid.dataSource.data();
        for (var j = 0; j < datas.length; j++) {
          var data = datas[j];
          if (data.itemNo == $scope.checkGoodContent) {
            var scanAmount = grid.dataSource.at(j).get("amountScaned") + 1;
            $scope.scanNumber = scanAmount + "/" + grid.dataSource.at(j).get("amount");
            grid.dataSource.at(j).set("amountScaned", scanAmount);
            grid.dataSource.at(j).set("scaned", "scaneding");
            //grid.dataSource.read();
            if (data.amountScaned == data.amount) {
              grid.dataSource.at(j).set("scaned", "scaned");
            }
          }
          totalCount += data.amount;
          numCount += data.scanAmount;
        }
        //总数和扫描数相同
        if (numCount == totalCount) {
          $scope.goodMore = true;
        }
      });
    };

    $scope.deleteOrder = function(){
      $scope.forcedDelete = 'ONE';
    };

    function pad(str) {
      str = str + "";
      var pad = "00";
      return (pad.length > str.length ? pad.substring(0, pad.length - str.length) + str : str);
    }

    //日期确定按钮
    $scope.commodityValidSure = function(){
      if($scope.count>0){
        $scope.errorWindow("#goodsCountId", $scope.goodsCountWindow,350);
        setTimeout(function(){ $("#goodsCountPosition").focus();}, 0);
      }else{
        checkSuccess();
      }
      $scope.month = parseInt($scope.months) + parseInt($scope.month || 0);
      if ($scope.month > 12) {
        $scope.year++;
        $scope.month -= 12;
      }
      $scope.useNotAfter = $scope.year + "-" + pad($scope.month) + "-" + pad($scope.day);
      $scope.saveGoods["useNotAfter"] = $scope.useNotAfter;
      $scope.commodityValidWindow.close();

    };

    //数量大于0确定按钮
    $scope.goodsCountSure = function(){
      $scope.goodsCountWindow.close();
      checkSuccess();
    };

    //日期数量点击赋值
    $scope.numberValue = function(v){
      if(  $scope.inputPos == 'year') {
        $("#yearId").val($("#yearId").val() + v);
      }else if ( $scope.inputPos == 'mouth'){
        $("#mouthId").val($("#mouthId").val() + v);
      }else if($scope.inputPos == 'day'){
        $("#dayId").val($("#dayId").val() + v);
      }else if($scope.inputPos == 'mouths'){
        $("#mouths").val($("#mouths").val() + v);
      }else  if( $scope.inputPos == 'count'){
        $("#goodsCountPosition").val($("#goodsCountPosition").val() + v);
      }
    };

    //日期光标位置
    $scope.inputPosition = function(value){
      $scope.inputPos= value;
    };

    //数量光标位置
    $scope.countPosition = function(){
      $scope.inputPos= 'count';
    };

    //清空日期
    $scope.emptyContentData = function(){
      $("#yearId").val("");
      $("#mouthId").val("");
      $("#dayId").val("");
      $("#mouths").val("");
    };

    //清空数量
    $scope.emptyContentCount = function(){
      $("#goodsCountPosition").val("");
    };

    //错误弹窗
    $scope.errorWindow = function (windowId, windowName,height) {
      var heightValue = 250;
      if(height){
        heightValue = height;
      }
      $(windowId).parent().addClass("myWindow");
      windowName.setOptions({
        width:750,
        height: heightValue,
        visible: false,
        actions: false
      });
      windowName.center();
      windowName.open();
    };


  })
})();