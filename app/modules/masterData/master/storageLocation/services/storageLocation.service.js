/**
 * Created by frank.zhou on 2017/04/21.
 */
(function() {
  "use strict";

  angular.module("myApp").service('storageLocationService', function (commonService, MASTER_CONSTANT) {
    return {
      // 取pod
      getPod: function(clientId, cb){
        commonService.ajaxMushiny({
          url: MASTER_CONSTANT.getPod+"?clientId="+ clientId,
          success: function(datas){
            cb && cb(datas.data);
          }
        });
      },
      // 取zone
      getZone: function(clientId, cb){
        commonService.ajaxMushiny({
          url: MASTER_CONSTANT.getZone+"?clientId="+ clientId,
          success: function(datas){
            cb && cb(datas.data);
          }
        });
      },
      // 取area
      getArea: function(clientId, cb){
        commonService.ajaxMushiny({
          url: MASTER_CONSTANT.getArea+"?clientId="+ clientId,
          success: function(datas){
            cb && cb(datas.data);
          }
        });
      }
    };
  });
})();