/**
 * Created by xiong on 2017/4/14.
 */
(function () {
    "use strict";
    angular.module("myApp").service("pickToPackService",function ($http,commonService,OUTBOUND_CONSTANT) {
        return{
            //扫描工作站
            scanStation:function (stationName,succ) {
                commonService.ajaxMushiny({
                    url:OUTBOUND_CONSTANT.checkStation+"?pickStationName="+ stationName,
                    success:function (datas) {
                        var info = datas.data.resultMessage;
                        var result = {};
                        if(info == 404){//工作站无效
                            result={msg:"none"};
                            succ(result);
                        }
                        if(info == 405){//工作站已被用户绑定
                            result={msg:"user",obj:datas.data.operatorName};
                            succ(result);
                        }
                        if(info == 406){//工作站绑定的有货筐
                            result={msg:"storage",obj:datas.data};
                            succ(result);
                        }
                        if(info == 1){//工作站扫描成功
                            result={msg:"success",obj:datas.data};
                            succ(result);
                        }
                    }
                })
            },
            //扫描PickPackWall
            scanPickPackCar:function (pickpackWallName,stationName,success) {
                commonService.ajaxMushiny({
                    url: OUTBOUND_CONSTANT.findPickPackWall+'?pickPackWallName='+pickpackWallName+'&pickStationName='+stationName,
                    success:function (datas) {
                        var info = datas.data.resultMessage;
                        if(info == 404){//pickpackwall无效
                            var result = {msg:"none"};
                            success(result);
                        }
                        if(info == 500){//不是系统绑定的pickpackwall
                            var result = {msg:"notsysytem"};
                            success(result);
                        }
                        if(info == 1){
                            var result={msg:"success",obj:datas.data.pickPackFieldTypeDTOS};
                            success(result);
                        }
                    }
                })
            },
            //扫描残品筐
            scanCanPinBasket:function (storageName,stationName,success,error) {
                commonService.ajaxMushiny({
                    url: OUTBOUND_CONSTANT.checkStorageLocation+'?storageName='+storageName+'&stationName='+stationName+"&type=DAMAGED",
                    success:function (datas) {
                        success&&success(datas.data);
                    },error:function (datas) {
                        error&&error(datas.data);
                    }
                })
            },
            //扫描无法扫描货筐
            scanUnScanSKUBasket:function (storageName,stationName,success,error) {
                commonService.ajaxMushiny({
                    url: OUTBOUND_CONSTANT.checkStorageLocation+'?storageName='+storageName+'&stationName='+stationName+"&type=GENUINE",
                    success:function (datas) {
                        success&&success(datas.data);
                    },error:function (datas) {
                        error&&error(datas.data);
                    }
                })
            },
            //扫描待调查货筐
            scanToReserachBasket:function (storageName,stationName,success,error) {
                commonService.ajaxMushiny({
                    url: OUTBOUND_CONSTANT.checkStorageLocation+'?storageName='+storageName+'&stationName='+stationName+"&type=TO_INVESTIGATE",
                    success:function (datas) {
                        success&&success(datas.data);
                    },error:function (datas) {
                        error&&error(datas.data);
                    }
                })
            },
            //绑定货筐
            bindStorage:function (storageName,stationName,type,success) {
                commonService.ajaxMushiny({
                    url: OUTBOUND_CONSTANT.bindStorageLocation + '?storageName=' + storageName + '&stationName=' + stationName + "&type="+type,
                    success: function (datas) {
                        var info = datas.data.resultMessage;
                        if(info == 1){
                            var result = {msg:"ok",pId:datas.data.pickUnitLoadId};
                            success(result);
                        }
                    }
                })
            },
            //扫描pod
            scanPod:function (podName,success) {
                commonService.ajaxMushiny({
                    url: OUTBOUND_CONSTANT.findPod+'?podName='+podName,
                    success:function (datas) {
                        success(datas.data);
                    }
                })
            },
            //获取orderposition
            getOrderPosition:function (podName,stationName,storageLocationName,success) {
                commonService.ajaxMushiny({
                    url: OUTBOUND_CONSTANT.getOrderPosition+'?podName='+podName+"&stationName="+stationName,
                    success:function (datas) {
                        success(datas.data);
                    }
                })
            },
            //扫描商品
            scanSKU:function (obj,success) {
                commonService.ajaxMushiny({
                    url: OUTBOUND_CONSTANT.scanSKU,
                    data:obj,
                    success:function (datas) {
                        var info = datas.data.resultMessage;
                        if(info == 404){//扫描商品不存在
                            var result = {msg:"none"};
                            success(result);
                        }
                        if(info == 500){//b)	扫描的商品的SKU和需要拣的商品的SKU不匹配
                            var result = {msg:"different"};
                            success(result);
                        }
                        if(info == 501){//需要扫描序列号
                            var result = {msg:"serialNo"};
                            success(result);
                        }
                        if(info == 1) {//扫描成功
                            var result = {msg:"ok"};
                            success(result);
                        }
                    }
                })

            },
            //扫描商品序列号
            scanSeriesNo:function (pickId,serialNo,success,error) {
                commonService.ajaxMushiny({
                    url: OUTBOUND_CONSTANT.scanSerialNo+"?pickId="+pickId+"&serialNo="+serialNo,
                    success:function (datas) {
                        success&&success(datas.data);
                    },error:function (datas) {
                        error&&error(datas.data);
                    }
                })
            },
            //问题商品处理
            handleProblemItem:function (obj,success,error) {
                commonService.ajaxMushiny({
                    url: OUTBOUND_CONSTANT.scanProItem,
                    data:obj,
                    success:function (datas) {
                        var info = datas.data.resultMessage;
                        if(info == 1) {//扫描成功
                            success&&success(datas.data);
                        }
                    },error:function (datas) {
                        error&&error(datas.data);
                    }
                })
            },
            //获取站台当前3个筐的信息
            getBakInfo:function (data,success) {
                commonService.ajaxMushiny({
                    url: OUTBOUND_CONSTANT.getAllstorageInfo + "?stationName="+data,
                    success: function (datas) {
                        success(datas.data);
                    }
                });
             },
            //扫描已满货筐
            scanfullBasket:function (storagename,stationname,success) {
                commonService.ajaxMushiny({
                    url: OUTBOUND_CONSTANT.fullstorage + "?storageName="+storagename+"&pickStationName="+stationname,
                    success: function (datas) {
                        success(datas.data);
                    }
                });
            },
            //扫描新的货筐
            scanNewBasket:function (storagename,storageType,stationName,success) {
                commonService.ajaxMushiny({
                    url: OUTBOUND_CONSTANT.checkStorageLocation+'?storageName='+storageName+'&stationName='+stationName+"&type="+storageType,
                    success:function (datas) {
                        var info = datas.data.resultMessage;
                        if(info == 404){//货筐无效
                            var result = {msg:"none"};
                            success(result);
                        }
                        if(info == 606){//货筐已被工作站绑定
                            var result = {msg:"yibangding",stationName:datas.data.stationName};
                            success(result);
                        }
                        if(info == 607){//货筐有商品
                            var result = {msg:"sku",amountSku:datas.data.sum};
                            success(result);
                        }
                        if(info == 1){
                            var result = {msg:"ok"};
                            success(result);
                        }
                    }
                })
            },
            //扫描货位
            scanHuoWei:function (binName,pickId,success) {
                commonService.ajaxMushiny({
                    url: OUTBOUND_CONSTANT.scanBin + "?binName="+binName+"&pickId="+pickId,
                    success: function (datas) {
                        var info = datas.data.resultMessage;
                        if(info == 404){//货位扫描错误
                            success("wrong");
                        }
                        if(info == 1){
                            success("ok");
                        }
                    }
                });
            },
            //逐一扫描货位的商品
            scanEachSKU:function (data,success) {
                commonService.ajaxMushiny({
                    url: OUTBOUND_CONSTANT.scanSKU,
                    data:obj,
                    success:function (datas) {
                        var info = datas.data.resultMessage;
                        if(info == 404){//扫描商品不存在
                            var result = {msg:"none"};
                            success(result);
                        }
                        if(info == 500){//b)	扫描的商品的SKU和需要拣的商品的SKU不匹配
                            var result = {msg:"different"};
                            success(result);
                        }
                        if(info == 501){//需要扫描序列号
                            var result = {msg:"serialNo"};
                            success(result);
                        }
                        if(info == 1) {//扫描成功
                            var result = {msg:"ok"};
                            success(result);
                        }
                    }
                })
            },
            //已扫描完所有商品
            haveScanedAllSKU:function (data) {
                ajaxMushiny({
                    url:OUTBOUND_CONSTANT.haveScanedAll+"?pId="+data,
                })
            },
            //结满工作站所有货筐
            fullAllStorage:function (stationName,success) {
                commonService.ajaxMushiny({
                    url:OUTBOUND_CONSTANT.fullAllStorage+"?stationName="+stationName,
                })
            },

            //问题处理接口
            callProblem:function (data) {
                commonService.ajaxMushiny({
                    url:OUTBOUND_CONSTANT.obproblem,
                    data:data,
                })
            },
            //停止工作
            stopWorking:function (stationName) {
                commonService.ajaxMushiny({
                    url:OUTBOUND_CONSTANT.stopWorking+"?stationName="+stationName
                })
            },
            //打开电子标签
            openLight:function (data) {
                $http({
                    url:"http://192.168.1.88:9090/light/onOffColor?labelId="+data+"&onOffFlag=true",
                })
            },
            //控制颜色打开灯
            openLightWithColor:function (data,color) {
                $http({
                    url:"http://192.168.1.88:9090/light/onOffColor?labelId="+data+"&onOffFlag=true&color="+color,
                })
            },
            //改变灯的颜色
            changeLightColor:function (labelId,color) {
                $http({
                    url:"http://192.168.1.88:9090/light/changeTagColor?labelId="+labelId+"&color="+color,
                })
            },
            //拍灯，获取信息
            clickLight:function (data,success) {
                commonService.ajaxMushiny({
                    url:OUTBOUND_CONSTANT.clickDigitalLabel+"?digitalId="+data,
                    success:function (data) {
                        if(data == 0){
                            success("ok")
                        }
                    }
                })
            }
        }
    });
})();