/**
 * Created by frank.zhou on 2016/11/18.
 */
(function() {
  "use strict";

  angular.module("myApp").service('receivingService', function (commonService, INBOUND_CONSTANT) {
    return {
      // 扫描工作站
      scanStation: function(name, success, error){
        commonService.ajaxMushiny({
          url: INBOUND_CONSTANT.scanStation+ "?name="+ name,
          success: function(datas){
            success && success(datas.data);
          },
          error:function (datas) {
              error && error(datas.data);
          }
        });
      },
      autoFullStorageLocations: function(stationid, success, error){
          commonService.ajaxMushiny({
              url: INBOUND_CONSTANT.deleteallprocess+ "?StationId="+ stationid,
              method: "DELETE",
              success: function(datas){
                  success();
              },
              error:function (datas) {
                  error && error(datas.data);
              }
          });
      },
      //获取所有货位类型
      getStorageLocationTypes:function(success){
          commonService.ajaxMushiny({
              url:INBOUND_CONSTANT.getlocationtypes,
              success:function (datas) {
                  success&&success(datas.data);
              }
          });
      },
        //绑定receiverStation货位
        bindStorageLocationTypes:function (arraydata,success,error) {
            commonService.ajaxMushiny({
                url:INBOUND_CONSTANT.bindlocationtypes,
                method: "POST",
                data:arraydata,
                success:function (success) {
                    success();
                },
                error:function (datas) {
                    error&&error(datas.data);
                }
            });
        },
        //scanstowStation
        scanStowStation:function (stowStationName,success,error) {
            commonService.ajaxMushiny({
                url:INBOUND_CONSTANT.scanstowstation+"?stationName="+stowStationName,
                success:function (datas) {
                    success&&success(datas.data);
                }
            });
        },
        autoFullStowLocation: function(stationid, success, error){
            commonService.ajaxMushiny({
                url: INBOUND_CONSTANT.autofullstowlocation+ "?stationName="+ stationid,
                method: "DELETE",
                success: function(datas){
                    success();
                },
                error:function (datas) {
                    error && error(datas.data);
                }
            });
        },
        //scanstowContainer
        scanStowContainer:function (slid,scanType,stationName,success,error) {
            commonService.ajaxMushiny({
                url:INBOUND_CONSTANT.scanstowcontainer+"?stationName="+stationName+"&slid="+slid+"&scanType="+scanType,
                success:function (datas) {
                    success&&success(datas.data);
                },
                error:function (datas) {
                    error&&error(datas.data);
                }
            });
        },
        //scanstowCiper
        scanStowCiper:function (slid,scanType,stationName,success,error) {
            commonService.ajaxMushiny({
                url:INBOUND_CONSTANT.scanstowciper+"?stationName="+stationName+"&slid="+slid+"&scanType="+scanType,
                success:function (datas) {
                    success&&success(datas.data);
                },
                error:function (datas) {
                    error&&error(datas.data);
                }
            });
        },
        //绑定StowStation货位
        bindStorageLocationTypesToStow:function (arraydata,success,error) {
            commonService.ajaxMushiny({
                url:INBOUND_CONSTANT.bindlocationtypestostow,
                method: "POST",
                data:arraydata,
                success:function (datas) {
                    success&&success(datas);
                },
                error:function (datas) {
                    error&&error(datas.data);
                }
            });
        },
        //扫描pod并获取pod信息
        getPodInfo:function (podid,storagetype,success,error) {
            commonService.ajaxMushiny({
                url:INBOUND_CONSTANT.getpodinfo+"?podid="+podid+"&type="+storagetype,
                success:function (datas) {
                    success&&success(datas.data);
                },
                error:function (datas) {
                    error&&error(datas.data);
                }
            });
        },
        //扫描货筐
        scanStorageLocation:function (slid,scantype,stationname,destinationId,positionIndex,success,error) {
            commonService.ajaxMushiny({
                url:INBOUND_CONSTANT.scanstoragelocation+"?slid="+slid+"&scanType="+scantype+"&stationName="+stationname+"&destinationId="+destinationId+"&positionIndex="+positionIndex,
                success:function (datas) {
                    success&&success(datas.data);
                }});
        },
        //绑定货筐
        bindStorageLocation:function (slid,scantype,stationname,error) {
            commonService.ajaxMushiny({
                url:INBOUND_CONSTANT.scandn+"?slid="+slid+"&scanType="+scantype+"&stationName="+stationname,
                error:function (datas) {
                    error&&error(datas.data);
                }
            })
        },
        //扫描DN
        scanDN:function (dn,success,error) {
            commonService.ajaxMushiny({
                url:INBOUND_CONSTANT.scandn+"?DN="+dn,
                success:function (datas) {
                    success&&success(datas.data);
                },
                error:function (datas) {
                    error&&error(datas.data);
                }
            });
        },
        //扫描商品
        scanItem:function (requestId,itemId,success,error) {
            commonService.ajaxMushiny({
                url:INBOUND_CONSTANT.scanitem+"?requestid="+requestId+"&itemid="+itemId,
                success:function (datas) {
                    success&&success(datas.data);
                },
                error:function (datas) {
                    error&&error(datas.data);
                }
            });
        },
        //扫描商品
        scanStowItem:function (itemId,success,error) {
            commonService.ajaxMushiny({
                url:INBOUND_CONSTANT.scanstowitem+"?itemid="+itemId,
                success:function (datas) {
                    success&&success(datas.data);
                },
                error:function (datas) {
                    error&&error(datas.data);
                }
            });
        },
        //检查SN
        checkSN:function (itemid,sn,success,error) {
            commonService.ajaxMushiny({
                url:INBOUND_CONSTANT.checksn+"?itemId="+itemid+"&SN="+sn,
                success:function () {
                    success();
                },
                error:function (datas) {
                    error&&error(datas.data);
                }
            });
        },
        //检查有效期
        checkAvaTime:function (itemId,avatime,success,error) {
            commonService.ajaxMushiny({
                url:INBOUND_CONSTANT.checkavatime+"?itemId="+itemId+"&avaTime="+avatime,
                success:function (datas) {
                    success&&success(datas.data);
                },
                error:function (datas) {
                    error&&error(datas.data);
                }
            });
        },
        //检查有效期
        checkNotGenuineLocation:function (storageid,stationName,storageType,success,error) {
            commonService.ajaxMushiny({
                url:INBOUND_CONSTANT.scannotgenuine+"?storageId="+storageid+"&stationName="+stationName+"&storageType="+storageType,
                success:function (datas) {
                    success&&success(datas.data);
                },
                error:function (datas) {
                    error&&error(datas.data);
                }
            });
        },
        //检查上架货位
        checkBin:function (storageid,itemId,useAfter,podid,success,error) {
            commonService.ajaxMushiny({
                url:INBOUND_CONSTANT.checkbin+"?storageid="+storageid+"&itemid="+itemId+"&podid="+podid+"&useAfter="+useAfter,
                success:function (datas) {
                    success&&success(datas.data);
                },
                error:function (datas) {
                    error&&error(datas.data);
                }
            });
        },
        //检查上架货筐
        checkStowBin:function (storageid,itemId,podid,success,error) {
            commonService.ajaxMushiny({
                url:INBOUND_CONSTANT.checkstowbin+"?storageid="+storageid+"&itemid="+itemId+"&podid="+podid,
                success:function (datas) {
                    success&&success(datas.data);
                },
                error:function (datas) {
                    error&&error(datas.data);
                }
            });
        },
        //检查上架货筐
        checkContainer:function (storageid,itemId,useAfter,stationName,success,error) {
            console.log("storageid-->"+storageid+"/itemid-->"+itemId+"/useafter-->"+useAfter+"/stationName-->"+stationName);
            commonService.ajaxMushiny({
                url:INBOUND_CONSTANT.checkcontainer+"?storageid="+storageid+"&itemid="+itemId+"&stationName="+stationName+"&useAfter="+useAfter,
                success:function (datas) {
                    success&&success(datas.data);
                },
                error:function (datas) {
                    error&&error(datas.data);
                }
            });
        },
        checkNotGenuisContainer:function (storageid,stationName,type,success,error) {
            commonService.ajaxMushiny({
                url:INBOUND_CONSTANT.scannotgenuine+"?storageid="+storageid+"&stationName="+stationName+"&storageType="+type,
                success:function (datas) {
                    success&&success(datas.data);
                },
                error:function (datas) {
                    error&&error(datas.data);
                }
            });
        },
        //检查非正品货位
        checkPallet:function (storageid,itemId,type,useAfter,success,error) {
            console.log("storageid-->"+storageid+"/itemid-->"+itemId+"/useafter-->"+useAfter+"/type-->"+type);
            commonService.ajaxMushiny({
                url:INBOUND_CONSTANT.checkcontainer+"?storageid="+storageid+"&itemid="+itemId+"&type="+type+"&useAfter="+useAfter,
                success:function (datas) {
                    success&&success(datas.data);
                },
                error:function (datas) {
                    error&&error(datas.data);
                }
            });
        },
        //上架商品
        finishReceive:function (databody,success) {
            commonService.ajaxMushiny({
                url:INBOUND_CONSTANT.finishreceive,
                method:"POST",
                data:databody,
                success:function () {
                    success();
                }
            });
        },
        //上架商品
        finishStow:function (databody,success) {
            commonService.ajaxMushiny({
                url:INBOUND_CONSTANT.finishstow,
                method:"POST",
                data:databody,
                success:function (datas) {
                    success&&success(datas.data);
                }
            });
        },
        finishInnormalReceive:function (databody,success,error) {
            commonService.ajaxMushiny({
                url:INBOUND_CONSTANT.finishreceive,
                method:"POST",
                data:databody,
                success:function () {
                    success();
                },
                error:function (datas) {
                    error&&error(datas.data);
                }
            });
        },
      //扫描目的地
      scanDestination: function(stationId, name, success, error){
        commonService.ajaxMushiny({
          url: INBOUND_CONSTANT.scanDestination+ "?receivingStationId="+ stationId+ "&name="+ name,
          success: function(datas){
            success && success(datas.data);
          },
          error: function(datas){
            error && error(datas.data);
          }
        });
      },
      // 扫描车牌
      scanContainer: function(name, success, error){
        commonService.ajaxMushiny({
          url: INBOUND_CONSTANT.scanContainer+ "?name="+ name,
          success: function(datas){
            success && success(datas.data);
          },
          error: function(datas){
            error && error(datas.data);
          }
        });
      },
      // 获取目的地车牌信息
      getReceivingContainer: function(receivingStationId, success){
        commonService.ajaxMushiny({
          url: INBOUND_CONSTANT.getReceivingContainer+ "?receivingStationId="+ receivingStationId,
          success: function(datas){
            success && success(datas.data);
          }
        });
      },
      // 保存目的地车牌信息
      saveReceivingContainer: function(data, success){
        commonService.ajaxMushiny({
          url: INBOUND_CONSTANT.saveReceivingContainer,
          method: "POST",
          data: data,
          success: function(datas){
            success && success(datas.data);
          }
        });
      },
      // 修改车牌信息
      replaceContainer: function(oldContainerId, newContainerId, success){
        commonService.ajaxMushiny({
          url: INBOUND_CONSTANT.replaceContainer+ "?oldContainerId="+ oldContainerId+ "&newContainerId="+ newContainerId,
          method: "PUT",
          success: function(datas){
            success && success(datas.data);
          }
        });
      },
      // 删除目的地车牌信息
      deleteReceivingContainer: function(stationId, success){
        commonService.ajaxMushiny({
          url: INBOUND_CONSTANT.deleteReceivingContainer+ "?receivingStationId="+ stationId,
          method: "DELETE",
          success: function(datas){
            success && success(datas.data);
          }
        });
      },
      // 扫描收货单号
      scanReceiving: function(adviceNo, success){
        commonService.ajaxMushiny({
          url: INBOUND_CONSTANT.scanReceiving+ "?adviceNo="+ adviceNo,
          success: function(datas){
            success && success(datas.data);
          }
        });
      },
      // 扫描商品
      scanItemData: function(adviceId, itemNo, success){
        commonService.ajaxMushiny({
          url: INBOUND_CONSTANT.scanItemData+ "?adviceId="+ adviceId+ "&itemNo="+ itemNo,
          success: function(datas){
            success && success(datas.data);
          }
        });
      },
      // 筛选目得地
      screenReceivingDestination: function(itemDataId, receivingType, success){
        commonService.ajaxMushiny({
          url: INBOUND_CONSTANT.screenReceivingDestination+ "?itemDataId="+ itemDataId+ "&receivingType="+ receivingType,
          success: function(datas){
            success && success(datas.data);
          }
        });
      },
      // 检查小车是否不同客户同商品
      checkContainers: function(containerId, itemDataId, useNotAfter, success, error){
        useNotAfter != "" && (useNotAfter = "&useNotAfter="+ useNotAfter);
        var options = {
          url: INBOUND_CONSTANT.checkContainer+ "?itemDataId="+ itemDataId+ "&containerId="+ containerId+ useNotAfter,
          success: function(datas){
            success && success(datas.data);
          }
        };
        error && (options.error = function(datas){
          error(datas.data);
        });
        commonService.ajaxMushiny(options);
      },
      // 测量
      receivingGoodsToCubiScan: function(data, success){
        commonService.ajaxMushiny({
          url: INBOUND_CONSTANT.receivingGoodsToCubiScan,
          method: "POST",
          data: data,
          success: function(datas){
            success && success(datas.data);
          }
        });
      },
      // stockUnit
      receivingGoodsToStockUnit: function(data, success){
        commonService.ajaxMushiny({
          url: INBOUND_CONSTANT.receivingGoodsToStockUnit,
          method: "POST",
          data: data,
          success: function(datas){
            success && success(datas.data);
          }
        });
      },
      //
      exitReceiveStation: function(success,error){
        commonService.ajaxMushiny({
          url: INBOUND_CONSTANT.exitReceiveStation,
          method: "DELETE",
          data: data,
          success: function(){
            success();
          },
          error:function(datas){
            error&&error(datas.data);
          }
        });
      },
      // 商品残损
      receivingGoodsToDamage: function(data, success){
        commonService.ajaxMushiny({
          url: INBOUND_CONSTANT.receivingGoodsToDamage,
          method: "POST",
          data: data,
          success: function(datas){
            success && success(datas.data);
          }
        });
      }
    };
  });
})();