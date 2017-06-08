/**
 * Created by PC-2 on 2017/5/4.
 */
(function () {
  'use strict';

  angular.module("myApp").service("shipmentDetailService",function (commonService, $httpParamSerializer,OUTBOUND_CONSTANT) {
    return{
      getShipmentInformation:function (searchOption,success,error) {
        return "";
        commonService.ajaxMushiny({
          url:OUTBOUND_CONSTANT.getShipmentInformation+"?searchDetail="+searchOption,
          success:function (datas) {
            success && success(datas.data)
          },error: function (datas) {
            error && error(datas.data)
          }
        })
      }
    }
  })
})();