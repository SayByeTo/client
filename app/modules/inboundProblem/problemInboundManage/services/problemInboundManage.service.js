/**
 * Created by thoma.bian on 2017/5/10.
 */

(function () {
  "use strict";

  angular.module("myApp").service('problemInboundManageService', function (commonService, $window, PROBLEM_INBOUND) {

    return {
      getInboundProblem: function (state, userName, seek, startDate, endDate, success) {
        var url = "";
        if (startDate == null && endDate == null) {
          url = PROBLEM_INBOUND.getInboundProblem + "?state=" + state + "&userName=" + userName + "&seek=" + seek;
        } else {
          if (startDate != null && endDate == null) {
            startDate = startDate + "T00:00:00";
            url = PROBLEM_INBOUND.getInboundProblem + "?state=" + state + "&userName=" + userName + "&seek=" + seek + "&startDate=" + startDate;
          } else if (startDate == null && endDate != null) {
            endDate = endDate + "T23:59:59";
            url = PROBLEM_INBOUND.getInboundProblem + "?state=" + state + "&userName=" + userName + "&seek=" + seek + "&endDate=" + endDate;
          } else if (startDate != null && endDate != null) {
            startDate = startDate + "T00:00:00";
            endDate = endDate + "T23:59:59";
            url = PROBLEM_INBOUND.getInboundProblem + "?state=" + state + "&userName=" + userName + "&seek=" + seek + "&startDate=" + startDate + "&endDate=" + endDate;
          }
        }
       commonService.ajaxMushiny({
          url: url,
          success: function (datas) {
            success && success(datas.data);
          }
        });
      },

      getInboundProblemRule: function (state, userName, seek, startDate, endDate, success) {
        var url = "";
        if (startDate == null && endDate == null) {
          url = PROBLEM_INBOUND.getInboundProblemRule + "?state=" + state + "&userName=" + userName + "&seek=" + seek;
        } else {
          if (startDate != null && endDate == null) {
            startDate = startDate + "T00:00:00";
            url = PROBLEM_INBOUND.getInboundProblemRule + "?state=" + state + "&userName=" + userName + "&seek=" + seek + "&startDate=" + startDate;
          } else if (startDate == null && endDate != null) {
            endDate = endDate + "T00:00:00";
            url = PROBLEM_INBOUND.getInboundProblemRule + "?state=" + state + "&userName=" + userName + "&seek=" + seek + "&endDate=" + endDate;
          } else if (startDate != null && endDate != null) {
            startDate = startDate + "T00:00:00";
            endDate = endDate + "T00:00:00";
            url = PROBLEM_INBOUND.getInboundProblemRule + "?state=" + state + "&userName=" + userName + "&seek=" + seek + "&startDate=" + startDate + "&endDate=" + endDate;
          }
        }
        commonService.ajaxMushiny({
          url: url,
          success: function (datas) {
            success && success(datas.data);
          }
        });
      },

      updateInboundProblemClose: function (Ids, success) {
        commonService.ajaxMushiny({
          url: PROBLEM_INBOUND.updateInboundProblemClose + "/" + Ids,
          success: function (datas) {
            success && success(datas.data);
          }
        });
      },
      findInboundProblem:function(id,success){
        commonService.ajaxMushiny({
          url: PROBLEM_INBOUND.findInboundProblem+"/"+id,
          success: function (datas) {
            success && success(datas.data);
          }
        });
      },
      getGoodsInformation: function (data, cb) {
        commonService.ajaxMushiny({
          url: PROBLEM_INBOUND.getGoodsInformation + "/" + data.inboundProblemId,
          success: function (datas) {
            cb && cb(datas.data);
          }
        });
      },

      getinboundProblemCheck: function (data, cb) {
        commonService.ajaxMushiny({
          url: PROBLEM_INBOUND.getProblemProductsNumber + "?search=inboundProblem.id==" + data.inboundProblem,
          success: function (datas) {
            cb && cb(datas.data);
          }
        })
      }



    }
  });
})();
