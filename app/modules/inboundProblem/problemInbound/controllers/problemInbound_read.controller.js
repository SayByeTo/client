/**
 * Created by thoma.bian on 2017/5/10.
 */
(function(){
  "use strict";

  angular.module('myApp').controller("problemInboundReadCtl", function ($scope, $state, $window, $stateParams, inboundProblemService, problemInboundBaseService) {

    $scope.products = false;
    $scope.errorCargoSpace = false;
    $scope.goodsMaturity = "produce";
    $scope.cargoRecordPage = "recordNumber";
    $scope.argoRecordGridShow = "notSelectCargoSpacePage";
    $scope.storageLocationNumb = 0;
    $scope.goodsCountContent = "";

    $("#allCargoSpaceId").addClass("buttonColorGray");
    $("#expirationDate").addClass("buttonColorGray");

    setTimeout(function () {$("#cargoSpaceId").focus();}, 0);

    $scope.backProblemInbound = function () {
      $state.go("main.inbound_problem_disposal");
    };

    $scope.allCargoSpaces = function () {
      $scope.argoRecordGridShow = "allCargoSpacePage";
      $("#allCargoSpaceId").removeClass("buttonColorGray");
      $("#notSelectCargoSpaceId").addClass("buttonColorGray");
      var cargoRecordGridOptions = $("#cargoRecordGRID").data("kendoGrid");
      cargoRecordGridOptions.setDataSource(new kendo.data.DataSource({data: $scope.allData}));
    };

    $scope.notSelectCargoSpaces = function () {
      $scope.argoRecordGridShow = "notSelectCargoSpacePage";
      $("#allCargoSpaceId").addClass("buttonColorGray");
      $("#notSelectCargoSpaceId").removeClass("buttonColorGray");
      var cargoRecordGridOptions = $("#cargoRecordGRID").data("kendoGrid");
      cargoRecordGridOptions.setDataSource(new kendo.data.DataSource({data: $scope.selectData}));
    };

    inboundProblemService.findInboundProblem($stateParams.id,function(data){
     if (data.client) {
        $scope.LessclientId = data.client.id;
      }
      $scope.problemType = data.problemType;
      if ($scope.problemType == "MORE") {
        $scope.problemTypeValue = "多货";
      } else {
        $scope.problemTypeValue = "少货";
      }
      $scope.inboundProblemId = data.id;
      $scope.solveAmount = data.solveAmount;
      $scope.amount = data.amount - $scope.solveAmount;
      $scope.problemStorageLocation = data.problemStorageLocation;

      inboundProblemService.getGoodsInformation({"inboundProblemId": data.id
      }, function (data) {
        $scope.skuData = data.lotMandatory;
        for (var k in data) $scope[k] = data[k];
      });

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
            var cargoRecordGridOptions = $("#cargoRecordGRID").data("kendoGrid");
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
    $scope.cargoRecordGridOptions = problemInboundBaseService.grid([], recordColumns, 240);
    problemInboundRecords(data.id);
  });

  function problemInboundRecords(inboundProblemId) {
    var selectData = [], allData = [], number = 0;
    inboundProblemService.inboundProblemRecord({"inboundProblemId": inboundProblemId
    }, function (data) {
      $scope.storageLocationNumb = 0;
      if (data.length == 0) {
        var cargoRecordGridOptions = $("#cargoRecordGRID").data("kendoGrid");
        cargoRecordGridOptions.hideColumn("unexamined");
      }
      // var data = [{"id": 1, "name": '1-1-A001B05', "amount": 3, "actualAmount": 4, "totalAmount":13, "storageLocationId": '00227a79-4536-4376-a3c4-498607c86e63', "itemDataId": 1, "clientName": 'system', "clientId": 'SYSTEM', "unexamined":"H"},
      //   {"id": 2, "name": '1-1-A001B06', "amount": 4, "actualAmount": 2, "totalAmount": 10, "storageLocationId": '002fc1a2-3892-4789-b9c4-dd99f988cfd1S', "itemDataId": 1, "clientName": 'system', "clientId": 'SYSTEM', "unexamined": "H"}];
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
      var cargoRecordGridOptions = $("#cargoRecordGRID").data("kendoGrid");
      cargoRecordGridOptions.setDataSource(new kendo.data.DataSource({data: selectData}));
    });
  }

  //record 记录
  function adnonState(data) {
    inboundProblemService.getInboudProblemState(data, function () {
    });
  }

  function updateInboundProblemMethod(rowData, solveAmount, value, arr) {
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
          "jobType": rowData.jobType,
          "reportBy":rowData.reportBy,
          "solveBy": rowData.solveBy,
          "reportDate ":$window.localStorage["username"],
          "state": state,
          "problemStorageLocation":rowData.problemStorageLocation,
          "lotNo":rowData.lotNo,
          "serialNo":rowData.serialNo,
          "serialVersionUID":rowData.serialVersionUID,
          "solveAmount":solveAmount,
          "itemNo": rowData.itemNo,
          "dealState": arr.id,
          "description": arr.reason
        }
      } else {
        data = {
          "id": rowData.id,
          "problemType": rowData.problemType,
          "amount": rowData.amount,
          "jobType": rowData.jobType,
          "reportBy":rowData.reportBy,
          "solveBy": rowData.solveBy,
          "reportDate ":$window.localStorage["username"],
          "state": state,
          "problemStorageLocation":rowData.problemStorageLocation,
          "lotNo":rowData.lotNo,
          "serialNo":rowData.serialNo,
          "serialVersionUID":rowData.serialVersionUID,
          "solveAmount":solveAmount,
          "itemDataId": rowData.itemData.id

        }
      }
    inboundProblemService.updateInboundProblem(data, function (v) {
      $scope.rrr = true;
      $scope.products = false;
      $scope.errorCargoSpace = false;
      $scope.productsNumber = "";
      $scope.cargoSpace = "";
    });
  }

  //检查
  $scope.checkCargoSpace = function (e) {
    var keycode = window.event ? e.keyCode : e.which;
    if (keycode == 13) {
      for (var i = 0; i < $scope.selectData.length; i++) {
        var data = $scope.selectData[i];
        if (data.name == this.cargoSpace) {
          $scope.checkName = data.name;
          $scope.goodsCountContent = 0;
          $scope.products = true;
          $scope.errorCargoSpace = false;
          $scope.itemDataId = data.itemDataId;
          $scope.storageLocationId = data.storageLocationId;
          $scope.amountFiled = data.amount;
          $scope.problemAmountFiled = data.actualAmount;
          $scope.storageLocationAmountFiled = data.totalAmount;
          $scope.clientFiled = data.clientId;
          var grid = $("#cargoRecordGRID").data("kendoGrid");
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
      if ($scope.problemAmountFiled == this.productsNumber) {
        inboundProblemService.problemProductsNumber({
          "amount": $scope.amountFiled,
          "inboundProblemId": $scope.inboundProblemId,
          "storageLocationId": $scope.storageLocationId,
          "state": "OK",
          "clientId": $scope.clientFiled,
          "itemDataAmount": $scope.amountFiled,
          "storageLocationAmount ": $scope.storageLocationAmountFiled,
          "problemAmount": $scope.problemAmountFiled
        }, function (data) {
          problemInboundRecords($scope.inboundProblemId);
          $scope.products = false;
          $scope.errorCargoSpace = false;
          $scope.productsNumber = "";
          $scope.cargoSpace = "";
        })
      }
      else if ($scope.problemAmountFiled > this.productsNumber && $scope.problemType == "More") {
        $scope.goodsCountContent = 'goodsCountMore';
        $scope.numberPoor = $scope.problemAmountFiled - this.productsNumber;
        setTimeout(function () {$("#recargoSpaceNameId").focus();}, 0);
        $scope.recargoSpace = $scope.cargoSpace;
      }
      else if ($scope.problemAmountFiled < this.productsNumber && $scope.problemType == "LESS") {
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
       inboundProblemService.getStowingOverage(data, function () {
          inboundProblemService.problemProductsNumber({
            "amount": $scope.amountFiled,
            "inboundProblemId": $scope.inboundProblemId,
            "storageLocationId": $scope.storageLocationId,
            "state": "NG",
            "clientId": $scope.clientFiled,
            "qaAmount": $scope.amountFiled,
            "totalAmount": $scope.storageLocationAmountFiled,
            "actualAmount": $scope.problemAmountFiled
          }, function (data) {
            problemInboundRecords($scope.inboundProblemId);
            $scope.solveAmount = parseInt($scope.solveAmount) + parseInt($scope.numberPoor);
            updateInboundProblemMethod($scope.rowData, $scope.solveAmount, '', '');
            if ($scope.rowData.amount - $scope.solveAmount == 0) {
              $scope.cargoRecordPage = 'recordNumberSuccess';
            } else {
              $scope.goodsCountContent = 'goodCountSuccess';
            }

          });
          inboundProblemService.getInboundDeal("More_FindBin", function (data) {
          });
          $scope.amount = $scope.amount - $scope.numberPoor;

        })
      } else {
        inboundProblemService.problemProductsNumber({
          "amount": $scope.problemAmountFiled - $scope.numberPoor,
          "inboundProblemId": $scope.inboundProblemId,
          "storageLocationId": $scope.storageLocationId,
          "state": "NG",
          "clientId": $scope.clientFiled
        }, function (data) {
          $scope.solveAmount = $scope.numberPoor;
          updateInboundProblemMethod($scope.rowData, $scope.solveAmount, '');
          if ($scope.rowData.amount - $scope.solveAmount == 0) {
            $scope.cargoRecordPage = 'recordNumberSuccess';
          } else {
            $scope.goodsCountContent = 'goodCountSuccess';
          }
          inboundProblemService.getDestinationId ($scope.recargoSpace,function(data){
            inboundProblemService.moveGoods({
              "sourceId":$scope.inboundProblemId,
              "destinationId": data.id,
              "itemDataId": $scope.itemDataId,
              "amount": $scope.numberPoor
            }, function (data) {
              problemInboundRecords($scope.inboundProblemId);
              $scope.amount = $scope.amount - $scope.numberPoor;
            })
          });

        })
      }
    }
  };

  //少货处理
  function lossMethod(){
    inboundProblemService.getStowingLoss({
      "amount": $scope.productsNumber - $scope.problemAmountFiled,
      "storageLocation": $scope.cargoSpace,
      "itemDataId": $scope.itemDataId
     }, function () {
      inboundProblemService.problemProductsNumber({
        "amount": $scope.productsNumber - $scope.problemAmountFiled,
        "inboundProblemId": $scope.inboundProblemId,
        "storageLocationId": $scope.storageLocationId,
        "state": "NG",
        "clientId": $scope.clientFiled,
        "qaAmount": $scope.amountFiled,
        "totalAmount": $scope.totalAmountFiled,
        "actualAmount": $scope.problemAmountFiled
      }, function (data) {
        problemInboundRecords($scope.inboundProblemId);
        $scope.solveAmount = parseInt($scope.solveAmount) + parseInt($scope.productsNumber - $scope.problemAmountFiled);
        $scope.recargoSpace = $scope.cargoSpace;
        $scope.numberPoor = $scope.productsNumber - $scope.problemAmountFiled;
        $scope.amount = $scope.amount - $scope.numberPoor;
        updateInboundProblemMethod($scope.rowData, $scope.solveAmount, '', '');
        if ($scope.rowData.amount - $scope.solveAmount == 0) {
          $scope.cargoRecordPage = 'recordNumberSuccess';
        } else {
          $scope.goodsCountContent = 'goodCountSuccess';
        }
        inboundProblemService.getInboundDeal("Less_FindBin", function (data) {
        });

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
  };

  //盘盈确认
  $scope.overageSure = function () {
    inboundProblemService.getInboundDeal("More_Overage", function (data) {
    });
    inboundProblemService.getDestinationId ($scope.destination,function(data) {
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
      inboundProblemService.overageGoods(arr, function (data) {
        updateInboundProblemMethod($scope.rowData, '', 'CLOSE', '');
        $scope.cargoRecordPage = 'recordNumberOverage';
      });
    })
  };

  //盘亏
  $scope.diskDeficitGoodsSure = function () {
    inboundProblemService.getInboundDeal("Less_Loss", function (data) {
    });
    $scope.diskDeficitGoodsWindow.close();
    inboundProblemService.lossGoods({
      "sourceId":$scope.inboundProblemId,
      "itemDataId": $scope.rowData.itemData.id,
      "amount": $scope.amount,
      "adjustReason": 'Ibp_Loss',
      "thoseResponsible":$window.localStorage["username"],
      "problemDestination":""
    }, function () {
      updateInboundProblemMethod($scope.rowData, '', 'CLOSE', '');
      $scope.cargoRecordPage = 'recordNumberLoss';
    })
  };

  $scope.nextGoods = function () {
    $state.go("main.problem_inbound");
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
    if ($scope.problemType == "More") {
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
        updateInboundProblemMethod($scope.rowData, '', 'OPEN', arr);
      }
    }
    $scope.remarksWindow.close();
  }
  })
})();
