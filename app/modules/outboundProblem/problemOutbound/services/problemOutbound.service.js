/**
 * Created by thoma.bian on 2017/5/10.
 */

(function() {
  "use strict";

  angular.module("myApp").service('problemOutboundService', function (commonService, $httpParamSerializer, PROBLEM_OUTBOUND) {
    return {
      // 扫描工作站
      getOutboundProblemStation: function(name, success, error){
        commonService.ajaxMushiny({
          url: PROBLEM_OUTBOUND.getOutboundProblemStation+ "?name="+ name,
          success: function (datas){
            success && success(datas.data);
          },
          error: function(datas){
            error && error(datas.data);
          }
        });
      },
      // 扫描问题车
      getOutboundProblemHandingCar: function(name, success, error){
        commonService.ajaxMushiny({
          url: PROBLEM_OUTBOUND.getOutboundProblemHandingCar+ "?name="+ name,
          success: function(datas){
            success && success(datas.data);
          },
          error: function(datas){
            error && error(datas.data);
          }
        });
      },
      // 扫描shipment
      getShipmentDealProblem: function(data, success, error){
        var params = "";
        data.obpStationId != "" && (params += "?obpStationId="+ data.obpStationId);
        data.obpWallId != "" && (params += "&obpWallId="+ data.obpWallId);
        params += "&shipmentNo="+ data.shipmentNo;
        data.state != "" && (params += "&state="+ data.state);
        commonService.ajaxMushiny({
          url: PROBLEM_OUTBOUND.getShipmentDealProblem+ params,
          success: function (datas) {
            success && success(datas.data);
          },
          error: function(datas){
            error && error(datas.data);
          }
        });
      },
      // 退出
      exitShipment: function(obpStationId, success){
        commonService.ajaxMushiny({
          url: PROBLEM_OUTBOUND.exitShipment+ "?obpStationId="+ obpStationId,
          success: function(datas){
            success && success(datas.data);
          }
        });
      },
      // 问题处理格以放置商品
      problemCellPlaceGoods: function(wallId, success){
        commonService.ajaxMushiny({
          url: PROBLEM_OUTBOUND.problemCellPlaceGoods+ "?wallId="+ wallId,
          success: function (datas) {
            success && success(datas.data);
          }
        });
      },
      // 绑定格子
      bindCell: function(shipmentNo, cellName, success){
        commonService.ajaxMushiny({
          url: PROBLEM_OUTBOUND.bindCell+ "?shipmentNo="+ shipmentNo+ "&cellName="+ cellName,
          success: function (datas) {
            success && success(datas.data);
          }
        });
      },
      // 订单详情
      getOrderDetails: function(data, success){
        var params = "";
        data.obpStationId != "" && (params += "?obpStationId="+ data.obpStationId);
        data.obpWallId != "" && (params += "&obpWallId="+ data.obpWallId);
        params += "&shipmentNo="+ data.shipmentNo;
        data.state != "" && (params += "&state="+ data.state);
        commonService.ajaxMushiny({
          url: PROBLEM_OUTBOUND.getOrderDetails+ params,
          success: function (datas) {
            success && success(datas.data);
          }
        });
      },
      // 订单商品信息
      getOrderGoodsDetails: function(shipmentNo, success){
        commonService.ajaxMushiny({
          url: PROBLEM_OUTBOUND.getOrderGoodsDetails+ "?shipmentNo="+ shipmentNo,
          success: function (datas) {
            success && success(datas.data);
          }
        });
      },
      // 保存商品记录(SN)
      saveGoodsBySN: function(data, success){
        commonService.ajaxMushiny({
          url: PROBLEM_OUTBOUND.saveGoodsBySN+ "?cellName="+ data.cellName+ "&shipmentNo="+ data.shipmentNo+ "&itemNo="+ data.itemNo+ "&serialNo="+ data.serialNo,
          success: function(datas){
            success && success(datas.data);
          }
        });
      },
      // 保存商品记录(非SN)
      saveGoodsInformation: function(data, success){
        commonService.ajaxMushiny({
          url: PROBLEM_OUTBOUND.saveGoodsInformation+ "?cellName="+ data.cellName+ "&shipmentNo="+ data.shipmentNo+ "&itemNo="+ data.itemNo,
          success: function(datas){
            success && success(datas.data);
          }
        });
      },
      // 释放问题格
      releaseQuestionCell: function(data, success){
        commonService.ajaxMushiny({
          url: PROBLEM_OUTBOUND.releaseQuestionCell+ "?"+ $httpParamSerializer(data),
          success: function(datas){
            success && success(datas.data);
          }
        });
      },
      // 商品转为正品
      saveGoodsToGenuine: function(data, success){
        commonService.ajaxMushiny({
          url: PROBLEM_OUTBOUND.saveGoodsToGenuine,
          method: "POST",
          data: data,
          success: function(datas){
            success && success(datas.data);
          }
        });
      },
      // 确认残损
      damageConfirm: function(data, success){
        commonService.ajaxMushiny({
          url: PROBLEM_OUTBOUND.damageConfirm,
          method: "POST",
          data: data,
          success: function(datas){
            success && success(datas.data);
          }
        });
      },
      // 放置商品到残品车
      damageGoods: function(data, success, error){
        commonService.ajaxMushiny({
          url: PROBLEM_OUTBOUND.damageGoods+ "?"+ $httpParamSerializer(data),
          success: function(datas){
            success && success(datas.data);
          },
          error: function(datas){
            error && error(datas.data);
          }
        });
      },
      // 生成新拣货任务
      generateNewPickingTasks: function(data, success){
        commonService.ajaxMushiny({
          url: PROBLEM_OUTBOUND.generateNewPickingTasks,
          method: "POST",
          data: data,
          success: function(datas){
            success && success(datas.data);
          }
        });
      },
      // 取分配货位
      getAssignedLocation: function(itemDataNo, success){
        commonService.ajaxMushiny({
          url: PROBLEM_OUTBOUND.getAssignedLocation+ "?itemDataNo="+ itemDataNo,
          success: function(datas){
            success && success(datas.data);
          }
        });
      },
      // 分配货位取货
      assignedPicking: function(data, success){
        commonService.ajaxMushiny({
          url: PROBLEM_OUTBOUND.assignedPicking,
          method: "POST",
          data: data,
          success: function (datas) {
            success && success(datas.data);
          }
        });
      },
      // 拆单发货
      demolitionShip: function(data, success){
        commonService.ajaxMushiny({
          url: PROBLEM_OUTBOUND.demolitionShip+"?"+ $httpParamSerializer(data),
          success: function(datas){
            success && success(datas.data);
          }
        });
      },
      // 删除订单
      deleteOrderSuccess: function(data, success){
        commonService.ajaxMushiny({
          url: PROBLEM_OUTBOUND.deleteOrderSuccess,
          method: "POST",
          data: data,
          success: function (datas) {
            success && success(datas.data);
          }
        });
      },
      // 删除订单后逐一扫描商品
      deleteOrderScanGoods: function(data, success, error){
        commonService.ajaxMushiny({
          url: PROBLEM_OUTBOUND.deleteOrderScanGoods,
          method: "POST",
          data: data,
          success: function(datas){
            success && success(datas.data);
          },
          error: function(datas){
            error && error(datas.data);
          }
        });
      },
      // 补打条码
      markUpBarcode: function(data, success){
        commonService.ajaxMushiny({
          url: PROBLEM_OUTBOUND.markUpBarcode,
          method: "POST",
          data: data,
          success: function(datas){
            success && success(datas.data);
          }
        });
      },
      // 序列号无法扫描，转为待调查状态
      getInvestigated: function(data, success, error){
        commonService.ajaxMushiny({
          url: PROBLEM_OUTBOUND.getInvestigated,
          method: "POST",
          data: data,
          success: function(datas){
            success && success(datas.data);
          },
          error: function(datas){
            error && error(datas.data);
          }
        });
      },
      // 客户删单
      moveShelvesLicensePlate: function(data, success){
        commonService.ajaxMushiny({
          url: PROBLEM_OUTBOUND.moveShelvesLicensePlate,
          method: "POST",
          data: data,
          success: function(datas){
            success && success(datas.data);
          }
        });
      },
      // 请扫描拣货车牌
      scanPickingLicensePlate:function(containerName,obpWallId,success){
        commonService.ajaxMushiny({
          url: PROBLEM_OUTBOUND.scanPickingLicensePlate+"?containerName="+containerName+"&obpWallId="+obpWallId,
          success: function (datas) {
            success && success(datas.data);
          }
        });
      },
      // 请检查并扫描商品
      checkScanGoods:function(containerName,obpWallId,itemNo,success){
        commonService.ajaxMushiny({
          url: PROBLEM_OUTBOUND.checkScanGoods+"?containerName="+containerName+"&obpWallId="+obpWallId+"&itemNo="+itemNo,
          success: function (datas) {
            success && success(datas.data);
          }
        });
      },
      // 请扫描拣货商品
      scanPickingGoods:function(obpWallId,itemNo,success){
        commonService.ajaxMushiny({
          url: PROBLEM_OUTBOUND.scanPickingGoods+"?obpWallId="+obpWallId+"&itemNo="+itemNo,
          success: function (datas) {
            success && success(datas.data);
          }
        });
      },
      // 强制删单GRID
      forcedDeleteGrid: function(data, success, error){
        if(data.startDate == undefined){
          data.startDate = "";
        }else{
          data.startDate = data.startDate + "T00:00:00";
        }
        if(data.endDate == undefined) {
          data.endDate = "";
        }else {
          data.endDate = data.endDate + "T23:59:59";
        }
        if(data.shipmentNo == undefined){
          data.shipmentNo = "";
        }
        commonService.ajaxMushiny({
          url: PROBLEM_OUTBOUND.forcedDeleteGrid+"?startDate="+data.startDate+"&endDate="+data.endDate+"&shipmentNo="+data.shipmentNo+"&state="+data.state+"&obpStationId="+data.obpStationId+"&obpWallId="+data.obpWallId,
          success: function (datas) {
            success && success(datas.data);
          },
          error:function(datas){
            error && error(datas.data);
          }
        });
      },
      // 强制删单删除订单
      forcedDeleteOrder: function(data, success){
        commonService.ajaxMushiny({
          method: 'PUT',
          url: PROBLEM_OUTBOUND.forcedDeleteOrder+"?container="+data.container+"&shipmentNo="+data.shipmentNo+"&deleteReason="+data.deleteReason,
          success: function(datas){
            success && success(datas.data);
          }
        });
      },

      putForceDeleteGoodsToContainer: function(data, success){
        if(data.serialNo==undefined){
          data.serialNo="";
        }
        commonService.ajaxMushiny({
          method: "POST",
          data: data,
          url: PROBLEM_OUTBOUND.putForceDeleteGoodsToContainer,
          success: function(datas){
            success && success(datas.data);
          }
        });
      }
    }
  });
})();