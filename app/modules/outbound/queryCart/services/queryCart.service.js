/**
 * Created by PC-2 on 2017/5/3.
 */
(function () {
  'use strict';

  angular.module("myApp").service("queryCartService",function (commonService, $httpParamSerializer, OUTBOUND_CONSTANT) {
    return{
      getQueryCartData:function (searchOption,success) {
        return "";
        commonService.ajaxMushiny({
          url:OUTBOUND_CONSTANT.getQueryCartData+"?searchDetail="+searchOption,
          success:function (datas) {
            success && success(datas.data)
          }
        })
      }
    }
  })
})();
