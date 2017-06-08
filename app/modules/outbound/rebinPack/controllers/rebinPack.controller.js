/**
 * Created by feiyu.pan on 2017/5/4.
 * Updated by feiyu.pan on 2017/5/19.
 */
(function () {
  "use strict";

  angular.module('myApp').controller("reBinPackCtl", function ($scope, $window, $state, rebinPackService, outboundService, $translate) {
    $scope.packExsdFontColor = "white";//exsd字体颜色
    $scope.packExsdColor = "#3b6dc7";//exsd颜色
    $scope.packStepName = "请检查并扫描商品"; //包装当前步骤名称
    $scope.packStep = ""; //包装步骤
    $scope.packProblemGoodsAmount = ""; //问题商品数量
    $scope.packProblem = "none";  //问题类型
    $scope.packPage = "workstation"; //页面选择
    $scope.scanNumberShow = false; //扫描数量进度是否显示
    $scope.scanNumber = 0; //扫描进度
    $scope.packWeightEnable = true; //是否称重
    $scope.reBinCellColor = "#f2f2f2"; //reBin格颜色R
    $scope.packProblemGoodsAmount = ""; //问题商品数量
    $scope.stationId="";
    setTimeout(function () {
      $("#workstationId").focus();
    },0);
    $scope.packReBinCellColor = {
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
    };
    //根据距离发货时间改变exsd的颜色
    $scope.packExsdColorChange = function (time) {
      if (time > 12) {
        $scope.packExsdColor = "#0066CD";
      } else if ((time < 12 && time > 6) || time == 12) {
        $scope.packExsdFontColor = "black";
        $scope.packExsdColor = "#66CEFF";
      } else if ((time < 6 && time > 3) || time == 6) {
        $scope.packExsdFontColor = "black";
        $scope.packExsdColor = "#FFFF01";
      } else if ((time < 3 && time > 1) || time == 3) {
        $scope.packExsdColor = "#FF9901";
      } else if ((time < 1 && time > 0) || time == 1) {
        $scope.packExsdColor = "#FF7C81";
      } else if (time < 0 || time == 0) {
        $scope.packExsdColor = "#FF0000";
      }
    };
    //包装提报具体操作
    $scope.packProblemProcessing = function (gridName, name, problemType) {
      var grid = $(gridName).data("kendoGrid");
      for (var i = 0; i < grid.dataSource.data().length; i++) {
        if (grid.dataSource.data()[i].itemNo == name) {
          grid.dataSource.at(i).set("remarks", problemType)
        }
      }
      $scope.packStep = "checkProblemShipment";
      $scope.packOrderState = "problemProcessing";
      if (problemType == "GOODS_LOSS") {
        $scope.problemType = "LOSE";
        $scope.packStepName = "商品丢失标记完成，请扫描当前订单号码";
      } else if (problemType == "GOODS_DAMAGED") {
        $scope.problemType = "DAMAGED";
        $scope.packStepName = "商品残损标记完成，请扫描当前订单号码";
      } else if (problemType == "SERIAL_NUMBER_CAN_NOT_SCAN") {
        $scope.problemType = "UNABLE_SCAN_SN";
        $scope.packStepName = "已成功标记商品序列号无法扫描，请将商品放入问题货筐并扫描货筐号码";
      } else if (problemType == "GOODS_NOT_CAN_SCAN") {
        $scope.problemType = "UNABLE_SCAN_SKU";
        $scope.packStepName = "商品无法扫描标记完成，请扫描订单号码"
      }
    };
    //弹窗
    $scope.packProblemWindow = function (windowId, windowName) {
      $(windowId).parent().addClass("packProblemWindow");
      windowName.setOptions({
        width: 846,
        closable: true,
        close: function () {
          $scope.iptFocus();
        }
      });
      windowName.center();
      windowName.open();
    };
    //输入框
    $scope.iptFocus = function () {
      if ($scope.packStep == 'checkGoods') {
        $("#checkGoodsTxt").focus();
      } else if ($scope.packStep == 'checkSerialNumber') {
        $("#checkSerialNumberTxt").focus();
      } else if ($scope.packStep == 'checkShipment') {
        $("#checkShipmentTxt").focus();
      } else if ($scope.packStep == 'checkBox') {
        $("#checkBoxTxt").focus();
      } else if ($scope.packStep == 'checkProblemShipment') {
        $("#problemShipmentTxt").focus();
      } else if ($scope.packStep == 'checkProblemContainer') {
        $("#problemContainerTxt").focus();
      }
    };
    //扫描工作站
    $scope.workstations = function (e) {
      var keyCode = window.event ? e.keyCode : e.which;
      if (keyCode == 13) {
        $scope.scanErrorMessage = "";
        $scope.stationName = $scope.workstation;
        rebinPackService.checkPackStation($scope.stationName, function (data) {
          if(data.packingStationTypeDTO.ifScan){
            $scope.ifWeight=data.packingStationTypeDTO.ifWeight;
            $scope.stationId=data.packingStationTypeDTO.id;
            $scope.packPage = "scanReBinWall";
            setTimeout(function () {
              $("#rebinCarId").focus();
            },0);
          }else{
            $scope.scanErrorMessage = "包装工具类型不符，请重新扫描工作站"
          }
        }, function (data) {
          $scope.scanErrorMessage = data.message
        });
        $scope.workstation = ""
      }
    };
    //扫描reBinWall
    $scope.scanReBinWall = function (e) {
      var keyCode = window.event ? e.keyCode : e.which;
      if (keyCode == 13) {
        console.log(1)
        $scope.scanErrorMessage = "";
        $scope.rebinWallName = $scope.rebinWall;
        $scope.getGoods($scope.stationName, $scope.rebinWallName);
        $scope.rebinWall = ""
      }
    };
    //grid表头
    var columns = [
      {field: "number", width: "40px", headerTemplate: "<span translate='编号'></span>"},
      {field: "itemNo", width: "140px", headerTemplate: "<span translate='商品条码'></span>"},
      {field: "name", headerTemplate: "<span translate='GOODS_NAME'></span>", attributes: {style: "text-align:left"}},
      {field: "scanAmount", width: "60px", headerTemplate: "<span translate='扫描数'></span>"},
      {field: "amount", width: "60px", headerTemplate: "<span translate='总数量'></span>"},
      //{field: "picture",width:"80px",headerTemplate: "<span translate='PICTURE'></span>" },
      {
        field: "remarks", width: "80px", headerTemplate: "<span translate='备注'></span>", template: function (item) {
        //返回备注
        return $translate.instant(item.remarks).replace("{0}", $scope.packProblemGoodsAmount.toString());
      }
      }];
    $scope.goodDetailsGridOptions = outboundService.reGrids("", columns, $(document.body).height() - 280);
    //数字点击事件
    $scope.bind = function (x) {
      if (x < $scope.amount + 1) {
        if ($scope.amount < 10 && x != 0) {
          $scope.packProblemGoodsAmount = x;
        } else {
          $scope.packProblemGoodsAmount = $scope.packProblemGoodsAmount + x;
          if ($scope.packProblemGoodsAmount.substring(0, 1) == 0) {
            $scope.packProblemGoodsAmount = "";
          }
        }
      }
    };
    //删除数字
    $scope.backspace = function () {
      if ($scope.packProblemGoodsAmount.length > 1) {
        $scope.packProblemGoodsAmount = $scope.packProblemGoodsAmount.substring(0, $scope.packProblemGoodsAmount.length - 1)
      } else {
        $scope.packProblemGoodsAmount = "";
      }
    };
    //获取商品信息
    $scope.getGoods = function (stationName, rebinWallName) {
      rebinPackService.checkRebinWall(stationName, rebinWallName, function (data) {
        $scope.packPage = "main";
        var goodDetails = [];
        $scope.useBubbleFilm = true;
        $scope.scanNumberShow = false;
        $scope.packBox = data.customerShipmentDTO.boxType.name;
        $scope.boxNameLength = $scope.packBox.length;
        $scope.rebinCell = data.reBinCellName;
        $scope.reBinCellColor = $scope.packReBinCellColor[$scope.rebinCell.substring(0, 1)];
        $scope.shipmentNo = data.customerShipmentDTO.shipmentNo;
        $scope.packExsdTime = kendo.format("{0:yyyy-MM-dd HH:mm:ss}", kendo.parseDate(data.customerShipmentDTO.deliveryDate));
        $scope.packOrderState = "scanning";
        var time = (new Date($scope.packExsdTime) - new Date) / 3600000;
        $scope.packExsdColorChange(time);
        for (var i = 0; i < data.customerShipmentDTO.positions.length; i++) {
          goodDetails.push({
            number: i + 1,
            id: data.customerShipmentDTO.positions[i].id,
            serialNo: 1,
            serialRecordType: data.customerShipmentDTO.positions[i].itemData.serialRecordType,
            itemDataId: data.customerShipmentDTO.positions[i].itemData.id,
            itemNo: data.customerShipmentDTO.positions[i].itemData.itemNo,
            name: data.customerShipmentDTO.positions[i].itemData.name,
            amount: data.customerShipmentDTO.positions[i].amount,
            scanAmount: 0,
            useBubbleFilm: data.customerShipmentDTO.positions[i].itemData.useBubbleFilm,
            remarks: "TO_SCAN"
          });
        }
        var grid = $("#packGoodDetailsGrid").data("kendoGrid");
        grid.setOptions({
          dataSource: goodDetails, change: function () {
            //弹出问题处理列表
            var grid = $("#packGoodDetailsGrid").data("kendoGrid");
            var row = grid.select();
            $scope.packSelectedData = grid.dataItem(row);
            if (parseInt($scope.packSelectedData.scanAmount) == 0 && $scope.packStep !== "checkProblemShipment" && $scope.packStep !== "checkProblemContainer" && $scope.packStep !== "") {
              $scope.packProblemWindow("#problemMenu", $scope.problemMenuWindow);
              $scope.itemNo = $scope.packSelectedData.itemNo;
              $scope.itemDataName = $scope.packSelectedData.name;
              $scope.uid = $scope.packSelectedData.uid;
              $scope.amount = $scope.packSelectedData.amount;
              $scope.scanAmount = $scope.packSelectedData.scanAmount;
              $scope.scanNumber = $scope.scanAmount + "/" + $scope.amount;
              $scope.scanNumberShow = true;
              $scope.packProblemGoodsAmount = "";
            }
          }, dataBound: function () {
            // //改变grid行颜色
            setTimeout(function () {
              var grid = $("#packGoodDetailsGrid").data("kendoGrid");
              grid.tbody.find('tr').each(function () {
                if ($(this).find('td:eq(3)').text() == $(this).find('td:eq(4)').text()) {
                  $(this).css("background", "#c5e0b4")
                } else if (parseInt($(this).find('td:eq(3)').text()) > 0 && parseInt($(this).find('td:eq(3)').text()) < parseInt($(this).find('td:eq(4)').text())) {
                  $(this).css("background", "#deebf7")
                } else if ($scope.packStep == "checkProblemShipment") {
                  $("#packGoodDetailsGrid tr").css("background", "#f2f2f2");
                  $("#packGoodDetailsGrid tr[data-uid=" + $scope.uid + "]").css("background", "#FBE5D6");
                }
              });
            }, 0);
          }
        });
        if($scope.ifWeight){
          $scope.packStepName="请将商品取出放置在电子秤上，点击称重按钮，对订单进行称重";
          $scope.packWeightEnable = false;
        }else{
          $rootScope.packStep = "checkGoods";
        }
      }, function (data) {
        $scope.scanErrorMessage = data.message
      });
    };
    //称重
    $scope.packGoodsWeight = function () {
      rebinPackService.getWeight($scope.stationId,function () {
        rebinPackService.weigh($scope.weight, $scope.shipmentNo, function () {
          $rootScope.packStep = "checkGoods";
          $rootScope.packStepName = "请检查并扫描商品";
          $scope.packWeightEnable = true;
          $rootScope.iptFocus()
        });
      });
    };
    //检查扫描商品
    $scope.checkGoods = function (e) {
      var goodsNumber = 0;
      var keycode = window.event ? e.keyCode : e.which;
      var grid = $("#packGoodDetailsGrid").data("kendoGrid");
      var data = grid.dataSource.data();
      if (keycode == 13) {
        $scope.itemNo = $scope.goods;
        for (var i = 0; i < data.length; i++) {
          if (data[i].itemNo == $scope.itemNo) {
            $scope.itemDataId = grid.dataSource.at(i).get("itemDataId");
            $scope.shipmentPositionId = grid.dataSource.at(i).get("id");
            $scope.serialRecordType = grid.dataSource.at(i).get("serialRecordType");
            $scope.serialNo = grid.dataSource.at(i).get("serialNo");
            $scope.itemDataName = grid.dataSource.at(i).get("name");
            $scope.useBubbleFilm = grid.dataSource.at(i).get("useBubbleFilm");
            $scope.uid = grid.dataSource.at(i).get("uid");
            $scope.amount = grid.dataSource.at(i).get("amount");
            $scope.scanAmount = grid.dataSource.at(i).get("scanAmount");
            if (data[i].scanAmount == data[i].amount) {
              //多货
              $rootScope.packProblemWindow("#packManyGoods", $scope.packManyGoodsWindow);
              $scope.moreItemDataName = $scope.itemDataName;
              $scope.moreScanAmount = scanAmount;
              $scope.moreAmount = amount;
              $scope.moreData = {
                description: "",
                problemType: "MORE",
                amount: 1,
                jobType: 'PACK',
                reportBy: $window.localStorage["name"],
                reportDate: kendo.format("{0:yyyy-MM-hh HH:mm:ss}", new Date()),
                problemStoragelocation: "",
                lotNo: $scope.lotNo,
                serialNo: $scope.serialNo,
                skuNo: $scope.skuNo,
                itemNo: $scope.itemNo,
                itemDataId: $scope.itemDataId,
                shipmentId: ""
              }
            }
          } else {
            goodsNumber++;
          }
        }
        //判断商品编号是否存在
        if (goodsNumber == data.length) {
          packService.checkItem($scope.itemNo, function (data) {
            $rootScope.packProblemWindow("#packManyGoods", $scope.packManyGoodsWindow);
            $scope.moreItemDataName = data.itemNo;
            $scope.moreScanAmount = 1;
            $scope.moreAmount = 0;
            $scope.moreData = {
              description: "",
              problemType: "MORE",
              amount: 1,
              jobType: 'PACK',
              reportBy: $window.localStorage["name"],
              reportDate: kendo.format("{0:yyyy-MM-hh HH:mm:ss}", new Date()),
              problemStoragelocation: "",
              lotNo: data.lotNo,
              serialNo: data.serialNo,
              skuNo: data.skuNo,
              itemNo: data.itemNo,
              itemDataId: data.itemDataId,
              shipmentId: ""
            }
          }, function () {
            $rootScope.packProblem = "errorDialog";
            $rootScope.errorMessage = $scope.itemNo + "不是一个有效的条形码，请扫描其他有效条码"
          })
        } else {
          $scope.skuData = {
            stationName: $scope.stationName,
            itemDataId: $scope.itemDataId,
            shipmentNo: $scope.shipmentNo
          };
          if ($scope.serialRecordType == "NO_RECORD") {
            $rootScope.packStep = "checkSerialNumber";
            $rootScope.packStepName = "请扫描商品序列号";
            $rootScope.packProblem = "serialNumber";
            $scope.serialNumberError = false;
            $rootScope.packOrderState = 'exception';
            $rootScope.iptFocus()
          } else {
            checkSuccess();
          }
        }
        $scope.goods = "";
      }
    };
    //扫描序列号
    $scope.checkSerialNumber = function (e) {
      var keycode = window.event ? e.keyCode : e.which;
      if (keycode == 13) {
        if ($scope.serialNumber == $scope.serialNo) {
          $scope.skuData["serialNo"] = $scope.serialNo;
          checkSuccess();
        } else {
          $scope.serialNumberError = true;
        }
        $scope.serialNumber = "";
      }
    };
    //检查完成
    function checkSuccess() {
      //保存一条商品记录
      rebinPackService.packing($scope.moreData, function () {
        var totalCount = 0, numCount = 0;
        var grid = $("#packGoodDetailsGrid").data("kendoGrid");
        var data = grid.dataSource.data();
        $rootScope.packProblem = "none";
        $rootScope.packStep = "checkGoods";
        $rootScope.packStepName = "请检查并扫描商品";
        $rootScope.packOrderState = "scanning";
        for (var j = 0; j < data.length; j++) {
          if (data[j].itemNo == $scope.itemNo) {
            var scanAmount = grid.dataSource.at(j).get("scanAmount") + 1;
            $scope.scanNumber = scanAmount + "/" + grid.dataSource.at(j).get("amount");
            $scope.scanNumberShow = true;
            grid.dataSource.at(j).set("scanAmount", scanAmount);
            grid.dataSource.at(j).set("remarks", "正在扫描");
            if (data[j].scanAmount == data[j].amount) {
              grid.dataSource.at(j).set("remarks", "扫描完成");
            }
          }
          totalCount += data[j].amount;
          numCount += data[j].scanAmount;
        }
        //总数和扫描数相同
        if (numCount == totalCount) {
          $rootScope.packStep = "checkShipment";
          $rootScope.packStepName = "请扫描订单号码";
          $rootScope.packOrderState = "scanShipment"
        }
        $rootScope.iptFocus()
      });
    }

    //扫描订单
    $scope.checkShipment = function (e) {
      var keycode = window.event ? e.keyCode : e.which;
      if (keycode == 13) {
        if ($scope.shipmentNo == $scope.shipment) {
          $scope.packProblem = "none";
          $scope.packStepName = "请扫描箱型号码";
          $scope.packStep = "checkBox";
          $scope.packOrderState = "scanBox"
        } else {
          $scope.packStepName = "请重新扫描订单号码";
          $scope.packProblem = "errorDialog";
          $scope.errorMessage = $scope.shipment + "并不是此订单对应的订单号码，请重新扫描"
        }
        $scope.shipment = "";
      }
    };
    //扫描箱号
    $scope.checkBox = function (e) {
      var keycode = window.event ? e.keyCode : e.which;
      if (keycode == 13) {
        $scope.boxName = $scope.box;
        if ($scope.box == $scope.packBox) {
          $scope.packFinish();
        } else {
          $scope.packProblemWindow("#packBoxWindow", $scope.packBoxWindow);
        }
        $scope.box = "";
      }
    };
    //结束包装
    $scope.packFinish = function () {
      rebinPackService.packFinish($scope.shipmentNo, $scope.boxName, function () {
        $rootScope.packStep = "";
        $rootScope.packOrderState = "orderSuccess";
        $scope.getGoods($scope.stationName, $scope.rebinWallName)
      });
    };
    //问题商品处理
    $scope.goodsProblemMenu = function (windowId, windowName, problemType) {
      //问题商品数量为1时直接提报
      if ($scope.packSelectedData.amount === 1) {
        //提报问题商品
        $scope.packProblemGoodsAmount = 1;
        $scope.packProblemProcessing("#packGoodDetailsGrid", $scope.itemNo, problemType);
      } else {
        //问题商品数量输入页面
        $scope.packProblemWindow(windowId, windowName)
      }
    };
    //确定提报问题商品
    $scope.problemProcessingSure = function (problemType) {
      $scope.packProblemProcessing("#packGoodDetailsGrid", $scope.itemNo, problemType);
    };
    //检查问题商品
    $scope.checkProblemShipment = function (e) {
      var keycode = window.event ? e.keyCode : e.which;
      if (keycode == 13) {
        if ($scope.problemShipment == $scope.shipmentNo) {
          $scope.packStep = "checkProblemContainer";
          $scope.packOrderState = "markComplete";
          $scope.reBinCellColor = "#f2f2f2"
        }
        $scope.problemShipment = "";
      }
    };
    //提报问题
    $scope.checkProblemContainer=function (e) {
      var keycode=window.event ? e.keyCode : e.which;
      if(keycode == 13){
        rebinPackService.checkProblemContainer($scope.itemNo,$scope.problemContaine,function () {
          if($rootScope.problemType!="MORE") {
            $scope.problemData = {
              description: "",
              problemType: $scope.problemType,
              amount: parseInt($scope.packProblemGoodsAmount),
              jobType: 'PACK',
              reportBy: $window.localStorage["username"],
              reportDate: kendo.format("{0:yyyy-MM-hh HH:mm:ss}", new Date()),
              problemStoragelocation: "",
              container: $scope.problemContaine,
              lotNo: $scope.lotNo,
              serialNo: $scope.serialNo,
              skuNo: $scope.skuNo,
              itemNo: $scope.itemNo,
              itemDataId: $scope.itemDataId,
              shipmentId: ""
            };
          }else{
            $scope.problemData=$scope.moreData;
            $scope.problemData["container"]=$scope.problemContaine
          }
          rebinPackService.submitQuestion($scope.problemData,function () {
            $scope.getGoods($scope.stationName, $scope.rebinWallName)
          });
        });
        $scope.problemContaine="";
      }
    };
    //信息查询
    $scope.informationInquiry = function () {
      packService.informationInquiry(function (data) {
        $scope.userName = data.userName;
        $scope.operationTime = data.operationTime;
        $scope.totalOperating = data.totalOperating;
        $scope.operationalEfficiency = data.operationalEfficiency;
        $scope.target = data.target;
        $scope.conclude = data.conclude;
        $scope.onARebinCell = data.onARebinCell;
        $scope.onAPod = data.onAPod;
        $scope.onAPallet = data.onAPallet;
        $scope.onTheOrder = data.onTheOrder;
        $scope.onTheCartonNo = data.onTheCartonNo;
        $rootScope.packProblemWindow('#informationInquiryId', $scope.informationInquiryWindow);
        $scope.problemProcessingWindow.close()
      })
    };
    //结束包装
    $scope.stopPack=function () {
      rebinPackService.stopPack($scope.stationName,function () {
        $scope.packPage='workstation';
        $scope.problemProcessingWindow.close()
      });
    };
    //锁定输入框
    $scope.iptFocus = function () {
      if ($scope.packStep == 'checkGoods') {
        setTimeout(function () {
          $("#checkGoodsTxt").focus();
        })
      } else if ($scope.packStep == 'checkSerialNumber') {
        setTimeout(function () {
          $("#checkSerialNumberTxt").focus();
        }, 0)
      } else if ($scope.packStep == 'checkShipment') {
        setTimeout(function () {
          $("#checkShipmentTxt").focus();
        }, 0)
      } else if ($scope.packStep == 'checkBox') {
        setTimeout(function () {
          $("#checkBoxTxt").focus();
        }, 0)
      } else if ($scope.packStep == 'checkProblemShipment') {
        setTimeout(function () {
          $("#problemShipmentTxt").focus();
        }, 0)
      } else if ($scope.packStep == 'checkProblemContainer') {
        setTimeout(function () {
          $("#problemContainerTxt").focus();
        })
      }
    };
  });
})();