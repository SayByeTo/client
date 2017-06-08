/**
 * Created by frank.zhou on 2017/04/21.
 */
(function() {
  "use strict";

  angular.module("myApp").service('itemDataGlobalService', function (commonService, MASTER_CONSTANT) {
    return {
      // 检查SKU
      checkSKU: function(skuNo, cb){
        commonService.ajaxMushiny({
          url: MASTER_CONSTANT.checkSKU+"?skuNo="+ skuNo,
          success: function(datas){
            cb && cb(datas.data);
          }
        });
      }
    };
  });
})();