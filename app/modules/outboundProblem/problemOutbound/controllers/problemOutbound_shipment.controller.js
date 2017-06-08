/**
 * Created by frank.zhou on 2017/5/17.
 */
(function () {
  'use strict';

  angular.module('myApp').controller("problemOutboundShipmentCtl", function ($scope, $rootScope, $state, problemOutboundService, problemOutboundBaseService) {
    // 错误弹窗
    $scope.errorWindow = function (options){
      $(options.id).parent().addClass("myWindow");
      var window = options.name;
      window.setOptions({width: options.width || 800, height: options.height || 250, visible: false, actions: ["close"]});
      window.center();
      options.open && window.bind("open", options.open);
      window.open();
    };

    // 问题拣货商品分配
    $scope.problemPicker = function(){
      $("#assignGoodsTypeId").parent().addClass("windowTitle");
      $scope.assignGoodsTypeWindow.setOptions({width: 800, height: 200, visible: false, actions: ["close"]});
      $scope.assignGoodsTypeWindow.center();
      $scope.assignGoodsTypeWindow.open();
    };

    // 退出
    $scope.exitShipment = function(){
      problemOutboundService.exitShipment($rootScope.obpStationId, function(){
        $state.go("main.outbound_problem_disposal");
      });
    };

    // 生成拣货任务，按照拣货车分配
    $scope.accordingPickingTruckDistribution = function(){
      $state.go("main.problemOutboundPick");
    };

    // 分配到货位，按照拣货商品分配
    $scope.accordingPickingGoodsDistribution = function(){
      $state.go("main.problemOutboundGoods");
    };

    // 待处理问题
    $scope.processProblemMethod = function(){
      $scope.processProblem = true;
      $scope.closeProblem = false;
      $scope.gridId = 'problemOutboundUNScanedGrid';
      $("#processProblemId").removeClass("buttonColorGray");
      $("#closeProblemId").addClass("buttonColorGray");
    };

    // 已处理完成
    $scope.closeProblemMethod = function(){
      $scope.closeProblem = true;
      $scope.processProblem = false;
      $scope.gridId = 'problemOutboundScanedGrid';
      $("#processProblemId").addClass("buttonColorGray");
      $("#closeProblemId").removeClass("buttonColorGray");
    };

    // 搜索
    $scope.questionOrder = function(e){
      var keycode = window.event ? e.keyCode : e.which;
      if(keycode != 13) return;
      $scope.refresh();
    };

    // 查询
    $scope.refresh = function(){
      $rootScope.shipmentNo = $scope.shipmentNo;
      var unScan = ($scope.gridId === "problemOutboundUNScanedGrid"); // 待处理
      problemOutboundService.getShipmentDealProblem({
        "obpStationId": $rootScope.obpStationId,
        "obpWallId": $rootScope.obpWallId,
        "shipmentNo": $scope.shipmentNo || "",
        "state": unScan? "unsolved": "solved"
      }, function(rs){
        if(!rs.length)
          $state.go("main.problemOutboundWall");
        else{
          $scope.shipment = rs[0];
          // 客户删单
          if(rs.length == 1 && rs[0].problemType == "DELETE_ORDER_CUSTOMER"){
            $scope.deleteOrders = "shelvesPlate";
            $scope.errorWindow({
              id:  "#orderHasDeletedId",
              name: $scope.orderHasDeletedWindow,
              height: 360,
              open: function(){
                setTimeout(function(){ $("#obp_deleteOrder").focus();}, 600);
              }
            });
          }
          // 正常
          else{
            $scope[unScan? "unScanLength": "scanLength"] = rs.length;
            // grid数据
            var grid = $("#" + $scope.gridId).data("kendoGrid");
            grid.setDataSource(new kendo.data.DataSource({data: rs}));
          }
        }
      }, function(data){
        if(data.key === "EX_SCANNING_SHIPMENT_IS_NORMAL")
          $scope.errorWindow({id: "#dealWithProblemId", name: $scope.dealWithProblemWindow, height: 300});
        else if(data.key === "EX_SCANNING_SHIPMENT_NOT_BIND_CELL")
          $state.go("main.problemOutboundWall");
      });
    };

    // 设置商品明细背景
    function setGoodsDetailsBackgound(datas){
      var grid = $("#orderDeletedGrid").data("kendoGrid");
      datas == null && (datas = grid.dataSource.data());
      for(var i = 0; i < datas.length; i++){
        var data = datas[i], bgColor = "";
        if(data.amountScaned == data.amount) bgColor = "#c5e0b4";
        else if(data.amountScaned > 0) bgColor = "#deebf7";
        bgColor != "" && grid.tbody.find("tr:eq("+ i+ ")").css("background", bgColor);
      }
    }

    // 检查扫描是否全部完成
    function checkScan(datas){
      for(var i = 0, scaned = true; i < datas.length; i++){
        var data = datas[i];
        if(data.amountScaned != data.amount){
          scaned = false;
          break;
        }
      }
      // 全部扫描完成
      if(scaned) $scope.goodMore = true;
    }

    // 刷新商品明细
    function refreshGoodsDetails(){
      var grid = $("#orderDeletedGrid").data("kendoGrid"), source = grid.dataSource;
      var row = source.at($scope.goodsDetailIndex);
      row.amountScaned+1 <= row.amount && row.set("amountScaned", row.amountScaned+1);
      setGoodsDetailsBackgound(source.data()); // 设置背景
      checkScan(source.data()); // 检查扫描完成否
    }

    // 客户删单-扫上架车牌
    $scope.clientDeleteOrder = function(e, stowContainer){
      var keycode = window.event ? e.keyCode : e.which;
      if (keycode != 13) return;
      $scope.deleteOrder = stowContainer;
      $scope.deleteOrders = 'deleteGoodGrid';
      var columns = [
        {field: "itemNo", width:150, headerTemplate: "<span translate='商品条码'></span>"},
        {field: "itemName", width:300, headerTemplate: "<span translate='商品名称'></span>"},
        {headerTemplate: "<span translate='扫描数/总数'></span>", template: function(item){
          return item.amountScaned + "/"+ item.amount;
        }},
        {field: "amount", headerTemplate: "<span translate='总数量'></span>"},
        {headerTemplate: "<span translate='备注'></span>", template: function(item){
          return item.amountScaned == item.amount? "扫描完成": "待扫描";
        }}
      ];
      $scope.orderDeletedGridGidOptions = {scrollable: true, columns: columns, height: 250};
      // 取明细
      problemOutboundService.getOrderGoodsDetails($scope.shipmentNo, function(datas){
        var grid = $("#orderDeletedGrid").data("kendoGrid");
        grid.setDataSource(new kendo.data.DataSource({data: datas}));
        setGoodsDetailsBackgound(datas);
        $("#obp_deleteOrderGrid").focus();
      });
    };

    // 逐一扫商品
    $scope.orderDeleteGrid = function(e){
      var keycode = window.event ? e.keyCode : e.which;
      if (keycode != 13) return;
      var grid = $("#orderDeletedGrid").data("kendoGrid"), datas = grid.dataSource.data();
      // 判断扫描商品是否存在
      for(var i = 0, targetItem = null; i < datas.length; i++){
        var data = datas[i];
        if(data.itemNo === $scope.deleteOrderGrid){
          targetItem = data;
          $scope.goodsDetailIndex = i;
          break;
        }
      }
      // 未找到或扫描完成
      if(targetItem == null || targetItem.amountScaned == targetItem.amount) return;
      $scope.goodsDetail = targetItem;
      if(targetItem.lotMandatory) $scope.openLotWin();
      else if(targetItem.serialRecordType === "ALWAYS_RECORD") $scope.openSerialWin();
      else $scope.scanGoods();
    };

    // 商品有效期
    $scope.openLotWin = function(){
      var targetItem = $scope.goodsDetail, isProduce = (targetItem.lotType=="MANUFACTURE");
      $scope.goodDate = (isProduce? 'produce': "maturity");
      $scope.errorWindow({
        id: "#commodityValidId",
        name: $scope.commodityValidWindow,
        height: 400,
        open: function(){
          $scope.produce_year = ""; $scope.produce_month = ""; $scope.produce_day = ""; $scope.obp_months = "";
          $scope.maturity_year = ""; $scope.maturity_month = ""; $scope.maturity_day = "";
          $scope.useNotAfter = "";
          setTimeout(function(){ $(isProduce? "#produce_year": "#maturity_year").focus();}, 600);
        }
      });
    };

    // 商品有效期-确认
    $scope.commodityValidSure = function(){
      // 到期日
      var year = 0, month = 0, day = 0;
      var isProduce = ($scope.goodsDetail.lotType == "MANUFACTURE");
      year = isProduce ? $scope.produce_year : $scope.maturity_year;
      day = isProduce ? $scope.produce_day : $scope.maturity_day;
      month = parseInt(isProduce ? $scope.produce_month + $scope.obp_months : $scope.maturity_month);
      while (month > 12){ year++; month -= 12;}
      $scope.useNotAfter = year + "-" + problemOutboundBaseService.pad(month) + "-" + problemOutboundBaseService.pad(day);
      $scope.commodityValidWindow.close(); // 有效期/到期日
      //
      if($scope.goodsDetail.serialRecordType === "ALWAYS_RECORD") $scope.openSerialWin();
      else $scope.scanGoods();
    };

    // 序列号
    $scope.openSerialWin = function(){
      $scope.errorWindow({
        id: "#goodsNumberId",
        name: $scope.goodsNumberWindow,
        open: function () {
          $scope.serialNumber = ""; // 初始为空
          setTimeout(function(){ $("#serialNumberId").focus();}, 600);
        }
      });
    };

    // 扫描序列号
    $scope.serialNumbers = function (e) {
      var keycode = window.event ? e.keyCode : e.which;
      if(keycode != 13) return;
      $scope.goodsNumberWindow.close();
      $scope.scanGoods();
    };

    // 扫描商品
    $scope.scanGoods = function(){
      problemOutboundService.moveShelvesLicensePlate({
        "containerName": $scope.deleteOrder,
        "shipmentNo": $scope.shipmentNo,
        "itemNo": $scope.goodsDetail.itemNo,
        "serialNo": $scope.serialNumber || "",
        "useNotAfter": $scope.useNotAfter || "",
        "solveKey": "DELETE_ORDER_CUSTOMER"
      }, function(){
        $scope.serialNumber = ""; $scope.useNotAfter = "";
        refreshGoodsDetails();
      });
    };

    // 进行问题处理确认
    $scope.dealWithProblemSure = function(){
      problemOutboundService.dealWithProblem(function(){
        $scope.dealWithProblemWindow.close();
        $state.go("main.problemOutboundWall");
      });
    };

    // ==============================================================初始化====================================================================
    $scope.processProblemMethod();
    setTimeout(function(){ $("#obp_shipment").focus();}, 0);
    $scope.shipmentNo = "";
    // 待处理问题
    var columnsLeft = [
      {field: "shipmentNo", headerTemplate: "<span translate='Shipment ID'></span>"},
      {field: "cell", headerTemplate: "<span translate='问题货格'></span>"},
      {field: "problemType", headerTemplate: "<span translate='问题类型'></span>"},
      {field: "reportBy", headerTemplate: "<span translate='触发人员'></span>"},
      {field: "jobType", headerTemplate: "<span translate='触发环节'></span>"},
      {field: "reportDate", headerTemplate: "<span translate='触发问题时间'></span>"},
      {field: "obpsCreateDate", headerTemplate: "<span translate='OBPS添加问题时间'></span>"},
      {field: "exSD", headerTemplate: "<span translate='预计发货时间点'></span>"},
      {field: "timeCondition", headerTemplate: "<span translate='距离发货时间'></span>"}
      //{field: "", headerTemplate: "<span translate='打印'></span>", command: { text: "打印订单", click: printOrder }}
    ];
    $scope.problemSolvingOrderNumberGridOptions = {height: $rootScope.mainHeight- 83, scrollable: true, columns: columnsLeft};
    // 已处理完成
    var columnsRight = [
      {field: "shipmentNo", headerTemplate: "<span translate='Shipment ID'></span>"},
      {field: "cell", headerTemplate: "<span translate='问题货格'></span>"},
      {field: "problemType", headerTemplate: "<span translate='问题类型'></span>"},
      {field: "reportBy", headerTemplate: "<span translate='触发人员'></span>"},
      {field: "jobType", headerTemplate: "<span translate='触发环节'></span>"},
      {field: "reportDate", headerTemplate: "<span translate='触发问题时间'></span>"},
      {field: "obpsCreateDate", headerTemplate: "<span translate='OBPS添加问题时间'></span>"},
      {field: "exSD", headerTemplate: "<span translate='OBPS处理时间'></span>"}
      //{field: "", headerTemplate: "<span translate='打印'></span>",command: { text: "打印订单", click: printOrder }},
      //{field: "", headerTemplate: "<button  ng-click='allSendToPacking()'>全部送至包装</button>", command: { text: "送去包装", click: printOrder }}
    ];
    $scope.completedProcessingGridOptions = {height: $rootScope.mainHeight- 83, scrollable: true, columns: columnsRight};
  });
})();