/**
 * Created by frank.zhou on 2017/04/21.
 */
(function() {
  "use strict";

  angular.module("myApp").service('semblenceService', function (commonService, MASTER_CONSTANT) {
    return {
      // 取client
      getClient: function(success,error){
        commonService.ajaxMushiny({
          url: MASTER_CONSTANT.getClient,
          success: function(datas){
            success && success(datas.data);
          },
          error:function (datas){
            error&&error(datas.data);
          }
        });
      },
      //取item group
      getItemGroup: function(success,error){
          commonService.ajaxMushiny({
              url: MASTER_CONSTANT.getClient,
              success: function(datas){
                  success && success(datas.data);
              },
              error:function (datas){
                  error&&error(datas.data);
              }
          });
      },
      //创建相似度
      createSemblence:function (databody,success,error) {
          commonService.ajaxMushiny({
              url:MASTER_CONSTANT.createSemblence,
              method:"POST",
              data:databody,
              success:function () {
                  success();
              }
          });
      }
    };
  });
})();