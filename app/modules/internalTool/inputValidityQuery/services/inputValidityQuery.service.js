/**
 * Created by PC-2 on 2017/5/12.
 */
(function () {
  'use strict';
  angular.module("myApp").service("inputValidityQueryService", function (commonService, $httpParamSerializer, INTERNAL_TOOL_CONSTANT) {
    return {
      //获取有效期录入信息
      getBySearchTerm: function (success, searchTerm, startDate, endDate) {
        if (!searchTerm) searchTerm = '';
        if (!startDate) startDate = '';
        if (!endDate) endDate = '';
        commonService.ajaxMushiny({
          url: INTERNAL_TOOL_CONSTANT.getBySearchTerm+ "?searchTerm=" + searchTerm + "&startDate=" + startDate + "&endDate=" + endDate,
          success: function (datas) {
            success && success(datas.data);
          }
        });
      }
    };
  });
})();