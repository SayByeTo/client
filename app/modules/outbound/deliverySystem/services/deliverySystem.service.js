/**
 * Created by feiyu.pan on 2017/5/3.
 */
(function () {
  "use strict";

  angular.module("myApp").service('deliverySystemService', function (commonService, $httpParamSerializer, OUTBOUND_CONSTANT) {
    return{
      //获取所有sortCode信息
      getDeliverySystemData:function (searchOption,startTime,endTime,state,success) {
        return "";
        commonService.ajaxMushiny({
          url:OUTBOUND_CONSTANT.getDeliverySystemData+"?startTime="+startTime+"&endTime="+endTime+"&isJustUnOut="+state+"&searchDetail="+searchOption,
          success:function (datas) {
            success && success(datas.data)
          }
        })
      },
      //获取所以未绑定门信息
      getDockDoor:function (success) {
        return "";
        commonService.ajaxMushiny({
          url:OUTBOUND_CONSTANT.getDockDoor,
          success:function (datas) {
            success && success(datas.data)
          }
        })
      },
      //绑定发货门
      bindDockDoor:function (doorNo,sortCode,deliverTime,success) {
        return "";
        commonService.ajaxMushiny({
          url:OUTBOUND_CONSTANT.bindDockDoor+"?doorNo="+doorNo+"&sortCode="+sortCode+"&deliverTime="+deliverTime,
          success:function (datas) {
            success && success(datas.data)
          }
        })
      },
      //重新装载
      reload:function (sortCode,success) {
        return "";
        commonService.ajaxMushiny({
          url:OUTBOUND_CONSTANT.reload+"?sortCode="+sortCode,
          success:function (datas) {
            success && success(datas.data)
          }
        })
      },
      //改变状态
      changeState:function (sortCode,deliverTime,state,success) {
        return "";
        commonService.ajaxMushiny({
          url:OUTBOUND_CONSTANT.changeState+"?sortCode="+sortCode+"&deliveryTime="+deliverTime+"&state="+state,
          success:function (datas) {
            success && success(datas.data)
          }
        })
      },
      //获取打印交接单信息
      getSortCodePrintInfo:function (sortCode,success) {
        return "";
        commonService.ajaxMushiny({
          url:OUTBOUND_CONSTANT.getSortCodePrintInfo+"?sortCode="+sortCode,
          success:function (datas) {
            success && success(datas.data)
          }
        })
      },
      //打印
      print:function (sortCode,success) {
        return "";
        commonService.ajaxMushiny({
          url:OUTBOUND_CONSTANT.print+"?sortCode="+sortCode,
          success:function (datas) {
            success && success(datas.data)
          }
        })
      }
    }
  });
})();