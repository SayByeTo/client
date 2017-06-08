/**
 * Created by PC-2 on 2017/5/3.
 */
(function () {
  "use strict";

  angular.module("myApp").service('cartQueryShipmentService', function (commonService, $httpParamSerializer, OUTBOUND_CONSTANT) {
    return{
      getCartQueryShipmentData:function (searchOption,success) {
        return "";
        commonService.ajaxMushiny({
          url:OUTBOUND_CONSTANT.getCartQueryShipmentData+"?searchDetail="+searchOption,
          success:function (datas) {
            success && success(datas.data)
          }
        })
      }
    }
  });
})();