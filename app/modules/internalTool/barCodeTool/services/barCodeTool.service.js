/**
 * Created by zhihan.dong on 2017/4/25.
 */


(function () {
    "use strict";

    angular.module("myApp").service('barCodeToolService', function (commonService, INTERNAL_TOOL_CONSTANT) {
        return {
            barcodeScanningSKU: function (sku, success, error) {
                commonService.ajaxMushiny({
                    url: INTERNAL_TOOL_CONSTANT.barcodeScanningSKU + "?sku=" + sku,
                    success: function (datas) {
                        success && success(datas.data);
                    },
                    error: function (datas) {
                        error && error(datas.data);
                    }
                });
            },
        };
    });
})();