/**
 * Created by thoma.bian on 2017/5/10.
 */

(function() {
  "use strict";

  angular.module("myApp").service('outboundProblemVerifyService', function (commonService, $window, PROBLEM_OUTBOUND) {
    return {
      getOutboundProblem:function(data, success){
        if(data.seek == undefined){
          data.seek = "";
        }
        if(data.userName == undefined){
          data.userName="";
        }
        commonService.ajaxMushiny({
          url: PROBLEM_OUTBOUND.getOutboundProblem+"?state="+data.state+"&userName="+data.userName+"&seek="+data.seek,
          success: function (datas) {
            success && success(datas.data);
          }
        });
      },
      updateOutboundProblemVerify:function(data,success){
        commonService.ajaxMushiny({
          method: "PUT",
          url: PROBLEM_OUTBOUND.updateOutboundProblemVerify,
          data: data,
          success: function (datas) {
            success && success(datas.content);
          }
        });
      },
      findOutboundProblem:function(id,success){
        commonService.ajaxMushiny({
          url: PROBLEM_OUTBOUND.findOutboundProblem+"/"+id,
          success: function (datas) {
            success && success(datas.data);
          }
        });
      },
      getGoodsInformation:function(id,success){
        commonService.ajaxMushiny({
          url: PROBLEM_OUTBOUND.getGoodsInformation+"/"+id,
          success: function (datas) {
            success && success(datas.data);
          }
        });
      },
      outboundProblemRecord: function (id,success){
        commonService.ajaxMushiny({
          url: PROBLEM_OUTBOUND.outboundProblemRecord+"/"+id,
          success: function (datas) {
            success && success(datas.data);
          }
        });
      },
      getRebinCarRecords:function(problemStoragelocation,success){
        commonService.ajaxMushiny({
          url: PROBLEM_OUTBOUND.getRebinCarRecords+"/"+problemStoragelocation,
          success: function (datas) {
            success && success(datas.data);
          }
        });
      },
      getOutbountProblemState:function(data,success){
        commonService.ajaxMushiny({
          method: "POST",
          data:data,
          url: PROBLEM_OUTBOUND.getOutbountProblemState,
          success: function (datas) {
            success && success(datas.data);
          }
        });
      },
      problemProductsNumber: function (data,success){
        commonService.ajaxMushiny({
          method: "POST",
          url: PROBLEM_OUTBOUND.getProblemProductsNumber,
          data:data,
          success: function (datas) {
            success && success(datas.data);
          }
        })
      },

      findOverageGoods:function(data,success){
        commonService.ajaxMushiny({
          method: "POST",
          url: PROBLEM_OUTBOUND.findOverageGoods,
          data:data,
          success: function (datas) {
            success && success(datas.data);
          }
        });
      },
      findLossGoods:function(data,success){
        commonService.ajaxMushiny({
          method: "POST",
          url: PROBLEM_OUTBOUND.findLossGoods,
          data:data,
          success: function (datas) {
            success && success(datas.data);
          }
        });
      },
      getStowingOverage:function(data,success){
        commonService.ajaxMushiny({
          method: "POST",
          url: PROBLEM_OUTBOUND.getStowingOverage,
          data:data,
          success: function (datas) {
            success && success(datas.data);
          }
        });
      },
      moveGoods:function(data,success){
        commonService.ajaxMushiny({
          method: "POST",
          url: PROBLEM_OUTBOUND.getMoveGoods,
          data:data,
          success: function (datas) {
            success && success(datas.data);
          }
        });
      },
      getStowingLoss:function(data,success){
        commonService.ajaxMushiny({
          method: "POST",
          url: PROBLEM_OUTBOUND.getStowingLoss,
          data:data,
          success: function (datas) {
            success && success(datas.data);
          }
        });
      },
      overageGoods:function(data,cb) {
        commonService.ajaxMushiny({
          method: "POST",
          url: PROBLEM_OUTBOUND.getOverageGoods,
          data: data,
          success: function (datas) {
            cb && cb(datas.data);
          }
        });
      },
      lossGoods:function(data,cb) {
        commonService.ajaxMushiny({
          method: "POST",
          url: PROBLEM_OUTBOUND.getLossGoods,
          data: data,
          success: function (datas) {
            cb && cb(datas.data);
          }
        });
      },
      getGoods:function(data,cb){
        commonService.ajaxMushiny({
          method: "GET",
          url: PROBLEM_OUTBOUND.getClientGoods+"?client="+data.client+"&itemNo="+data.itemNo,
          success: function (datas) {
            cb && cb(datas.data);
          }
        });
      },
     getRule:function(name,cb){
        commonService.ajaxMushiny({
          url: PROBLEM_OUTBOUND.getRule+"?rule="+name,
          success: function (datas) {
            cb && cb(datas.data);
          }
        });
      },
      getAnalysis:function(skuNo,cb) {
        commonService.ajaxMushiny({
          url: PROBLEM_OUTBOUND.getAnalysis + "/" + skuNo,
          success: function (datas) {
            cb && cb(datas.data);
          }
        });
      },

      //下面没有
      getDestinationId : function(name,cb){
        commonService.ajaxMushiny({
          url: PROBLEM_OUTBOUND.getDestinationId+"?storageLocationName="+name,
          success: function (datas) {
            cb && cb(datas.data);
          }
        });
      }

    }
  })
})();