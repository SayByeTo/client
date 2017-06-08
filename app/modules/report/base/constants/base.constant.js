/**
 * Created by zhihan.dong on 2017/04/17.
 * Updated by frank.zhou on 2017/05/12.
 */
(function () {
  "use strict";

  angular.module("myApp").constant("REPORT_CONSTANT", {
    "getWorkflow": "report/workflow-total",
    "getWorkflowDetail": "report/workflow-total/detail",
    "getWorkPoolProcessPath": "report/work-pool/process-path",
    "getWorkPoolProcessPathDetail": "report/workflow/detail",
    "getProcessPathWorkPool": "report/process-path/work-pool",
    "getProcessPathWorkPoolDetail": "report/workflow/detail",
    "getLegacyData": "report/legacyData",
    "getFud": "report/fud",

    "capcityTotal": "report/capacity",
    "queryCapcityPods": "report/capacity/pods",
    "queryCapcitySides": "report/capacity/pods/sides",
    "queryCapcityBins": "report/capacity/pods/sides/bins",
    
    //pickquery
     "pickArea" : "/report/pick-area",
     "pickExsd": "/report/pick-exSD",

  });
})();