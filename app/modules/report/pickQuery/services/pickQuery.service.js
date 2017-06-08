/**
 * Created by zhihan.dong on 2017/04/17.
 * Updated by zhihan.dong on 2017/04/18.
 */
(function () {
  "use strict";
  angular.module("myApp").service('pickQueryService', function (commonService, REPORT_CONSTANT) {
    return {
      querypickTypeArea: function (cb,ppName,zoneName) {
  /*      cb([{
            ppName: "Total Picking Not Yet Picked",
            zoneSet: [{
              zoneName: "A",
              pickAmount: {
                total: 50
              }
            },
            {
              zoneName: "B",
              pickAmount: {
                total: 50
              }
            }]
          },
          {
            ppName: "Total Picked",
            zoneSet: [{
              zoneName: "A",
              pickAmount: {
                total: 50
              }
            },
            {
              zoneName: "B",
              pickAmount: {
                total: 50
              }
            }]
          },
          {
            ppName: "Total",
            zoneSet: [{
              zoneName: "A",
              pickAmount: {
                total: 50
              }
            },
            {
              zoneName: "B",
              pickAmount: {
                total: 50
              }
            }]
          },
          {
            ppName: "test",
            zoneSet: [{
              zoneName: "A",
              pickAmount: {
                picked: 100,
                notPicked: 50
              }
            },
            {
              zoneName: "B",
              pickAmount: {
                 picked: 100,
                notPicked: 50
              }
            }]
          },
          {
            ppName: "test2",
            zoneSet: [{
              zoneName: "A",
              pickAmount: {
                picked: 200,
                notPicked: 50
              }
            }]
          },
        ]);
        return;*/
        commonService.ajaxMushiny({
          url: REPORT_CONSTANT.pickArea+"?ppName="+(ppName||"")+" &zoneName="+(zoneName||"")+" &deliveryDate=",
          success: function (datas) {
            cb && cb(datas.data);
          }
        });
      },
       querypickTypeExsd: function (cb,ppName,deliveryDate) {
      /*  cb([{
            ppName: "Total Picking Not Yet Picked",
            deliveryDates: [{
              deliveryDateName: "A",
              pickAmount: {
                total: 50
              }
            },
            {
              deliveryDateName: "B",
              pickAmount: {
                total: 50
              }
            }]
          },
          {
            ppName: "Total Picked",
            deliveryDates: [{
              deliveryDateName: "A",
              pickAmount: {
                total: 50
              }
            },
            {
              deliveryDateName: "B",
              pickAmount: {
                total: 50
              }
            }]
          },
          {
            ppName: "Total",
            deliveryDates: [{
              deliveryDateName: "A",
              pickAmount: {
                total: 50
              }
            },
            {
              deliveryDateName: "B",
              pickAmount: {
                total: 50
              }
            }]
          },
          {
            ppName: "test",
            deliveryDates: [{
              deliveryDateName: "A",
              pickAmount: {
                picked: 100,
                notPicked: 50
              }
            },
            {
              deliveryDateName: "B",
              pickAmount: {
                 picked: 100,
                notPicked: 50
              }
            }]
          },
          {
            ppName: "test2",
            deliveryDates: [{
              deliveryDateName: "A",
              pickAmount: {
                picked: 200,
                notPicked: 50
              }
            }]
          },
        ]);
        return;*/
        commonService.ajaxMushiny({
          url: REPORT_CONSTANT.pickExsd+"?ppName="+(ppName||"")+" &zoneName= &deliveryDate="+(deliveryDate||"")+"",
          success: function (datas) {
            cb && cb(datas.data);
          }
        });
      },
    };
  });
})();