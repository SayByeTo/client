/**
 * Created by thoma.bian on 2017/5/10.
 */
(function () {
  'use strict';
  angular.module('myApp').controller("icqaDetailCtl", function ($scope, $window, $rootScope, commonService, ICQABaseService, icqaDetailService) {

    $scope.icqaDetailPage = "ONE";

    $scope.inventoryStaff = false;
    $scope.stocktakingDetail = false;
    $scope.state = "raw";
    $scope.personnelArr = [];
    $scope.newPersonnelArr = [];
    $scope.personnel = "";
    $scope.inventoryUser = false;
    $scope.inventoryUserToAssign = false;
    $scope.times = 1;

    $("#defaultTwoInventoryId").addClass("buttonColorGray");
    $("#defaultThreeInventoryId").addClass("buttonColorGray");
    $("#defaultFourInventoryId").addClass("buttonColorGray");

    var columnsSelect = [
      {field: "stocktakingNo", headerTemplate: "<span translate='盘点编号'></span>"},
      {field: "name", headerTemplate: "<span translate='盘点名称'></span>"},
      {field: "zone", headerTemplate: "<span translate='指定区域'></span>"},
      {field: "totalQty", headerTemplate: "<span translate='盘点总数'></span>"},
      {field: "okQty", headerTemplate: "<span translate='盘点完成数量'></span>"},
      {field: "ngQty", headerTemplate: "<span translate='剩余差异货位数量'></span>"},
      {field: "dpmo", headerTemplate: "<span translate='差异货位DPMO'></span>",template: function (item) {
         return parseInt(item.dpmo);
       }
      },{
        field: "createdDate", headerTemplate: "<span translate='创建时间'></span>", template: function (item) {
        if (item.createdDate) {
          return kendo.format("{0:yyyy-MM-dd HH:mm:ss}", kendo.parseDate(item.createdDate))
        } else {
          return "";
        }

      }
      },
      {field: "createdByUser", headerTemplate: "<span translate='创建人'></span>"},
      {
        field: "closeDate", headerTemplate: "<span translate='关闭时间'></span>", template: function (item) {
        if (item.closeDate) {
          return kendo.format("{0:yyyy-MM-dd HH:mm:ss}", kendo.parseDate(item.closeDate))
        } else {
          return "";
        }
      }
      }
    ];
    inventoryCount("");
    icqaDetailService.selectRoundOfInventory($scope.times, $scope.inventoryInformation, $scope.createdDateOne, $scope.createdDateTwo, function (data) {
      $scope.stocktakingOrdersGridOption = ICQABaseService.grid(data, columnsSelect, $(document.body).height() - 240);
    });


    $scope.defaultOneInventory = function () {
      $scope.times = 1;
      inventoryCount("");
      $("#defaultOneInventoryId").removeClass("buttonColorGray");
      $("#defaultTwoInventoryId").addClass("buttonColorGray");
      $("#defaultThreeInventoryId").addClass("buttonColorGray");
      $("#defaultFourInventoryId").addClass("buttonColorGray");
      icqaDetailService.selectRoundOfInventory($scope.times, $scope.inventoryInformation, $scope.createdDateOne, $scope.createdDateTwo, function (data) {
       var grid = $("#stocktakingOrdersGrid").data("kendoGrid");
        grid.setDataSource(new kendo.data.DataSource({data: data}));
      });


    };
    $scope.defaultTwoInventory = function () {
      $scope.times = 2;
      inventoryCount("");
      $("#defaultOneInventoryId").addClass("buttonColorGray");
      $("#defaultTwoInventoryId").removeClass("buttonColorGray");
      $("#defaultThreeInventoryId").addClass("buttonColorGray");
      $("#defaultFourInventoryId").addClass("buttonColorGray");
      icqaDetailService.selectRoundOfInventory($scope.times, $scope.inventoryInformation, $scope.createdDateOne, $scope.createdDateTwo, function (data) {

        var grid = $("#stocktakingOrdersGrid").data("kendoGrid");
        grid.setDataSource(new kendo.data.DataSource({data: data}));
      });
    };

    $scope.defaultThreeInventory = function () {
      $scope.times = 3;
      inventoryCount("");
      $("#defaultOneInventoryId").addClass("buttonColorGray");
      $("#defaultTwoInventoryId").addClass("buttonColorGray");
      $("#defaultThreeInventoryId").removeClass("buttonColorGray");
      $("#defaultFourInventoryId").addClass("buttonColorGray");
      icqaDetailService.selectRoundOfInventory($scope.times, $scope.inventoryInformation, $scope.createdDateOne, $scope.createdDateTwo, function (data) {
          var grid = $("#stocktakingOrdersGrid").data("kendoGrid");
          grid.setDataSource(new kendo.data.DataSource({data: data}));
      });
  };

   $scope.defaultFourInventory = function(){
       $scope.times = 4;
       inventoryCount("");
       $("#defaultOneInventoryId").addClass("buttonColorGray");
       $("#defaultTwoInventoryId").addClass("buttonColorGray");
       $("#defaultThreeInventoryId").addClass("buttonColorGray");
       $("#defaultFourInventoryId").removeClass("buttonColorGray");
       icqaDetailService.selectRoundOfInventory($scope.times, $scope.inventoryInformation, $scope.createdDateOne, $scope.createdDateTwo, function (data) {
           var grid = $("#stocktakingOrdersGrid").data("kendoGrid");
           grid.setDataSource(new kendo.data.DataSource({data: data}));
       });
   };

    $scope.searchICQADetail = function () {
      icqaDetailService.selectRoundOfInventory($scope.times, $scope.inventoryInformation, $scope.createdDateOne, $scope.createdDateTwo, function (data) {
        var grid = $("#stocktakingOrdersGrid").data("kendoGrid");
        grid.setDataSource(new kendo.data.DataSource({data: data}));
      })
    };

    $scope.searchICQADetailTime = function () {
      icqaDetailService.selectRoundOfInventory($scope.times, $scope.inventoryInformation, $scope.createdDateOne, $scope.createdDateTwo, function (data) {
        var grid = $("#stocktakingOrdersGrid").data("kendoGrid");
        grid.setDataSource(new kendo.data.DataSource({data: data}));
      });
      inventoryCount("");
    };

    $scope.oneInventory = function () {
      $scope.inventoryStaff = false;
      $scope.times = 1;
      inventoryCount($scope.stocktakingId);
      $("#oneInventoryId").removeClass("buttonColorGray");
      $("#twoInventoryId").addClass("buttonColorGray");
      $("#threeInventoryId").addClass("buttonColorGray");
      $("#fourInventoryId").addClass("buttonColorGray");
      if ($scope.stocktakingId) {
        icqaDetailService.selectRoundOfInventoryId($scope.times, $scope.stocktakingId,  $scope.createdDateOne, $scope.createdDateTwo,function (data) {
          var grid = $("#stocktakingSelectGridONEId").data("kendoGrid");
          grid.setDataSource(new kendo.data.DataSource({data: data}));
        });

        icqaDetailService.select0rdersByStocktakingIds($scope.stocktakingId, $scope.times, function (res) {
          var grid = $("#stocktakingDetailsGridId").data("kendoGrid");
          grid.setDataSource(new kendo.data.DataSource({data: res}));
        });
      }
    };

    $scope.twoInventory = function () {
      if ($scope.stocktakingId) {
        icqaDetailService.getStocktaking0rderUser($window.localStorage["clientId"], function (data) {
          $scope.usersSource = data;
        });
        $scope.times = 2;
        inventoryCount($scope.stocktakingId);
        $scope.inventoryStaff = true;
        $scope.inventory = [];
        $scope.personnelArr = [];
        $scope.newPersonnelArr = [];


        $("#oneInventoryId").addClass("buttonColorGray");
        $("#twoInventoryId").removeClass("buttonColorGray");
        $("#threeInventoryId").addClass("buttonColorGray");
        $("#fourInventoryId").addClass("buttonColorGray");

        icqaDetailService.checkInventory($scope.stocktakingId, $scope.times, function (v) {
          if (v.length > 0) {
            for (var i = 0; i < v.length; i++) {
              $scope.newPersonnelArr.push({id: v[i].userDTO.id, name: v[i].userDTO.name});
            }
          }

          icqaDetailService.selectRoundOfInventoryId($scope.times, $scope.stocktakingId, $scope.createdDateOne, $scope.createdDateTwo, function (data) {
            var grid = $("#stocktakingSelectGridONEId").data("kendoGrid");
            grid.setDataSource(new kendo.data.DataSource({data: data}));
          });

          icqaDetailService.select0rdersByStocktakingIds($scope.stocktakingId, $scope.times, function (res) {
            $scope.inventory = res;
            var notInventory = 0;
            for (var i = 0; i < $scope.inventory.length; i++) {
              if ($scope.inventory[i].state == "未盘点") {
                notInventory++;
              }
            }
            if (notInventory == 0 && $scope.newPersonnelArr.length > 0) {
              $scope.inventoryUserToAssign = true;
              $("#userNameId").attr("readonly", "readonly");
            } else {
              $scope.inventoryUserToAssign = false;
              $("#userNameId").removeAttr("readonly");
            }
            var grid = $("#stocktakingDetailsGridId").data("kendoGrid");
            grid.setDataSource(new kendo.data.DataSource({data: res}));
          });

        });
      } else {
        $("#stocktakingDetailsId").parent().addClass("mySelect");
        $scope.stocktakingDetailsWindow.setOptions({
          width: 600,
          height: 150,
          visible: false,
          actions: false
        });
        $scope.stocktakingDetailsWindow.center();
        $scope.stocktakingDetailsWindow.open();
      }
    };

    $scope.threeInventory = function () {
      if ($scope.stocktakingId) {
        icqaDetailService.getStocktaking0rderUser($window.localStorage["clientId"], function (data) {
          $scope.usersSource = data;
        });
        $scope.times = 3;
        inventoryCount($scope.stocktakingId);
        $scope.inventoryStaff = true;
        $scope.inventory = [];
        $scope.personnelArr = [];
        $scope.newPersonnelArr = [];


        $("#threeInventoryId").removeClass("buttonColorGray");
        $("#twoInventoryId").addClass("buttonColorGray");
        $("#oneInventoryId").addClass("buttonColorGray");
        $("#fourInventoryId").addClass("buttonColorGray");

        icqaDetailService.checkInventory($scope.stocktakingId, $scope.times, function (v) {
          if (v.length > 0) {
            for (var i = 0; i < v.length; i++) {
              $scope.newPersonnelArr.push({id: v[i].userDTO.id, name: v[i].userDTO.name});
            }
          }
          icqaDetailService.selectRoundOfInventoryId($scope.times, $scope.stocktakingId, $scope.createdDateOne, $scope.createdDateTwo, function (data) {
            var grid = $("#stocktakingSelectGridONEId").data("kendoGrid");
            grid.setDataSource(new kendo.data.DataSource({data: data}));
          });
          icqaDetailService.select0rdersByStocktakingIds($scope.stocktakingId, $scope.times, function (res) {
            $scope.inventory = res;
            var notInventory = 0;
            for (var i = 0; i < $scope.inventory.length; i++) {
              if ($scope.inventory[i].state == "未盘点") {
                notInventory++;
              }
            }
            if (notInventory == 0 && $scope.newPersonnelArr.length > 0) {
              $scope.inventoryUserToAssign = true;
              $("#userNameId").attr("readonly", "readonly");
            } else {
              $scope.inventoryUserToAssign = false;
              $("#userNameId").removeAttr("readonly");
            }
            var grid = $("#stocktakingDetailsGridId").data("kendoGrid");
            grid.setDataSource(new kendo.data.DataSource({data: res}));
          });
        });
      } else {
        $("#stocktakingDetailsId").parent().addClass("mySelect");
        $scope.stocktakingDetailsWindow.setOptions({
          width: 600,
          height: 150,
          visible: false,
          actions: false
        });
        $scope.stocktakingDetailsWindow.center();
        $scope.stocktakingDetailsWindow.open();
      }
    };

    $scope.fourInventory = function(){
        if ($scope.stocktakingId) {
            icqaDetailService.getStocktaking0rderUser($window.localStorage["clientId"], function (data) {
                $scope.usersSource = data;
            });
            $scope.times = 4;
            inventoryCount($scope.stocktakingId);
            $scope.inventoryStaff = true;
            $scope.inventory = [];
            $scope.personnelArr = [];
            $scope.newPersonnelArr = [];

            $("#threeInventoryId").addClass("buttonColorGray");
            $("#twoInventoryId").addClass("buttonColorGray");
            $("#oneInventoryId").addClass("buttonColorGray");
            $("#fourInventoryId").removeClass("buttonColorGray");

            icqaDetailService.checkInventory($scope.stocktakingId, $scope.times, function (v) {
               if (v.length > 0) {
                for (var i = 0; i < v.length; i++) {
                  $scope.newPersonnelArr.push({id: v[i].userDTO.id, name: v[i].userDTO.name});
               }
            }
            icqaDetailService.selectRoundOfInventoryId($scope.times, $scope.stocktakingId, $scope.createdDateOne, $scope.createdDateTwo, function (data) {
               var grid = $("#stocktakingSelectGridONEId").data("kendoGrid");
                grid.setDataSource(new kendo.data.DataSource({data: data}));
           });
            icqaDetailService.select0rdersByStocktakingIds($scope.stocktakingId, $scope.times, function (res) {
                $scope.inventory = res;
                var notInventory = 0;
                for (var i = 0; i < $scope.inventory.length; i++) {
                    if ($scope.inventory[i].state == "未盘点") {
                        notInventory++;
                    }
                }
                if (notInventory == 0 && $scope.newPersonnelArr.length > 0) {
                    $scope.inventoryUserToAssign = true;
                    $("#userNameId").attr("readonly", "readonly");
                } else {
                    $scope.inventoryUserToAssign = false;
                    $("#userNameId").removeAttr("readonly");
                }
                var grid = $("#stocktakingDetailsGridId").data("kendoGrid");
                grid.setDataSource(new kendo.data.DataSource({data: res}));
            });
          });
        } else {
          $("#stocktakingDetailsId").parent().addClass("mySelect");
          $scope.stocktakingDetailsWindow.setOptions({
              width: 600,
              height: 150,
              visible: false,
              actions: false
          });
          $scope.stocktakingDetailsWindow.center();
          $scope.stocktakingDetailsWindow.open();
      }
   };

    $scope.inventoryUsers = function (v) {
      if ($scope.newPersonnelArr.length > 0) {
        for (var i = 0; i < $scope.newPersonnelArr.length; i++) {
          if (v.id == $scope.newPersonnelArr[i].id) {
            $scope.inventoryUser = false;
            break;
          } else {
            $scope.inventoryUser = true;
          }
        }
      } else {
        $scope.personnelArr.push({id: v.id, name: v.name});
      }
      if ($scope.inventoryUser) {
        $scope.personnelArr.push({id: v.id, name: v.name});
      }
    };

    $scope.deletePersonnelArr = function (id) {
      for (var i = 0; i < $scope.personnelArr.length; i++) {
        if (id == $scope.personnelArr[i].id) {
          $scope.personnelArr.splice(i, 1);
        }
      }
    };

    $scope.backAll = function () {
      $scope.icqaDetailPage = "ONE";
    };

    var columnsDetails = [
      {field: "locationName", headerTemplate: "<span translate='货位'></span>"},
      {field: "operator", headerTemplate: "<span translate='盘点人员'></span>"},
      {field: "state", headerTemplate: "<span translate='货位状态'></span>"},
        {
            field: "createDate", headerTemplate: "<span translate='创建时间'></span>", template: function (item) {
            if (item.createDate) {
                return kendo.format("{0:yyyy-MM-dd HH:mm:ss}", kendo.parseDate(item.createDate))
            } else {
                return "";
            }

        }
        },
      {
        field: "countDate", headerTemplate: "<span translate='盘点时间'></span>", template: function (item) {
        if (item.countDate) {
          return kendo.format("{0:yyyy-MM-dd HH:mm:ss}", kendo.parseDate(item.countDate))
        } else {
          return "";
        }
      }
      },
      {field: "stocktakingName", headerTemplate: "<span translate='创建方式'></span>"}];
    $scope.stocktakingDetailsGridOption = ICQABaseService.grid([], columnsDetails, $(document.body).height() - 360);
    $scope.stocktakingSelectGridONEOption = ICQABaseService.grid([], columnsSelect, 100);

    $scope.myGridChange = function () {
      $scope.icqaDetailPage = "TWO";
      var grid = $("#stocktakingOrdersGrid").data("kendoGrid");
      var row = grid.select();
      var data = grid.dataItem(row);
      $scope.stocktakingId = data.id;
      if ($scope.times == 1) {
        $scope.oneInventory();
      } else if ($scope.times == 2) {
        $scope.twoInventory();
      } else if($scope.times == 3){
          $scope.threeInventory();
      } else {
        $scope.fourInventory();
      }
      inventoryCount($scope.stocktakingId);

      icqaDetailService.selectRoundOfInventoryId($scope.times, $scope.stocktakingId, $scope.createdDateOne, $scope.createdDateTwo, function (data) {
        var grid = $("#stocktakingSelectGridONEId").data("kendoGrid");
        grid.setDataSource(new kendo.data.DataSource({data: data}));
      });

      icqaDetailService.select0rdersByStocktakingIds(data.id, $scope.times, function (res) {

        $scope.stocktakingDetail = true;
        var grid = $("#stocktakingDetailsGridId").data("kendoGrid");
        grid.setDataSource(new kendo.data.DataSource({data: res}));
      });
    };
     function inventoryCount(id){
       if(id) {
           icqaDetailService.selectInventoryCount(id, $scope.createdDateOne, $scope.createdDateTwo ,function (data) {
               $scope.oneInventoryCountChild = data.amount1;
               $scope.twoInventoryCountChild = data.amount2;
               $scope.threeInventoryCountChild = data.amount3;
               $scope.fourInventoryCountChild = data.amount4;
           });
       }else{
           icqaDetailService.selectInventoryCount(id,$scope.createdDateOne, $scope.createdDateTwo, function (data) {
               $scope.oneInventoryCount = data.amount1;
               $scope.twoInventoryCount = data.amount2;
               $scope.threeInventoryCount = data.amount3;
               $scope.fourInventoryCount= data.amount4;
           });
       }
     }

    $scope.stocktakingUser = function () {
      var count = [];
      if ($scope.stocktakingId) {
        if ($scope.newPersonnelArr.length > 0) {
          for (var i = 0; i < $scope.inventory.length; i++) {
            if ($scope.inventory[i].state == "未盘点") {
              count.push($scope.inventory[i]);
            }
          }
          $scope.inventory = count;
        }
        $scope.personnelArr = $scope.personnelArr.concat($scope.newPersonnelArr);
        $scope.newPersonnelArr = [];
        var count = parseInt($scope.inventory.length) / parseInt($scope.personnelArr.length);
        var arr = [];
        var temp = [];
        var z = 0;
        if ($scope.inventory.length >= $scope.personnelArr.length) {
          for (var j = 0; j < $scope.personnelArr.length; j++) {
            if (j == 0) {
              arr.push(z);
            } else {
              z = parseInt(count) + z;
              arr.push(z);
            }
          }
          icqaDetailService.deleteUsers($scope.stocktakingId, $scope.times, function () {

          });
        } else {
          $("#inventoryCountId").parent().addClass("mySelect");
          $scope.inventoryCountWindow.setOptions({
            width: 600,
            height: 150,
            visible: false,
            actions: false
          });

          $scope.inventoryCountWindow.center();
          $scope.inventoryCountWindow.open();
          return;
        }
        for (var j = 0; j < $scope.inventory.length; j++) {
          for (var k = 0; k < arr.length; k++) {
            if (j == arr[k]) {
              $scope.personnelArr[k].storageLocationId = $scope.inventory[j].storageLocationId;
              $scope.personnelArr[k].orderIndex = $scope.inventory[j].bayIndex;
            }
          }
        }

        for (var i = 0; i < $scope.personnelArr.length; i++) {
          temp.push({
            "state": "RAW",
            "stocktakingId": $scope.stocktakingId,
            "times": $scope.times,
            "userId": $scope.personnelArr[i].id,
            "storageLocationId": $scope.personnelArr[i].storageLocationId,
            "orderIndex": $scope.personnelArr[i].orderIndex,
            "orderBy": "ASC"
          })
        }

        icqaDetailService.saveStocktakingUser(temp, function () {
          $scope.inventoryUser = false;
          $("#inventoryPersonnelId").parent().addClass("mySelect");
          $scope.inventoryPersonnelWindow.setOptions({
            width: 600,
            height: 150,
            visible: false,
            actions: false
          });
          $scope.inventoryPersonnelWindow.center();
          $scope.inventoryPersonnelWindow.open();
        })
      }
    };
  })
})();
