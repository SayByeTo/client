/**
 * Created by PC-2 on 2017/5/4.
 */
(function () {
  'use strict';

    angular.module("myApp").service("deliveryShipmentsDetailService",function (commonService,$httpParamSerializer,OUTBOUND_CONSTANT) {
      return{
        //获取所以信息
        getDeliveryShipmentsDetailData:function (startTime,endTime,exSD,isJustUnOut,searchDetail,success) {
          return "";
          commonService.ajaxMushiny({
            url:OUTBOUND_CONSTANT.getDeliveryShipmentsDetailData+"?startTime="+startTime+"&endTime="+endTime+"&exSD="+exSD+"&isJustUnOut="+isJustUnOut+"&searchDetail="+searchDetail,
            success:function (datas) {
              success && success(datas.data)
            }
          })
        }
      }
  })
})();