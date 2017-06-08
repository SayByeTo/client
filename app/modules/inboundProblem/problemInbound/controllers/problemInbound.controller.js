/**
 * Created by thoma.bian on 2017/5/10.
 */
(function(){
  "use strict";

  angular.module('myApp').controller("problemInboundCtl", function ($scope, $window, inboundProblemService, problemInboundBaseService) {

    $scope.page = "main";
    //workStationPage

   // 扫描工作站
    $scope.workStation = function (e) {
      var keycode = window.event ? e.keyCode : e.which;
      if (keycode != 13) return;
       inboundProblemService.getInboundProblemStation($scope.workstation, function(data){
        $scope.page = 'main';
      }, function(){
        $scope.workingStation = true;
      });
    };

    //左边Grid
    var columnsLeft = [{field: "problemType", width: "40px", headerTemplate: "<span translate='问题类型'></span>",
      template: function (item) {
        var value = "";
        if (item.problemType == "MORE") {
          value = "<span>多货</span>";
        } else {
          value = "<span>少货</span>";
        }
        return value;
      }
    },
    {field: "itemData.itemNo", width: "120px", headerTemplate: "<span translate='SKU'></span>"},
    {field: "problemStorageLocation", width: "120px", headerTemplate: "<span translate='容器'></span>"},
    {field: "amount", width: "50px", headerTemplate: "<span translate='COUNT'></span>",
      template: function (item) {
        return item.amount - item.solveAmount;
      }
    },
    {field: "reportBy", width: "110px", headerTemplate: "<span translate='操作人'></span>"},
    {field: "reportDate", width: 105, headerTemplate: "<span translate='员工操作时间'></span>",
      template: function (item) {
       return item.reportDate ? kendo.format("{0:yyyy-MM-dd HH:mm:ss}", kendo.parseDate(item.reportDate)) : "";
     }
    },
    {field: "solveBy", width: "110px", headerTemplate: "<span translate='问题人员'></span>"}];

    inboundProblemService.getInboundProblem("OPEN","",$scope.itemNoLeft, function (data) {
      $scope.problemInboundLeftGridOptions = problemInboundBaseService.grid(data,columnsLeft, $(document.body).height() - 210);
    });

    $scope.searchInputLeft = function (e) {
      var keycode = window.event ? e.keyCode : e.which;
      if (keycode == 13) {
        $scope.searchGridLeft();
      }
    };

    $scope.searchGridLeft = function () {
      inboundProblemService.getInboundProblem("OPEN","", $scope.itemNoLeft, function (data) {
        var problemInboundLeftGrid = $("#problemInboundLeftGrid").data("kendoGrid");
        problemInboundLeftGrid.setOptions({"editable": false});
        problemInboundLeftGrid.setDataSource(new kendo.data.DataSource({data: data}));
      });
    };

    //右边Grid
    var columnsRight = [{field: "problemType", width: "40px", headerTemplate: "<span translate='问题类型'></span>",
      template: function (item) {
        var value = "";
        if (item.problemType == "MORE") {
          value = "<span>多货</span>"
        } else {
          value = "<span>少货</span>"
        }
        return "<a ui-sref='main.problemInboundRead({id:dataItem.id})'>" + value + "</a>";
      }
    },
    {field: "itemNo", width: "120px", headerTemplate: "<span translate='SKU'></span>"},
    {field: "problemStorageLocation", width: "120px", headerTemplate: "<span translate='容器'></span>"},
    {field: "amount", width: "50px", headerTemplate: "<span translate='COUNT'></span>",
      template: function (item) {
        return item.amount - item.solveAmount;
      }
    },
    {field: "reportBy", width: "110px", headerTemplate: "<span translate='操作人'></span>"},
    {field: "reportDate", width: 105, headerTemplate: "<span translate='员工操作时间'></span>",
      template: function (item) {
        return item.reportDate ? kendo.format("{0:yyyy-MM-dd HH:mm:ss}", kendo.parseDate(item.reportDate)) : "";
      }
    },
    {field: "solveBy", width: "110px", headerTemplate: "<span translate='问题人员'></span>"}];

    inboundProblemService.getInboundProblem("PROCESS",$window.localStorage["username"],$scope.itemNoRight, function (data) {
      $scope.problemInboundRightGridOptions = problemInboundBaseService.grid(data,columnsRight, $(document.body).height() - 210);
    });

    $scope.searchInputRight = function (e) {
      var keycode = window.event ? e.keyCode : e.which;
      if (keycode == 13) {
        $scope.searchGridRight();
      }
    };

    $scope.arr = "";
    $scope.searchGridRight = function () {
      inboundProblemService.getInboundProblem("PROCESS",$window.localStorage["username"],$scope.itemNoRight, function (data) {
        if (data.length > 1) {
          $scope.andCase1 = 1;
          $("#problemInboundRightGrid").height($(document.body).height()/2);
          $scope.rowData = data[0];
        }
        for (var i = 0; i < data.length; i++) {
          if (i == 0) {
            $scope.arr = data[i].id;
          } else {
            $scope.arr += "," + data[i].id;
          }
        }
        var problemInboundRightGrid = $("#problemInboundRightGrid").data("kendoGrid");
        problemInboundRightGrid.setOptions({"editable": false});
        problemInboundRightGrid.setDataSource(new kendo.data.DataSource({data: data}));
      });
    };

    //左右移动
    $scope.moveAndonInbound = function (value) {
      var state = "", grid = "", username = "";
      if (value == "left") {
        state = "PROCESS";
        grid = $("#andonInboundLeftGRID").data("kendoGrid");
        username = $window.localStorage["username"]
      } else {
        state = "OPEN";
        grid = $("#andonInboundRightGRID").data("kendoGrid");
        username = $window.localStorage["username"]
      }
      var rows = grid.select();
      if (rows.length) {
        var rowData = grid.dataItem(rows[0]);
        //console.log(rowData);
        var dataFiled = {};
        if (rowData.problemType == "More") {
          dataFiled = {
             "id": rowData.id,
             "problemType": rowData.problemType,
             "amount": rowData.amount,
             "description":rowData.description,
             "jobType": rowData.jobType,
             "reportBy":rowData.reportBy,
             "solveBy": username,
             "reportDate ": rowData.reportDate,
             "state": state,
             "problemStorageLocation":rowData.problemStorageLocation,
             "lotNo":rowData.lotNo,
             "serialNo":rowData.serialNo,
             "serialVersionUID":rowData.serialVersionUID,
             "solveAmount":rowData.solveAmount,
             "itemNo": rowData.itemNo
          }
        } else {
          dataFiled = {
            "id": rowData.id,
            "problemType": rowData.problemType,
            "amount": rowData.amount,
            "jobType": rowData.jobType,
            "reportBy":rowData.reportBy,
            "solveBy": username,
            "reportDate": rowData.reportDate,
            "state": state,
            "problemStorageLocation":rowData.problemStorageLocation,
            "lotNo":rowData.lotNo,
            "serialNo":rowData.serialNo,
            "serialVersionUID":rowData.serialVersionUID,
            "solveAmount":rowData.solveAmount,
            "itemDataId": rowData.itemData.id
          }
        }
       inboundProblemService.updateInboundProblem(dataFiled, function () {
          $scope.searchGridLeft();
          $scope.searchGridRight();
        });
      }
    };

    var andCaseColumns = [{field: "containerName", width: 60, headerTemplate: "<span translate='容器'></span>"},
      {field: "amount", width: 60, headerTemplate: "<span translate='COUNT'></span>"},
      {field: "deliveryNote", headerTemplate: "<span translate='收货DN'></span>"},
      {field: "stationName", headerTemplate: "<span translate='收货站台'></span>"},
      {field: "createdBy", headerTemplate: "<span translate='收货人'></span>"},
      {field: "clientName", headerTemplate: "<span translate='客户'></span>"},
      {field: "modifiedDate", headerTemplate: "<span translate='时间'></span>"}];

    $scope.andCaseChild1 = function () {
      $scope.andCaseChildPage = 'CaseGrid';
      inboundProblemService.getAnalysis($scope.arr, function (data) {
        $scope.andCaseGridOptions = problemInboundBaseService.grid(data, andCaseColumns);
      })
    };

    $scope.andCaseChild2 = function () {
      $scope.andCaseChildPage = 'CaseContent';
    };

    $scope.addCaseButtonSure = function(){
      inboundProblemService.getDestinationId ($scope.caseDestination,function(data){
        inboundProblemService.moveGoods({
          "sourceId":$scope.inboundProblemId,
          "destinationId": data.id,
          "itemDataId": $scope.itemDataId,
          "amount": $scope.caseAmount
        }, function (data) {
          inboundProblemService.updateInboundProblem(
            { "id":  $scope.rowData.id,
            "problemType":  $scope.rowData.problemType,
            "amount":  $scope.rowData.amount,
            "jobType":  $scope.rowData.jobType,
            "reportBy": $scope.rowData.reportBy,
            "solveBy":  $scope.rowData.solveBy,
            "reportDate ":$window.localStorage["username"],
            "state": 'CLOSE',
            "problemStorageLocation": $scope.rowData.problemStorageLocation,
            "lotNo": $scope.rowData.lotNo,
            "serialNo": $scope.rowData.serialNo,
            "serialVersionUID": $scope.rowData.serialVersionUID,
            "solveAmount": $scope.rowData.solveAmount,
            "itemNo":  $scope.rowData.itemNo}
            , function (v) {
              $scope.andCaseInformation = true;
          });
        })
      });
    };

    $scope.emptyCase = function(){
      $scope.caseDestination= "";
      $scope.source= "";
      $scope.caseAmount= "";
    };

    $scope.continues = function(){
      $scope.searchGridRight();
      $scope.andCase1 = "";
      $scope.andCaseChildPage = "";
      $scope.andCaseInformation = false;
     $("#problemInboundRightGrid").height($(document.body).height()-210);
    };


  })
})();