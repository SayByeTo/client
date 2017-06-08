/**
 * Created by thoma.bian on 2017/5/10.
 * Updated by frank.zhou on 2017/5/19.
 */

(function () {
  'use strict';

  angular.module('myApp').controller("problemOutboundDetailCtl", function ($scope, $rootScope, $state, problemOutboundService, problemOutboundBaseService) {
    // ============================================================================================================================================
    // 错误弹窗
    $scope.errorWindow = function (options){
      $(options.id).parent().addClass("myWindow");
      var window = options.name;
      window.setOptions({width: options.width || 800, height: options.height || 250, visible: false, actions: ["close"]});
      window.center();
      options.open && window.bind("open", options.open);
      window.open();
    };

    // 扫描框获焦点
    function focusItemNo(){
      $scope.itemNo = "";
      setTimeout(function(){ $("#obp_itemNo").focus();}, 300);
    }

    // shipment信息
    function getOrderDetails(){
      problemOutboundService.getOrderDetails({
        "obpStationId": $rootScope.obpStationId,
        "obpWallId": $rootScope.obpWallId,
        "shipmentNo": $rootScope.shipmentNo,
        "state": "unsolved"
      }, function(datas){
        var grid = $("#outProblemGrid").data("kendoGrid");
        grid.setDataSource(new kendo.data.DataSource({data: datas}));
      });
    }

    // 获取商品明细
    function getOrderGoodsDetails(){
      problemOutboundService.getOrderGoodsDetails($rootScope.shipmentNo, function(datas){
        $scope.orderGoodsDetails = datas;
        var grid = $("#outGoodsProblemGrid").data("kendoGrid");
        grid.setDataSource(new kendo.data.DataSource({data: datas}));
        setGoodsDetailsBackgound(datas);
      });
    }

    // 设置商品明细背景
    function setGoodsDetailsBackgound(datas, gridId){
      gridId == null && (gridId = "outGoodsProblemGrid");
      var grid = $("#"+ gridId).data("kendoGrid");
      datas == null && (datas = grid.dataSource.data());
      for(var i = 0; i < datas.length; i++){
        var data = datas[i], bgColor = "";
        if(data.problemType == "DAMAGED" && data.solveKey == "") bgColor = "#f0ad4e";
        else if(data.amountScaned == data.amount) bgColor = "#c5e0b4";
        else if(data.amountScaned > 0) bgColor = "#deebf7";
        bgColor != "" && grid.tbody.find("tr:eq("+ i+ ")").css("background", bgColor);
      }
    }

    // 检查扫描是否全部完成
    function checkScan(datas){
      for(var i = 0, scaned = true, hasStockUnitZero = false; i < datas.length; i++){
        var data = datas[i];
        if(data.solveKey == "CONFIRM_DAMAGED" && data.stockUnitAmount <= 0){ hasStockUnitZero=true; continue;}
        if(!(data.amountScaned == data.amount && (data.solveKey !=""? ["DAMAGED_TO_NORMAL","HAS_HOT_PICK","ASSIGNED_LOCATION"].indexOf(data.solveKey)>=0: true))){
          scaned = false;
          break;
        }
      }
      // 全部扫描完成
      if(scaned){
        if(hasStockUnitZero){ $scope.clearTheProblem = false; $scope.demolitionDelivery= true;}
        else $scope.orderProcessing = "orderSuccess";
      }
    }

    // 刷新商品明细
    function refreshGoodsDetails(){
      var grid = $("#outGoodsProblemGrid").data("kendoGrid"), source = grid.dataSource;
      var row = source.at($scope.goodsDetailIndex);
      row.amountScaned+1 <= row.amount && row.set("amountScaned", row.amountScaned+1);
      setGoodsDetailsBackgound(source.data()); // 设置背景
      checkScan(source.data()); // 检查扫描完成否
    }

    // 打印订单
    $scope.printOrder = function(){

    };

    // 清除问题处理格
    $scope.clearProblemCell = function(key, callback){
      problemOutboundService.releaseQuestionCell({
        "shipmentNo": $rootScope.shipmentNo,
        "obpStationId": $rootScope.obpStationId,
        "cellName": $rootScope.obpCellName,
        "solveKey": key
      }, function(){
        callback && callback();
      });
    };

    // 返回主页
    $scope.backHome = function(){
      $scope.clearProblemCell("RELEASE_CELL", function(){
        $state.go("main.problemOutboundShipment");
      });
    };

    // 扫描商品
    $scope.scanGoods = function(e){
      var keycode = window.event? e.keyCode: e.which;
      if(keycode != 13) return;
      var grid = $("#outGoodsProblemGrid").data("kendoGrid"), datas = grid.dataSource.data();
      // 判断扫描商品是否存在
      for(var i = 0, targetItem = null; i < datas.length; i++){
        var data = datas[i];
        if(data.itemNo === $scope.itemNo){
          targetItem = data;
          $scope.goodsDetailIndex = i;
          break;
        }
      }
      // 未找到或扫描完成
      if(targetItem == null || targetItem.amountScaned == targetItem.amount) return;
      // 扫描商品序列号
      $scope.goodsDetail = targetItem;
      if(targetItem.serialRecordType === "ALWAYS_RECORD"){
        $scope.operation = "serialNumber";
        $scope.errorWindow({
          id: "#goodsNumberId",
          name: $scope.goodsNumberWindow,
          open: function () {
            $scope.serialNumber = ""; // 初始为空
            $scope.investigated = false;
            setTimeout(function(){ $("#serialNumberId").focus();}, 600);
          }
        });
      }else{
        problemOutboundService.saveGoodsInformation({
          "cellName": $rootScope.obpCellName,
          "shipmentNo": $rootScope.shipmentNo,
          "itemNo": targetItem.itemNo
        }, function(){
          refreshGoodsDetails();
        });
      }
    };

    // 扫描序列号
    $scope.serialNumbers = function (e, item) {
      var keycode = window.event ? e.keyCode : e.which;
      if(keycode != 13) return;
      problemOutboundService.saveGoodsBySN({
        "cellName": $rootScope.obpCellName,
        "shipmentNo": $rootScope.shipmentNo,
        "itemNo": item.itemNo,
        "serialNo": $scope.serialNumber
      }, function(){
        $scope.goodsNumberWindow.close();
        $scope.operation = "checkGoods";
        focusItemNo();
        refreshGoodsDetails();
      });
    };

    // 序列号无法扫描，转为待调查状态
    $scope.investigateTheStatus = function(){
      $scope.goodsInvestigateWindow.close();
      if($scope.goodsDetailClick.lotMandatory){
        var isProduce = ($scope.goodsDetailClick.lotType=="MANUFACTURE");
        $scope.goodDate = (isProduce? 'produce': "maturity");
        $scope.errorWindow({
          id: "#commodityValidId",
          name: $scope.commodityValidWindow,
          height: 400,
          open: function(){
            $scope.produce_year = ""; $scope.produce_month = ""; $scope.produce_day = ""; $scope.obp_months = "";
            $scope.maturity_year = ""; $scope.maturity_month = ""; $scope.maturity_day = "";
            $scope.useNotAfter = "";
            $scope.useNotAfterKey = "TO_BE_INVESTIGATED";
            setTimeout(function(){ $(isProduce? "#produce_year": "#maturity_year").focus();}, 600);
          }
        });
      }else{
        $scope.useNotAfter = "";
        $scope.errorWindow({id: "#investigationCartsId", name: $scope.investigationCartsWindow, open: function() {
          setTimeout(function (){ $("#obp_investigatedCar").focus(); }, 600);
        }});
      }
    };

    // 请扫描待调查车牌
    $scope.investigationCart = function(e){
      var keycode = window.event ? e.keyCode : e.which;
      if(keycode != 13) return;
      problemOutboundService.getInvestigated({
        "itemNo": $scope.goodsDetailClick.itemNo,
        "shipmentNo": $rootScope.shipmentNo,
        "containerName": $scope.investigatedCar,
        "useNotAfter": $scope.useNotAfter,
        "solveKey": "TO_BE_INVESTIGATED"
      }, function(){
        $scope.investigationCartsWindow.close();
        $scope.goodsDetailClick.set("solveKey", "TO_BE_INVESTIGATED");
      }, function(data) {
        if (data.key == "EX_CONTAINER_SKU_DIFFERENT_CLIENT")
          $scope.investErrorKey = "errorClient";
        else if (data.key == "EX_CONTAINER_SKU_DIFFERENT_LOT")
          $scope.investErrorKey = "errorTime";
      });
    };

    // 商品有效期-确认
    $scope.commodityValidSure = function(){
      // 到期日
      var year = 0, month = 0, day = 0;
      var isProduce = ($scope.goodsDetailClick.lotType == "MANUFACTURE");
      year = isProduce ? $scope.produce_year : $scope.maturity_year;
      day = isProduce ? $scope.produce_day : $scope.maturity_day;
      month = parseInt(isProduce ? $scope.produce_month + $scope.obp_months : $scope.maturity_month);
      while (month > 12){ year++; month -= 12;}
      $scope.useNotAfter = year + "-" + problemOutboundBaseService.pad(month) + "-" + problemOutboundBaseService.pad(day);
      $scope.commodityValidWindow.close(); // 有效期/到期日
      //
      if($scope.useNotAfterKey == "TO_BE_INVESTIGATED"){
        $scope.errorWindow({id: "#investigationCartsId", name: $scope.investigationCartsWindow, open: function() {
          setTimeout(function (){ $("#obp_investigatedCar").focus(); }, 600);
        }});
      }else if($scope.useNotAfterKey == "CONFIRM_DAMAGED"){
        $scope.errorWindow({id: "#residualLicensePlateId", name: $scope.residualLicensePlateWindow, height: 300, open: function(){
          setTimeout(function (){ $("#obp_damageCart").focus();}, 600);
        }});
      }
    };

    // 选择数字
    $scope.selectNumber = function(text){

    };

    // 确认残损
    $scope.confirmDamage = function(){
      problemOutboundService.damageConfirm({
        "itemNo": $scope.goodsDetail.itemNo,
        "shipmentNo": $rootScope.shipmentNo,
        "solveKey": "CONFIRM_DAMAGED"
      }, function(){
        $scope.differentValidityPeriod = false;
        $scope.differentClient = false;
        $scope.problemTypeWindow.close();
        $scope.problemTypeScanDoneWindow.close();
        if($scope.goodsDetailClick.lotMandatory){
          var isProduce = ($scope.goodsDetailClick.lotType=="MANUFACTURE");
          $scope.goodDate = (isProduce? 'produce': "maturity");
          $scope.errorWindow({
            id: "#commodityValidId",
            name: $scope.commodityValidWindow,
            height: 400,
            open: function(){
              $scope.produce_year = ""; $scope.produce_month = ""; $scope.produce_day = ""; $scope.obp_months = "";
              $scope.maturity_year = ""; $scope.maturity_month = ""; $scope.maturity_day = "";
              $scope.useNotAfter = "";
              $scope.useNotAfterKey = "CONFIRM_DAMAGED";
              setTimeout(function(){ $(isProduce? "#produce_year": "#maturity_year").focus();}, 600);
            }
          });
        }else{
          $scope.useNotAfter = "";
          $scope.errorWindow({id: "#residualLicensePlateId", name: $scope.residualLicensePlateWindow, height: 300, open: function(){
            setTimeout(function (){ $("#obp_damageCart").focus();}, 600);
          }});
        }
      });
    };

    // 扫描残品车
    $scope.damageCarts = function(e){
      var keycode = window.event ? e.keyCode : e.which;
      if(keycode != 13) return;
      problemOutboundService.damageGoods({
        "cellName": $rootScope.obpCellName,
        "containerName": $scope.damageCart,
        "shipmentNo": $rootScope.shipmentNo,
        "itemNo": $scope.goodsDetail.itemNo,
        "useNotAfter": $scope.useNotAfter
      }, function(){
        $scope.residualLicensePlateWindow.close(); // 残品弹窗
        $scope.goodsDetailClick.set("solveKey", "CONFIRM_DAMAGED");
        var grid = $("#outGoodsProblemGrid").data("kendoGrid"), datas = grid.dataSource.data();
        setGoodsDetailsBackgound(datas); // 设置背景色
        checkScan(datas); // 检查扫描情况
      }, function(data){
        if(data.key == "EX_CONTAINER_SKU_DIFFERENT_LOT"){
          $scope.differentValidityPeriod= true;
          $scope.differentClient= false;
        }else if(data.key == "EX_CONTAINER_SKU_DIFFERENT_CLIENT"){
          $scope.differentValidityPeriod= false;
          $scope.differentClient= true;
        }
      });
    };

    // 商品丢失
    $scope.goodsLost = function(){
      problemOutboundService.damageConfirm({
        "itemNo": $scope.goodsDetail.itemNo,
        "shipmentNo": $rootScope.shipmentNo,
        "solveKey": "GOODS_LOSS"
      }, function(){
        $scope.problemTypeWindow.close();
        $scope.problemTypeNoScanWindow.close();
        $scope.problemTypeScanDoneWindow.close();
        $scope.goodsDetailClick.set("solveKey",  "GOODS_LOSS");
        var grid = $("#outGoodsProblemGrid").data("kendoGrid"), datas = grid.dataSource.data();
        setGoodsDetailsBackgound(datas); // 设置背景色
        checkScan(datas); // 检查扫描情况
      });
    };

    // 商品转为正品
    $scope.goodsToGenuine = function(){
      problemOutboundService.saveGoodsToGenuine({
        "itemNo": $scope.goodsDetail.itemNo,
        "shipmentNo": $rootScope.shipmentNo,
        "solveKey": "DAMAGED_TO_NORMAL"
      },function(){
        $scope.problemTypeWindow.close();
        $scope.goodsDetailClick.set("solveKey", "DAMAGED_TO_NORMAL");
        var grid = $("#outGoodsProblemGrid").data("kendoGrid"), datas = grid.dataSource.data();
        setGoodsDetailsBackgound(datas); // 设置背景色
        checkScan(datas); // 检查扫描情况
      });
    };

    // 生成拣货任务
    $scope.confirmPickingTask =  function(){
      problemOutboundService.generateNewPickingTasks({
        "itemNo": $scope.goodsDetail.itemNo,
        "shipmentNo": $rootScope.shipmentNo,
        "solveKey": "HAS_HOT_PICK"
      }, function(){
        $scope.pickingTaskWindow.close();
        getOrderGoodsDetails();
      });
    };

    // 分配货位取货
    $scope.distributionPickingTask = function(){
      $scope.pickingTaskWindow.close();
      $scope.errorWindow({id: "#confirmDistributionId", name: $scope.confirmDistributionWindow, height: 300});
      var columns = [
        {field: "name", width: 200, headerTemplate: "<span translate='位置'></span>"},
        {field: "amount", width: 100, headerTemplate: "<span translate='数量'></span>"}
      ];
      $scope.confirmDistributionGidOptions = {selectable: "row", scrollable: true, columns: columns, height: 200};
      // 加载数据
      problemOutboundService.getAssignedLocation($scope.goodsDetailClick.itemNo, function(datas){
        var grid = $("#confirmDistributionGrid").data("kendoGrid");
        grid.setDataSource(new kendo.data.DataSource({data: datas}));
      });
    };

    // 分配货位取货--确定
    $scope.confirmDistributionSure = function(){
      var grid = $("#confirmDistributionGrid").data("kendoGrid"), row= grid.select();
      if(!row.length) return;
      var data = grid.dataItem(row[0]);
      problemOutboundService.assignedPicking({
        "itemNo": $scope.goodsDetailClick.itemNo,
        "shipmentNo": $rootScope.shipmentNo,
        "location": data.name,
        "solveKey": "ASSIGNED_LOCATION"
      }, function(){
        $scope.confirmDistributionWindow.close();
        getOrderGoodsDetails();
      });
    };

    // 获取拆单明细
    function getDemolitionDatas(){
      var grid = $("#outGoodsProblemGrid").data("kendoGrid"), datas = grid.dataSource.data();
      for(var i = 0, items = []; i < datas.length; i++){
        var data = datas[i];
        if(data.solveKey == "CONFIRM_DAMAGED" && data.stockUnitAmount <= 0) continue;
        items.push(data);
      }
      return items;
    }

    // 拆单发货
    $scope.demolitionShip = function(){
      $scope.errorWindow({id: "#demolitionGoodsDetailsId", name: $scope.demolitionGoodsDetailsWindow, height: 300});
      // 拆单后商品明细
      var columns = [
        {field: "itemNo", width:150, headerTemplate: "<span translate='商品条码'></span>"},
        {field: "itemName", width:300, headerTemplate: "<span translate='商品名称'></span>"},
        {field: "amount", width: 100, headerTemplate: "<span translate='总数量'></span>"}
      ];
      $scope.demolitionGoodsDetailsGidOptions = {scrollable: true, dataSource: getDemolitionDatas(), columns: columns, height: 200};
    };

    // 拆单发货--确定
    $scope.demolitionGoodsDetailsSure = function(){
      problemOutboundService.demolitionShip({
        "shipmentNo": $rootScope.shipmentNo,
        "solveKey": "DISMANTLE_SHIPMENT"
      }, function(){
        $scope.demolitionGoodsDetailsWindow.close();
      });
    };

    // 删除订单
    $scope.deleteOrder = function(){
      $scope.errorWindow({id: "#demolitionDeleteId", name: $scope.demolitionDeleteWindow, height: 400});
      $scope.demolitionDelete = true;
      $scope.licensePlateNumber = false;
      // 商品明细
      var columns = [
        {field: "itemNo", width:150, headerTemplate: "<span translate='商品条码'></span>"},
        {field: "itemName", width:300, headerTemplate: "<span translate='商品名称'></span>"},
        {field: "amount", width: 100, headerTemplate: "<span translate='总数量'></span>"}
      ];
      $scope.demolitionDeleteGidOptions = {scrollable: true, dataSource: getDemolitionDatas(), columns: columns, height: 200};
    };

    // 删除订单--确认
    $scope.demolitionDeleteSure =  function(){
      problemOutboundService.deleteOrderSuccess({
        "shipmentNo": $rootScope.shipmentNo,
        "solveKey": "OUT_OF_STOCK_DELETE_SHIPMENT"
      }, function(){
        $scope.demolitionDelete = false;
        $scope.licensePlateNumber = true;
        $scope.lpNumber = 'one';
        setTimeout(function(){ $("#obp_plateNumber").focus();}, 300);
      });
    };

    // 扫描车牌
    $scope.plateNumbers = function(e){
      var keycode = window.event ? e.keyCode : e.which;
      if(keycode != 13) return;
      problemOutboundService.deleteOrderScanGoods({
        "shipmentNo": $rootScope.shipmentNo,
        "containerName": $scope.plateNumber,
        "solveKey": "OUT_OF_STOCK_DELETE_SHIPMENT"
      }, function(){
        //$scope.demolitionDeleteWindow.set("title", "请逐一扫描订单内的商品");
        $scope.lpNumber = "";
        $("#obp_plateNumber").css("display", "none");
        $("#obp_scanWinGoods").css("display", "");
        setTimeout(function(){ $("#obp_scanWinGoods").focus();}, 300);
      });
    };

    // 逐一扫描商品
    $scope.scanWindowGoods = function(e){
      var keycode = window.event ? e.keyCode : e.which;
      if(keycode != 13) return;
      var grid = $("#demolitionDeleteGrid").data("kendoGrid"), datas = grid.dataSource.data();
      // 判断扫描商品是否存在
      for(var i = 0, targetItem = null; i < datas.length; i++){
        var data = datas[i];
        if(data.itemNo === $scope.scanWinGoods){ targetItem = data; break;}
      }
      // 未找到或扫描完成
      if(targetItem == null || targetItem.amountScaned == targetItem.amount) return;
      problemOutboundService.deleteOrderScanGoods({
        "shipmentNo": $rootScope.shipmentNo,
        "itemNo": targetItem.itemNo,
        "solveKey": "OUT_OF_STOCK_DELETE_SHIPMENT",
        "useNotAfter": "" // 缺详细计算
      }, function(){
        targetItem.amountScaned+1 <= targetItem.amount && targetItem.set("amountScaned", targetItem.amountScaned+1);
        setGoodsDetailsBackgound(datas, "demolitionDeleteGrid");
        // 扫描完成后关删单窗
      }, function(data){
        if(data.key == "EX_CONTAINER_SKU_DIFFERENT_CLIENT") $scope.lpNumber = "two";
        else if(data.key == "EX_CONTAINER_SKU_DIFFERENT_LOT") $scope.lpNumber = "three";
      });
    };

    // 条码无法扫描
    $scope.barcodeNotScanned = function(){
      $scope.problemTypeWindow.close();
      $scope.problemTypeNoScanWindow.close();
      $scope.problemTypeScanDoneWindow.close();
      $scope.errorWindow({id: "#newPickingId", name: $scope.newPickingWindow, height: 300});
    };

    // 补打条码
    $scope.fillTheBarCode = function(){
      problemOutboundService.markUpBarcode({
        "shipmentNo": $rootScope.shipmentNo,
        "itemNo": $scope.goodsDetailClick.itemNo,
        "solveKey": "PRINT_SKU_REPAIR"
      }, function() {
        $scope.newPickingWindow.close();
        $scope.goodsDetailClick.set("solveKey", "PRINT_SKU_REPAIR");
        var grid = $("#outGoodsProblemGrid").data("kendoGrid"), datas = grid.dataSource.data();
        setGoodsDetailsBackgound(datas); // 设置背景色
        checkScan(datas); // 检查扫描情况
      });
    };

    // =================================================================初始化===================================================================
    $scope.orderProcessing = 'processing';
    $scope.clearTheProblem = true;
    $scope.problemTypeButton = "noScan";
    $scope.operation = "checkGoods";
    focusItemNo();

    // shipment
    var columns = [
      {field: "shipmentNo", headerTemplate: "<span translate='订单号码'></span>"},
      {field: "cell", headerTemplate: "<span translate='问题货格'></span>"},
      {field: "problemType", headerTemplate: "<span translate='问题类型'></span>"},
      {field: "reportBy", headerTemplate: "<span translate='触发人员'></span>"},
      {field: "jobType", headerTemplate: "<span translate='触发环节'></span>"},
      {field: "reportDate", headerTemplate: "<span translate='触发问题时间'></span>"},
      {field: "obpsCreateDate", width:180, headerTemplate: "<span translate='OBPS添加问题时间'></span>"},
      {field: "exSD", headerTemplate: "<span translate='预计发货时间点'></span>"},
      {field: "problemStorageLocation", headerTemplate: "<span translate='触发容器'></span>"},
      {field: "timeCondition", template: "<span>#: timeCondition #</span>", headerTemplate: "<span translate='距离发货时间'></span>"}
    ];
    $scope.outProblemGridOptions = {scrollable: true, columns: columns, height: 60};
    getOrderDetails();

    // 商品明细
    var columnsGoods = [
      {field: "itemNo", width:150, headerTemplate: "<span translate='商品条码'></span>"},
      {field: "itemName", width:300, headerTemplate: "<span translate='商品名称'></span>"},
      {headerTemplate: "<span translate='扫描数/总数'></span>", template: function(item){
        return item.amountScaned + "/"+ item.amount;
      }},
      {field: "amount", headerTemplate: "<span translate='总数量'></span>"},
      {headerTemplate: "<span translate='备注'></span>", template: function(item) {
        var text = "待扫描";
        if (item.problemType == "DAMAGED") {
          if (item.solveKey == "CONFIRM_DAMAGED") text = "<div>已确认残损</div><div>" + (item.stockUnitAmount > 0 ? "生成新拣货任务" : "库存为零") + "</div>";
          else if (item.solveKey == "HAS_HOT_PICK") text = "<div>已生成拣货任务</div>";
          else if (item.solveKey == "ASSIGNED_LOCATION") text = "<div>已分配货位</div>";
          else text = "<div>报残" + item.amountProblem + "件</div>";
          text += (item.amountScaned == item.amount ? "<div>扫描完成</div>" : "");
        } else if (item.problemType == "LOSE") {
          if (item.solveKey == "GOODS_LOSS") text = "<div>生成新拣货任务</div>";
          else if (item.solveKey == "HAS_HOT_PICK") text = "<div>已生成拣货任务</div>";
          else text = "<div>丢失" + item.amountProblem + "件</div>";
          text += (item.amountScaned == item.amount ? "<div>扫描完成</div>" : "");
        } else if (item.problemType == "UNABLE_SCAN_SKU") {
          if (item.solveKey == "PRINT_SKU_REPAIR") text = "<div>条码已补打</div>";
          else text = "条码无法扫描" + item.amountProblem + "件";
          text += (item.amountScaned == item.amount ? "<div>扫描完成</div>" : "");
        } else if (item.problemType == "UNABLE_SCAN_SN"){
          if(item.solveKey == "TO_BE_INVESTIGATED") text = "<div>生成新拣货任务</div>";
          else text = "<div>序列号无法扫描" + item.amountProblem + "件</div>";
          text += (item.amountScaned == item.amount ? "<div>扫描完成</div>" : "");
        }else if(item.amountScaned == item.amount)
          text = "扫描完成";
        else if(item.amountScaned > 0)
          text = "正在扫描";
        return text;
      }}
    ];
    $scope.outGoodsProblemOptions = {scrollable: true, columns: columnsGoods, height: $(document.body).height() - 320};
    // 取数据
    getOrderGoodsDetails();
    // 设置事件
    $("#outGoodsProblemGrid").on("click", "tr", function(){
      var grid = $("#outGoodsProblemGrid").data("kendoGrid"), dataItem = grid.dataItem($(this).closest("tr"));
      $scope.goodsDetail = dataItem;
      $scope.goodsDetailClick = dataItem;
      if(dataItem.solveKey == "GOODS_LOSS" || dataItem.solveKey == "TO_BE_INVESTIGATED")
        $scope.errorWindow({id: "#pickingTaskId", name: $scope.pickingTaskWindow, height: 300});
      else if(dataItem.problemType == "UNABLE_SCAN_SN"){
        $scope.errorWindow({id: "#goodsInvestigate", name: $scope.goodsInvestigateWindow, height: 300});
      }else{
        // 未扫描完成
        if (dataItem.get("amountScaned") != dataItem.get("amount"))
          $scope.errorWindow({id: "#problemTypeNoScanId", name: $scope.problemTypeNoScanWindow, height: 300});
        // 已扫描完成
        else{
          if(dataItem.problemType == "DAMAGED"){
            if(dataItem.solveKey == "CONFIRM_DAMAGED"){
              if(dataItem.stockUnitAmount > 0) $scope.errorWindow({id: "#pickingTaskId", name: $scope.pickingTaskWindow, height: 300});
              //else $scope.errorWindow({id: "#demolitionGoodsDetailsId", name: $scope.demolitionGoodsDetailsWindow, height: 300});
            }else{
              $scope.errorWindow({id: "#problemTypeId", name: $scope.problemTypeWindow, height: 300});
              $scope.orderProcessing = "processing";
            }
          }else
            $scope.errorWindow({id: "#problemTypeScanDoneId", name: $scope.problemTypeScanDoneWindow, height: 300});
        }
      }
    });
  });
})();