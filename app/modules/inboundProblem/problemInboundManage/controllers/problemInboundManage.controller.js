/**
 * Created by thoma.bian on 2017/5/10.
 */
(function () {
  'use strict';
  angular.module('myApp').controller("problemInboundManageCtl", function ($scope,$rootScope, problemInboundManageService, problemInboundBaseService) {

    $scope.problemsGrid = "problemsSolve";
    $scope.problemsGridSearch = "problemsSolveSearch";
    $scope.problemsGridTimeSearch = "problemsSolveTimeSearch";
    $scope.checkbox = true;
    $("#problemRecordsId").addClass("buttonColorGray");
    $("#problemClosesId").addClass("buttonColorGray");

    $scope.problemsSolving = function () {
      $rootScope.problemManage = 1;
      $scope.problemsGrid = "problemsSolve";
      $scope.problemsGridSearch = "problemsSolveSearch";
      $scope.problemsGridTimeSearch = "problemsSolveTimeSearch";
      $scope.checkbox = true;
      $("#problemsSolvingId").removeClass("buttonColorGray");
      $("#problemRecordsId").addClass("buttonColorGray");
      $("#problemClosesId").addClass("buttonColorGray");
      $scope.stateDateOpen = "";
      $scope.endDateOpen = "";
      $scope.itemNoLeft = "";
      $scope.searchGridLeft();
    };

    $scope.problemRecords = function () {
      $rootScope.problemManage = 2;
      $scope.problemsGrid = "problemsRecord";
      $scope.problemsGridSearch = "problemsRecordSearch";
      $scope.problemsGridTimeSearch = "problemsRecordTimeSearch";
      $scope.checkbox = false;
      $("#problemsSolvingId").addClass("buttonColorGray");
      $("#problemRecordsId").removeClass("buttonColorGray");
      $("#problemClosesId").addClass("buttonColorGray");
      $scope.stateDateProcess = "";
      $scope.endDateProcess = "";
      $scope.itemNoRight = "";
      $scope.searchGridRight();
    };

    $scope.problemCloses = function () {
      $rootScope.problemManage = 3;
      $scope.problemsGrid = "problemsClose";
      $scope.problemsGridSearch = "problemsCloseSearch";
      $scope.problemsGridTimeSearch = "problemsCloseTimeSearch";
      $scope.checkbox = false;
      $("#problemsSolvingId").addClass("buttonColorGray");
      $("#problemRecordsId").addClass("buttonColorGray");
      $("#problemClosesId").removeClass("buttonColorGray");
      $scope.stateDateClose = "";
      $scope.endDateClose = "";
      $scope.itemNoClose = "";
      $scope.searchGridClose();
    };

    // 查询全部
    $scope.selectAll = function () {
      var grid = $('#problemsSolvingGRID').data('kendoGrid');
      if ($scope.select_all) {
        $scope.select_one = true;
        grid.tbody.children('tr').addClass('k-state-selected');
        //grid.select(grid.tbody.find(">tr"));
      } else {
        $scope.select_one = false;
        grid.tbody.children('tr').removeClass('k-state-selected');
      }
    };

    // 关闭选中的
    $scope.closeProblemsGrid = function () {
      var grid = $('#problemsSolvingGRID').data('kendoGrid');
      var rows = grid.select();
      var dataFiled = "";
      for (var i = 0; i < rows.length; i++) {
        var rowData = grid.dataItem(rows[i]);
        if (i == 0) {
          dataFiled = rowData.id;
        } else {
          dataFiled += "," + rowData.id;
        }
      }
      problemInboundManageService.updateInboundProblemClose(dataFiled, function () {
        $scope.searchGridLeft();
        $scope.select_all = false;
      })
    };

    $scope.chk = false;
    $scope.selectOne = function (val, uid) {
     var grid = $('#problemsSolvingGRID').data('kendoGrid');
      if (val) {
        grid.select("tr[data-uid='" + uid + "']");
      } else {
        grid.tbody.children('tr[data-uid="' + uid + '"]').removeClass('k-state-selected');
      }
    };
    var columnsLeft = [
      {width: 35, template: "<input type=\"checkbox\"  ng-model='chk' id='dataItem.id' class='check-box' ng-checked = 'select_one' ng-click='selectOne(chk,dataItem.uid)'/>"},
      {field: "problemType", width: "80px", headerTemplate: "<span translate='问题类型'></span>",
        template: function (item) {
          var value = "";
          if (item.problemType == "More") {
            value = "<span>多货</span>"
          } else {
            value = "<span>少货</span>"
          }
          return value;
        }
      },
      {field: "itemData.itemNo", headerTemplate: "<span translate='SKU'></span>"},
      {field: "problemStorageLocation", headerTemplate: "<span translate='容器'></span>"},
      {field: "amount", headerTemplate: "<span translate='COUNT'></span>"},
      {field: "reportBy", headerTemplate: "<span translate='操作人'></span>"},
      {
        field: "reportDate", headerTemplate: "<span translate='员工操作时间'></span>", template: function (item) {
        return item.reportDate ? kendo.format("{0:yyyy-MM-dd HH:mm:ss}", kendo.parseDate(item.reportDate)) : "";
      }
      },
      {field: "solveBy", headerTemplate: "<span translate='问题人员'></span>"},
      {field: "description", headerTemplate: "<span translate='备注信息'></span>"}];

    problemInboundManageService.getInboundProblem("OPEN", "", "", null, null, function (data) {
      $scope.problemsSolvingGridOptions = problemInboundBaseService.grid(data, columnsLeft, $(document.body).height() - 300);
    });

    $scope.searchGridLeft = function () {
      if ($scope.itemNoLeft == undefined) {
        $scope.itemNoLeft = "";
      }
      problemInboundManageService.getInboundProblem("OPEN", "", $scope.itemNoLeft, null, null, function (data) {
        var problemsSolvingGrid = $("#problemsSolvingGRID").data("kendoGrid");
        problemsSolvingGrid.setDataSource(new kendo.data.DataSource({data: data}));
      });

    };

    $scope.searchOpen = function () {
      if ($scope.itemNoLeft == undefined) {
        $scope.itemNoLeft = "";
      }
      if ($scope.stateDateOpen == undefined || $scope.stateDateOpen == "") {
        $scope.stateDateOpen = null;
      }
      if ($scope.endDateOpen == undefined || $scope.endDateOpen == "") {
        $scope.endDateOpen = null;
      }
      problemInboundManageService.getInboundProblem("OPEN", "", $scope.itemNoLeft, $scope.stateDateOpen, $scope.endDateOpen, function (data) {
        var problemsSolvingGrid = $("#problemsSolvingGRID").data("kendoGrid");
        problemsSolvingGrid.setDataSource(new kendo.data.DataSource({data: data}));
      });
    };

    var columnsRight = [
      {field: "inboundProblem.problemType", width: "80px", headerTemplate: "<span translate='问题类型'></span>",
        template: function (item) {
         var value = "";
          if (item.inboundProblem.problemType == "More") {
            value = "<span>多货</span>"
          } else {
            value = "<span>少货</span>"
          }
          return "<a ui-sref='main.problemInboundManageDetail({id:dataItem.inboundProblem.id,name:dataItem.storageLocation.name})'>" + value + "</a>";
        }
      },
      {field: "inboundProblemRule.description", headerTemplate: "<span translate='操作'></span>"},
      {field: "inboundProblem.itemData.itemNo", headerTemplate: "<span translate='SKU'></span>"},
      {field: "inboundProblem.problemStorageLocation", headerTemplate: "<span translate='容器'></span>"},
      {field: "amount", headerTemplate: "<span translate='COUNT'></span>"},
      {field: "inboundProblem.reportBy", headerTemplate: "<span translate='操作人'></span>"},
      {
        field: "storageLocation.name", headerTemplate: "<span translate='货位名称'></span>", template: function (item) {
        return item.storageLocation ? item.storageLocation.name : "";
      }
      },
      {
        field: "inboundProblem.reportDate",
        headerTemplate: "<span translate='员工操作时间'></span>",
        template: function (item) {
          return item.inboundProblem.reportDate  ? kendo.format("{0:yyyy-MM-dd HH:mm:ss}", kendo.parseDate(item.inboundProblem.reportDate)) : "";
        }
      },
      {field: "inboundProblem.solveBy", headerTemplate: "<span translate='问题人员'></span>"},
      {field: "inboundProblem.description", headerTemplate: "<span translate='备注信息'></span>"}];

    problemInboundManageService.getInboundProblemRule("PROCESS", "", "", null, null, function (data) {
      $scope.problemRecordsGridOptions = problemInboundBaseService.grid(data, columnsRight, $(document.body).height() - 300);
    });

    $scope.searchGridRight = function () {
      if ($scope.itemNoRight == undefined) {
        $scope.itemNoRight = "";
      }
      problemInboundManageService.getInboundProblemRule("PROCESS", "", $scope.itemNoRight, null, null, function (data) {
        var problemRecordsGRID = $("#problemRecordsGRID").data("kendoGrid");
        problemRecordsGRID.setDataSource(new kendo.data.DataSource({data: data}));
      });

    };

    $scope.searchProcess = function () {
      if ($scope.itemNoRight == undefined) {
        $scope.itemNoRight = "";
      }
      if ($scope.stateDateProcess == undefined || $scope.stateDateProcess == "") {
        $scope.stateDateProcess = null;
      }
      if ($scope.endDateProcess == undefined || $scope.endDateProcess == "") {
        $scope.endDateProcess = null;
      }
      problemInboundManageService.getInboundProblemRule("PROCESS", "", $scope.itemNoRight, $scope.stateDateProcess, $scope.endDateProcess, function (data) {
        var problemRecordsGRID = $("#problemRecordsGRID").data("kendoGrid");
        problemRecordsGRID.setDataSource(new kendo.data.DataSource({data: data}));
      });
    };

    var columnsClose = [
      {field: "inboundProblem.problemType", width: "80px", headerTemplate: "<span translate='问题类型'></span>",
        template: function (item) {
          var value = "";
          if (item.inboundProblem.problemType == "More") {
            value = "<span>多货</span>"
          } else {
            value = "<span>少货</span>"
          }

          return "<a ui-sref='main.problemInboundManageDetail({id:dataItem.inboundProblem.id,name:dataItem.storageLocation.name})'>" + value + "</a>";
        }
      },
      {field: "inboundProblemRule.description", headerTemplate: "<span translate='操作'></span>"},
      {field: "inboundProblem.itemData.itemNo", headerTemplate: "<span translate='SKU'></span>"},
      {field: "inboundProblem.problemStorageLocation", headerTemplate: "<span translate='容器'></span>"},
      {field: "amount", headerTemplate: "<span translate='COUNT'></span>"},
      {field: "inboundProblem.reportBy", headerTemplate: "<span translate='操作人'></span>"},
      {
        field: "storageLocation.name", headerTemplate: "<span translate='货位名称'></span>", template: function (item) {
        return item.storageLocation ? item.storageLocation.name : "";
      }
      },
      {
        field: "inboundProblem.reportDate",
        headerTemplate: "<span translate='员工操作时间'></span>",
        template: function (item) {
          return item.inboundProblem.reportDate ? kendo.format("{0:yyyy-MM-dd HH:mm:ss}", kendo.parseDate(item.inboundProblem.reportDate)) : "";
        }
      },
      {field: "inboundProblem.solveBy", headerTemplate: "<span translate='问题人员'></span>"},
      {field: "inboundProblem.description", headerTemplate: "<span translate='备注信息'></span>"}
    ];

    problemInboundManageService.getInboundProblemRule("ClOSE", "", "", null, null, function (data) {
      $scope.problemCloseGridOptions = problemInboundBaseService.grid(data, columnsClose, $(document.body).height() - 300);
    });
    $scope.searchGridClose = function () {
      if ($scope.itemNoClose == undefined) {
        $scope.itemNoClose = "";
      }
      problemInboundManageService.getInboundProblemRule("ClOSE", "", $scope.itemNoClose, null, null, function (data) {
        var problemCloseGRID = $("#problemCloseGRID").data("kendoGrid");
        problemCloseGRID.setDataSource(new kendo.data.DataSource({data: data}));
      });
    };

    $scope.searchClose = function () {
      if ($scope.itemNoRight == undefined) {
        $scope.itemNoRight = "";
      }
      if ($scope.stateDateClose == undefined || $scope.stateDateClose == "") {
        $scope.stateDateClose = null;
      }
      if ($scope.endDateClose == undefined || $scope.endDateClose == "") {
        $scope.endDateClose = null;
      }
      problemInboundManageService.getInboundProblemRule("ClOSE", "", $scope.itemNoRight, $scope.stateDateClose, $scope.endDateClose, function (data) {
        var problemCloseGRID = $("#problemCloseGRID").data("kendoGrid");
        problemCloseGRID.setDataSource(new kendo.data.DataSource({data: data}));
      });
    };

    if ($rootScope.problemManage == 2) {
      $scope.problemRecords();
    } else if ($rootScope.problemManage == 3) {
      $scope.problemCloses();
    }

  }).controller("problemInboundManageDetailCtl", function ($scope, $state,  $stateParams, problemInboundManageService, problemInboundBaseService) {

    $scope.backProblemInbound = function () {
      $state.go("main.inbound_problem_manage");
    };
    problemInboundManageService.findInboundProblem($stateParams.id,function(data){
      $scope.problemType = data.problemType;
      if ($scope.problemType == "More") {
        $scope.problemTypeValue = "多货";
      } else {
        $scope.problemTypeValue = "少货";
      }
      $scope.inboundProblemId = data.id;
      $scope.solveAmount = data.solveAmount;
      $scope.amount = data.amount - $scope.solveAmount;
      $scope.problemStorageLocation = data.problemStorageLocation;

      problemInboundManageService.getGoodsInformation({
        "inboundProblemId": data.id
      }, function (data) {
        for (var k in data) $scope[k] = data[k];
      });

      var recordColumns = [
        {field: "storageLocation.name", width: 180, headerTemplate: "<span translate='上架货位历史'></span>",
          template: function (item) {
            setTimeout(function () {
              var grid = $("#adjustmentCargoSpaceGRID").data("kendoGrid");
              grid.tbody.find('tr').each(function () {
                if ($(this).find('td:first-child').text() == $stateParams.name) {
                  $(this).css("background", "#c5e0b4")
                }
              })
            }, 0);
            return  item.storageLocation.name;
          }
        },
        {field: "amount", headerTemplate: "<span translate='问题商品上架数量'></span>"},
        {field: "problemAmount ", headerTemplate: "<span translate='货位问题商品剩余数量'></span>"},
        {field: "storageLocationAmount ", headerTemplate: "<span translate='货位商品总数'></span>"},
        {field: "client.name", headerTemplate: "<span translate='CLIENT'></span>",
          template: function (item) {
            return  item.client?item.client.name:"";
          }
        }
      ];

      problemInboundManageService.getinboundProblemCheck({
        "inboundProblemId": data.id
      }, function (datas) {
         $scope.adjustmentCargoSpaceGridOptions = problemInboundBaseService.grid(datas, recordColumns, 240);
      });

    })
  })
})();
