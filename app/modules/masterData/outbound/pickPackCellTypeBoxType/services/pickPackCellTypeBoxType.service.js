/**
 * Created by frank.zhou on 2017/05/08.
 */
(function() {
  "use strict";

  angular.module("myApp").service('pickPackCellTypeBoxTypeService', function (commonService, MASTER_CONSTANT) {
    return {
      // 取boxType
      getBoxTypeByClient: function(clientId, cb){
        commonService.ajaxMushiny({
          url: MASTER_CONSTANT.getBoxTypeByClient+"?clientId="+ clientId,
          success: function(datas){
            cb && cb(datas.data);
          }
        });
      },
      // 未分配PickPackCellType
      getUnassignedPickPackCellTypeByBoxType: function(boxTypeId, cb){
        commonService.ajaxMushiny({
          url: MASTER_CONSTANT.getUnassignedPickPackCellTypeByBoxType.replace("#id#", boxTypeId),
          success: function(datas){
            cb && cb(datas.data);
          }
        });
      },
      // 已分配PickPackCellType
      getAssignedPickPackCellTypeByBoxType: function(boxTypeId, cb){
        commonService.ajaxMushiny({
          url: MASTER_CONSTANT.getAssignedPickPackCellTypeByBoxType.replace("#id#", boxTypeId),
          success: function(datas){
            cb && cb(datas.data);
          }
        });
      },
      // 保存
      save: function(key, id, items, cb){
        commonService.ajaxMushiny({
          url: MASTER_CONSTANT[key].replace("#id#", id),
          data: items,
          method: "POST",
          success: function(datas){
            cb && cb(datas.data);
          }
        });
      }
    };
  });
})();