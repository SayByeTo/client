/**
 * Created by frank.zhou on 2017/01/17.
 */
(function () {
  "use strict";

  angular.module("myApp").service('rebinService', function (commonService, OUTBOUND_CONSTANT, BACKEND_CONFIG) {
    return {
      // 扫描工作站
      scanStation: function (data, success,error) {
        commonService.ajaxMushiny({
          url: OUTBOUND_CONSTANT.scanStation + "?name=" + data,
          success: function (datas) {
            success && success(datas.data);
          },
          error:function (datas) {
                error&&error(datas.data);
          }
        });
      },
      //绑定rebinwall
      rebinWalls: function (data, success, error) {
        var rebinWalls = OUTBOUND_CONSTANT.rebinWalls.replace(/{requestId}/, data.requestId)
        commonService.ajaxMushiny({
          url: rebinWalls,
          method: "POST",
          data: data,
          success: function (datas) {
            success && success(datas.data);
          },
          error: function (datas) {
            error && error(datas.data);
          }
        });
      },
      //查看所有拣货车进度
      rebinfromUnitloads: function (data, success) {
        var rebinfromUnitloads = OUTBOUND_CONSTANT.rebinfromUnitloads.replace(/{requestId}/, data.requestId)
        commonService.ajaxMushiny({
          url: rebinfromUnitloads,
          success: function (datas) {
            success && success(datas.data);
          }
        });
      },
      // 扫描批次号
      scanPickingOrder: function (number, rebinStationId, success) {
        commonService.ajaxMushiny({

          url: OUTBOUND_CONSTANT.scanPickingOrder + "?number=" + number + "&rebinStationId=" + rebinStationId,
          success: function (datas) {
            success && success(datas.data);
          }
        });
      },
      // 取批次信息
      /*      getPickingOrder: function (id, success) {
              success({
                id: 2,
                name: "pickingOrder01",
                amount: 2
              });
              return;
              commonService.ajaxMushiny({
                url: OUTBOUND_CONSTANT.getPickingOrder + "?id=" + id,
                success: function (datas) {
                  success && success(datas.data);
                },
                error: function (datas) {
                  error && error(datas.data);
                }
              });
            },*/
      // 扫描rebinWall
      scanReBinWall: function (data, requestId, success, error) {
        var scanReBinWall = OUTBOUND_CONSTANT.scanReBinWall.replace(/{requestId}/, requestId)
        commonService.ajaxMushiny({
          url: scanReBinWall + "?name=" + data,
          data: data,
          success: function (datas) {
            success && success(datas.data);
          },
          error: function (datas) {
            error && error(datas.data);
          }
        });
      },
      // 结束rebin
      rebinEnd: function (requestId, success, error) {
        var rebinEnd = OUTBOUND_CONSTANT.rebinEnd.replace(/{requestId}/, requestId)
        commonService.ajaxMushiny({
          method: "POST",
          url: rebinEnd,
          success: function (datas) {
            success && success(datas.data);
          },
          error: function (datas) {
            error && error(datas.data);
          }
        });
      },
      // 扫描拣货车
      scanPickingContainer: function (data, requestId, success, error) {
        var scanPickingContainer = OUTBOUND_CONSTANT.scanPickingContainer.replace(/{requestId}/, requestId)
        commonService.ajaxMushiny({
          url: scanPickingContainer + "?containerName=" + data,
          data: data,
          success: function (datas) {
            success && success(datas.data);
          },
          error: function (datas) {
            error && error(datas.data);
          }
        });
      },
      // 扫描商品
      scanGoods: function (data, requestId, success, error) {
        var scanGoods = OUTBOUND_CONSTANT.scanGoods.replace(/{requestId}/, requestId)
        commonService.ajaxMushiny({
          method: "POST",
          data: data,
          url: scanGoods,
          success: function (datas) {
            success && success(datas.data);
          },
          error: function (datas) {
            error && error(datas.data);
          }
        });
      }, //完成Rebin Position操作
      rebinPosition: function (data, requestId, success) {
        var rebinPosition = OUTBOUND_CONSTANT.rebinPosition.replace(/{requestId}/, requestId)
        rebinPosition = rebinPosition.replace(/{positionId}/, data.id)
        commonService.ajaxMushiny({
          data: data,
          method: "POST",
          url: rebinPosition,
          success: function (datas) {
            success && success(datas.data);
          }
        });
      }
    };
  });
})();