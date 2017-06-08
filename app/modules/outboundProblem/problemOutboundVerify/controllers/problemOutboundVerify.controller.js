/**
 * Created by thoma.bian on 2017/5/10.
 */
(function () {
  'use strict';
  angular.module('myApp').controller("problemOutboundVerifyCtl", function ($scope,$window,outboundProblemVerifyService,problemOutboundBaseService) {

     $scope.arr = "";

    //outboundproblem核实公共方法
     function problemOutboundVerifyGrid(value,gridId){
      outboundProblemVerifyService.getOutboundProblem(value, function (data) {
       if(value.state == "PROCESS") {
           if (data.length > 1) {
             $scope.andCase1 = 1;
             $("#problemOutboundVerifyRightGrid").height($(document.body).height()/2);
             $scope.rowData = data;
           }
           for (var i = 0; i < data.length; i++) {
             if (i == 0) {
               $scope.arr = data[i].id;
             } else {
               $scope.arr += "," + data[i].id;
             }
           }
         }
         var grid = $("#"+gridId).data("kendoGrid");
         grid.setDataSource(new kendo.data.DataSource({data: data}));
       })
     }

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
      {field: "itemNo", width: "130px", headerTemplate: "<span translate='SKU'></span>"},
      {field: "problemStoragelocation", width: "120px", headerTemplate: "<span translate='容器'></span>"},
      {field: "amount", width: "50px", headerTemplate: "<span translate='COUNT'></span>",
        template: function (item) {
          return item.amount - item.solveAmount;
        }
      },
      {field: "createdBy", width: "110px", headerTemplate: "<span translate='操作人'></span>"},
      {field: "modifiedDate", width: 105, headerTemplate: "<span translate='员工操作时间'></span>",
        template: function (item) {
          return item.modifiedDate ? kendo.format("{0:yyyy-MM-dd HH:mm:ss}", kendo.parseDate(item.modifiedDate)) : "";
        }
      },
     {field: "jobType", headerTemplate: "<span translate='操作环节'></span>"},
     {field: "client", headerTemplate: "<span translate='客户'></span>"},
     {field: "solvedBy", width: "110px", headerTemplate: "<span translate='问题人员'></span>"}];

    $scope.problemOutboundVerifyLeftGridOptions = problemOutboundBaseService.grid("",columnsLeft, $(document.body).height() - 210);
    problemOutboundVerifyGrid({"state":"OPEN","userName":"","seek":$scope.itemNoLeft},"problemOutboundVerifyLeftGird");

    //左边Grid INPUT 回车
    $scope.searchInputLeft = function (e) {
      var keycode = window.event ? e.keyCode : e.which;
      if (keycode == 13) {
        problemOutboundVerifyGrid({"state":"OPEN","userName":"","seek":$scope.itemNoLeft},"problemOutboundVerifyLeftGird");
      }
    };

    //左边Grid INPUT 搜索
    $scope.searchGridLeft = function () {
      problemOutboundVerifyGrid({"state":"OPEN","userName":"","seek":$scope.itemNoLeft},"problemOutboundVerifyLeftGird");
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
        return "<a ui-sref='main.problemOutboundVerifyRead({id:dataItem.id})'>" + value + "</a>";
      }
    },
      {field: "itemNo", width: "130px", headerTemplate: "<span translate='SKU'></span>"},
      {field: "problemStoragelocation", width: "120px", headerTemplate: "<span translate='容器'></span>"},
      {field: "amount", width: "50px", headerTemplate: "<span translate='COUNT'></span>",
        template: function (item) {
          return item.amount - item.solveAmount;
        }
      },
      {field: "createdBy", width: "110px", headerTemplate: "<span translate='操作人'></span>"},
      {field: "modifiedDate", width: 105, headerTemplate: "<span translate='员工操作时间'></span>",
        template: function (item) {
          return item.modifiedDate ? kendo.format("{0:yyyy-MM-dd HH:mm:ss}", kendo.parseDate(item.modifiedDate)) : "";
        }
      },
      {field: "jobType",headerTemplate: "<span translate='操作环节'></span>"},
      {field: "client",headerTemplate: "<span translate='客户'></span>"},
      {field: "solvedBy", width: "110px", headerTemplate: "<span translate='问题人员'></span>"}];

    $scope.problemOutboundVerifyRightGridOptions = problemOutboundBaseService.grid("",columnsRight, $(document.body).height() - 210);
    problemOutboundVerifyGrid({"state":"PROCESS","userName":$window.localStorage["username"],"seek":$scope.itemNoRight},"problemOutboundVerifyRightGrid");

    //右边Grid INPUT 回车
    $scope.searchInputRight = function (e) {
      var keycode = window.event ? e.keyCode : e.which;
      if (keycode == 13) {
        problemOutboundVerifyGrid({"state":"PROCESS","userName":$window.localStorage["username"],"seek":$scope.itemNoRight},"problemOutboundVerifyRightGrid");
      }
    };

    //右边Grid INPUT 搜索
    $scope.searchGridRight = function () {
      problemOutboundVerifyGrid({"state":"PROCESS","userName":$window.localStorage["username"],"seek":$scope.itemNoRight},"problemOutboundVerifyRightGrid");
    };


    //左右移动
    $scope.moveProblemOutboundVerify = function (value) {
      var state = "", grid = "", username = "";
      if (value == "left") {
        state = "PROCESS";
        grid = $("#problemOutboundVerifyLeftGird").data("kendoGrid");
        username = $window.localStorage["username"]
      } else {
        state = "OPEN";
        grid = $("#problemOutboundVerifyRightGrid").data("kendoGrid");
        username = $window.localStorage["username"]
      }
      var rows = grid.select();
      if (rows.length) {
        var rowData = grid.dataItem(rows[0]);
        var dataFiled = {};
        if (rowData.problemType == "MORE") {
          dataFiled = {
            "id": rowData.id,
            "problemType": rowData.problemType,
            "amount": rowData.amount,
            "solveAmount": rowData.solveAmount,
            "jobType": rowData.jobType,
            "state": state,
            "container":rowData.container,
            "problemStoragelocation": rowData.problemStoragelocation,
            "reportBy":rowData.reportBy,
            "itemNo": rowData.itemNo,
            "modifiedDate":rowData.modifiedDate,
            "solvedBy": username,
            "client":rowData.client,
            "clientId":rowData.clientId
          }
        } else {
          dataFiled = {
            "id": rowData.id,
            "problemType": rowData.problemType,
            "amount": rowData.amount,
            "solveAmount": rowData.solveAmount,
            "jobType": rowData.jobType,
             "state": state,
            "container":rowData.container,
            "problemStoragelocation": rowData.problemStoragelocation,
            "reportBy":rowData.reportBy,
            "itemDataId": rowData.itemData.id,
            "modifiedDate":rowData.modifiedDate,
            "solvedBy": username,
            "client":rowData.client,
            "clientId":rowData.clientId
          }
        }
        outboundProblemVerifyService.updateOutboundProblemVerify(dataFiled, function () {
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
      outboundProblemVerifyService.getAnalysis($scope.itemNoRight, function (data) {
        $scope.andCaseGridOptions = problemOutboundBaseService.grid(data, andCaseColumns);
      })
    };

    $scope.andCaseChild2 = function () {
      $scope.andCaseChildPage = 'CaseContent';
    };

    $scope.addCaseButtonSure = function(){
      outboundProblemVerifyService.getDestinationId ($scope.caseDestination,function(data){
        outboundProblemVerifyService.moveGoods({
          "sourceId":$scope.inboundProblemId,
          "destinationId": data.id,
          "itemDataId": $scope.itemDataId,
          "amount": $scope.caseAmount
        }, function (data) {
          outboundProblemVerifyService.updateOutboundProblemVerify(
            {  "id": $scope.rowData.id,
              "problemType": $scope.rowData.problemType,
              "amount": $scope.rowData.amount,
              "solveAmount": $scope.rowData.solveAmount,
              "jobType": $scope.rowData.jobType,
              "state": 'CLOSE',
              "container":$scope.rowData.container,
              "problemStoragelocation": $scope.rowData.problemStoragelocation,
              "reportBy":$scope.rowData.reportBy,
              "itemNo": $scope.rowData.itemNo,
              "modifiedDate":$scope.rowData.modifiedDate,
              "solvedBy": $scope.rowData.solvedBy,
              "client":$scope.rowData.client,
              "clientId":$scope.rowData.clientId}
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
      $("#problemOutboundVerifyRightGrid").height($(document.body).height()-210);
    };

  })
})();

