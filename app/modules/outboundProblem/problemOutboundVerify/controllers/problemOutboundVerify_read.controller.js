/**
 * Created by thoma.bian on 2017/5/10.
 */
(function(){
  "use strict";

  angular.module('myApp').controller("problemOutboundVerifyReadCtl", function ($scope, $state, $window, $stateParams, outboundProblemVerifyService, problemOutboundBaseService) {

    $scope.content='cargoRecordNumber';
    $scope.products = false;
    $scope.errorCargoSpace = false;
    $scope.cargoRecordPage = 'recordNumber';
    $("#allOutboundCargoSpaceId").addClass("buttonColorGray");
    $("#notOutboundSelectCargoSpaceId").removeClass("buttonColorGray");

    $scope.backProblemOutboundVerify = function () {
      $state.go("main.outbound_problem_verify");
    };

   //Rebin车记录
    var carColumns=[{field: "id", width:"50px", headerTemplate: "<span translate='序号'></span>"},
      {field: "wall",headerTemplate: "<span translate='Rebin车牌'></span>"},
      {field: "cell",  headerTemplate: "<span translate='Rebin格'></span>"},
      {field: "amount", headerTemplate: "<span translate='问题商品数量'></span>"},
      {field: "rebinAmount", headerTemplate: "<span translate='Rebin格商品总数'></span>"}];
    $scope.rebinCarRecordsGridOptions  = problemOutboundBaseService.grid("", carColumns, $(document.body).height() - 210-250);

    //显示所有货位
    $scope.allCargoSpaces = function () {
      $scope.argoRecordGridShow = "allCargoSpacePage";
      $("#allOutboundCargoSpaceId").removeClass("buttonColorGray");
      $("#notOutboundSelectCargoSpaceId").addClass("buttonColorGray");
      var cargoRecordGridOptions = $("#cargoOutboundRecordGrid").data("kendoGrid");
      cargoRecordGridOptions.setDataSource(new kendo.data.DataSource({data: $scope.allData}));
    };

    //显示未查货位
    $scope.notSelectCargoSpaces = function () {
      $scope.argoRecordGridShow = "notSelectCargoSpacePage";
      $("#allOutboundCargoSpaceId").addClass("buttonColorGray");
      $("#notOutboundSelectCargoSpaceId").removeClass("buttonColorGray");
      var cargoRecordGridOptions = $("#cargoOutboundRecordGrid").data("kendoGrid");
      cargoRecordGridOptions.setDataSource(new kendo.data.DataSource({data: $scope.selectData}));
    };

   //显示商品信息
    outboundProblemVerifyService.findOutboundProblem($stateParams.id,function(data){
      $scope.problemType = data.problemType;
      $scope.rowData = data;
      if ($scope.problemType == "MORE") {
        $scope.problemTypeValue = "多货";
        $scope.location='more';
      } else {
        $scope.problemTypeValue = "少货";
        $scope.location='less';
      }
      $scope.outboundProblemId = data.id;
      $scope.jobType = data.jobType;
      $scope.solveAmount = data.solveAmount;
      $scope.amount = data.amount - $scope.solveAmount;
      $scope.problemStoragelocation = data.problemStoragelocation;

      outboundProblemVerifyService.getGoodsInformation(data.id, function (data) {
        $scope.skuData = data.lotMandatory;
        for (var k in data) $scope[k] = data[k];
      });

      //Rebin车记录
      outboundProblemVerifyService.getRebinCarRecords($scope.problemStoragelocation,function(data) {
        var rebinCarRecords = $("#rebinCarRecordsGrid").data("kendoGrid");
        rebinCarRecords.setDataSource(new kendo.data.DataSource({data: data}));
      });

      //拣货货位记录
      var recordColumns = [{field: "id", width: "50px", headerTemplate: "<span translate='序号'></span>"},
        {field: "name", width: 180, headerTemplate: "<span translate='上架货位历史'></span>"},
        {field: "amount", headerTemplate: "<span translate='问题商品上架数量'></span>"},
        {field: "actualAmount", headerTemplate: "<span translate='货位问题商品剩余数量'></span>"},
        {field: "totalAmount", headerTemplate: "<span translate='货位商品总数'></span>"},
        {field: "clientName", headerTemplate: "<span translate='CLIENT'></span>"},
        {field: "unexamined", headerTemplate: "<span translate='unexamined'></span>",
          template: function (item) {
            var unexamined = item.unexamined;
            var htmlStr = "<div>" + unexamined + "</div>";
            setTimeout(function () {
              var cargoRecordGridOptions = $("#cargoOutboundRecordGrid").data("kendoGrid");
              cargoRecordGridOptions.tbody.find("tr").each(function () {
                var td = $(this).find("td:last-child");
                if (td.text() == "NG") {
                  $(this).css("background", "#92D050");
                }
                cargoRecordGridOptions.hideColumn("unexamined");
              }, 0)

            });
            return htmlStr;
          }
        }
      ];
      $scope.cargoRecordGridOptions = problemOutboundBaseService.grid([], recordColumns, 240);
      problemOutboundRecords(data.id);
    });

    //拣货货位记录数据查询
    function problemOutboundRecords(id) {
      var selectData = [], allData = [], number = 0;
      outboundProblemVerifyService.outboundProblemRecord(id, function (data) {

       $scope.storageLocationNumb = 0;
        if (data.length == 0) {
          var cargoRecordGridOptions = $("#cargoOutboundRecordGrid").data("kendoGrid");
          cargoRecordGridOptions.hideColumn("unexamined");
        }
        for (var i = 0; i < data.length; i++) {
          number++;
          allData.push({"id": number, "name": data[i].name, "amount": data[i].amount, "actualAmount": data[i].actualAmount, "totalAmount": data[i].totalAmount, "storageLocationId": data[i].storageLocationId, "itemDataId": data[i].itemDataId, "clientName": data[i].clientName, "clientId": data[i].clientId, "unexamined": data[i].unexamined
          });
          if (data[i].unexamined == "H") {
            $scope.storageLocationNumb++;
            selectData.push({"id": number, "name": data[i].name, "amount": data[i].amount, "actualAmount": data[i].actualAmount, "totalAmount": data[i].totalAmount, "storageLocationId": data[i].storageLocationId, "itemDataId": data[i].itemDataId, "clientName": data[i].clientName, "clientId": data[i].clientId, "unexamined": data[i].unexamined
            });
          }
        }
        $scope.selectData = selectData;
        $scope.allData = allData;

        var cargoRecordGridOptions = $("#cargoOutboundRecordGrid").data("kendoGrid");
        cargoRecordGridOptions.setDataSource(new kendo.data.DataSource({data: selectData}));
      });
    }

    function getRuleState(value) {
      outboundProblemVerifyService.getRule(value, function () {
      });
    }

    //找到多货少货位置
    $scope.findLocation = function() {
      var rebinColumns=[
        {field: "wall",headerTemplate: "<span translate='Rebin车牌'></span>"},
        {field: "cell",  headerTemplate: "<span translate='Rebin格'></span>"},
        {field: "amount", headerTemplate: "<span translate='问题商品数量'></span>"},
        {field: "rebinAmount", headerTemplate: "<span translate='Rebin格商品总数'></span>"},
        {field: "actualAmount", headerTemplate: "<span translate='Rebin格实际问题商品数量'></span>"}
        ];
      var grid = $("#rebinCarRecordsGrid").data("kendoGrid");
      var rows = grid.select();
      var data = grid.dataItem(rows[0]);
      var datas=[{"wall":data.wall,"cell":data.cell,"amount":data.amount,"rebinAmount":data.rebinAmount,"itemSku":data.itemSku}];
      $scope.rebinOutboundCarRecordsGridOptions = problemOutboundBaseService.editGrid({
        columns: rebinColumns,
        height:180,
        dataSource: {
          data: datas,
          schema: {
            model: {
              id: "id",
              fields: {
                "wall": {editable: false},
                "cell": {editable: false},
                "amount": {editable: false},
                "rebinAmount": {editable: false}
              }
            }
          }
        }
      });
      $("#rebinQuestionGoodsCountId").parent().addClass("windowTitle");
        $scope.rebinQuestionGoodsCountWindow.setOptions({
          width: 800,
          height: 300,
          visible: false,
          actions: false
        });
        $scope.rebinQuestionGoodsCountWindow.center();
        $scope.rebinQuestionGoodsCountWindow.open();
    };

    //找到多货少货位置确认按钮
    $scope.rebinQuestionGoodsCountSure = function(){
      var grid = $('#rebinOutboundCarRecordsGrid').data('kendoGrid');
      var data = grid.dataSource.data()[0];
      $scope.actualAmountFiled = data.actualAmount;
      $scope.totalAmountFiled = data.rebinAmount;
      $scope.numberPoor = data.amount-data.actualAmount;
      $scope.wall= data.wall;
      $scope.cell= data.cell;
      $scope.itemSku = data.itemSku;
     if ($scope.problemType == "MORE") {
        getFindOverageGoods();
      }else{
        getFindLossGoods();
      }
    };

    function getFindOverageGoods(){
      outboundProblemVerifyService.findOverageGoods({
        "amount": $scope.numberPoor,
        "storageLocation": $scope.wall+ $scope.cell,
        "itemSku":$scope.itemSku
      }, function () {
        outboundProblemVerifyService.problemProductsNumber({
          "amount":  $scope.numberPoor,
          "problemId": $scope.outboundProblemId,
          "storageLocationId": $scope.storageLocationId,
          "state": "NG",
          "clientId": $scope.clientFiled,
          "qaAmount":  $scope.numberPoor,
          "totalAmount": $scope.totalAmountFiled,
          "actualAmount": $scope.actualAmountFiled
        }, function (data) {
          getRuleState("More_FindBin");
          $scope.solveAmount = parseInt($scope.solveAmount) + parseInt($scope.numberPoor);
          updateOutboundProblemMethod($scope.rowData, $scope.solveAmount, '', '');
          if ($scope.rowData.amount - $scope.solveAmount == 0) {
            $scope.allPage = $scope.wall + $scope.cell;
            $scope.cargoRecordPage = 'recordNumberSuccess';
          } else {
            $scope.goodsCountContent = 'rebinCarCell';
            $scope.rebinQuestionGoodsCountWindow.close();
          }
        })
       })
    }

    function getFindLossGoods(){
      outboundProblemVerifyService.findLossGoods({
        "amount": $scope.numberPoor,
        "storageLocation": $scope.wall+ $scope.cell,
        "itemSku":$scope.itemSku
      }, function () {
        outboundProblemVerifyService.problemProductsNumber({
          "amount":  $scope.numberPoor,
          "problemId": $scope.outboundProblemId,
          "storageLocationId": $scope.storageLocationId,
          "state": "NG",
          "clientId": $scope.clientFiled,
          "qaAmount":  $scope.numberPoor,
          "totalAmount": $scope.totalAmountFiled,
          "actualAmount": $scope.actualAmountFiled
        }, function (data) {
          getRuleState("Less_FindBin");
          $scope.solveAmount = parseInt($scope.solveAmount) + parseInt($scope.numberPoor);
          updateOutboundProblemMethod($scope.rowData, $scope.solveAmount, '', '');
          if ($scope.rowData.amount - $scope.solveAmount == 0) {
            $scope.cargoRecordPage = 'recordNumberSuccess';
          } else {
            $scope.goodsCountContent = 'rebinCarCell';
            $scope.rebinQuestionGoodsCountWindow.close();
          }
        })
      })
    }

    function updateOutboundProblemMethod(rowData, solveAmount, value, arr) {
      var data = {}, state = "OPEN";
      if (value != "") {
        state = value;
      } else {
        state = rowData.state;
      }
      if ($scope.amount == 0 || $scope.amount < 0) {
        state = "CLOSE";
      }
      if (rowData.problemType == "MORE") {
        data = {
          "id": rowData.id,
          "problemType": rowData.problemType,
          "amount": rowData.amount,
          "solveAmount": solveAmount,
          "jobType": rowData.jobType,
          "state": state,
          "container":rowData.container,
          "problemStoragelocation": rowData.problemStoragelocation,
          "reportBy":rowData.reportBy,
          "itemNo": rowData.itemNo,
          "modifiedDate":rowData.modifiedDate,
          "solvedBy": rowData.solvedBy,
          "client":rowData.client,
          "clientId":rowData.clientId,
          "dealState": arr.id,
          "description": arr.reason
        }
      } else {
        data = {
          "id": rowData.id,
          "problemType": rowData.problemType,
          "amount": rowData.amount,
          "jobType": rowData.jobType,
          "state": state,
          "container":rowData.container,
          "problemStoragelocation": rowData.problemStoragelocation,
          "modifiedDate":rowData.modifiedDate,
          "solvedBy": $window.localStorage["username"],
          "client":rowData.client,
          "clientId":rowData.clientId,
          "itemDataId": rowData.itemData.id,
          "solveAmount": solveAmount
        }
      }
      outboundProblemVerifyService.updateOutboundProblemVerify(data, function (v) {
        $scope.rrr = true;
        $scope.products = false;
        $scope.errorCargoSpace = false;
        $scope.productsNumber = "";
        $scope.cargoSpace = "";
      });
    }

    $scope.checkCargoSpace = function (e) {
      var keycode = window.event ? e.keyCode : e.which;
      if (keycode == 13) {
        for (var i = 0; i < $scope.selectData.length; i++) {
          var data = $scope.selectData[i];
          if (data.name == $scope.cargoSpace) {
            $scope.checkName = data.name;
            $scope.goodsCountContent = 0;
            $scope.products = true;
            $scope.errorCargoSpace = false;
            $scope.itemDataId = data.itemDataId;
            $scope.storageLocationId = data.storageLocationId;
            $scope.amountFiled = data.amount;
            $scope.actualAmountFiled = data.actualAmount;
            $scope.totalAmountFiled = data.totalAmount;
            $scope.clientFiled = data.clientId;
            var grid = $("#cargoOutboundRecordGrid").data("kendoGrid");
            var uid = grid.dataSource.at(i).uid;
            grid.select("tr[data-uid='" + uid + "']");
          }
        }
        if ($scope.checkName != this.cargoSpace) {
          $scope.errorCargoSpace = true;
          $scope.products = false;
        } else {
          setTimeout(function () {$("#problemProductsNumber").focus();}, 0);
        }
      }
    };

    $scope.problemProductsNumber = function (e) {
      var keycode = window.event ? e.keyCode : e.which;
      if (keycode == 13) {
        if ($scope.actualAmountFiled == $scope.productsNumber) {
           outboundProblemVerifyService.problemProductsNumber({
            "amount": $scope.amountFiled,
            "problemId": $scope.outboundProblemId,
            "storageLocationId": $scope.storageLocationId,
            "state": "OK",
            "clientId": $scope.clientFiled,
            "qaAmount": $scope.amountFiled,
            "totalAmount": $scope.totalAmountFiled,
            "actualAmount": $scope.actualAmountFiled
          }, function (data) {
            problemOutboundRecords($scope.outboundProblemId);
            $scope.products = false;
            $scope.errorCargoSpace = false;
            $scope.productsNumber = "";
            $scope.cargoSpace = "";
          })
        }
        else if ($scope.actualAmountFiled > $scope.productsNumber && $scope.problemType == "MORE") {
          $scope.goodsCountContent = 'goodsCountMore';
          $scope.numberPoor = $scope.actualAmountFiled - this.productsNumber;
          setTimeout(function () {$("#recargoSpaceNameId").focus();}, 0);
          $scope.recargoSpace = $scope.cargoSpace;
          $scope.allPage =  $scope.recargoSpace;
        }
        else if ($scope.actualAmountFiled < $scope.productsNumber && $scope.problemType == "LESS") {
          lossMethod();
        }
      }
    };
    // 多货处理
    $scope.reCheckCargoSpace = function (e) {
      var keycode = window.event ? e.keyCode : e.which;
      if (keycode == 13) {
        if ($scope.recargoSpace == $scope.cargoSpace) {
          var data = {
            "amount": $scope.numberPoor,
            "storageLocation": $scope.cargoSpace,
            "itemDataId": $scope.itemDataId
          };
          outboundProblemVerifyService.getStowingOverage(data, function () {
            outboundProblemVerifyService.problemProductsNumber({
              "amount": $scope.amountFiled,
              "problemId": $scope.outboundProblemId,
              "storageLocationId": $scope.storageLocationId,
              "state": "NG",
              "clientId": $scope.clientFiled,
              "qaAmount": $scope.amountFiled,
              "totalAmount": $scope.totalAmountFiled,
              "actualAmount": $scope.actualAmountFiled
            }, function (data) {
              problemOutboundRecords($scope.outboundProblemId);
              $scope.solveAmount = parseInt($scope.solveAmount) + parseInt($scope.numberPoor);
              updateOutboundProblemMethod($scope.rowData, $scope.solveAmount, '', '');
              if ($scope.rowData.amount - $scope.solveAmount == 0) {
                $scope.cargoRecordPage = 'recordNumberSuccess';
              } else {
                $scope.goodsCountContent = 'goodCountSuccess';
              }

            });
            getRuleState("More_FindBin");
            $scope.amount = $scope.amount - $scope.numberPoor;

          })
        }
      }
    };

    //少货处理
    function lossMethod(){
      outboundProblemVerifyService.getStowingLoss({
        "amount": $scope.productsNumber - $scope.actualAmountFiled,
        "storageLocation": $scope.cargoSpace,
        "itemDataId": $scope.itemDataId
      }, function () {
        outboundProblemVerifyService.problemProductsNumber({
          "amount": $scope.productsNumber - $scope.actualAmountFiled,
          "problemId": $scope.outboundProblemId,
          "storageLocationId": $scope.storageLocationId,
          "state": "NG",
          "clientId": $scope.clientFiled,
          "qaAmount": $scope.amountFiled,
          "totalAmount": $scope.totalAmountFiled,
          "actualAmount": $scope.actualAmountFiled
        }, function (data) {
          problemOutboundRecords($scope.outboundProblemId);
          $scope.solveAmount = parseInt($scope.solveAmount) + parseInt($scope.productsNumber - $scope.actualAmountFiled);
          $scope.recargoSpace = $scope.cargoSpace;
          $scope.allPage =  $scope.recargoSpace;
          $scope.numberPoor = $scope.productsNumber - $scope.actualAmountFiled;
          $scope.amount = $scope.amount - $scope.numberPoor;
          updateOutboundProblemMethod($scope.rowData, $scope.solveAmount, '', '');
          if ($scope.rowData.amount - $scope.solveAmount == 0) {
            $scope.cargoRecordPage = 'recordNumberSuccess';
          } else {
            $scope.goodsCountContent = 'goodCountSuccess';
          }
          getRuleState("Less_FindBin");
          $scope.products = false;
          $scope.productsNumber = "";
          $scope.cargoSpace = "";
        })
      });
    };

    //盘盈//盘亏
    $scope.produceDate = function () {
      $scope.goodsMaturity = "produce";
      $("#expirationDate").addClass("buttonColorGray");
      $scope.flag = 1;
    };

    $scope.maturityDate = function () {
      $scope.goodsMaturity = "maturity";
      $("#productionDate").addClass("buttonColorGray");
      $scope.flag = 2;
    };

    $scope.problemGoodsNumber = function () {
      if ($scope.problemType == "MORE") {
        if ($scope.skuData == true) {
          $("#goodsMaturityDateId").parent().addClass("mySelect");
          $scope.goodsMaturityDateWindow.setOptions({
            width: 700,
            height: 350,
            visible: false,
            actions: false
          });
          $scope.goodsMaturityDateWindow.center();
          $scope.goodsMaturityDateWindow.open();
        } else {
          $scope.goodsMaturityDateSure();
        }
      } else {
        $scope.goodsMaturityDateSure();
      }
    };

    $scope.goodsMaturityDateSure = function () {
      var window, windowId;
      if ($scope.problemType == "MORE") {
        windowId = $("#diskSurplusGoodsId");
        window = $scope.diskSurplusGoodsWindow;
      } else {
        windowId = $("#diskDeficitGoodsId");
        window = $scope.diskDeficitGoodsWindow;
      }
      $scope.goodsMaturityDateWindow.close();
      windowId.parent().addClass("myWindow");
      window.setOptions({
        width: 800,
        height: 200,
        visible: false,
        actions: false
      });
      window.center();
      window.open();
      if ($scope.flag == 1) {
        $scope.month = parseInt($scope.months) + parseInt($scope.month || 0);
        if ($scope.month > 12) {
          $scope.year++;
          $scope.month -= 12;
        }
      }
      $scope.useNotAfter = $scope.year + "-" + pad($scope.month) + "-" + pad($scope.day);
    };

    $scope.diskSurplusGoodsSure = function () {
      $scope.diskSurplusGoodsWindow.close();
      $scope.cargoRecordPage = 'recordNumberContent';
      $scope.source = $scope.toContainer;
    };

    //盘盈确认
    $scope.overageSure = function () {
      getRuleState("More_Overage");
      outboundProblemVerifyService.getDestinationId ($scope.destination,function(data) {
        var arr = {
          "destinationId": data.id,
          "client": $scope.client.id,
          "itemNo": $scope.itemNo,
          "amount": $scope.amount,
          "inventoryState": "",
          "useNotAfter": $scope.useNotAfter || "",
          "adjustReason": 'Ibp_Overage',
          "thoseResponsible": $window.localStorage["username"],
          "problemDestination": ""
        };
        outboundProblemVerifyService.overageGoods(arr, function (data) {
          updateOutboundProblemMethod($scope.rowData, '', 'CLOSE', '');
          $scope.cargoRecordPage = 'recordNumberOverage';
        });
      })
    };

    $scope.diskDeficitGoodsSure = function () {
      getRuleState("Less_Loss");
      outboundProblemVerifyService.lossGoods({
        "sourceId": $scope.outboundProblemId ,
        "itemDataId": $scope.rowData.itemData.id,
        "amount": $scope.amount,
        "adjustReason": 'Ibp_Loss',
        "thoseResponsible":$window.localStorage["username"],
        "problemDestination":""
      }, function () {
        $scope.diskDeficitGoodsWindow.close();
        updateOutboundProblemMethod($scope.rowData, '', 'CLOSE', '');
        $scope.cargoRecordPage = 'recordNumberLoss';
      });
    };

    $scope.nextGoods = function () {
      $state.go("main.outbound_problem_verify");
    };

    function pad(str) {
      str = str + "";
      var pad = "00";
      return (pad.length > str.length ? pad.substring(0, pad.length - str.length) + str : str);
    }

    $scope.overageCancel = function () {
      $scope.products = false;
      $scope.errorCargoSpace = false;
      $scope.cargoRecordPage = 'recordNumber';
      $scope.argoRecordGrid = "notSelectCargoSpace";
    };

    //备注
    $scope.remarks = function () {
      $("#remarksId").parent().addClass("mySelect");
      $scope.remarksWindow.setOptions({
        width: 800,
        height: 280,
        visible: false,
        actions: false
      });
      $scope.remarksWindow.center();
      $scope.remarksWindow.open();
    };

    //备注确认
    $scope.remarksWindowSure = function () {
      if ($scope.problemType == "MORE") {
        if ($scope.reasonId == 1) {
          $scope.reason = $("#reasonOneId").html().substring(2);
        }
        if ($scope.reasonId == 2) {
          $scope.reason = $("#reasonTwoId").html().substring(2);
        }
        var arr = {
          id: $scope.reasonId,
          reason: $scope.reason
        };
        if ($scope.reasonId) {
          updateOutboundProblemMethod($scope.rowData, '', 'OPEN', arr);
        }
      }
      $scope.remarksWindow.close();
    }

  })
})();