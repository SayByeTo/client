/**
 * Created by thoma.bian on 2017/5/10.
 */

(function() {
  "use strict";

   angular.module("myApp").service('inboundProblemService', function (commonService, $window, PROBLEM_INBOUND) {
    return {

      // 扫描工作站
      getInboundProblemStation: function(name, success, error){
        commonService.ajaxMushiny({
          url: PROBLEM_INBOUND.getInboundProblemStation+ "?name="+ name,
          success: function (datas){
            success && success(datas.data);
          },
          error: function(datas){
            error && error(datas.data);
          }
        });
      },

      //解绑工作站
      exitInboundProblemStation: function(name, success, error){
        commonService.ajaxMushiny({
          url: PROBLEM_INBOUND.exitInboundProblemStation+ "?name="+ name,
          success: function (datas){
            success && success(datas.data);
          },
          error: function(datas){
            error && error(datas.data);
          }
        });
      },

      //查询inbound grid
      getInboundProblem:function(state, userName, seek, success){
        if(userName == undefined){
          userName = ""
        }
        if(seek == undefined ){
          seek = "";
        }
        commonService.ajaxMushiny({
          url: PROBLEM_INBOUND.getInboundProblem+"?state="+state+"&userName="+userName+"&seek="+seek,
          success: function (datas) {
            success && success(datas.data);
          }
        });
      },

      //修改状态
      updateInboundProblem: function (data, success) {
        commonService.ajaxMushiny({
          method: "PUT",
          url: PROBLEM_INBOUND.updateInboundProblem,
          data: data,
          success: function (datas) {
           success && success(datas.content);
          }
        });
      },

      //根据Id 查询一条inbound grid
      findInboundProblem:function(id,success){
        commonService.ajaxMushiny({
          url: PROBLEM_INBOUND.findInboundProblem+"/"+id,
          success: function (datas) {
            success && success(datas.data);
          }
        });
      },

      //商品信息
      getGoodsInformation:function(data,success){
        commonService.ajaxMushiny({
          url: PROBLEM_INBOUND.getGoodsInformation+"/"+data.inboundProblemId,
          success: function (datas) {
            success && success(datas.data);
          }
        });
      },

      inboundProblemRecord: function (data,success){
         commonService.ajaxMushiny({
          url: PROBLEM_INBOUND.inboundProblemRecord+"/"+data.inboundProblemId,
            success: function (datas) {
              success && success(datas.data);
          }
        });
      },
      getInboudProblemState:function(data,success){
        commonService.ajaxMushiny({
          method: "POST",
          data:data,
          url: PROBLEM_INBOUND.getInboudProblemState,
          success: function (datas) {
            success && success(datas.data);
          }
        });
      },

      //插入一条记录
      problemProductsNumber: function (data,success){
         commonService.ajaxMushiny({
          method: "POST",
          url: PROBLEM_INBOUND.getProblemProductsNumber,
          data:data,
           success: function (datas) {
             success && success(datas.data);
          }
        })
      },

      //多货上架
      getStowingOverage:function(data,success){
        commonService.ajaxMushiny({
          method: "POST",
          url: PROBLEM_INBOUND.getStowingOverage,
          data:data,
          success: function (datas) {
            success && success(datas.data);
          }
        });
      },

      //移货
      moveGoods:function(data,success){
        commonService.ajaxMushiny({
          method: "POST",
          url: PROBLEM_INBOUND.getMoveGoods,
          data:data,
          success: function (datas) {
            success && success(datas.data);
          }
        });
      },

      //少货上架
      getStowingLoss:function(data,success){
        commonService.ajaxMushiny({
          method: "POST",
          url: PROBLEM_INBOUND.getStowingLoss,
          data:data,
          success: function (datas) {
            success && success(datas.data);
          }
        });
      },

      //盘盈
     overageGoods:function(data,cb) {
        commonService.ajaxMushiny({
          method: "POST",
          url: PROBLEM_INBOUND.getOverageGoods,
          data: data,
          success: function (datas) {
            cb && cb(datas.data);
          }
        });
      },

      //盘亏
      lossGoods:function(data,cb) {
        commonService.ajaxMushiny({
          method: "POST",
          url: PROBLEM_INBOUND.getLossGoods,
          data: data,
          success: function (datas) {
            cb && cb(datas.data);
          }
        });
      },
      getGoods:function(data,cb){
        commonService.ajaxMushiny({
          method: "GET",
          url: PROBLEM_INBOUND.getClientGoods+"?client="+data.client+"&itemNo="+data.itemNo,
          success: function (datas) {
            cb && cb(datas.data);
          }
        });
      },

      //
      getInboundDeal:function(name,cb){
        commonService.ajaxMushiny({
          url: PROBLEM_INBOUND.getInboundDeal+"?name="+name,
          success: function (datas) {
          cb && cb(datas.data);
          }
        });
      },

      //根据目的容器查询目的
      getDestinationId : function(name,cb){
       commonService.ajaxMushiny({
         url: PROBLEM_INBOUND.getDestinationId+"?name="+name,
         success: function (datas) {
           cb && cb(datas.data);
         }
       });
     },

      //并案分析
      getAnalysis:function(ids,cb){
        commonService.ajaxMushiny({
          url: PROBLEM_INBOUND.getAnalysis+"/"+ids,
          success: function (datas) {
            cb && cb(datas.data);
          }
        });
      }
    }
  });
})();