/**
 * Created by frank.zhou on 2017/01/17.
 */
(function () {
  'use strict';
  angular.module('myApp').controller("rebinMainCtl", function ($scope, $rootScope, $state, commonService, outboundService, rebinService) {
    // ================================================外部函数=====================================================
    // 扫描rebinWall
    //批次信息
    $scope.scanReBinWall = function (e, type) {
      var keyCode = window.event ? e.keyCode : e.which;
      if (keyCode != 13) return;
      var name = $scope[type === "one" ? "rebinWall1" : "rebinWall2"];
      //////////判断非正常进入 rebinWall 判定
      if ($rootScope.pickingOrder.rebininfo || $rootScope.rebinStation.rebininfo) {
        if (type === "one") {
          if (name != $scope.rebinWall1) return;
        } else if (type === "two") {
          if (name != $scope.rebinWall2) return;
        }
      }
      rebinService.scanReBinWall(name, $scope.requestId, function (data) {
          if (type === "one") {
            $("#rebin_two").focus(); // 小车输入框获焦
            $scope.rebinWall1Id = data.id;
            $scope.rebinWallOne = data;
            $scope.rebinWallOneRows = [], $scope.rebinWallOneColumns = [];
            $scope.rebinWallOneName = name;
            //
            for (var i = 0; i < $scope.pickingOrder.numColumn; i++) $scope.rebinWallOneColumns.push({
              name: "",
              choice: false
            });
            for (var i = 0; i < $scope.pickingOrder.numRow; i++) $scope.rebinWallOneRows[i] = angular.copy({
              item: $scope.rebinWallOneColumns,
              color: "#c1c1c1"
            });
            if ($scope.pickingOrder.numRebinWall < 2) {
              toMain();
            }
          } else if (type === "two") {
            $scope.rebinWall2Id = data.id;
            $scope.rebinWallTwo = data;
            $scope.rebinWallTwoName = name;
            $scope.rebinWallTwoRows = [], $scope.rebinWallTwoColumns = [];
            for (var i = 0; i < $scope.pickingOrder.numColumn; i++) $scope.rebinWallTwoColumns.push({
              name: "",
              choice: false
            });
            for (var i = 0; i < $scope.pickingOrder.numRow; i++) $scope.rebinWallTwoRows[i] = angular.copy({
              item: $scope.rebinWallTwoColumns,
              color: "#c1c1c1"
            });
            //
            toMain();
          }
        },
        function (data) {
          $scope.bindRebinError = data.message;
        }
      )
    };
    // 扫描拣货车
    $scope.scanPickingContainer = function (e) {
      var keyCode = window.event ? e.keyCode : e.which;
      if (keyCode != 13) return;
      var name = $scope[$scope.pickingProcess === "scanFirstContainer" ? "firstContainer" : "nextContainer"];
      rebinService.scanPickingContainer(name, $scope.requestId, function (data) {
          //  if ($scope.pickingProcess === "scanFirstContainer") {
          $scope.batchTotal = data.amountTotalOfPickingOrder;
          $scope.batchComplete = data.amountRebinedOfPickingOrder;
          $scope.rebinStart = true;
          $scope.rebinFirstContainer = data;
          $scope.pickingProcess = "scanGoods"; // 扫描商品
          $scope.rebinGoodsStatus = "start";
          $scope.containerName = data.containerName;
          $scope.containerComplete = data.amountRebined;
          $scope.containerTotal = data.amountTotal;
          $scope.rebinFromUnitLoadId = data.id;
          if ($scope.containerTotal == $scope.containerComplete) {
            $scope.pickingProcess = "next";
          }
          setTimeout(function () {
            $("#rebin_goods").focus();
          }, 100); // 商品输入框获焦
          // }
        }, rebinError

      );
      $scope[$scope.pickingProcess === "scanFirstContainer" ? "firstContainer" : "nextContainer"] = "";
    };
    // 扫描商品
    $scope.scanGoods = function (e) {
      var keyCode = window.event ? e.keyCode : e.which;
      if (keyCode != 13) return;
      var datas = {
        id: $scope.requestId,
        rebinFromUnitLoadId: $scope.rebinFromUnitLoadId,
        itemNumber: $scope.goods
      }
      rebinService.scanGoods(datas, $scope.requestId, function (data) {
          $scope.rebinExSD = data.deliveryTime ? kendo.format("{0:yyyy-MM-dd HH:mm:ss}", kendo.parseDate(data.deliveryTime)) : ""
          $scope.timeHour = (new Date(kendo.parseDate(data.deliveryTime)) - new Date()) / 3600000;
          $scope.exsdColor = exsdColor($scope.timeHour)
          $scope.exsdFontColor = exsdFontColor($scope.exsdColor)
          $scope.rebinGoods = data;
          rebinWallHighlight(data)
          $scope.rebinHistory.push({
            color: $scope.rebinColor,
            type: data.rebinWallIndex, ////////////第一辆车还是第二辆车
            name: data.rebinToCellName, //rebinwall 名字
            deliveryTime: $scope.rebinExSD, //EXSD
            deliveryTimeColor: $scope.exsdColor, //Exsd背景
            deliveryTimeFont: $scope.exsdFontColor //Exsd 文字
          })
          //check 历史记录轮播 exsd 背景颜色
          $scope.rebinHistory.map(function (data) {
            var hour = (new Date(data.deliveryTime) - new Date()) / 3600000;
            data.deliveryTimeColor = exsdColor(hour);
            data.deliveryTimeFont = exsdFontColor(data.deliveryTimeColor)
            return data
          })
          var grid = $("#rebinGoodsGrid").data("kendoGrid");
          grid.setOptions({
            "editable": false
          });
          var array = [];
          array.push(data)
          grid.setDataSource(new kendo.data.DataSource({
            data: array
          }));
          $scope.containerComplete = data.rebinFromUnitLoad.amountRebined;
          $scope.batchComplete = data.rebinFromUnitLoad.amountRebinedOfPickingOrder;
          if ($scope.containerComplete == $scope.containerTotal) {
            if ($scope.batchComplete == $scope.batchTotal) {}
            $scope.pickingProcess = "next";
            setTimeout(function () {
              $("#rebin_next").focus();
            }, 0);
          }
          $scope.rebinGoodsStatus = "success";
        },
        function (data) {
          $scope.rebinGoodsStatus = "error";
          if (data.message.indexOf("Rebin结束") != -1) {
            openWindow({
              id: "whetherMoreGoodsId",
              className: "windowTitle",
              width: 800,
              height: 280
            });
          } else {
            rebinError(data)
          }
        });
      $scope.goods = "";
    };
    // 查看所有车辆进度
    $scope.readContainerProcess = function () {
      rebinService.rebinfromUnitloads({
        requestId: $scope.requestId
      }, function (data) {
        $scope.containerDetails = data;
      }, rebinError)
      openWindow({
        id: "rebin_containerDetailWin",
        className: "windowTitle",
        width: 600,
        height: 280
      });
    };
    //问题菜单事件
    $scope.problemGoodKeydown = function ($event) {
      if ($event.keyCode != 13) return;
      $scope.problemGoods();
    }
    //焦点锁定
    $scope.rebinFocus = function () {
      if ($scope.showPage == 'main') {
        if ($scope.pickingProcess === 'scanFirstContainer' && $scope.rebinEnd === false) {
          $("#rebin_first").focus();
        } else if ($scope.pickingProcess === 'scanGoods' && $scope.containerComplete != $scope.containerTotal && $scope.rebinEnd === false && $scope.batchComplete != $scope.batchTotal) {
          $("#rebin_goods").focus();
        } else if ($scope.pickingProcess === 'next' && $scope.containerComplete == $scope.containerTotal && $scope.rebinEnd === false && $scope.batchComplete != $scope.batchTotal) {
          $("#rebin_next").focus();
        }
      }
    }
    $scope.problemGoods = function ($event) {
      var key = $scope.problemGood.toUpperCase();
      if (key == "E") {
        rebinService.rebinEnd($scope.requestId, function () {
          $scope.rebinEnd = true;
        })
        $scope.problemMenuWindow.close()
      } else if (key == "I") {
        $scope.userName = localStorage.getItem("name")
        openWindow({
          id: "selectInformationId",
          className: "windowTitle",
          width: 800,
          height: 480
        });
      }
    }
    $scope.rebinContinueClick = function () {
      $rootScope.rebinContinue = true;
      $state.go("main.re_bin");
    }
    // ================================================内部函数=====================================================
    // 打开窗口
    function openWindow(options) {
      options.className && $("#" + options.id).parent().addClass(options.className);
      var win = $("#" + options.id).data("kendoWindow");
      win.setOptions({
        width: options.width,
        height: options.height,
        actions: false,
        close: $scope.rebinFocus //焦点锁定
      });
      options.activate && win.bind("activate", options.activate);
      win.center().open();
    }
    // 监听
    function listenReBin() {
      $("#rebin_parent").bind("keydown", function (e) {
        if ($scope.showPage != "main" || [68, 69, 73, 77, 80].indexOf(e.keyCode) < 0) return;
        /*     openWindow({
               id: "rebin_problemWin",
               className: "problemMenu",
               width: 500,
               height: 280
             });*/
      });
    }
    // 问题菜单
    function initProblemMenu() {
      $("#rebin_questionMenu").kendoMenu({
        select: function (e) {
          var key = $(e.item).attr("key");
          var problemFocus = function () {
            $("#problemGoodsId").focus();
          }
          if (key == "RE_BIN_STOP") {
            rebinService.rebinEnd($scope.requestId, function () {
              $scope.rebinEnd = true;
            }, rebinError)
            $scope.problemMenuWindow.close()
          } else if (key == "MESSAGE_SEARCH") {
            $scope.userName = localStorage.getItem("name")
            openWindow({
              id: "selectInformationId",
              className: "windowTitle",
              width: 800,
              height: 480
            });
          } else {
            openWindow({
              id: "rebin_problemWin",
              className: "problemMenu",
              width: 500,
              height: 380,
              activate: problemFocus
            });
          }
        }
      });
    }
    // 取批次详细信息
    function getPickingOrder() {
      //判断批次绑定rebinWall信息
      if ($rootScope.rebinStation.rebinInfo) {
        $scope.rebinWallMessage1 = $rootScope.rebinStation.rebinInfo.rebinWallNames[0];
        if ($rootScope.rebinStation.rebinInfo.numRebinWall > 1) {
          $scope.rebinWallMessage2 = $rootScope.rebinStation.rebinInfo.rebinWallNames[1];
        }
        $scope.rebinWallNames = $rootScope.rebinStation.rebinInfo.rebinWallNames;
        $scope.containerNumber = $rootScope.rebinStation.rebinInfo.containerNames.join();
        $scope.ExSD = $rootScope.rebinStation.rebinInfo.deliveryTimes.map(function (params) {
          return params ? kendo.format("{0:yyyy-MM-dd HH:mm:ss}", kendo.parseDate(params)) : ""
        }).join();
        $scope.rebinWallCount = $rootScope.rebinStation.rebinInfo.numRebinWall;
        $scope.batchNumber = $rootScope.rebinStation.rebinInfo.pickingOrderNumber;
        $scope.requestId = $rootScope.rebinStation.rebinInfo.id; ///requestId
      } else if ($rootScope.pickingOrder) {
        if ($rootScope.pickingOrder.rebinWallNames != 0) {
          $scope.rebinWallMessage1 = $rootScope.pickingOrder.rebinWallNames[0];
          if ($rootScope.pickingOrder.numRebinWall > 1) {
            $scope.rebinWallMessage2 = $rootScope.pickingOrder.rebinWallNames[1];
          }
          $scope.rebinWallNames = $rootScope.pickingOrder.rebinWallNames;
        }
        $scope.batchNumber = $rootScope.pickingOrder.pickingOrderNumber;
        $scope.rebinWallCount = $rootScope.pickingOrder.numRebinWall;

        $scope.containerNumber = $rootScope.pickingOrder.containerNames.join();
        $scope.ExSD = $rootScope.pickingOrder.deliveryTimes.map(function (params) {
          return params ? kendo.format("{0:yyyy-MM-dd HH:mm:ss}", kendo.parseDate(params)) : ""
        }).join();
        $scope.requestId = $rootScope.pickingOrder.id; ///requestId
      }
      setTimeout(function () {
        $("#rebin_one").focus(); // 小车输入框获焦
      }, 0);
      $scope.bindRebinError = '';
      $scope.rebinHistory = [];
      //////////////////////////>>>>>>>>>>>>>>>>>>>>>>>>轮播初始化
      setTimeout(function () {
            var mySwiper = new Swiper('.swiper-container', {
                slidesPerView: 7,
                observer: true, //修改swiper自己或子元素时，自动初始化swiper
                observeParents: true, //修改swiper的父元素时，自动初始化swiper
                prevButton: '.swiper-button-prev',
                nextButton: '.swiper-button-next',
                spaceBetween: 20,
            })
        });
      //////////////////////////////////////<<<<<<<<<<<<<<<<<<<<<<
    }

    function toMain() {
      var data = {
        id: $scope.requestId,
        rebinWall1Id: $scope.rebinWall1Id,
        rebinWall2Id: $scope.rebinWall2Id
      };
      rebinService.rebinWalls(data, function (data) {
        $scope.bindRebinError = '';
        $scope.pickingProcess = "scanFirstContainer"; // 扫描第一辆拣货车
        setTimeout(function () {
          $("#rebin_first").focus();
        }, 100); // 拣货车输入框获焦
        $scope.showPage = "main"; // 跳转主页
      }, function (data) {
        $scope.bindRebinError = data.message
      })
    }

    function initRebinEndGrid() {
      var columns = [{
          field: "rebinWall",
          headerTemplate: "<span translate='REBIN_WALL'></span>"
        },
        {
          field: "count",
          headerTemplate: "<span translate='REBIN_WALL'>总计件数</span>"
        },
        {
          field: "reason",
          headerTemplate: "<span translate='REBIN_WALL'>reason</span>"
        }
      ]
      var moreColumns = [{
          field: "sku",
          headerTemplate: "<span translate='SKU'></span>"
        },
        {
          field: "name",
          headerTemplate: "<span translate='NAME'></span>"
        }, {
          field: "count",
          headerTemplate: "<span translate='COUNT'></span>"
        },
      ]
      $scope.rebinWallOneProblemOptions = commonService.editGrid({
        editable: false,
        height: 60,
        columns: columns
      });
      $scope.rebinWallTwoProblemOptions = commonService.editGrid({
        editable: false,
        height: 60,
        columns: columns
      });
      $scope.rebinMoreGoodsOptions = commonService.editGrid({
        editable: false,
        height: 60,
        columns: moreColumns
      });
    }

    // 初始化商品列表
    function initReBinGoodsGrid() {
      var columns = [{
          field: "unitName",
          width: "60px",
          headerTemplate: "<span translate='TYPE'></span>"
        },
        {
          field: "itemName",
          headerTemplate: "<span translate='NAME'></span>"
        },
        {
          field: "itemNumber",
          width: "100px",
          headerTemplate: "<span translate='SKU'></span>"
        },
        {
          width: "60px",
          headerTemplate: "<span translate='商品状态'></span>",
          template: function (item) {
            var state = item.amountItemRebined + "/" + item.amountItem;

            return state;
          }
        },
        {
          field: "rebinToCellName",
          width: "60px",
          headerTemplate: "<span translate='目的地'></span>"
        },
        {
          width: "80px",
          headerTemplate: "<span translate='目的地状态'></span>",
          template: function (item) {
            var state = item.amountShipmentRebined + "/" + item.amountShipment;
            setTimeout(function () {
              var grid = $("#rebinGoodsGrid").data("kendoGrid");
              grid.tbody.find('tr').each(function () {
                var state = $(this).find('td:nth-child(6)').text().split("/")
                if (state[0] == state[1]) {
                  $(this).css("background", "#c5e0b4")
                } else {
                  $(this).css("background", "#f2f2f2")
                }
              })
            }, 0);
            return state;
          }
        },
        {
          field: "rebinWallName",
          width: "80px",
          headerTemplate: "<span translate='Rebin车号码'></span>"
        }
      ];
      $scope.rebinGoodsGridOptions = commonService.editGrid({
        editable: false,
        height: 100,
        columns: columns
      });
    }
    //选择rebin格高亮
    function rebinWallHighlight(data) {
      var changeChar = function (char) {
        return Math.abs(65 - char.substring(0, 1).charCodeAt() + $scope.pickingOrder.numRow) - 1
      }
      initRebinWall();
      if (data.rebinWallIndex == 1) {
        $scope.rebinType = "one";
        $scope.rebinWallOneFolatHierarchy = data.rebinToCellName.substring(0, 1); //ABC  层级
        $scope.rebinWallOneFolatNumber = data.rebinToCellName.substring(1, 3); //123 排列
        $scope.rebinWallOneFolatHeight = parseInt(changeChar(data.rebinToCellName));
        $scope.rebinWallOneFolatWidth = parseInt($scope.rebinWallOneFolatNumber) - 1;
        $scope.rebinColor = $scope.rebinWallcolor[$scope.rebinWallOneFolatHierarchy];
        $scope.rebinWallOneRows[$scope.rebinWallOneFolatHeight].color = $scope.rebinWallcolor[$scope.rebinWallOneFolatHierarchy]; //行颜色
        $scope.rebinWallOneRows[$scope.rebinWallOneFolatHeight].item[$scope.rebinWallOneFolatWidth].name = data.rebinToCellName;
        $scope.rebinWallOneRows[$scope.rebinWallOneFolatHeight].item[$scope.rebinWallOneFolatWidth].choice = true;
      } else if (data.rebinWallIndex == 2) {
        $scope.rebinType = "two"
        $scope.rebinWallTwoFolatHierarchy = data.rebinToCellName.substring(0, 1); //ABC  层级
        $scope.rebinWallTwoFolatNumber = data.rebinToCellName.substring(1, 3); //123 排列
        $scope.rebinWallTwoFolatHeight = changeChar(data.rebinToCellName);
        $scope.rebinWallTwoFolatWidth = parseInt($scope.rebinWallTwoFolatNumber) - 1;
        $scope.rebinColor = $scope.rebinWallcolor[$scope.rebinWallOneFolatHierarchy];
        $scope.rebinWallTwoRows[$scope.rebinWallTwoFolatHeight].color = $scope.rebinWallcolor[$scope.rebinWallTwoFolatHierarchy]; //行颜色
        $scope.rebinWallTwoRows[$scope.rebinWallTwoFolatHeight].item[$scope.rebinWallTwoFolatWidth].name = data.rebinToCellName;
        $scope.rebinWallTwoRows[$scope.rebinWallTwoFolatHeight].item[$scope.rebinWallTwoFolatWidth].choice = true;
      }
    }
    //初始化Rebin格子
    function initRebinWall() {
      var init = function (name) {
        angular.forEach(name, function (data) {
          data.color = "#c1c1c1";
          angular.forEach(data.item, function (data) {
            data.name = "";
            data.choice = false;
          })
        });
      }
      init($scope.rebinWallOneRows)
      init($scope.rebinWallTwoRows)
    }
    //exsd 背景
    function exsdColor(timeHour) {
      var color;
      if ($scope.timeHour > 12) {
        color = "#0066CD";
      } else if (($scope.timeHour < 12 && $scope.timeHour > 6) || $scope.timeHour == 12) {
        color = "#66CEFF";
      } else if (($scope.timeHour < 6 && $scope.timeHour > 3) || $scope.timeHour == 6) {
        color = "#FFFF01";
      } else if (($scope.timeHour < 3 && $scope.timeHour > 1) || $scope.timeHour == 3) {
        color = "#FF9901";
      } else if (($scope.timeHour < 1 && $scope.timeHour > 0) || $scope.timeHour == 1) {
        color = "#FF7C81";
      } else if ($scope.timeHour < 0 || $scope.timeHour == 0) {
        color = "#FF0000";
      }
      return color;
    }
    //exsd文字
    function exsdFontColor(time) {
      var color;
      if (time == "#66CEFF" || time == "#FFFF01") {
        color = "#000000"
      } else {
        color = "#FFFFFF"
      }
      return color
    }
    //错误方法
    function rebinError(data) {
      $scope.rebinError = data.message;
      openWindow({
        id: "rebinErrorWindowId",
        className: "windowTitle",
        width: 400,
        height: 280
      });
    }
    //rebin基础初始化
    function initRebin() {
      ///记录rebin格子行颜色
      $scope.rebinWallcolor = {
        A: "#00b050",
        B: "#66ffff",
        C: "#ffff00",
        D: "#ff7c80",
        E: "#c00000",
        F: "#7030a0",
        G: "#FF00FF",
        H: "#FF9900",
        I: "#33CC33",
        J: "#3399FF",
        K: "#0000FF",
        L: "#CC99FF"
      }
      $scope.rebinWall1Id = '';
      $scope.rebinWall2Id = '';
      $scope.rebinStart = false;
      $scope.rebinStation = $rootScope.rebinStation;
      if (!$rootScope.rebinStation.rebinInfo) {
        $scope.pickingOrder = $rootScope.pickingOrder;
      } else {
        $scope.pickingOrder = $rootScope.rebinStation.rebinInfo;
      }
      $scope.showPage = "container"; // 小车页面
      $scope.rebinEnd = false; //rebin结束
    }
    // 初始加载
    function init() {
      initRebin(); //rebin基础初始化
      listenReBin();
      initProblemMenu();
      getPickingOrder(); // 取批次信息
      initReBinGoodsGrid(); // 商品信息表
      initRebinEndGrid(); //rebin结束gird
    }
    // =============================================================================================================
    // 初始化信息
    init();
  })
})();