/**
 * Created by xiong on 2017/4/14.
 */
(function () {
    "use strict";
    angular.module("myApp").service("pickToToteService",function ($http,commonService,OUTBOUND_CONSTANT) {
        return{
            //扫描工作站
            scanStation:function (stationName,succ) {
                commonService.ajaxMushiny({
                    url:OUTBOUND_CONSTANT.scanPickToToteStation+"?pickStationName="+ stationName,
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
                            result={msg:"storage",obj:datas.data.pickingUnitLoadResults};
                            succ(result);
                        }
                        if(info == 1){//工作站扫描成功
                            result={msg:"success",amount:datas.data.amountPosition};
                            succ(result);
                        }
                    }
                })
            },
            //查看问题筐是否绑定
            checkProStorage:function (stationName,succ) {
                commonService.ajaxMushiny({
                    url:OUTBOUND_CONSTANT.checkStorage +"?stationName="+stationName,
                    success:function (datas) {
                        var info = datas.data.resultMessage;
                        if(info == 700){//没有绑定残品筐
                            var result = {msg:"NODAMAGED",data:datas.data};
                            succ(result);
                        }
                        if(info == 701){//没有绑定无法扫描筐
                            var result = {msg:"NOUNSCAN",data:datas.data};
                            succ(result);
                        }
                        if(info == 1){
                            var result = {msg:"ok"};
                            succ(result);
                        }
                    }
                })
            },
            //扫描pod，检查batch对应的货筐是否绑定
            checkBatch:function (podName,stationName,success) {
                commonService.ajaxMushiny({
                    url:OUTBOUND_CONSTANT.checkOrder+"?podName="+podName+"&stationName="+stationName,
                    success:function (datas) {
                        var info = datas.data.resultMessage;
                        if(info == 702){//需要绑定货筐
                            var result = {msg:"NOSTORAGE",data:datas.data};
                            success(result);
                        }
                        if(info == 1){
                            var result = {msg:"ok"};
                            success(result);
                        }
                    }
                })
            },
            //扫描残品筐
            scanCanPinBasket:function (storageName,stationName,pickUnitLoadId,success) {
                commonService.ajaxMushiny({
                    url: OUTBOUND_CONSTANT.bindStorage+'?storageName='+storageName+'&stationName='+stationName+"&pickUnitLoadId="+pickUnitLoadId+"&type=DAMAGED",
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
            //扫描无法扫描货筐
            scanUnScanSKUBasket:function (storageName,stationName,pickUnitLoadId,success) {
                commonService.ajaxMushiny({
                     url: OUTBOUND_CONSTANT.bindStorage+'?storageName='+storageName+'&stationName='+stationName+"&pickUnitLoadId="+pickUnitLoadId+"&type=GENUINE",
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
            //扫描空拣货货筐
            scanEmptyStorage:function (storageName,stationName,pickUnitLoadId,success) {
                commonService.ajaxMushiny({
                 url: OUTBOUND_CONSTANT.bindStorage+'?storageName='+storageName+'&stationName='+stationName+"&pickUnitLoadId="+pickUnitLoadId+"&type=GENUINE",
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
                    url: OUTBOUND_CONSTANT.getOrder+'?podName='+podName+"&stationName="+stationName+"&storageLocationName="+storageLocationName,
                    success:function (datas) {
                        success(datas.data);
                    }
                })
            },
            //扫描商品
            scanSKU:function (obj,success,error) {
                commonService.ajaxMushiny({
                    url: OUTBOUND_CONSTANT.confirmItem,
                    method:"POST",
                    data:obj,
                    success:function (datas) {
                       success&&success(datas.data);
                    },
                    error:function (datas) {
                       error&&error(datas.data);
                    }
                })

            },
            //扫描商品序列号
            scanSeriesNo:function (pickId,serialNo,success) {
                commonService.ajaxMushiny({
                    url: OUTBOUND_CONSTANT.scanSerialNo+"?pickId="+pickId+"&serialNo="+serialNo,
                    success:function (datas) {
                        success("ok");
                    }
                })
            },
            //扫描残损商品
            scanskuDamaged:function (obj,success) {
                commonService.ajaxMushiny({
                    url: OUTBOUND_CONSTANT.scanDamagedItem,
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
                        if(info == 502){
                            var result = {msg:"sameName_diffrentTime",storagename:datas.data.storageName};
                            success(result);
                        }
                        if(info == 503){
                            var result = {msg:"SameNameSKU",storagename:datas.data.storageName};
                            success(result);
                        }
                        if(info == 1) {//扫描成功
                            var result = {msg:"ok"};
                            success(result);
                        }
                    }
                })
            },
            //获取站台当前货筐的信息
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
                    url: OUTBOUND_CONSTANT.bindStorage+'?storagename='+storageName+'&stationName='+stationName+"&pickUnitLoadId="+pickUnitLoadId+"&type="+storageType,
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
                    url: OUTBOUND_CONSTANT.confirmItem,
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
            //结满工作站所有货筐
            fullAllStorage:function (stationName,success) {
                commonService.ajaxMushiny({
                    url:OUTBOUND_CONSTANT.fullAllStorage+"?stationName="+stationName,
                    success:function () {
                        success();
                    }
                })
            },
            //绑定货筐
            bindStorage:function (pickId,storageName,stationName) {
                commonService.ajaxMushiny({
                    url: OUTBOUND_CONSTANT.bindStorageWithItem+'?storageName='+storageName+'&stationName='+stationName+"&pickUnitLoadId="+pickId,
                })
            },

            //停止工作
            stopWorking:function (stationName) {
                commonService.ajaxMushiny({
                    url:OUTBOUND_CONSTANT.stopWorking+"?stationName="+stationName
                })
            },

            //调用问题处理接口
            callObProblem:function (data) {
                commonService.ajaxMushiny({
                    url:OUTBOUND_CONSTANT.obproblem,
                    data:data,
                })
            },
            //打开电子标签
            openLight:function (data) {
                $http({
                    url:"http://192.168.1.88:9090/light/onOffColor?labelId="+data+"&onOffFlag=true&color=RED",
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