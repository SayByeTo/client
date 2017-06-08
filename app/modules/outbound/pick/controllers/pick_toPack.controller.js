
(function () {
    'use strict';

    angular.module('myApp').controller("pickToPackCtl", function ($scope, $stateParams, $rootScope, $state, $window,pickToPackService) {
        $scope.wallHeight = $("#wallHeight").height();//pickpackwall父div的高度
        $scope.podheight = $("#podheight").height();//pod父div的高度
        $scope.serialNoType = "GENUINE";//初始化定义扫描序列号状态
        $scope.scanDamagedBasketType = "Bind";//当前扫描残品筐的操作步骤
        /////////////////////////////////////////////////////////////外部函数///////////////////////////////////////////////////////
        // 扫描工作站
        $scope.scanStation = function (e) {
            var keyCode = window.event ? e.keyCode : e.which;
            if (keyCode != 13) return;
            $scope.stationNo = $scope.pickPackStationName;//工作站条码
            pickToPackService.scanStation($scope.stationNo, function (data) {
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
                    $scope.storages = data.obj.pickingUnitLoadResults;
                    //获取工作站货筐对应的电子标签
                    $scope.damagedLight = data.obj.damagedLightId;
                    $scope.unScanLight = data.obj.canNotScanLightId;
                    $scope.toReserachLight = data.obj.toInvestigateId;

                    $scope.chooseTypeWindow("pickStyleId",$scope.pickStyleWindows);
                }
                if(data.msg =="success"){
                    //获取工作站货筐对应的电子标签
                    $scope.damagedLight = data.obj.damagedLightId;
                    $scope.unScanLight = data.obj.canNotScanLightId;
                    $scope.toReserachLight = data.obj.toInvestigateId;
                    $scope.pickPackStationName="";

                    $scope.pickPackOperate = "scanPickPackCar"; // 继续扫描pickpack_car
                    //$rootScope.pickpackcar = {};
                    $rootScope.pickPackMain = {};
                    $scope.messageOperate={};
                    $rootScope.pickPackContinue = false;
                    setTimeout(function () {
                        $("#pickPack_pickPackCar").focus();
                    }, 100);
                }
            });
        };
        //自动满筐所有车牌重新绑定
        $scope.reused = function () {
            pickToPackService.fullAllStorage($scope.stationNo);
            $scope.pickStyleWindows.close();
            $scope.pickPackOperate = "scanPickPackCar";
            setTimeout(function () {
                $("#pickPack_pickPackCar").focus();
            }, 100);
        }
        //扫描Pick-Pack Car
        $scope.scanPickPackCar = function (e) {
            var keyCode = window.event ? e.keyCode : e.which;
            if (keyCode != 13) return;
            var pickPackNo = $scope.pickPackCarNo;
            pickToPackService.scanPickPackCar($scope.pickPackCarNo,$scope.stationNo, function (data) {
                if (data.msg == "success") {
                    $scope.messageOperate="";
                    initMainPage();
                    initPickPackWall(data.obj);
                }
                if (data.msg == "none") {
                    $scope.message = "条码"+pickPackNo+"，不是一个有效的Pick Pack车，请重新扫描";
                    $scope.messageOperate="show";
                    $scope.pickPackCarNo = "";
                }
                if(data.msg == "notsysytem"){
                    $scope.message = "扫描的Pick Pack wall并不是系统绑定的Pick Pack wall，请重新扫描";
                    $scope.messageOperate="show";
                    $scope.pickPackCarNo = "";
                }
            });
        }
        //扫描残品筐
        $scope.scanCanPinBasket  = function (e) {
            var keyCode = window.event ? e.keyCode : e.which;
            if (keyCode != 13) return;
            var damage = $scope.canPinBasket;
            pickToPackService.scanCanPinBasket($scope.canPinBasket,$scope.stationNo,function(data){
                $scope.damagedPid = data.pickUnitLoadId;
                $("#canPinId").css("background","#D9D9D9");
                $("#unScanId").css("background","#FFC000");
                $scope.basketOperate = "unScanSKUBasket";
                $scope.windowMessage = "请扫描商品无法扫描货筐，并将货筐放于指定位置";
                setTimeout(function () {
                    $("#unScanSKUBasketId").focus();
                }, 200);
                //残品筐扫描成功,进入桉灯
                /* $scope.windowMessage = "请按动残品货筐上方暗灯";
                $("#canPinId").css("background","#00B050");
                //调按灯接口，查看灯的状态,进行跳转
                pickToPackService.clickLight($scope.damagedLight,function () {
                    $("#canPinId").css("background","#D9D9D9");
                    $("#unScanId").css("background","#FFC000");
                    $scope.basketOperate = "unScanSKUBasket";
                    $scope.windowMessage = "请扫描商品无法扫描货筐，并将货筐放于指定位置";
                    setTimeout(function () {
                        $("#unScanSKUBasketId").focus();
                    }, 200);
                    //调灯亮的接口
                    $scope.unScanLight = "2f087879-dd62-4e3b-a10a-3f7b97f34e3f";
                    pickToPackService.openLight($scope.unScanLight);
                })*/
            },function (data) {
                if(data.key=="GOODS_EXIST_IN_LOCATION"){
                    //残品筐里有商品
                    openDamagedWindow(data);
                }
                if(data.key == "UNIYLOAD_ALREADY_BINDED_TO_STATION"){
                    //残品筐已被绑定
                    openDamagedScanWindow(data,$scope.canPinBasket);
                }
                if(data.key == "NO_SUCH_UNITLOAD"){
                    //无效的残品筐
                    openDamagedNoneWindow($scope.canPinBasket);
                }
            });
        }
        //扫描无法扫描货筐
        $scope.scanUnScanSKUBasket = function (e) {
            var keyCode = window.event ? e.keyCode : e.which;
            if (keyCode != 13) return;
            var unScanSKUBasket = $scope.unScanSKUBasket;
            pickToPackService.scanUnScanSKUBasket($scope.unScanSKUBasket,$scope.stationNo, function (data) {
                    $scope.canNotScanPId = data.pickUnitLoadId;
                $("#unScanId").css("background","#D9D9D9");
                $("#toReserachId").css("background","#33CCFF");
                $scope.basketOperate = "toReserachBasket";
                $scope.windowMessage = "请扫描待调查货筐，并将货筐放于指定位置";
                setTimeout(function () {
                    $("#toReserachBasketId").focus();
                }, 200);
                /*//无法扫描商品货筐扫描成功,进入桉灯
                    $scope.windowMessage = "请按动无法扫描商品货筐上方暗灯";
                    $("#unScanId").css("background","#00B050");
                    //调按灯接口，查看灯的状态,进行跳转
                    pickToPackService.clickLight($scope.unScanLight,function () {
                        $("#unScanId").css("background","#D9D9D9");
                        $("#toReserachId").css("background","#33CCFF");
                        $scope.basketOperate = "toReserachBasket";
                        $scope.windowMessage = "请扫描待调查货筐，并将货筐放于指定位置";
                        setTimeout(function () {
                            $("#toReserachBasketId").focus();
                        }, 200);
                        //调灯亮的接口
                        $scope.toReserachLight = "2f087879-dd62-4e3b-a10a-3f7b97f34e3f";
                        pickToPackService.openLight($scope.toReserachLight);
                    })*/
            },function (data) {
                if (data.key == "GOODS_EXIST_IN_LOCATION") {
                    //无法扫描商品货筐里有商品
                    openUnScanWindow(data);
                }
                if (data.key == "UNIYLOAD_ALREADY_BINDED_TO_STATION") {
                    //无法扫描商品货筐已被绑定
                    openUnScanBindWindow(data,$scope.unScanSKUBasket);
                }
                if (data.key == "NO_SUCH_UNITLOAD") {
                    //无效的无法扫描商品货筐
                    openUnScanNoneWindow($scope.unScanSKUBasket);
                }
            })
        }
        //扫描待调查货筐
        $scope.scanToReserachBasket = function (e) {
            var keyCode = window.event ? e.keyCode : e.which;
            if (keyCode != 13) return;
            var toReserachBasket = $scope.toReserachBasket;
            pickToPackService.scanToReserachBasket($scope.toReserachBasket,$scope.stationNo, function (data) {
                    $scope.toInvestigatePId = data.pickUnitLoadId;
                $("#toReserachId").css("background","#D9D9D9");
                $scope.basketOperate = "pod";
                $scope.windowMessage = "等待Pod进入";
                setTimeout(function () {
                    $("#podId").focus();
                }, 200);
                /*//待调查商品货筐扫描成功,进入桉灯
                    $scope.windowMessage = "请按动待调查商品货筐上方暗灯";
                    $("#toReserachId").css("background","#00B050");
                   //调按灯接口，查看灯的状态,进行跳转
                    pickToPackService.clickLight($scope.toReserachLight,function () {
                        $("#toReserachId").css("background","#D9D9D9");
                        $scope.basketOperate = "pod";
                        $scope.windowMessage = "等待Pod进入";
                        setTimeout(function () {
                            $("#podId").focus();
                        }, 200);
                    })*/
            },function (data) {
                if (data.key == "GOODS_EXIST_IN_LOCATION") {
                    //待调查商品货筐里有商品
                    openToReaservhWindow(data);
                }
                if (data.key == "UNIYLOAD_ALREADY_BINDED_TO_STATION") {
                    //待调查商品货筐已被绑定
                    openToReaservhBindWindow(data,$scope.toReserachBasket);
                }
                if (data.key == "NO_SUCH_UNITLOAD") {
                    //无效的待调查商品货筐
                    openToReaservhNoneWindow($scope.toReserachBasket);
                }
            })
        }
        //扫描pod
        $scope.scanPod = function (e) {
            var keyCode = window.event ? e.keyCode : e.which;
            if (keyCode != 13) return;
            pickToPackService.scanPod($scope.podNo, function (data) {
                initPod(data);//初始化pod
            });
            $scope.getOrderPosition($scope.podNo,$scope.stationNo);//获取取货单信息
            $scope.basketOperate = "sku";
            $scope.windowMessage = "请从指定货位取出商品，检查并扫描商品";
            setTimeout(function () {$("#skuId").focus(),200});
            pickToPackService.openLight($scope.pickPackCellLight);
        }
        //获取取货单信息
        $scope.getOrderPosition = function (podNo,stationNo) {
            //获取取货单信息
            pickToPackService.getOrderPosition(podNo,stationNo,function (datas) {
                $scope.amountPicked = datas.amountPicked;//需要拣的数量
                $scope.pickId = datas.id;//拣货单id
                $scope.pickNo = datas.amountPicked;
                $scope.skuNo = datas.itemDataDTO.skuNo;//商品skuNo
                $scope.skuDescription = datas.itemDataDTO.name;
                $scope.serialNoCode = datas.itemDataDTO.serialRecordType;//商品序列号是否需要扫描 ALWAYS_RECORD需要扫描
                var fieldIndex = data.pickPackCellDTO.fieldIndex;
                $scope.pickPackCellLight = data.pickPackCellDTO.digitalabel1Id;//对应Pick Pack Cell的电子标签
                //pickToPackService.openLight($scope.pickPackCellLight);//打开对应cell的灯
                //pod格子高亮
                $scope.podHierarchy = data.pickFromLocationName.substring(9,10); //ABC  层级
                $scope.podNumber = data.pickFromLocationName.substring(10); //123 排列
                $scope.podHeight = parseInt(changeChar($scope.podHierarchy));
                $scope.podWidth = parseInt($scope.podNumber) - 1;
                $scope.podColor = $scope.podWallColor[$scope.podHierarchy];
                $scope.podRows[$scope.podHeight].color = $scope.podColor; //行颜色
                $scope.podRows[$scope.podHeight].item[$scope.podWidth].name = data.pickFromLocationName.substring(9);
                $scope.podRows[$scope.podHeight].item[$scope.podWidth].choice = true;
                //pickPackWall格亮
                $scope.pickrow = data.pickPackCellDTO.xPos;
                $scope.pickcolumn = data.pickPackCellDTO.yPos;
                if(fieldIndex == 1){
                    $scope.pickPackWall1Rows[$scope.pickrow -1].item[$scope.pickcolumn - 1].name = $scope.amountPicked;
                    $scope.pickPackWall1Rows[$scope.pickrow -1].item[$scope.pickcolumn - 1].choice = true;
                }
                if(fieldIndex == 2){
                    $scope.pickPackWall2Rows[$scope.pickrow -1].item[$scope.pickcolumn - 1].name = $scope.amountPicked;
                    $scope.pickPackWall2Rows[$scope.pickrow -1].item[$scope.pickcolumn - 1].choice = true;
                }
                if(fieldIndex == 3){
                    $scope.pickPackWall3Rows[$scope.pickrow -1].item[$scope.pickcolumn - 1].name = $scope.amountPicked;
                    $scope.pickPackWall3Rows[$scope.pickrow -1].item[$scope.pickcolumn - 1].choice = true;
                }
                //商品出现问题时需要的信息
                $scope.lotNo = datas.stockUnit.lot.lotNo;
                $scope.serialNo=datas.stockUnit.serialNo;
                $scope.itemNo=datas.itemData.itemNo;
                $scope.itemDataId=datas.itemData.id;
                $scope.problemStoragelocation = datas.pickfromLocationName;
            })
        }
        //扫描商品
        $scope.scanSKU = function (e) {
            var keyCode = window.event ? e.keyCode : e.which;
            if (keyCode != 13) return;
            if( $scope.amountPicked == 1) {
                var obj = {pickId:$scope.pickId,itemNo:$scope.skuNo,amountPicked:$scope.amountPicked,type:""};
                pickToPackService.scanSKU(obj, function (data) {
                    if (data.msg == "serialNo") {
                        $scope.basketOperate = "seriesNo";
                        $scope.windowMessage = "请扫描商品的序列号"
                        $scope.seriesWindow("seriesNoId", $scope.seriesNoWindows, function () {
                            $("#seriesNumberId").focus();
                        });
                    }
                    if(data.msg == "ok"){
                        putItem();
                    }
                })
            }
            if($scope.amountPicked > 1){
                $scope.amount = $scope.amountPicked
                $scope.skuOperate = "skuNoInput";
                $scope.basketOperate = "skuNoInput";
                $scope.windowMessage = "请输入商品数量";
            }
        }
        //扫描商品序列号
        $scope.scanSeriesNo=function (e) {
            var keyCode = window.event ? e.keyCode : e.which;
            if (keyCode != 13) return;
            pickToPackService.scanSeriesNo($scope.pickId,$scope.seriesNo,function (data) {
                if("GENUINE" == $scope.serialNoType){
                    $scope.seriesNoWindows.close();
                    $scope.basketOperate="putSKU";
                    $scope.windowMessage="请将商品放置到指定Pick-Pack Wall，并按动Pick-Pack Wall上方暗灯";
                    setTimeout(function () {$("#putSKUId").focus();},200);
                    //按灯
                    /*pickToPackService.clickLight($scope.pickPackCellLight,function () {
                        if(data == "ok"){
                        pickToPackService.scanPod($scope.podNo, function (data) {
                        initPod(data);//初始化pod
                        });
                        $scope.getOrderPosition($scope.podNo,$scope.stationNo);//获取取货单信息
                        }
                        })*/
                }
                if("DAMAGED" == $scope.serialNoType){
                    var obj = {pickId:$scope.pickId,itemNo:$scope.skuDamagedNo,amountPicked:$scope.amountPicked,type:"DAMAGED"};
                    handleProblemItem(obj);
                }
            },function (data) {
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
            })
        }
        //选择拣货数量
        $scope.bind = function (x) {
            $scope.pickNoInput = x;
        }
        //输入拣货数量后确定
        $scope.confirmPick = function () {
            var obj = {pickId:$scope.pickId,itemNo:$scope.skuNo,amountPicked:$scope.pickNoInput};
            pickToPackService.scanSKU(obj, function (data) {
              if(data.msg == "ok"){
                  putItem();
              }
            })
        }
        //商品残损按钮
        $scope.skuDamaged = function () {
            $scope.skuDamagedNo="";
            $scope.basketOperate="skuDamaged";
            $scope.windowMessage="请扫描残损商品";
            setTimeout(function () {
                $("#skuDamagedId").focus();
            },200);
        }
        //扫描残损商品
        $scope.scanskuDamaged = function (e) {
            var keyCode = window.event ? e.keyCode:e.which;
            if(keyCode != 13) return;
            //判断是否需要扫描序列号
            if($scope.serialNoCode == "ALWAYS_RECORD"){
                $scope.serialNoType = "DAMAGED";//扫描序列号变为残品序列号状态
                $scope.basketOperate = "seriesNo";
                $scope.windowMessage = "请扫描商品的序列号"
                $scope.seriesWindow("seriesNoId", $scope.seriesNoWindows, function () {
                    $("#seriesNumberId").focus();
                });
            }else{
                var obj = {pickId:$scope.pickId,itemNo:$scope.skuDamagedNo,amountPicked:$scope.amountPicked,type:"DAMAGED"};
                handleProblemItem(obj);
            }

        }
        //问题商品处理
        function handleProblemItem(obj) {
            pickToPackService.handleProblemItem(obj,function (data) {
                //调用问题处理接口
                var obProblemDTO = {problemType:"Damaged",amount:$scope.pickNo,reportDate:data.reportDate};
                callProblem(obProblemDTO);
                putCanPin();//放问题商品
            },function (data) {
                if(data.message == "SAME_ITEMNAME_DIFFERENT_LOT"){
                    $scope.errorWindow("changeBakId",$scope.changeBakWindows);
                    $scope.BasketFullMessaage="货筐号码："+data.value+"中存在相同名称不同有效期商品，请点击“货筐已满”结满当前货筐，扫描空的货筐后再放置商品";
                }else if(data.message == "SAME_ITEM_DIFFERENT_CLIENT"){
                    $scope.errorWindow("changeBakId",$scope.changeBakWindows);
                    $scope.BasketFullMessaage="货筐号码： "+data.value+"中存在相同名称不同客户商品，请点击“货筐已满”结满当前货筐，扫描空的货筐后再放置商品";
                }
            })
        }
        //货筐已满按钮事件
        $scope.BasketFull = function () {
            $scope.changeBakWindows.close();
            //获取该站台3个筐目前的信息
            pickToPackService.getBakInfo($scope.stationNo,function (data) {
                $scope.bakInfo=data.pickingUnitLoadResults;
            });
            $scope.scanFullBakWindow("scanFullId",$scope.scanFullWindows,function(){$("#fullBasketId").focus()});
            $scope.basketOperate = "windowMessage";
            $scope.windowMessage="请扫描已满货筐";
        }
        //扫描已满货筐
        $scope.scanfullBasket = function(e){
            var keyCode = window.event ? e.keyCode:e.which;
            if(keyCode != 13) return;
            pickToPackService.scanfullBasket($scope.fullBasket,$scope.stationNo,function (data) {
                $scope.storageTypeName = data.storageName;
                $scope.scanFullWindows.close();
                if(data.storageName == "DAMAGED") {
                    $scope.newBasketNo = "已成功满筐在残品货筐位置，货筐条码：" + $scope.fullBasket + "，商品总数" + data.sum + "件,请扫描新的货筐放在残品货筐位置";
                }
                if(data.storageName == "GENUINE"){
                    $scope.newBasketNo = "已成功满筐在无法扫描货筐位置，货筐条码：" + $scope.fullBasket + "，商品总数" + data.sum + "件,请扫描新的货筐放在无法扫描货筐位置";
                }
                if(data.storageName == "TO_INVESTIGATE"){
                    $scope.newBasketNo = "已成功满筐在待调查货筐位置，货筐条码：" + $scope.fullBasket + "，商品总数" + data.sum + "件,请扫描新的货筐放在待调查货筐位置";
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
                $scope.basketOperate = "windowMessage";
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
                        //残品筐里有商品
                        openDamagedWindow(data);
                    }
                    if($scope.storageTypeName == "GENUINE") {
                        openUnScanWindow(data);
                    }
                    if($scope.storageTypeName == "TO_INVESTIGATE") {
                        openToReaservhWindow(data);
                    }
                }
                if(data.msg == "yiBangDing"){
                    if($scope.storageTypeName == "DAMAGED") {
                        //残品筐已被绑定
                        openDamagedScanWindow(data,info);
                    }
                    if($scope.storageTypeName == "GENUINE") {
                        openUnScanBindWindow(data,info);
                    }
                    if($scope.storageTypeName == "TO_INVESTIGATE") {
                        openToReaservhBindWindow(data,info)
                    }
                }
                if(data.msg == "none"){
                    if($scope.storageTypeName == "DAMAGED") {
                        //无效的残品筐
                        openDamagedNoneWindow(info);
                    }
                    if($scope.storageTypeName == "GENUINE") {
                        openUnScanNoneWindow(info);
                    }
                    if($scope.storageTypeName == "TO_INVESTIGATE") {
                        openToReaservhNoneWindow(info);
                    }
                }
                if(data,msg == "ok"){
                    if($scope.storageTypeName == "DAMAGED") {
                        $scope.newBasketNo = "已成功扫描车牌" + $scope.newbasketNo + "在残品货筐位置;请按动货筐上方暗灯";
                    }
                    if($scope.storageTypeName == "GENUINE") {
                        $scope.newBasketNo = "已成功扫描车牌" + $scope.newbasketNo + "在无法扫描货筐位置;请按动货筐上方暗灯";
                    }
                    if($scope.storageTypeName == "TO_INVESTIGATE") {
                        $scope.newBasketNo = "已成功扫描车牌" + $scope.newbasketNo + "在待调查货筐位置;请按动货筐上方暗灯";
                    }
                    $scope.newbakWindows.setOptions({
                        title:"请按动货筐上方暗灯",
                        activate:function () {$("#newbasketId").focus();}
                    });
                    $scope.basketOperate = "windowMessage";
                    $scope.windowMessage="请按动货筐上方暗灯";
                    //按灯接口，成功后，关闭这个窗口，获取拣货单信息
                    pickToToteService.clickLight($scope.digitalLabelId,function (data) {
                        if(data == "ok"){
                            $scope.newbakWindows.close();
                            getOrder($scope.podNo,$scope.stationNo);//获取取货单信息
                        }
                    })
                }
            });
        }
        //待调查商品货筐确定，进入桉灯
        $scope.continueToReserach = function () {
            $scope.reserachWindows.close();
            //绑定货筐
            pickToPackService.bindStorage($scope.toReserachBasket,$scope.stationNo,"TO_INVESTIGATE",function (data) {
                if(data.msg=="ok") {
                    $scope.toInvestigatePId = data.pId;
                    $("#toReserachId").css("background", "#00B050");
                    $scope.windowMessage = "请按动待调查商品货筐上方暗灯";
                }
            });
            pickToToteService.clickLight($scope.toReserachLight,function (data) {
                if(data == "ok"){
                    $("#toReserachId").css("background","#D9D9D9");
                    $scope.basketOperate = "pod";
                    $scope.windowMessage = "等待Pod进入";
                    setTimeout(function () {
                        $("#podId").focus();
                    }, 200);
                }
            })
        }
        //无法扫描商品货筐确定，进入桉灯
        $scope.continueUnScan = function () {
            $scope.unScanWindows.close();
            //绑定货筐
            pickToPackService.bindStorage($scope.unScanSKUBasket,$scope.stationNo,"GENUINE",function (data) {
                if(data.msg=="ok") {
                    $scope.canNotScanPId = data.pId;
                    $("#unScanId").css("background", "#00B050");
                    $scope.windowMessage = "请按动无法扫描商品货筐上方暗灯";
                }
            });
            pickToToteService.clickLight($scope.unScanLight,function (data) {
                if(data == "ok"){
                    $("#unScanId").css("background","#D9D9D9");
                    $("#toReserachId").css("background","#33CCFF");
                    $scope.basketOperate = "toReserachBasket";
                    $scope.windowMessage = "请扫描待调查货筐，并将货筐放于指定位置";
                    setTimeout(function () {
                        $("#toReserachBasketId").focus();
                    }, 200);
                    //打开对应位置电子标签
                    pickToPackService.openLight($scope.toReserachLight);
                }
            })
        }
        //残品货筐确定，进入桉灯
        $scope.continueCanPin = function () {
            $scope.canPinWindows.close();
            //绑定货筐
            pickToPackService.bindStorage($scope.canPinBasket,$scope.stationNo,"DAMAGED",function (data) {
                if(data.msg=="ok"){
                    $scope.damagedPid = data.pId;
                    $("#canPinId").css("background","#00B050");
                    $scope.windowMessage = "请按动残品货筐上方暗灯";
                }
            });
            pickToToteService.clickLight($scope.damagedLight,function (data) {
                if(data == "ok"){
                    $("#canPinId").css("background","#D9D9D9");
                    $("#unScanId").css("background","#FFC000");
                    $scope.basketOperate = "unScanSKUBasket";
                    $scope.windowMessage = "请扫描商品无法扫描货筐，并将货筐放于指定位置";
                    setTimeout(function () {
                        $("#unScanSKUBasketId").focus();
                    }, 200);
                    //打开对应位置电子标签
                    pickToPackService.openLight($scope.unScanLight);
                }
            })
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
        //待调查商品货筐请求确认时取消，重新扫描货筐
        $scope.toReserachclose = function () {
            $scope.windowMessage = "请重新扫描待调查商品货筐";
            $scope.reserachWindows.close();
            setTimeout(function () {
                $("#toReserachBasketId").focus();
            }, 200);
        }
        //////////////////////////////////////////////////////////////问题处理按钮//////////////////////////////////////
        //商品丢失
        $scope.skuMiss = function () {
            $scope.qusetionWindows.close();
            $scope.openWindow({
                windowId:"scanHuoWeiId",
                windowName:$scope.scanHuoWeiWindows,
                windowClass:"blueWindow",
                width:700,
                height:300,
                closeable:true,
                activate:function () {$("#huoWeiId").focus();},
            })

        }
        //货筐已满
        $scope.unitLoadFull = function () {
            $scope.qusetionWindows.close();
            //获取该站台3个筐目前的信息
            pickToPackService.getBakInfo($scope.pickPackStationName,function (data) {
                $scope.bakInfo=data.pickingUnitLoadResults;
            });
            $scope.scanFullBakWindow("scanFullId",$scope.scanFullWindows,function(){$("#fullBasketId").focus()});
            $scope.basketOperate = "windowMessage";
            $scope.windowMessage="请扫描已满货筐";
        }
        //商品无法扫描
        $scope.canNotScan = function () {
            var obj = {pickId:$scope.pickId,itemNo:"",amountPicked:$scope.amountPicked,type:"GENUINE"};
            handleProblemItem(obj);
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
                windowId:"isFinishId",
                windowName:$scope.isFinishWindows,
                windowClass:"blueWindow",
                width:700,
                height:260,
                closeable:false,
                visible:true,
            })
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////报告暗灯////////////////////////////////////////////////////////
        //货位无法扫描
        $scope.canNotScanBin = function () {

        }
        //货位存残品
        $scope.damagedSkuInBin = function () {

        }
        //货位存在无法扫描商品
        $scope.canNotScanInBin = function () {
            
        }
        //套装不全/被拆
        $scope.suitIncomplete = function () {
            
        }
        //套装组套错误
        $scope.suitWrong = function () {

        }
        //相似商品在相同货位
        $scope.similarSkuInSameBin = function () {
            
        }
        //货筐商品太满
        $scope.storageItemFull = function () {

        }
        //货位存在安全隐患
        $scope.storageIsNotSafe = function () {
            
        }
        //货位需要检查
        $scope.storageNeedCheck = function () {

        }
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //确认是否结束拣货
        $scope.exit = function () {
            $scope.isFinishWindows.close();
            $scope.openWindow({
                windowId:"isFullId",
                windowName:$scope.isFullAllBakWindows,
                windowClass:"blueWindow",
                width:700,
                height:260,
                closeable:false,
                visible:true,
            })
            pickToPackService.stopWorking($scope.stationNo);//解除用户与工作站绑定
        }
        $scope.notExit = function () {
            $scope.isFinishWindows.close();
        }
        //确认结满所有货筐
        $scope.fullAll = function () {
            pickToPackService.fullAllStorage($scope.stationNo);//结满工作站下所有货筐
            $scope.isFullAllBakWindows.close();
            $state.go("main.pick");
        }
        $scope.notFullAll = function () {
            $scope.isFullAllBakWindows.close();
            $state.go("main.pick");
        }
        //货位扫描
        $scope.scanHuoWei = function (e) {
            var keyCode = window.event ? e.keyCode:e.which;
            if(keyCode != 13) return;
            pickToPackService.scanHuoWei($scope.HuoWei,$scope.pickId,function (data) {
                if(data == "ok"){
                    $scope.scanHuoWeiWindows.close();
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
                if(data == "wrong"){
                    //货位扫描错误，重新扫描
                }
            })
        }
        //逐一扫描货位里的商品
        $scope.scanEachSKU = function (e) {
            var keyCode = window.event ? e.keyCode:e.which;
            if(keyCode != 13) return;
            pickToPackService.scanEachSKU($scope.eachSKUNo,function (data) {
                if(data.msg == "different"){
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
            })
        }
        //商品扫描错误，继续每一件扫描
        $scope.scanEverySKU = function (e) {
            var keyCode = window.event ? e.keyCode:e.which;
            if(keyCode != 13) return;
            pickToPackService.scanEachSKU($scope.eachSKUNo,function (data) {
                if(data.msg == "different"){
                    $scope.everySKUNo = "";
                }
                if(data.msg == "ok"){
                    $scope.getOrderPosition($scope.podNo,$scope.stationNo);//获取取货单信息
                }
            })
        }
        //货位为空，留个接口，功能和已扫描完所有商品按钮一样
        $scope.positionEmpry = function () {
            pickToPackService.haveScanedAllSKU($scope.pickId);
            $scope.getOrderPosition($scope.podNo,$scope.stationNo);//获取取货单信息
            var data = {
                problemType:"LOSE",
                amount:$scope.amountPicked,
                reportDate:kendo.format("{0:yyyy-MM-hh HH:mm:ss}", new Date())
            }
            callProblem(data);
        }
        //已扫描完所有商品
        $scope.haveScanedAllSKU = function () {
            pickToPackService.haveScanedAllSKU($scope.pickId);
            $scope.getOrderPosition($scope.podNo,$scope.stationNo);//获取取货单信息
            var data = {
                problemType:"LOSE",
                amount:$scope.amountPicked,
                reportDate:kendo.format("{0:yyyy-MM-hh HH:mm:ss}", new Date())
            }
            callProblem(data);
        }
        ///////////////////////////////////////////////////////////////内部函数////////////////////////////////////////////////////
        //取商品扫商品
        function putItem() {
            $scope.basketOperate = "putSKU";
            $scope.windowMessage = "请将商品放到指定的Pick-Pack Wall,并按动Pick-Pack Wall上方暗灯";
            //按灯
            pickToPackService.clickLight($scope.pickPackCellLight,function () {
                if(data == "ok"){
                    /*pickToPackService.scanPod($scope.podNo, function (data) {
                        initPod(data);//初始化pod
                    });*/
                    $scope.getOrderPosition($scope.podNo,$scope.stationNo);//获取取货单信息
                }
            })
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
            $("#" + windowId).parent().addClass("myWindow");
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
        //残品货筐扫描报错时弹窗
        function openDamagedWindow(data) {
            //残品筐里有商品
            $scope.basketOperate="scanCanPinBasket";
            $scope.windowMessage = "请确认是否使用当前残品货筐";
            $scope.skuNo = (data.values)[0];
            $scope.errorWindow("canPinBakId",$scope.canPinWindows,function () {
                $("#recanPinBasketId").focus();
            });
        }
        function openDamagedScanWindow(data,canPinBasket){
            //残品筐已被绑定
            $scope.basketOperate="scanCanPinBasket";
            $scope.windowMessage = "请重新扫描残品货筐";
            $scope.stationName=(data.values)[0];
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
            $scope.unScanSkuNo = (data.values)[0];
            $scope.windowMessage = "请确认是否使用当前无法扫描商品货筐";
            $scope.errorWindow("unScanWindows", $scope.unScanWindows);
        }
        function openUnScanBindWindow(data,unScanSKUBasket) {
            $scope.basketOperate = "unScanSKUBasket";
            $scope.windowMessage = "请重新扫描无法扫描商品货筐";
            $scope.unScanSKUBasketNo = unScanSKUBasket;
            $scope.unScanSKUBasket = "";
            $scope.stationName = (data.values)[0];
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
        //待调查货筐扫描报错时弹窗
        function openToReaservhWindow(data) {
            $scope.basketOperate = "toReserachBasket";
            $scope.toReserachSkuNo = (data.values)[0];
            $scope.windowMessage = "请确认是否使用当前待调查商品货筐";
            $scope.errorWindow("reserachId", $scope.reserachWindows);
        }
        function openToReaservhBindWindow(data,toReserachBasket) {
            $scope.basketOperate = "toReserachBasket";
            $scope.stationName = (data.values)[0];
            $scope.windowMessage = "请重新扫描待调查商品货筐";
            $scope.toReserachBasketNo = toReserachBasket;
            $scope.toReserachBasket = "";
            $scope.errorWindow("toReserachBakId", $scope.toReserachWindows,function () {
                $("#retoReserachBasketId").focus();
            });
            $scope.toReserachOperate = "yiBangDing";
        }
        function openToReaservhNoneWindow(toReserachBasket) {
            $scope.basketOperate = "toReserachBasket";
            $scope.windowMessage = "请重新扫描待调查商品货筐";
            $scope.toReserachBasketNo = toReserachBasket;
            $scope.toReserachBasket = "";
            $scope.errorWindow("toReserachBakId", $scope.toReserachWindows,function () {
                $("#retoReserachBasketId").focus();
            });
            $scope.toReserachOperate = "wuXiao";
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
        //outbound问题处理
        function callProblem(data) {
            $scope.problemData = {
                problemType:data.problemType,
                amount:data.amount,
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
        //放残品
        function putCanPin() {
            $scope.putCanpin= "scanCanPinBasket";
            $scope.windowMessage = "请将商品放置到残品货筐中，并按动残品货筐上方暗灯";
            $("#canPinId").css("background","#FF0000");
            pickToPackService.clickLight($scope.damagedLight,function () {
                $scope.getOrderPosition($scope.podNo,$scope.stationNo);//获取取货单信息
            })
        }
        // 初始化页面
        function initPage() {
            if ($rootScope.pickPackContinue) {
                $scope.pickPackOperate = "scanPickPackCar"; // 继续扫描pickpack_car
                $rootScope.pickpackcar = {};
                $rootScope.pickPackMain = {};
                $rootScope.pickPackContinue = false;
                setTimeout(function () {
                    $("#pickPack_pickPackCar").focus();
                }, 100);
            } else {
                $rootScope.pickPackContinue = false;
                $rootScope.pickPackStation = {};
                $rootScope.pickPackMain = {};
                $rootScope.pickpackcar = {};
                $scope.pickPackOperate = "scanStation"; // 初始扫描工作站
                setTimeout(function () {
                    $("#pickPack_station").focus();
                }, 200);
            }
        }
        //初始化主页面
        function initMainPage() {
            $scope.pickPackStation = {};
            $scope.pickpackcar = {};
            $scope.pickPackOperate = {};
            $scope.pickPackMain = "pickPackMain";
            $scope.basketOperate = "scanCanPinBasket";
            $scope.skuOperate = "skuNo";//"skuNo";"skuNoInput"
            //$scope.amount = 4;
            $scope.windowMessage = "请扫描残品货筐，并将货筐放于指定位置";
            $("#canPinId").css("background","red");
            setTimeout(function () {
                $("#canPinBasketId").focus();
            }, 200);
            //调灯亮的接口
            //$scope.damagedLight = "2f087879-dd62-4e3b-a10a-3f7b97f34e3f";
           // pickToPackService.openLight($scope.damagedLight);

        }
        //初始化Pick Pack Wall
        function initPickPackWall(data) {
            //初始化左侧格子
            initLeft(data[0]);
            //初始化中间格子
            initMiddle(data[1]);
            //初始化右边格子
            initRight(data[2]);
            $scope.pickPackWallWidth = $scope.numberOfColumns1 + $scope.numberOfColumns2 + $scope.numberOfColumns3;
        }
        function initLeft(data){
            $scope.pickPackWall1Rows = [], $scope.pickPackWall1Columns = [];
            $scope.numberOfRows1 = data.numberOfRows;
            $scope.numberOfColumns1 = data.numberOfColumns;
            $scope.cellHeight1 = ($scope.wallHeight - ($scope.numberOfRows1+1) * 10)/$scope.numberOfRows1;
            for (var i = 0; i < data.numberOfColumns;i++) $scope.pickPackWall1Columns.push({
                name: "",
                choice: false
            });
            for (var i = 0; i < data.numberOfRows; i++) $scope.pickPackWall1Rows[i] = angular.copy({
                item: $scope.pickPackWall1Columns,
                color: "#c1c1c1"
            });
            var data = $scope.pickPackWall1Rows;
            angular.forEach(data, function (data) {
                data.color = "#c1c1c1";
                angular.forEach(data.item, function (data) {
                    data.name = "";
                    data.choice = false;
                })
            });
        }
        function initMiddle(data) {
            $scope.pickPackWall2Rows = [], $scope.pickPackWall2Columns = [];
            $scope.numberOfRows2 = data.numberOfRows;
            $scope.numberOfColumns2 = data.numberOfColumns;
            $scope.cellHeight2 = ($scope.wallHeight - ($scope.numberOfRows2+1) * 10)/$scope.numberOfRows2;
            for (var i = 0; i < data.numberOfColumns;i++) $scope.pickPackWall2Columns.push({
                name: "",
                choice: false
            });
            for (var i = 0; i < data.numberOfRows; i++) $scope.pickPackWall2Rows[i] = angular.copy({
                item: $scope.pickPackWall2Columns,
                color: "#c1c1c1"
            });
            var data = $scope.pickPackWall2Rows;
            angular.forEach(data, function (data) {
                data.color = "#c1c1c1";
                angular.forEach(data.item, function (data) {
                    data.name = "";
                    data.choice = false;
                })
            });
        }
        function initRight(data) {
            $scope.pickPackWall3Rows = [], $scope.pickPackWall3Columns = [];
            $scope.numberOfRows3 = data.numberOfRows;
            $scope.numberOfColumns3 = data.numberOfColumns;
            $scope.cellHeight3 = ($scope.wallHeight - ($scope.numberOfRows3+1) * 10)/$scope.numberOfRows3;
            for (var i = 0; i < data.numberOfColumns; i++) $scope.pickPackWall3Columns.push({
                name: "",
                choice: false
            });
            for (var i = 0; i < data.numberOfRows; i++) $scope.pickPackWall3Rows[i] = angular.copy({
                item: $scope.pickPackWall3Columns,
                color: "#c1c1c1"
            });
            var data = $scope.pickPackWall3Rows;
            angular.forEach(data, function (data) {
                data.color = "#c1c1c1";
                angular.forEach(data.item, function (data) {
                    data.name = "";
                    data.choice = false;
                })
            });
        }
        function init() {
           initPage();
        }
        //初始化
        init();
    })
})();