/**
 * Created by frank.zhou on 2017/04/25.
 */
(function() {
  "use strict";

  angular.module("myApp").service('goodsReceiptService', function (commonService, MASTER_CONSTANT) {
    return {
      // 取stockUnit
      getStockUnit: function(id, cb){
        commonService.ajaxMushiny({
          url: MASTER_CONSTANT.getStockUnit.replace("#id#", id),
          success: function(datas){
            cb && cb(datas.data);
          }
        });
      },
      // 扫描DN
      scanDN: function(adviceNo, cb){
        commonService.ajaxMushiny({
          url: MASTER_CONSTANT.scanDN+ "?adviceNo="+ adviceNo,
          success: function(datas){
            cb && cb(datas.data);
          }
        });
      },
      // 激活DN
      activateDN: function(adviceNo, cb){
        commonService.ajaxMushiny({
          url: MASTER_CONSTANT.activateDN+ "?adviceNo="+ adviceNo,
          method: "POST",
          success: function(datas){
            cb && cb(datas.data);
          }
        });
      }
    };
  });
})();