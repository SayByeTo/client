/**
 * Created by feiyu.pan on 2017/4/17.
 * Updated by feiyu.pan on 2017/5/15.
 */
(function () {
  "use strict";

  angular.module('myApp').controller("packScanGoodsCtl", function ($scope, $window, $state, $rootScope, packService, outboundService, $translate) {
    $scope.packPage = "workstation"; //页面选择
    $scope.scanNumberShow = false; //扫描数量进度是否显示
    $scope.scanNumber = 0; //扫描进度
    $scope.packWeightEnable = true; //是否称重
    $scope.reBinCellColor = "#f2f2f2"; //reBin格颜色
    $scope.packProblemGoodsAmount = ""; //问题商品数量
    $scope.stationId = "";//工作站ID
    setTimeout(function () {
      $("#workstationId").focus();
    },0);
    //扫描工作站
    $scope.workstations = function (e) {
      var keyCode = window.event ? e.keyCode : e.which;
      if (keyCode == 13) {
        $scope.scanErrorMessage="";
        $scope.stationName=$scope.workstation;
        packService.checkPackStation($scope.stationName,function (data) {
          if(data.packingStationTypeDTO.ifScan){
            $scope.ifWeight=data.packingStationTypeDTO.ifWeight;
            $scope.packPage = "scanPickPackWall";
            $scope.stationId=data.packingStationTypeDTO.id;
            setTimeout(function () {
              $("#pickPackWallId").focus();
            },0);
          }else{
            $scope.scanErrorMessage = "包装工具类型不符，请重新扫描工作站"
          }
        },function (data) {
          $scope.scanErrorMessage=data.message
        });
        $scope.workstation=""
      }
    };
    //扫描pickPackWall
    $scope.scanPickPackWall = function (e) {
      var keyCode = window.event ? e.keyCode : e.which;
      if (keyCode == 13) {
        $scope.scanErrorMessage="";
        $scope.pickPackWallName=$scope.pickPackWall;
        packService.checkPickPackWall($scope.pickPackWallName,function () {
          $scope.packPage = "main";
        });
        $scope.pickPackWall="";
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
      {field: "remarks", width: "80px", headerTemplate: "<span translate='备注'></span>", template: function (item) {
        //返回备注
        return $translate.instant(item.remarks).replace("{0}", $scope.packProblemGoodsAmount.toString());
      }}];
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
    $scope.getGoods=function (pickPackCellId) {
      packService.getGoods(pickPackCellId,function (data) {
        $rootScope.iptFocus();
        var goodDetails = [];
        $scope.useBubbleFilm = true;
        $scope.scanNumberShow = false;
        $scope.packBox = data.customerShipmentDTO.boxType.name;
        $scope.boxNameLength = $scope.packBox.length;
        $scope.rebinCell = data.reBinCellName;
        $scope.reBinCellColor = $rootScope.packReBinCellColor[$scope.rebinCell.substring(0, 1)];
        $scope.shipmentNo = data.customerShipmentDTO.shipmentNo;
        $scope.packExsdTime = kendo.format("{0:yyyy-MM-dd HH:mm:ss}", kendo.parseDate(data.customerShipmentDTO.deliveryDate));
        $rootScope.packOrderState = "scanning";
        var time = (new Date($scope.packExsdTime) - new Date) / 3600000;
        $rootScope.packExsdColorChange(time);
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
            if (parseInt($scope.packSelectedData.scanAmount) == 0 && $rootScope.packStep !== "checkProblemShipment" && $rootScope.packStep !== "checkProblemContainer" && $rootScope.packStep != "") {
              $rootScope.packProblemWindow("#problemMenu", $scope.problemMenuWindow);
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
                } else if ($rootScope.packStep == "checkProblemShipment") {
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
          $rootScope.packStepName = "请检查并扫描商品";
        }
      });
    };
    //称重
    $scope.packGoodsWeight = function () {
      packService.getWeight($scope.stationId,function (data) {
        $scope.weight = data;
        packService.weigh($scope.weight,$scope.shipmentNo,function () {
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
              $scope.moreItemDataName=$scope.itemDataName;
              $scope.moreScanAmount=scanAmount;
              $scope.moreAmount=amount;
              $scope.moreData={
                description:"",
                problemType:"MORE",
                amount:1,
                jobType:'PACK',
                reportBy:$window.localStorage["name"],
                reportDate:kendo.format("{0:yyyy-MM-hh HH:mm:ss}",new Date()),
                problemStoragelocation:"",
                lotNo:$scope.lotNo,
                serialNo:$scope.serialNo,
                skuNo:$scope.skuNo,
                itemNo:$scope.itemNo,
                itemDataId:$scope.itemDataId,
                shipmentId:""
              }
            }
          } else {
            goodsNumber++;
          }
        }
        //判断商品编号是否存在
        if (goodsNumber == data.length) {
          packService.checkItem($scope.itemNo,function (data) {
            $rootScope.packProblemWindow("#packManyGoods", $scope.packManyGoodsWindow);
            $scope.moreItemDataName=data.itemNo;
            $scope.moreScanAmount=1;
            $scope.moreAmount=0;
            $scope.moreData={
              description:"",
              problemType:"MORE",
              amount:1,
              jobType:'PACK',
              reportBy:$window.localStorage["name"],
              reportDate:kendo.format("{0:yyyy-MM-hh HH:mm:ss}",new Date()),
              problemStoragelocation:"",
              lotNo:data.lotNo,
              serialNo:data.serialNo,
              skuNo:data.skuNo,
              itemNo:data.itemNo,
              itemDataId:data.itemDataId,
              shipmentId:""
            }
          },function () {
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
      packService.packing($scope.moreData,function () {
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
          $rootScope.packProblem = "none";
          $rootScope.packStepName = "请扫描箱型号码";
          $rootScope.packStep = "checkBox";
          $rootScope.packOrderState = "scanBox";
          $rootScope.iptFocus()
        } else {
          $rootScope.packStepName = "请重新扫描订单号码";
          $rootScope.packProblem = "errorDialog";
          $rootScope.errorMessage = $scope.shipment + "并不是此订单对应的订单号码，请重新扫描"
        }
        $scope.shipment = "";
      }
    };
    //扫描箱号
    $scope.checkBox = function (e) {
      var keycode = window.event ? e.keyCode : e.which;
      if (keycode == 13) {
        $scope.boxName = $scope.box;
        if ($scope.box.toLowerCase() == $scope.packBox.toLowerCase()) {
          $scope.packFinish();
        } else {
          $rootScope.packProblemWindow("#packBoxWindow", $scope.packBoxWindow);
        }
        $scope.box = "";
      }
    };
    //结束包装
    $scope.packFinish = function () {
      packService.packFinish($scope.shipmentNo,$scope.boxName,function () {
        $rootScope.packStep = "";
        $rootScope.packStepName = "请按动Rebin车上方暗灯，并取出商品";
        $rootScope.packOrderState = "orderSuccess";
        $scope.getGoods()
      });
    };
    //问题商品处理
    $scope.goodsProblemMenu = function (windowId, windowName, problemType) {
      $scope.packProblemGoodsAmount="";
      //问题商品数量为1时直接提报
      if ($scope.packSelectedData.amount === 1) {
        //提报问题商品
        $scope.packProblemGoodsAmount = 1;
        $rootScope.packProblemProcessing("#packGoodDetailsGrid", $scope.itemNo, problemType);
      } else {
        //问题商品数量输入页面
        $rootScope.packProblemWindow(windowId, windowName);
      }
    };
    //确定提报问题商品
    $scope.problemProcessingSure = function (problemType) {
        $rootScope.packProblemProcessing("#packGoodDetailsGrid", $scope.itemNo, problemType);
    };
    //检查问题商品
    $scope.checkProblemShipment = function (e) {
      var keycode = window.event ? e.keyCode : e.which;
      if (keycode == 13) {
        if ($scope.problemShipment == $scope.shipmentNo) {
          $rootScope.packStep = "checkProblemContainer";
          $rootScope.packOrderState = "markComplete";
          $scope.reBinCellColor = "#f2f2f2"
        }
        $scope.problemShipment = "";
      }
    };
    //提报问题
    $scope.checkProblemContainer=function (e) {
      var keycode=window.event ? e.keyCode : e.which;
      if(keycode == 13){
        packService.checkProblemContainer($scope.itemNo,$scope.problemContaine,function () {
          if($rootScope.problemType!="MORE") {
            $scope.problemData = {
              description: "",
              problemType: $rootScope.problemType,
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
          packService.submitQuestion($scope.problemData,function () {
            $scope.getGoods()
          });
        });
        $scope.problemContaine="";
      }
    };
    //信息查询
    $scope.informationInquiry=function () {
      packService.informationInquiry(function (data){
        $scope.userName=data.userName;
        $scope.operationTime=data.operationTime;
        $scope.totalOperating=data.totalOperating;
        $scope.operationalEfficiency=data.operationalEfficiency;
        $scope.target=data.target;
        $scope.conclude=data.conclude;
        $scope.onARebinCell=data.onARebinCell;
        $scope.onAPod=data.onAPod;
        $scope.onAPallet=data.onAPallet;
        $scope.onTheOrder=data.onTheOrder;
        $scope.onTheCartonNo=data.onTheCartonNo;
        $rootScope.packProblemWindow('#informationInquiryId',$scope.informationInquiryWindow);
        $scope.problemProcessingWindow.close()
      })
    }
  });
})();