/**
 * Created by feiyu.pan on 2017/4/19.
 */
(function () {
  "use strict";

  angular.module("myApp").service('rebinPackService', function (commonService, $httpParamSerializer, OUTBOUND_CONSTANT) {
    return{
      //检查包装工作站
      checkPackStation:function (stationName,success,error) {
        commonService.ajaxMushiny({
          url:OUTBOUND_CONSTANT.checkPackStation+"?stationName="+stationName,
          success:function (datas) {
            success && success(datas.data)
          },error:function (datas) {
            error && error(datas.data)
          }
        })
      },
      //检查rebinWall
      checkRebinWall:function (stationName,rebinWallname,success,error) {
        commonService.ajaxMushiny({
          url:OUTBOUND_CONSTANT.checkRebinWall+"?stationName="+stationName+"&rebinWallname="+rebinWallname,
          success:function (datas) {
            success && success(datas.data)
          },error:function (datas) {
            error && error(datas.data)
          }
        })
      },
      //称重
      weigh:function (shipmentNo,weight,success) {
        commonService.ajaxMushiny({
          url:OUTBOUND_CONSTANT.weigh+"?shipmentNo="+shipmentNo+"&weight="+weight,
          success:function (datas) {
            success && success(datas.data)
          }
        })
      },
      //检查商品是否存在
      checkItem:function (itemNo,success,error) {
        commonService.ajaxMushiny({
          url:OUTBOUND_CONSTANT.checkItem+"?itemNo="+itemNo,
          success:function (datas) {
            success && success(datas.data)
          },error:function (datas) {
            error && error(datas.data)
          }
        })
      },
      //包装
      packing:function (data,success,error) {
        commonService.ajaxMushiny({
          url:OUTBOUND_CONSTANT.packing,
          method:"POST",
          data:data,
          success:function (datas) {
            success && success(datas.data)
          },error:function (datas) {
            error && error(datas.data)
          }
        })
      },
      //包装结束
      packFinish:function (shipmentNo,boxName,success,error) {
        commonService.ajaxMushiny({
          url:OUTBOUND_CONSTANT.packFinish+"?shipmentNo"+shipmentNo+"&boxName="+boxName,
          success:function (datas) {
            success && success(datas.data)
          },error:function (datas) {
            error &&  error(datas.data)
          }
        })
      },
      //结束包装
      stopPack:function (stationName,success) {
        commonService.ajaxMushiny({
          url:OUTBOUND_CONSTANT.stop+"?stationName="+stationName,
          success:function (datas){
            success && success(datas.data)
          }
        })
      },
      //获得重量
      getWeight:function (id,success) {
        commonService.ajaxMushiny({
          url:OUTBOUND_CONSTANT.getWeight+id,
          success:function (datas) {
            success && success(datas.data)
          }
        });
      },
      informationInquiry:function (success) {
        commonService.ajaxMushiny({
          url:OUTBOUND_CONSTANT.informationInquiry,
          success:function (datas) {
            success && success(datas.data)
          }
        })
      }
    }
  });
})();