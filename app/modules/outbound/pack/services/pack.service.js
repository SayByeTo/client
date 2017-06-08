/**
 * Created by feiyu.pan on 2017/4/19.
 */
(function () {
  "use strict";

  angular.module("myApp").service('packService', function (commonService, $httpParamSerializer, OUTBOUND_CONSTANT) {
    return{
      //获得商品列表
      getGoods:function (pickPackCellId,success) {
        commonService.ajaxMushiny({
          url:OUTBOUND_CONSTANT.getGoods+"?pickPackCellId="+pickPackCellId,
          success:function (datas) {
            success && success(datas.data)
          }
        })
      },
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
      //检查pickPackWall
      checkPickPackWall:function (pickPackWallName,success,error) {
        commonService.ajaxMushiny({
          url:OUTBOUND_CONSTANT.checkPickPackWall+"?pickPackWallName="+pickPackWallName,
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
      //检查问题货框
      checkProblemContainer:function (itemNo,storageLocationName,success,error) {
        commonService.ajaxMushiny({
          url:OUTBOUND_CONSTANT.checkProblemContainer+"?itemNo="+itemNo+"&storageLocationName="+storageLocationName,
          success:function (datas) {
            success && success(datas.data)
          },error:function (datas) {
            error && error(datas.data)
          }
        })
      },
      //提交问题
      submitQuestion:function (data,success,error) {
        commonService.ajaxMushiny({
          url:OUTBOUND_CONSTANT.submitQuestion,
          method:"POST",
          data:data,
          success:function (datas) {
            success && success(datas.data)
          },error:function (datas) {
            error && error(datas.data)
          }
        })
      },
      //停止包装
      stopPack:function (stationName,success) {
        commonService.ajaxMushiny({
          url:OUTBOUND_CONSTANT.stopPack+"?stationName="+stationName,
          success:function (datas) {
            success && success(datas.data)
          }
        })
      },
      //获取重量
      getWeight:function (id,success) {
        commonService.ajaxMushiny({
          url:OUTBOUND_CONSTANT.getWeight+id,
          success:function (datas) {
            success && success(datas.data)
          }
        })
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