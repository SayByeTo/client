/**
 * Created by thoma.bian on 2017/5/10.
 */


(function () {
  "use strict";

  angular.module("myApp").service('icqaAndonService', function (commonService, ICQA_CONSTANT) {
    return {
      // 取区域
      getAndonMasters: function (option,cb) {
        if(option.startDate == undefined){
          option.startDate = "";
        }else{
          option.startDate =  option.startDate+"T00:00:00";
        }
        if(option.endDate == undefined){
          option.endDate = "";
        }else{
          option.endDate = option.endDate+"T00:00:00";
        }
        if(option.seek == undefined){
          option.seek = "";
        }

        commonService.ajaxMushiny({
            url: ICQA_CONSTANT.getAndonMasters + "?state=" + option.state + "&anDonMasterType=" + option.anDonMasterType + "&seek=" + option.seek + "&startDate=" + option.startDate + "&endDate=" + option.endDate,
            success: function (datas) {
              cb && cb(datas.data);
            }
        });
      },
      updateAndonMasters:function(data,cb){
        commonService.ajaxMushiny({
          method: "PUT",
          data: data,
          url: ICQA_CONSTANT.updateAndonMasters,
          success: function (datas) {
            cb && cb(datas.data);
          }
        });
      },
      selectAndonType:function(id,cb){
        commonService.ajaxMushiny({
          url: ICQA_CONSTANT.selectAndonType+"?search=anDonMasterType.id=="+id,
          success: function (datas) {
            cb && cb(datas.data);
          }
        });
      }
    }
  })
})();
