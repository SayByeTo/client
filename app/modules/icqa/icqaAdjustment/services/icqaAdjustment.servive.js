/**
 * Created by thoma.bian on 2017/5/10.
 */

(function () {
  "use strict";

  angular.module("myApp").service('icqaAdjustmentService', function (commonService, ICQA_CONSTANT) {
    return {
      getItemAdjust: function(sku,cb){
        commonService.ajaxMushiny({
          url: ICQA_CONSTANT.getItemAdjust+"?sku="+sku,
          success: function (datas) {
            cb && cb(datas.data);
          }
        });
      }
    }

  })
})();