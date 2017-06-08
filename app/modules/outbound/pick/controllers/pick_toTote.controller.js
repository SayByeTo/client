/**
 * Created by frank.zhou on 2017/01/17.
 */
(function () {
    'use strict';

    angular.module('myApp').controller("pickToToteCtl", function ($scope, $stateParams, $rootScope, $state, pickToToteService) {
        $scope.podheight = $("#podheight").height();//pod父div的高度
        /////////////////////////////////////////////////////////////外部函数///////////////////////////////////////////////////////
        // 扫描工作站
        $scope.scanStation = function (e) {
            var keyCode = window.event ? e.keyCode : e.which;
            if (keyCode != 13) return;
            $scope.stationNo = $scope.pickPackStationName;
            pickToToteService.scanStation($scope.stationNo, function (data) {
                if(data.msg=="none"){
                    $scope.message = "条码 "+$scope.stationNo+" 不是一个有效工作站，请重新扫描";
                    $scope.messageOperate="show";
                    $scope.pickPackStationName = "";
                }
                if(data.msg =="user"){
                    $scope.message = "工作站已分配给员工"+data.obj+"，请重新扫描";
                    $scope.messageOperate="show";
                    $scope.pickPackStationName = "";
                }
                if(data.msg == "storage"){
                    $scope.storages = data.obj;
                    $scope.chooseTypeWindow("pickStyleId",$scope.pickStyleWindows);
                }
                if(data.msg =="success"){
                    $scope.amountPosition = data.amount;
                    initMainPage();//初始化主页面
                    checkProStorage($scope.stationNo);//先检查2个问题货筐是否绑定
                }
            });
        };
        //自动满筐所有车牌重新绑定
        $scope.reused = function () {
            $scope.pickStyleWindows.close();
            pickToToteService.fullAllStorage($scope.stationNo,function () {
                initMainPage();//初始化主页面
                checkProStorage($scope.stationNo);//先检查2个问题货筐是否绑定
            });
        }
        //扫描残品筐
        $scope.scanDamagedBasket  = function (e) {
            var keyCode = window.event ? e.keyCode : e.which;
            if (keyCode != 13) return;
            var canPinBasket = $scope.canPinBasket;
            pickToToteService.scanCanPinBasket($scope.canPinBasket,$scope.stationNo,$scope.damagedPickUnitLoadId,function(data){
                if(data.msg=="sku"){
                    openDamagedWindow(data);
                }
                if(data.msg == "yiBangDing"){
                    openDamagedScanWindow(data,canPinBasket);
                }
                if(data.msg == "none"){
                    openDamagedNoneWindow(canPinBasket);
                }
                if(data.msg == "ok"){

                    if($scope.reScanCanPinWindows.open()){
                        $scope.reScanCanPinWindows.close();
                    }

                    //残品筐扫描成功,进入桉灯
                    // $scope.windowMessage = "请按动残品货筐上方暗灯";
                    // $("#canPinId").css("background","#00B050");
                       //拍灯，获取返回信息



                    $("#canPinId").css("background","#D9D9D9");
                    checkProStorage($scope.stationNo);
                    /*pickToToteService.clickLight($scope.digitalLabelId,function (data) {
                        $("#canPinId").css("background","#D9D9D9");
                        checkProStorage($scope.stationNo);//检查无法扫描货筐是否绑定
                    })*/
                }
            });
        }
        //扫描无法扫描货筐
        $scope.scanUnScanSKUBasket = function (e) {
            var keyCode = window.event ? e.keyCode : e.which;
            if (keyCode != 13) return;
            var unScanSKUBasket = $scope.unScanSKUBasket;
            pickToToteService.scanUnScanSKUBasket($scope.unScanSKUBasket, $scope.stationNo,$scope.canNotScanpickUnitLoadId,function (data) {
                if (data.msg == "sku") {
                    //无法扫描商品货筐里有商品
                    openUnScanWindow(data);
                }
                if (data.msg == "yiBangDing") {
                    //无法扫描商品货筐已被绑定
                    openUnScanBindWindow(data,unScanSKUBasket);
                }
                if (data.msg == "none") {
                    //无效的无法扫描商品货筐
                    openUnScanNoneWindow(unScanSKUBasket);
                }
                if(data.msg == "ok"){
                    //无法扫描商品货筐扫描成功,进入桉灯
                    // $scope.windowMessage = "请按动无法扫描商品货筐上方暗灯";
                    // $("#unScanId").css("background","#00B050");
                    //拍灯，获取返回信息'
                    if($scope.reUnScanWindows.open()){
                        $scope.reUnScanWindows.close();
                    }
                    $("#unScanId").css("background","#D9D9D9");
                    $scope.basketOperate = "pod";
                    $scope.windowMessage = "等待Pod...";
                    setTimeout(function () {
                        $("#podId").focus();
                    }, 200);
                  /*  pickToToteService.clickLight(digitalLabelId,function (data) {
                        if(data == "ok"){
                            $("#unScanId").css("background","#D9D9D9");
                            $scope.basketOperate = "pod";
                            $scope.windowMessage = "等待Pod...";
                            setTimeout(function () {
                                $("#podId").focus();
                            }, 200);
                        }
                    })*/
                }
            })
        }
        //扫描空拣货货筐
        $scope.scanemptyBasket = function (e) {
            var keyCode = window.event ? e.keyCode : e.which;
            if (keyCode != 13) return;
            var empty = $scope.emptyBasket;
            pickToToteService.scanEmptyStorage($scope.emptyBasket, $scope.stationNo,$scope.pickUnitLoadId,function (data) {
                if (data.msg == "sku") {
                    //空拣货货筐里有商品
                    openEmptyWindow(data,empty);
                }
                if (data.msg == "yiBangDing") {
                    //空拣货货筐已被绑定
                    openEmptyBindWindow(data,empty);
                }
                if (data.msg == "none") {
                    //无效的空拣货货筐
                    openEmptyNoneWindow(empty);
                }
                if (data.msg == "ok") {
                    //关闭错误弹窗
                    if($scope.emptyWindows.open()){
                        $scope.emptyWindows.close();
                    }
                    //空拣货货筐扫描成功,进入桉灯
                    // $scope.windowMessage = "请按动空拣货货筐上方暗灯";
                    // $("#empty"+$scope.index).css("background", "#00B050");

                    //拍灯，获取返回信息

                    $("#empty"+$scope.index).css("background","#D9D9D9");
                    //获取拣货单信息
                    getOrder($scope.podNo,$scope.stationNo,empty);
                   /* pickToToteService.clickLight(digitalLabelId,function (data) {
                        if(data == "ok"){
                            $("#empty"+$scope.index).css("background","#D9D9D9");
                            //获取拣货单信息
                            getOrder($scope.podNo,$scope.stationNo,empty);
                        }
                    })*/
                }
            });
        }
        //扫描pod
        $scope.scanPod = function (e) {
            var keyCode = window.event ? e.keyCode : e.which;
            if (keyCode != 13) return;
            pickToToteService.scanPod($scope.podNo, function (data) {
                initPod(data);
                checkOrder($scope.podNo,$scope.stationNo);
            });
        }
        //扫描商品
        $scope.scanSKU = function (e) {
            var keyCode = window.event ? e.keyCode : e.which;
            if (keyCode != 13) return;
            var amount = $scope.pickNo;
            if(amount == 1) {//需要拣货数量为1，直接到后台确认拣货
                var obj = {
                    "pickIds": $scope.pickIds,
                    "pickUnitLoadId": $scope.pickUnitLoadId,
                    "itemNo": $scope.skuNo,
                    "amountPicked": $scope.pickNo
                };
                pickToToteService.scanSKU(obj, function (data) {
                        putSKU();
                },function (data) {
                    if(data.key == "NO_ITEMDATA_WITH_ITEMNUMER"){
                        $scope.itemMsg = data.value;
                        $scope.openWindow({
                            windowId:"scanItem",
                            windowClass:"myWindow",
                            windowName:$scope.scanItemErrorWindows,
                            width:700,
                            height:260,
                            closeable:false,
                            visible:true,
                            activate:function () {$("#scanItemInput").focus();},
                        })
                    }
                    if(data.key == "ITEM_IS_NOT_MATCH"){
                        $scope.itemMsg = data.value;
                        $scope.openWindow({
                            windowId:"scanItem",
                            windowClass:"myWindow",
                            windowName:$scope.scanItemErrorWindows,
                            width:700,
                            height:260,
                            closeable:false,
                            visible:true,
                            activate:function () {$("#scanItemInput").focus();},
                        })
                    }
                })
            }
            if(amount > 1){//数量大于1的，需要显示选择数量界面，当确认输入数量后，再提交后台确认
                $scope.basketOperate = "amountInput";
                $scope.windowMessage = "请输入拣货数量";
                $scope.skuOperate= "skuNoInput";
                $scope.amount = amount;
            }
        }
        //输入数量后确认
        $scope.confirmInput = function () {
            //判断拣货数量和输入的数量
            if($scope.pickNo > $scope.pickNoInput){
                $scope.openWindow({
                    windowId:"isInputNoId",
                    windowClass:"myWindow",
                    windowName:$scope.isInputNoWindows,
                    width:700,
                    height:260,
                    closeable:false,
                    visible:true,
                })
            }else {
                var obj = {
                    "pickIds": $scope.pickIds,
                    "pickUnitLoadId": $scope.pickUnitLoadId,
                    "itemNo": $scope.skuNo,
                    "amountPicked": $scope.pickNoInput
                };
                pickToToteService.scanSKU(obj, function (data) {
                    if (data == "ok") {
                        $scope.skuOperate = "skuNo";
                        $scope.pickNo = $scope.pickNoInput;
                        putSKU();
                    }
                })
            }
        }
        //当输入数量小于需求数量时，确认
        $scope.confirmInput = function () {
            var obj = {
                "pickIds": $scope.pickIds,
                "pickUnitLoadId": $scope.pickUnitLoadId,
                "itemNo": $scope.skuNo,
                "amountPicked": $scope.pickNoInput
            };
            pickToToteService.scanSKU(obj, function (data) {
                if (data == "ok") {
                    $scope.skuOperate = "skuNo";
                    $scope.pickNo = $scope.pickNoInput;
                    $("#empty" + $scope.i).text($scope.pickNoInput);
                    putSKU();
                   /* $scope.basketOperate = "sku";
                    $scope.windowMessage = "请从指定货位取出商品，检查并扫描商品";
                    $scope.pickNo = data.amountRequest - $scope.pickNoInput;
                    $scope.i = data.positionIndex;
                    $("#empty"+$scope.i).css("background","#33CCFF");
                    $("#empty"+$scope.i).text(data.amountRequest - $scope.pickNoInput);*/
                }
            })
        }
        //扫描商品序列号
        $scope.scanSeriesNo=function (e) {
            var keyCode = window.event ? e.keyCode : e.which;
            if (keyCode != 13) return;
            pickToToteService.scanSeriesNo($scope.seriesNo,function (data) {
                if(data == "ok"){
                    $scope.seriesNoWindows.close();
                    $scope.openWindow({
                        windowId:"newSeriesNoId",
                        windowName:$scope.rescanSeriesNoWindows,
                        windowClass:"myWindow",
                        width:700,
                        height:300,
                        closeable:true,
                        activate:function () {$("#newSeriesNumberId").focus();},
                    })
                }
            })
        }
        //选择拣货数量
        $scope.bind = function (x) {
            $scope.pickNoInput = x;
        }
        //扫描残损商品
        $scope.scanskuDamaged = function (e) {
            var keyCode = window.event ? e.keyCode:e.which;
            if(keyCode != 13) return;
            var amount = $scope.pickNo;
            debugger;
            if(amount == 1) {//需要拣货数量为1，直接到后台确认拣货
                scanDamagedItem(amount,$scope.skuDamagedNo);
            }
            if(amount > 1){
                $scope.basketOperate = "amountInput";
                $scope.windowMessage = "请输入残品数量";
                $scope.qusetionWindows.close();
                $scope.openWindow({
                    windowId:"damagedItemId",
                    windowClass:"myWindow",
                    windowName:$scope.damagedItemAmountWindows,
                    width:700,
                    height:300,
                    closeable:true,
                })
            }
        }
        //输入残品数量
        $scope.inputDamagedAmount = function (x) {
            $scope.damagedItemInput = x;
        }
        //输入残品数量，确认
        $scope.confirmDamagedInput = function () {
            scanDamagedItem($scope.damagedItemInput);
        }
        //货筐已满按钮事件
        $scope.BasketFull = function () {
            $scope.changeBakWindows.close();
            //获取该站台货筐目前的信息
            pickToToteService.getBakInfo($scope.stationNo,function (data) {
                $scope.bakInfo=data.pickingUnitLoadResults;
            });
            $scope.windowMessage="请扫描已满货筐";
            $scope.scanFullBakWindow("scanFullId",$scope.scanFullWindows,function(){$("#fullBasketId").focus()});
        }
        //扫描已满货筐
        $scope.scanfullBasket = function(e){
            var keyCode = window.event ? e.keyCode:e.which;
            if(keyCode != 13) return;
            pickToToteService.scanfullBasket($scope.fullBasket,$scope.stationName,function (data) {
                $scope.storageTypeName = data.storageName;
                $scope.positionIndex = data.positionIndex();
                $scope.scanFullWindows.close();
                if($scope.positionIndex == 21) {
                    $scope.newBasketNo = "已成功满筐在残品货筐位置，货筐条码：" + $scope.fullBasket + "，商品总数" + data.sum + "件,请扫描新的货筐放在残品货筐位置";
                }
                if($scope.positionIndex == 22){
                    $scope.newBasketNo = "已成功满筐在无法扫描货筐位置，货筐条码：" + $scope.fullBasket + "，商品总数" + data.sum + "件,请扫描新的货筐放在无法扫描货筐位置";
                }
                if(data.storageName == "GENUINE" && $scope.positionIndex != 22){
                    $scope.newBasketNo = "已成功满筐拣货货筐位置，货筐条码：" + $scope.fullBasket + "，商品总数" + data.sum + "件,请扫描新的货筐放在拣货货筐位置";
                }
                $scope.openWindow({
                    windowId:"newbakId",
                    windowName:$scope.newbakWindows,
                    windowClass:"blueWindow",
                    width:700,
                    height:300,
                    closeable:true,
                    activate:function () {$("#newbasketId").focus();},
                    title:"请扫描新的货筐",
                });
                $scope.windowMessage="请扫描新的货筐";
            })
        }
        //扫描新的货筐
        $scope.scannewbasketNo = function (e) {
            var keyCode = window.event ? e.keyCode:e.which;
            if(keyCode != 13) return;
            var info = $scope.newbasketNo;
            pickToPackService.scanNewBasket($scope.newbasketNo,$scope.storageTypeName,$scope.stationNo,function (data) {
                //这里要判断货筐
                if(data.msg=="sku"){
                    if($scope.storageTypeName == "DAMAGED") {
                        openDamagedWindow(data);
                    }
                    if($scope.positionIndex == 22) {
                        openUnScanWindow(data);
                    }
                    if($scope.storageTypeName == "GENUINE" && $scope.positionIndex != 22) {
                        openEmptyWindow(data,info);
                    }
                }
                if(data.msg == "yiBangDing"){
                    if($scope.storageTypeName == "DAMAGED") {
                        openDamagedScanWindow(data,info);
                    }
                    if($scope.positionIndex == 22) {
                        openUnScanBindWindow(data,info);
                    }
                    if($scope.storageTypeName == "GENUINE" && $scope.positionIndex != 22) {
                        openEmptyBindWindow(data,info);
                    }
                }
                if(data.msg == "none"){
                    if($scope.storageTypeName == "DAMAGED") {
                        openDamagedNoneWindow(info);
                    }
                    if($scope.positionIndex == 22) {
                        openUnScanNoneWindow(info);
                    }
                    if($scope.storageTypeName == "GENUINE" && $scope.positionIndex != 22) {
                        openEmptyNoneWindow(info);
                    }
                }
                if(data,msg == "ok"){
                    if($scope.storageTypeName == "DAMAGED") {
                        $scope.newBasketNo = "已成功扫描车牌" + $scope.newbasketNo + "在残品货筐位置;请按动货筐上方暗灯";
                    }
                    if($scope.positionIndex == 22) {
                        $scope.newBasketNo = "已成功扫描车牌" + $scope.newbasketNo + "在无法扫描货筐位置;请按动货筐上方暗灯";
                    }
                    if($scope.storageTypeName == "GENUINE" && $scope.positionIndex != 22) {
                        $scope.newBasketNo = "已成功扫描车牌" + $scope.newbasketNo + "在空拣货货筐位置;请按动货筐上方暗灯";
                    }
                    $scope.newbakWindows.setOptions({
                        title:"请按动货筐上方暗灯",
                        activate:function () {$("#newbasketId").focus();}
                    });
                    $scope.windowMessage="请按动货筐上方暗灯";
                    //按灯接口，成功后，关闭这个窗口，获取拣货单信息
                    $scope.newbakWindows.close();
                    getOrder($scope.podNo,$scope.stationNo,$scope.emptyBasket);//获取取货单信息
                 /*   pickToToteService.clickLight($scope.digitalLabelId,function (data) {
                        if(data == "ok"){
                            $scope.newbakWindows.close();
                            getOrder($scope.podNo,$scope.stationNo,$scope.emptyBasket);//获取取货单信息
                        }
                    })*/
                }
            });
        }
        //无法扫描商品货筐确定，进入桉灯
        $scope.continueUnScan = function () {
            $scope.unScanWindows.close();
            //绑定货筐
            pickToToteService.bindStorage($scope.pickUnitLoadId,$scope.unScanSKUBasket, $scope.stationNo);
            $("#unScanId").css("background","#00B050");
            $scope.windowMessage = "请按动无法扫描商品货筐上方暗灯";
            //按灯

            $("#unScanId").css("background","#D9D9D9");
            getOrder($scope.podNo,$scope.stationNo,$scope.emptyBasket);//获取取货单信息
          /*  pickToToteService.clickLight($scope.digitalLabelId,function (data) {
                if(data == "ok"){
                    $("#unScanId").css("background","#D9D9D9");
                    getOrder($scope.podNo,$scope.stationNo,$scope.emptyBasket);//获取取货单信息
                }
            })*/
        }
        //残品货筐确定，进入桉灯
        $scope.continueCanPin = function(){
            $scope.canPinWindows.close();
            //绑定货筐
            pickToToteService.bindStorage($scope.pickUnitLoadId,$scope.unScanSKUBasket, $scope.stationNo);
            $("#canPinId").css("background","#00B050");
            $scope.windowMessage = "请按动残品货筐上方暗灯";
            //按灯
            $("#canPinId").css("background","#D9D9D9");
            checkProStorage($scope.stationNo);//检查无法扫描货筐是否绑定
           /* pickToToteService.clickLight($scope.digitalLabelId,function (data) {
                if(data == "ok"){
                    $("#canPinId").css("background","#D9D9D9");
                    checkProStorage($scope.stationNo);//检查无法扫描货筐是否绑定
                }
            })*/
        }
        //残品货筐请求确认时取消，重新扫描货筐
        $scope.cancel = function () {
            $scope.windowMessage = "请重新扫描残品货筐";
            $scope.canPinWindows.close();
            setTimeout(function () {
                $("#canPinBasketId").focus();
            }, 200);
        }
        //无法扫描商品货筐请求确认时取消，重新扫描货筐
        $scope.unScanclose = function () {
            $scope.windowMessage = "请重新扫描无法扫描商品货筐";
            $scope.unScanWindows.close();
            setTimeout(function () {
                $("#unScanSKUBasketId").focus();
            }, 200);
        }
        //////////////////////////////////////////////////////////////问题处理按钮//////////////////////////////////////
        //商品残损按钮
        $scope.skuDamaged = function () {
            $scope.qusetionWindows.close();
            $scope.skuDamagedNo="";
            $scope.basketOperate="skuDamaged";
            $scope.windowMessage="请扫描残损商品";
            setTimeout(function () {
                $("#skuDamagedId").focus();
            },200);
            $scope.canPinId.css("background","#FF0000");
        }
        //商品丢失
        $scope.skuMiss = function () {
            $scope.qusetionWindows.close();
            $scope.openWindow({
                windowId:"scanBinId",
                windowName:$scope.scanBinWindows,
                windowClass:"blueWindow",
                width:700,
                height:300,
                closeable:true,
                activate:function () {$("#binId").focus();},
            })

        }
        //商品无法扫描
        $scope.canNotScan = function () {
            var obj = {
                pickIds: $scope.pickIds,
                pickUnitLoadId: $scope.canNotScanpickUnitLoadId,
                itemNo: $scope.skuNo,
                amountPicked: 1
            };
            pickToToteService.scanskuDamaged(obj,function () {
                if(data=="SameNameSKU"){
                    $scope.errorWindow("changeBakId",$scope.changeBakWindows);
                    $scope.BasketFullMessaage="货筐号码： "+$scope.unScanSKUBasket+"中存在相同名称不同客户商品，请点击“货筐已满”结满当前货筐，扫描空的货筐后再放置商品";
                }else if(data=="sameName_diffrentTime"){
                    $scope.errorWindow("changeBakId",$scope.changeBakWindows);
                    $scope.BasketFullMessaage="货筐号码："+$scope.unScanSKUBasket+"中存在相同名称不同有效期商品，请点击“货筐已满”结满当前货筐，扫描空的货筐后再放置商品";
                }else{
                    //调用问题处理接口
                    var obProblemDTO = {problemType:"UNABLE_SCAN_SKU",amount:$scope.pickNo,reportDate:data.reportDate};
                    callProblem(obProblemDTO);
                    putCanPin(amount);//放残品
                }
            })
        }
        //货筐已满
        $scope.unitLoadFull = function () {
            //获取该站台货筐筐目前的信息
            pickToToteService.getBakInfo($scope.pickPackStationName,function (data) {
                $scope.bakInfo=data.pickingUnitLoadResults;
            });
            $scope.windowMessage="请扫描已满货筐";
            $scope.scanFullBakWindow("scanFullId",$scope.scanFullWindows,function(){$("#fullBasketId").focus()});
        }
        //报告暗灯
        $scope.clickLight = function () {
            $scope.qusetionWindows.close();
            $scope.openWindow({
                windowId:"lightMenuId",
                windowName:$scope.lightWindows,
                windowClass:"blueWindow",
                width:800,
                height:400,
                closeable:true,
            })
        }
        //信息查询
        $scope.infoCheck = function () {
            $scope.qusetionWindows.close();
            $scope.openWindow({
                windowId:"informationInquiryId",
                windowName:$scope.informationInquiryWindow,
                windowClass:"blueWindow",
                width:700,
                height:350,
                closeable:true,
            })
        }
        //停止工作
        $scope.finishWork = function () {
            $scope.qusetionWindows.close();
            $scope.openWindow({
                windowId:"isFullId",
                windowName:$scope.isFullAllBakWindows,
                windowClass:"blueWindow",
                width:700,
                height:260,
                closeable:false,
                visible:true,
            })
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //确认结满所有货筐
        $scope.fullAll = function () {
            pickToToteService.stopWorking($scope.stationNo);
            pickToToteService.fullAllStorage($scope.stationNo);
            $scope.isFullAllBakWindows.close();
            $state.go("main.pick");
        }
        $scope.notFullAll = function () {
            $scope.isFullAllBakWindows.close();
            $state.go("main.pick");
        }
        //货位扫描
        $scope.scanBin = function (e) {
            var keyCode = window.event ? e.keyCode:e.which;
            if(keyCode != 13) return;
            pickToToteService.scanBin($scope.bin,function (data) {
                if(data == "ok"){
                    $scope.scanBinWindows.close();
                    $scope.openWindow({
                        windowId:"scanEachSKUId",
                        windowName:$scope.scanEachSKUWindows,
                        windowClass:"blueWindow",
                        width:700,
                        height:400,
                        closeable:true,
                        activate:function () {$("#eachSKUId").focus();},
                    })
                }
            })
        }
        //逐一扫描货位里的商品
        $scope.scanEachSKU = function (e) {
            var keyCode = window.event ? e.keyCode:e.which;
            if(keyCode != 13) return;
            pickToToteService.scanEachSKU($scope.eachSKUNo,function (data) {
                if(data == "different"){
                    $scope.scanEachSKUWindows.close();
                    $scope.openWindow({
                        windowId:"scanEverySKUId",
                        windowName:$scope.scanEverySKUWindows,
                        windowClass:"myWindow",
                        width:700,
                        height:400,
                        closeable:true,
                        activate:function () {$("#everySKUId").focus();},
                    })
                }
                if(data == "ok"){
                    putSKU();
                }
            })
        }
        //货位为空，留个接口，，功能和已扫描完所有商品按钮一样
        $scope.positionEmpry = function () {

        }
        ///////////////////////////////////////////////////////////////内部函数////////////////////////////////////////////////////
        //检查 2 个问题筐是否绑定
        function checkProStorage(stationName) {
            pickToToteService.checkProStorage(stationName,function (data) {
                if(data.msg == "NODAMAGED"){
                    $scope.damagedPickUnitLoadId = data.data.pickUnitLoadId;
                    //$scope.positionIndex = data.positionIndex;//对应物理位置
                    $scope.basketOperate = "scanCanPinBasket";
                    $scope.windowMessage = "请扫描残品货筐，并将货筐放于指定位置";
                    $("#canPinId").css("background","red");
                    setTimeout(function () {
                        $("#canPinBasketId").focus();
                    }, 200);
                    //调灯亮的接口
                   /* $scope.digitalLabelId = data.data.digitalLabelId//"2f087879-dd62-4e3b-a10a-3f7b97f34e3f";
                    pickToToteService.openLight($scope.digitalLabelId);*/
                }
                if(data.msg== "NOUNSCAN"){
                    $scope.canNotScanpickUnitLoadId = data.data.pickUnitLoadId;
                    //$scope.positionIndex = data.positionIndex;//对应物理位置
                    $scope.basketOperate = "unScanSKUBasket";
                    $scope.windowMessage = "请扫描无法扫描货筐，并将货筐放于指定位置";
                    $("#unScanId").css("background","#33CCFF");
                    setTimeout(function () {
                        $("#unScanSKUBasketId").focus();
                    }, 200);
                    //调灯亮的接口
                  /*  $scope.digitalLabelId =data.data.digitalLabelId;// "2f087879-dd62-4e3b-a10a-3f7b97f34e3f";
                    pickToToteService.openLight($scope.digitalLabelId);*/
                }
                if(data.msg == "ok"){
                    $scope.basketOperate = "pod";
                    $scope.windowMessagev = "等待Pod...";
                    setTimeout(function () {
                        $("#podId").focus();
                    }, 200);
                }
            })
       }
       //检查batch对应得拣货货筐是否绑定
        function checkOrder(podName,stationName) {
           pickToToteService.checkBatch(podName,stationName,function (data) {
                if(data.msg == "NOSTORAGE"){
                    $scope.pickUnitLoadId = data.data.pickUnitLoadId;
                    $scope.index = data.data.positionIndex;
                    $scope.digitalLabelId = data.data.digitalLabelId;
                    $scope.basketOperate = "emptyBasket";
                    $scope.windowMessage = "请扫描空拣货货筐，放置在指定位置";
                    $("#empty"+$scope.index).css("background","#33CCFF");
                    setTimeout(function () {
                        $("#emptyBasketId").focus();
                    }, 200);
                    //调灯亮的接口
                /*    $scope.digitalLabelId =data.data.digitalLabelId;// "2f087879-dd62-4e3b-a10a-3f7b97f34e3f";
                    pickToToteService.openLight($scope.digitalLabelId);*/
                }
                if(data.msg == "ok"){
                    //获取拣货单信息
                    getOrder(podName,stationName,$scope.emptyBasket);
                }
           })
       }
       //获取拣货任务
        function getOrder(podName,stationName,storageLocationName) {
            pickToToteService.getOrderPosition(podName,stationName,storageLocationName,function (data) {
                //点亮pod格子
                lightPodCell(data.pickfromLocationName);
                //设置页面信息
                $scope.basketOperate = "sku";
                $scope.windowMessage = "请从指定货位取出商品，检查并扫描商品";
                $scope.sku = "SKU: " + data.itemData.itemNo;
                $scope.skuDescription = data.itemData.name;
                $scope.pickNo = data.amountRequest;
                $scope.i = data.positionIndex;
                $("#empty"+$scope.i).css("background","#33CCFF");
                $("#empty"+$scope.i).text(data.amountRequest);
                //需要向后台返回的数据
                $scope.pickIds = data.pickIdList;
                $scope.pickUnitLoadId = data.pickUnitLoadId;
                $scope.shipmentId = data.shipmentId;//商品所属的订单
                //商品出现问题时需要的信息
                //$scope.lotNo = data.stockUnit.lot.lotNo;
                //$scope.serialNo=data.stockUnit.serialNo;
                $scope.itemNo=data.itemData.itemNo;
                $scope.itemDataId=data.itemData.id;
                $scope.problemStoragelocation = data.pickfromLocationName;
            })
        }
        //点亮pod格子
        function lightPodCell(locationName) {
            var changeChar = function (char) {
                return Math.abs(65 - char.charCodeAt() + $scope.size) - 1
            }

            $scope.podHierarchy = locationName.substring(9,10); //ABC  层级
            $scope.podNumber = locationName.substring(10);//123 排列
            $scope.podHeight = parseInt(changeChar($scope.podHierarchy));
            $scope.podWidth = parseInt($scope.podNumber) - 1;
            $scope.podColor = $scope.podWallColor[$scope.podHierarchy];
            $scope.podRows[$scope.podHeight].color = $scope.podColor; //行颜色
            $scope.podRows[$scope.podHeight].item[$scope.podWidth].name = locationName.substring(9);
            $scope.podRows[$scope.podHeight].item[$scope.podWidth].choice = true;
        }
        //扫描残品商品
        function scanDamagedItem(amount) {
            var obj = {
                pickIds: $scope.pickIds,
                pickUnitLoadId: $scope.damagedPickUnitLoadId,
                itemNo: $scope.skuNo,
                amountPicked: amount
            };
            pickToToteService.scanskuDamaged(obj,function (data) {
                if(data=="SameNameSKU"){
                    $scope.errorWindow("changeBakId",$scope.changeBakWindows);
                    $scope.BasketFullMessaage="货筐号码： "+$scope.canPinBasket+"中存在相同名称不同客户商品，请点击“货筐已满”结满当前货筐，扫描空的货筐后再放置商品";
                }else if(data=="sameName_diffrentTime"){
                    $scope.errorWindow("changeBakId",$scope.changeBakWindows);
                    $scope.BasketFullMessaage="货筐号码： "+$scope.canPinBasket+"中存在相同名称不同有效期商品，请点击“货筐已满”结满当前货筐，扫描空的货筐后再放置商品";
                }else{
                    //调用问题处理接口
                    var obProblemDTO = {problemType:"DAMAGED",amount:$scope.pickNo,reportDate:data.reportDate};
                    callProblem(obProblemDTO);
                    putCanPin(amount);//放残品
                }
            })
        }
        //放商品，拍灯
        function putSKU() {
            // $scope.windowMessage = "请将商品放入指定货筐，并按动货筐上方暗灯";
            // $("#empty"+$scope.i).css("background","green");
            //按灯操作
            $("#empty"+$scope.i).css("background","#D9D9D9");
            checkOrder($scope.podNo,$scope.stationNo);
          /*  pickToToteService.clickLight($scope.digitalLabelId,function (data) {
                if(data == "ok"){
                    $("#empty"+$scope.i).css("background","#D9D9D9");
                    checkOrder($scope.podNo,$scope.stationNo);
                }
            })*/
        }
        //初始化pod
        function initPod(data) {
            //初始化pod每栏的颜色
            $scope.podWallColor = {
                A: "#00b050",
                B: "#66ffff",
                C: "#ffff00",
                D: "#ff7c80",
                E: "#c00000",
                F: "#7030a0",
                G: "#FF00FF",
                H: "#FF9900",
                I: "#33CC33",
                J: "#3399FF",
                K: "#0000FF",
                L: "#CC99FF"
            }
            $scope.podRows = [], $scope.podColumns = [];
            $scope.size = data.levels.length;
            $scope.heightPod = ($scope.podheight -10*($scope.size))/$scope.size;//每层高度
            var column = data.columns;
            for (var j=0;j<$scope.size;j++){
                for (var i = 0; i < column[j];i++) $scope.podColumns.push({
                    name: "",
                    choice: false
                });
                $scope.podRows[j] = angular.copy({
                    item: $scope.podColumns,
                    color: "#c1c1c1"
                });
                $scope.podColumns = [];
            }
        }
        //残品货筐扫描报错时弹窗
        function openDamagedWindow(data) {
            //残品筐里有商品
            $scope.basketOperate="scanCanPinBasket";
            $scope.windowMessage = "请确认是否使用当前残品货筐";
            $scope.damagedAmount = data.amountSku;
            $scope.errorWindow("canPinBakId",$scope.canPinWindows,function () {
                $("#recanPinBasketId").focus();
            });
        }
        function openDamagedScanWindow(data,canPinBasket){
            //残品筐已被绑定
            $scope.basketOperate="scanCanPinBasket";
            $scope.windowMessage = "请重新扫描残品货筐";
            $scope.stationName=data.stationName;
            $scope.canPinBasketNo = canPinBasket;
            $scope.canPinBasket="";
            $scope.errorWindow("recanPinBakId",$scope.reScanCanPinWindows,function () {
                $("#recanPinBasketId").focus();
            });
            $scope.reScanCanPinOperate = "yiBangDing";
        }
        function openDamagedNoneWindow(canPinBasket) {
            //无效的残品筐
            $scope.basketOperate="scanCanPinBasket";
            $scope.windowMessage = "请重新扫描残品货筐";
            $scope.canPinBasketNo = canPinBasket;
            $scope.canPinBasket="";
            $scope.errorWindow("recanPinBakId",$scope.reScanCanPinWindows,function () {
                $("#recanPinBasketId").focus();
            });
            $scope.reScanCanPinOperate = "wuXiao";
        }
        //无法扫描货筐扫描报错时弹窗
        function openUnScanWindow(data) {
            //无法扫描商品货筐里有商品
            $scope.basketOperate = "unScanSKUBasket";
            $scope.unScanSkuNo = data.amountSku;
            $scope.windowMessage = "请确认是否使用当前无法扫描商品货筐";
            $scope.errorWindow("unScanWindows", $scope.unScanWindows);
        }
        function openUnScanBindWindow(data,unScanSKUBasket) {
            $scope.basketOperate = "unScanSKUBasket";
            $scope.windowMessage = "请重新扫描无法扫描商品货筐";
            $scope.unScanSKUBasketNo = unScanSKUBasket;
            $scope.unScanSKUBasket = "";
            $scope.stationName = data.stationName;
            $scope.errorWindow("reUnScanBakId", $scope.reUnScanWindows,function () {
                $("#reunScanSKUBasketId").focus();
            });
            $scope.reUnScanOperate = "yiBangDing";
        }
        function openUnScanNoneWindow(unScanSKUBasket) {
            $scope.basketOperate = "unScanSKUBasket";
            $scope.windowMessage = "请重新扫描无法扫描商品货筐";
            $scope.unScanSKUBasketNo = unScanSKUBasket;
            $scope.unScanSKUBasket = "";
            $scope.errorWindow("reUnScanBakId", $scope.reUnScanWindows,function () {
                $("#reunScanSKUBasketId").focus();
            });
            $scope.reUnScanOperate = "wuXiao";
        }
        //空拣货货筐扫描报错时弹窗
        function openEmptyWindow(data,empty) {
            $scope.basketOperate = "emptyBasket";
            $scope.emptySkuNo = data.amountSku;
            $scope.windowMessage = "请重新扫描空拣货货筐";
            $scope.emptyBasketNo = empty;
            $scope.emptyBasket = "";
            $scope.errorWindow("emptyBakId", $scope.emptyWindows, function () {
                $("#emptyStorageId").focus();
            });
            $scope.emptyOperate = "existSKU";
        }
        function openEmptyBindWindow(data,empty) {
            $scope.basketOperate = "emptyBasket";
            $scope.windowMessage = "请重新扫描空拣货货筐";
            $scope.stationName = data.stationName;
            $scope.emptyBasketNo = empty;
            $scope.emptyBasket = "";
            $scope.errorWindow("emptyBakId", $scope.emptyWindows, function () {
                $("#emptyStorageId").focus();
            });
            $scope.emptyOperate = "yiBangDing";
        }
        function openEmptyNoneWindow(empty) {
            $scope.basketOperate = "emptyBasket";
            $scope.windowMessage = "请重新扫描空拣货货筐";
            $scope.emptyBasketNo = empty;
            $scope.emptyBasket = "";
            $scope.errorWindow("emptyBakId", $scope.emptyWindows, function () {
                $("#emptyStorageId").focus();
            });
            $scope.emptyOperate = "wuXiao";
        }
        // 错误弹窗
        $scope.errorWindow = function (windowId, windowName,focusInput) {
            $("#" + windowId).parent().addClass("myWindow");
            windowName.setOptions({
                width: 700,
                height: 250,
                visible: false,
                actions: false,
                activate:focusInput,
            });
            windowName.center();
            windowName.open();
        }
        // 选择拣货模式弹窗弹窗
        $scope.chooseTypeWindow = function (windowId, windowName) {
            $("#" + windowId).parent().addClass("myWindow");
            windowName.setOptions({
                width: 900,
                height: 400,
                visible: false,
                actions: false,
            });
            windowName.center();
            windowName.open();
        }
        // 扫描已满货筐弹窗
        $scope.scanFullBakWindow = function (windowId, windowName,focusInput) {
            $("#" + windowId).parent().addClass("blueWindow");
            windowName.setOptions({
                width: 700,
                height: 400,
                closeable:true,
                visible: false,
                activate:focusInput,
            });
            windowName.center();
            windowName.open();
        }
        //扫描序列号弹窗
        $scope.seriesWindow = function (windowId, windowName,focusInput) {
            $("#"+windowId).parent().addClass("myWindow");
            windowName .setOptions({
                width: 700,
                height: 260,
                visible: false,
                closeable:true,
                activate:focusInput,
            });
            windowName.center();
            windowName.open();
        }
        //问题处理弹窗
        $scope.problemShow = function () {
            $("#qusetionMenuId").parent().addClass("blueWindow");
            $scope.qusetionWindows.setOptions({
                width: 700,
                height: 400,
                closeable:true,
                visible: false,
            });
            $scope.qusetionWindows.center();
            $scope.qusetionWindows.open();
        }
        //打开窗口
        $scope.openWindow = function(options){
            $("#" + options.windowId).parent().addClass(options.windowClass);
            options.windowName.setOptions({
                width:options.width,
                height:options.height,
                closeable:options.closeable,
                visible:true,
                title:options.title,
                activate:options.activate,
            });
            options.windowName.center();
            options.windowName.open();
        }
        //放残品
        function putCanPin(amount) {
            $scope.putCanpin= "scanCanPinBasket";
            $scope.windowMessage = "请将商品放置到残品货筐中，并按动残品货筐上方暗灯";
            $("#canPinId").css("background","#FF0000");
            $("#canPinId").text(amount);
            //按灯操作
            $("#canPinId").css("background","#D9D9D9");
            checkOrder($scope.podNo,$scope.stationNo);
           /* pickToToteService.clickLight($scope.digitalLabelId,function (data) {
                if(data == "ok"){
                    $("#canPinId").css("background","#D9D9D9");
                    checkOrder($scope.podNo,$scope.stationNo);
                }
            })*/
        }
        //outbound问题处理
        function callProblem(data) {
            $scope.problemData = {
                problemType:data.problemType,
                amount:data.mount,
                jobType:"Pick",
                reportBy:$window.localStorage['username'],
                reportDate:data.reportDate,
                problemStoragelocation:$scope.problemStoragelocation,
                container:"",
                lotNo:$scope.lotNo,
                serialNo:$scope.serialNo,
                skuNo:$scope.skuNo,
                itemNo:$scope.itemNo,
                itemDataId:$scope.itemDataId,
                shipmentId:$scope.shipmentId
            }
            pickToPackService.callProblem($scope.problemData);
        }
        // 初始化页面
        function initPage() {
            $rootScope.pickPackContinue = false;
            $rootScope.pickPackStation = {};
            $rootScope.pickPackMain = {};
            $rootScope.pickpackcar = {};
            $scope.pickPackOperate = "scanStation"; // 初始扫描工作站
            setTimeout(function () {
                $("#pickPack_station").focus();
            }, 200);
        }
        //初始化主页面
        function initMainPage() {
            $scope.pickPackMain = "pickPackMain";
            $scope.messageOperate = {};
            $scope.pickPackOperate = {};
            $scope.skuOperate = "skuNo";//"skuNo";"skuNoInput"
        }
        function init() {
             initPage();
        }
        //初始化
        init();
    })
})();