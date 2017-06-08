/**
 * Created by feiyu.pan on 2017/4/17.
 * Updated by feiyu.pan on 2017/5/15.
 */
(function () {
  "use strict";

  angular.module('myApp').controller("packNoScanGoodsCtl", function ($scope, $window, $state, $rootScope, packService, outboundService, $translate) {
    $scope.packPage = "workstation"; //页面选择
    $scope.scanNumberShow = false; //扫描数量进度是否显示
    $scope.packWeightEnable = false; //是否称重
    $scope.reBinCellColor = "#f2f2f2"; //reBin格颜色
    $scope.packProblemGoodsAmount = ""; //问题商品数量
    $scope.packSuccess=false; //是否包装完成
    $scope.stationId="";//stationId
    setTimeout(function () {
      $("#workstationId").focus();
    },0);
    //扫描工作站
    $scope.workstations=function (e) {
      var keyCode=window.event ? e.keyCode : e.which;
      if(keyCode == 13){
        $scope.scanErrorMessage="";
        $scope.stationName=$scope.workstation;
        packService.checkPackStation($scope.stationName,function (data) {
          if(!data.packingStationTypeDTO.ifScan){
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
    $scope.scanPickPackWall=function (e) {
      var keyCode=window.event ? e.keyCode : e.which;
      if(keyCode == 13){
        $scope.scanErrorMessage="";
        $scope.pickPackWallName=$scope.pickPackWall;
        packService.checkPickPackWall($scope.pickPackWallName,function (data) {
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
      {field: "problemAmount", width: "60px", headerTemplate: "<span translate='问题数'></span>"},
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
        var goodDetails = [];
        $scope.useBubbleFilm = true;
        $scope.scanNumberShow = false;
        $scope.packSuccess = false;
        $scope.packBox = data.customerShipmentDTO.boxType.name;
        $scope.boxNameLength = $scope.packBox.length;
        $scope.rebinCell = data.reBinCellName;
        $scope.reBinCellColor = $rootScope.packReBinCellColor[$scope.rebinCell.substring(0, 1)];
        $scope.shipmentNo = data.customerShipmentDTO.shipmentNo;
        $scope.packExsdTime = kendo.format("{0:yyyy-MM-dd HH:mm:ss}", kendo.parseDate(data.customerShipmentDTO.deliveryDate));
        $rootScope.packOrderState = "packing";
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
            problemAmount: 0,
            useBubbleFilm: data.customerShipmentDTO.positions[i].itemData.useBubbleFilm,
            remarks: ""
          });
        }
        var grid = $("#packGoodDetailsGrid").data("kendoGrid");
        grid.setOptions({
          dataSource: goodDetails, change: function () {
            //弹出问题处理列表
            var grid = $("#packGoodDetailsGrid").data("kendoGrid");
            var row = grid.select();
            $scope.packSelectedData = grid.dataItem(row);
            if ($scope.packStep == "checkShipment") {
              $rootScope.packProblemWindow("#problemMenu", $scope.problemMenuWindow);
              $scope.itemNo = $scope.packSelectedData.itemNo;
              $scope.itemDataName = $scope.packSelectedData.name;
              $scope.uid = $scope.packSelectedData.uid;
              $scope.amount = $scope.packSelectedData.amount;
              $scope.problemAmount = $scope.amount;
              $scope.scanNumberShow = true;
            }
          }, dataBound: function () {
            // //改变grid行颜色
            setTimeout(function () {
              var grid = $("#packGoodDetailsGrid").data("kendoGrid");
              grid.tbody.find('tr').each(function () {
                if ($scope.packSuccess) {
                  $(this).css("background", "#c5e0b4")
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
          $rootScope.packStep = "checkShipment";
          $rootScope.packStepName = "请将下列商品装入指定的包装箱中，并扫描订单号码";
        }
      });
    };
    //称重
    $scope.packGoodsWeight = function () {
      packService.getWeight($scope.stationId,function (data) {
        $scope.weight=data;
        packService.weigh($scope.weight,$scope.shipmentNo,function () {
          $rootScope.packStep = "checkShipment";
          $rootScope.packStepName = "请将下列商品装入指定的包装箱中，并扫描订单号码";
          $scope.packWeightEnable = true;
          $rootScope.iptFocus()
        });
      });
    };
    //扫描订单
    $scope.checkShipment = function (e) {
      var keycode = window.event ? e.keyCode : e.which;
      if (keycode == 13) {
        if ($scope.shipmentNo == $scope.shipment) {
          $scope.packSuccess=true;
          $rootScope.packProblem = "none";
          $rootScope.packStepName = "请扫描箱型号码";
          $rootScope.packStep = "checkBox";
          $rootScope.packOrderState = "scanBox";
          $scope.changeRemarks("订单<br/>扫描完成")
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
        if ($scope.box == $scope.packBox) {
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
        $scope.changeRemarks("包装完成");
        $scope.getGoods()
      });
    };
    //改变备注
    $scope.changeRemarks=function (remark) {
      var grid = $("#packGoodDetailsGrid").data("kendoGrid");
      var data = grid.dataSource.data();
      for(var i=0;i<data.length;i++){
        grid.dataSource.at(i).set("remarks", remark);
      }
    };
    //问题商品处理
    $scope.goodsProblemMenu = function (windowId, windowName, problemType) {
      $scope.packProblemGoodsAmount="";
      //问题商品数量为1时直接提报
      if ($scope.packSelectedData.amount === 1) {
        //提报问题商品
        $scope.packProblemGoodsAmount = 1;
        $rootScope.packProblemProcessing($scope.packProblemGoodsAmount, "#packGoodDetailsGrid", $scope.itemNo, problemType);
        $scope.problemAmount = $scope.packProblemGoodsAmount
      } else {
        //问题商品数量输入页面
        $rootScope.packProblemWindow(windowId, windowName)
      }
    };
    //确定提报问题商品
    $scope.problemProcessingSure = function (problemType) {
      $rootScope.packProblemProcessing($scope.packProblemGoodsAmount, "#packGoodDetailsGrid", $scope.itemNo, problemType);
      $scope.problemAmount = $scope.packProblemGoodsAmount
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
          $scope.problemData = {
            description: "",
            problemType: $rootScope.problemType,
            amount: parseInt($scope.packProblemGoodsAmount),
            jobType: 'PACK',
            reportBy: $window.localStorage["name"],
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