/**
 * Created by 123 on 2017/4/19.
 */
(function () {
    "use strict";
    angular.module("myApp").controller("receivingToteCtl",function ($window,$scope, $rootScope, $state, $stateParams,INBOUND_CONSTANT,receivingService,receiving_commonService,commonService) {
        $("#receiving_user").html($window.localStorage["name"]); // 当前用户
        console.log("tote--->");
        // $scope.fullfinish = '0';
        $scope.podstatus = '0';
        var scan_product_content= false;
        var scan_DN = false;
        var scan_product_info= false;
        var scan_product_content_DAMAGED= $rootScope.scan_product_content_DAMAGED;
        var scan_product_content_MEASURED= $rootScope.scan_product_content_MEASURED;
        var scan_product_content_TO_INVESTIGATE= $rootScope.scan_product_content_TO_INVESTIGATE;
        var thisid;
        var receiveType = INBOUND_CONSTANT.GENUINE;
        var finishType = INBOUND_CONSTANT.SINGLE;
        var isSingle= false;
        var scan_bin = false;
        var isScanConstainerFinish = false;
        var scanNums = 0;
        var currentMode = "";
        var adviceNo = "";
        var storageid = "";
        var amount = "";
        var itemid = "";
        var sn = "";
        var useAfter = "";
        var storages = new Array();
        function refreshReceivingContainer(receivingStationId, isInit){
            isInit == null && (isInit = false);
            receivingService.getReceivingContainer(receivingStationId, function(datas){
                var isMax = (datas.length === $scope.maxAmount), gridId = "receivingGRID";
                // 初始化
                if(isInit){
                    $scope.status = (isMax? "max": "normal");
                    $scope.status === "normal" && (setTimeout(function(){ $("#receiving_destination").focus();}, 100));
                    isMax && (gridId = "receivedGRID");
                }
                // 数据
                var grid = $("#"+ gridId).data("kendoGrid");
                grid.setDataSource(new kendo.data.DataSource({data: datas}));
                $rootScope.receivingProcessContainers = datas;
                // 跳转收货页面
                if(!isInit && isMax){
                    setTimeout(function(){
                        $state.go($scope.receivingCurrent==='single'? "main.receivingSingle": "main.receivingPallet");
                    }, 1000);
                }
            });
        }

        // ========================================================================================
        // 跳转收货页面
        $scope.toReceiving = function(){
            $state.go($scope.receivingCurrent==='single'? "main.receivingSingle": "main.receivingPallet");
        };

        // 扫描工作站
        $scope.scanStation = function(e){
            var keyCode = window.event? e.keyCode: e.which;
            if(keyCode != 13) return;
            $scope.scanstatus = '1';
            if($scope.scanstatus==='1'){
                commonService.dialogMushiny($scope.window, {
                    url: "modules/inbound/receiving/templates/scan-station-error.html",
                    width:500,
                    height:300
                });
            }
            $scope.status = 'max';
            $scope.scanstatus = '0';
            $scope.scanhead = '1';
            console.log("开始填充");
            var root_div = $scope;

        };

        // 扫描目的地
        $scope.scanDestination = function(e){
            var keyCode = window.event? e.keyCode: e.which;
            if(keyCode != 13) return;
            $scope.destinationId = "";
            // receivingService.scanDestination($scope.stationId, $scope.destination, function(data){
            //   $scope.destinationId = data.id;
            //   $("#warnDestination").html("");
            //   $("#receiving_container").focus();
            // }, function(data){
            //   $("#warnDestination").html(data.message);
            // });
        };

        // 扫描车牌
        $scope.scanContainer = function(e){
            var keyCode = window.event? e.keyCode: e.which;
            if(keyCode != 13) return;
            // receivingService.scanContainer($scope.container, function(data){
            //   $scope.containerId = data.id;
            //   $("#warnContainer").html("");
            //   receivingService.saveReceivingContainer({
            //     "receivingStationId": $scope.stationId,
            //     "receivingDestinationId": $scope.destinationId,
            //     "containerId": $scope.containerId
            //   }, function(){
            //     refreshReceivingContainer($scope.stationId); // 刷新绑定车牌信息表
            //     $("#receiving_destination").focus();
            //   });
            // }, function(data){
            //   $("#warnContainer").html(data.message);
            // });
        };

        $scope.switchMode = function (modeData) {
            isSingle = modeData;
            if(isSingle){
                finishType=INBOUND_CONSTANT.SINGLE;
            }else{
                finishType=INBOUND_CONSTANT.ALL;
            }
        }

        // 自动满筐所有车牌
        $scope.deleteReceivingContainer = function(e){
            $scope.status= 'init';
            $scope.receivingMode= 'init';
            $scope.receivingButton= 'init';
            $scope.fullfinish = '0';
            var isSELECT = false;
            var SELECTID;
            var root_div = $("#select_bin_grid");
            console.log("开始填充");
            var count  = "";
            for (var i = 0;i<5;i++){
                count += "<div style='float: left;margin-left:8%;width:80%;height:25%'>"
                for (var j=0;j<4;j++){
                    count +="<div class='box_shadow_with_radius' id='bin_item"+i+j+"'"+
                        // "style='width:20%;height:70%;background-color: #E0EEEE;margin-left:5%;float: left'> " +
                        "<span id='bin_item_title' style='font-size: 24px;line-height: 80px;color: #FFFFFF;'>"+j+"</span> " +
                        "</div>";
                }
                count+="</div>";
            }
            root_div.html(count);
            $('.box_shadow_with_radius').each(function(){
                $(this).click(function(){
                    if(isSELECT){
                        console.log("有选-id--->"+SELECTID);
                        document.getElementById(SELECTID).style.backgroundColor = '#E0EEEE';
                        // this.style.backgroundColor = '#FF0000';
                        // SELECTID = this.id;
                    }else{
                        console.log("未选id--->"+SELECTID);
                        isSELECT = true;
                    }
                    SELECTID = this.id;
                    this.style.backgroundColor = '#00a2eb';
                })
            })

            // receivingService.deleteReceivingContainer($scope.stationId, function(){
            //   $scope.
            //   $scope.receivingMode= 'init';
            //   $scope.receivingButton= 'init';
            // });
        };

        /**根据数据动态生成div表格
         *  @param rootdiv 生成div表格的容器
         * @param row 表格的行数
         * @param column 表格的列数
         * @param flag动态生成的div加标志位
         * @param ispercentage 宽高单位是否为百分比
         * @param tablespace 分割线距离
         */
        function fillGrid(rootdiv,row,column,flag,temlateClass,tableSpace,unit) {
            if(rootdiv==null||rootdiv==undefined||row<1||column<1)return;
            var count  = "";
            var root_width = rootdiv.style.width;
            var root_height = rootdiv.style.height;
            var all_space_horizon = (column+1)*tableSpace;
            var all_space_ver = (row+1)*tableSpace;
            var item_width = parseInt((root_width - all_space_horizon)/column);
            var item_height = parseInt((root_height - all_space_ver)/row);
            for (var i = 0;i<row;i++){
                count += "<div style='float: left;width:100%;height:10%;margin-top: 6%'>"
                for (var j=0;j<column;j++){
                    count +="<div class='"+temlateClass+"' id='"+flag+i+j+"'"+
                        "style='width:10%;height:100%;'> " +
                        "<span id='"+flag+i+j+"' style='color: #FFFFFF;line-height: 3;'></span> " +
                        "</div>";
                }
                count+="</div>";
            }
            rootdiv.innerHTML = count;
            $('.'+temlateClass).each(function(){
                $(this).click(function(){
                    thisid = this.id;
                    $('.'+temlateClass).each(function(){
                        if(this.id!=thisid){
                            this.style.backgroundColor = '#8c8c8c';
                        }
                    })
                    receiving_commonService.receiving_tip_dialog_normal("keyboard_window",{
                        width:600,
                        height:400,
                        title:"请输入收货数量",
                        open:function () {
                            receiving_commonService.keyboard_fillGrid($("#keyboard_keys"),2,5,"keyboard","keyboard_layout_item",0,"px");
                        },
                        close:function () {
                            $("#keyboard_inputer").value = "";
                        }
                    });
                })
            })
            // rootdiv.html(count);
        }

        $scope.switchMode = function (modeData) {
            isSingle = modeData;
        }

        function finishGoods() {
            if(isSingle){//是否单件收货
                receivingService.finishReceive({
                    receiveStationId:$rootScope.stationId,
                    adviceId:adviceNo,
                    sn:sn,
                    useNotAfter:useAfter,
                    itemId:itemid,
                    storageLocationId:storageid,
                    amount:1,
                    receiveType:receiveType,
                    finishType:finishType
                },function () {
                    alert("上架成功");
                    $("#receiving_status_span").html("已成功收货上架"+amount+"件商品至</br>"+storageid);
                    $("#"+receiving_commonService.findStorageLocation()).css({"backgroundColor":"#00b0ff"});
                    receiving_commonService.closePopWindow("keyboard_window");
                });
            }else{
                receiving_commonService.receiving_tip_dialog_normal("keyboard_window",{
                    width:600,
                    height:400,
                    title:"请输入收货数量",
                    open:function () {
                        receiving_commonService.keyboard_fillGrid($("#keyboard_keys"),2,5,"keyboard","keyboard_layout_item");
                    },
                    close:function () {
                        $("#keyboard_inputer").value = "";
                    }
                });
                // if(SingleMode){
                //     receivingService.finishReceive({
                //         receiveStationId:$rootScope.stationId,
                //         adviceId:adviceNo,
                //         sn:sn,
                //         useNotAfter:useAfter,
                //         itemId:itemid,
                //         storageLocationId:storageid,
                //         amount:1,
                //         receiveType:receiveType,
                //         finishType:finishType
                //     },function () {
                //         alert("上架成功");
                //         $("#receiving_status_span").html("已成功收货上架"+amount+"件商品至</br>"+storageid);
                //         $("#"+receiving_commonService.findStorageLocation()).css({"backgroundColor":"#00b0ff"});
                //         receiving_commonService.closePopWindow("keyboard_window");
                //     });
                // }else{
                //
                // }
            }
        }
        //收货数量弹出框确定
        $scope.finish_keyboard = function () {
            if($("#keyboard_inputer").val()===undefined||$("#keyboard_inputer").val()<1){
                $scope.keyboardStatus='0';
                return;
            }else{
                $scope.keyboardStatus='1';
            }
            amount = $("#keyboard_inputer").val();
            receivingService.finishReceive({
                receiveStationId:$rootScope.stationId,
                adviceId:adviceNo,
                sn:sn,
                useNotAfter:useAfter,
                itemId:itemid,
                storageLocationId:storageid,
                amount:amount,
                receiveType:receiveType,
                finishType:finishType
            },function () {
                $("#receiving_status_span").html("已成功收货上架"+amount+"件商品至</br>"+storageid);
                $("#"+receiving_commonService.findStorageLocation()).css({"backgroundColor":"#00b0ff"});
                receiving_commonService.closePopWindow("keyboard_window");
            });
        }

        $scope.receivingscan = function (e) {
            if(!receiving_commonService.autoAddEvent(e)) return;
            var inputvalue = $("#receiving-inputer").val();
            $("#receiving-inputer").val("");
            // if(scan_pod===false){//开始扫描pod号码
            //     podid = inputvalue;
            //     receivingService.getPodInfo(inputvalue,INBOUND_CONSTANT.BIN,function (data) {
            //         if(Number(data.status)<0||data.cls.totalRow===0){//pod信息不合法
            //             var options = {
            //                 width:500,
            //                 height:300,
            //                 title:INBOUND_CONSTANT.NOTGETPOD,
            //                 open:function () {
            //                     document.getElementById("tipwindow_span").innerHTML = INBOUND_CONSTANT.NOTGETPOD;
            //                 },
            //                 close:function () {
            //                     $("#receiving-inputer").focus();
            //                 }
            //             };
            //             receiving_commonService.receiving_tip_dialog("tipwindow",options);
            //         }else{
            //             scan_pod = true;
            //             if(!scan_product_content_DAMAGED){
            //                 $scope.scanbadcib='0';
            //                 $("#receiving_tip").html(INBOUND_CONSTANT.SCANDAMAGED);
            //             }
            //             storages = data.storageLocations;
            //             $("#receiving_pod_layout").html("");
            //             receiving_commonService.fillGrid(document.getElementById("receiving_pod_layout"),data.cls.totalRow,"receiving_pod_layout","receiving_pod_layout_item",data.cls.columnMap);
            //             setTimeout(function(){ $("#receiving-inputer").focus();}, 200);
            //         }
            //     });
            // }else{//开始扫描货筐
                if(scan_product_content_DAMAGED===false){
                    currentMode = "scan_product_content_DAMAGED";
                    console.log("$rootScope.receiveProcessDTOList-->"+$rootScope.receiveProcessDTOList);
                    receivingService.scanStorageLocation(inputvalue,INBOUND_CONSTANT.DAMAGED,$rootScope.stationName,$rootScope.receiveProcessDTOList[0].destinationId,$rootScope.receiveProcessDTOList[0].positionIndex,function (data) {
                        if(data.status==='2'){//有商品,提示用户
                            $scope.scancontainerType = INBOUND_CONSTANT.DAMAGED;
                            var options = {
                                width:600,
                                height:500,
                                title:INBOUND_CONSTANT.SUREUSELOCATION,
                                open:function () {
                                    $scope.wimgstatus='hidden';
                                    $("#win_content").html("当前货框:"+data.cls.storagelocationName+",里面有"+data.cls.amount+"件商品，请重新确认是否继续使用当前货筐进行收货");
                                },
                                close:function () {
                                    $("#receiving-inputer").focus();
                                }
                            };
                            receiving_commonService.receiving_tip_dialog("window_img_ok_cancel",options);
                        }else{
                            scan_product_content_DAMAGED = true;
                            $scope.scanbadcib='1';
                            $scope.scanmeasurecib = '0';
                            $("#receiving_tip").html(INBOUND_CONSTANT.SCANMEASURE);
                            setTimeout(function(){ $("#receiving-inputer").focus();}, 200);
                        }
                    },function (data) {
                        var options = {
                            title:INBOUND_CONSTANT.RESCANLOCATION,
                            open:function () {
                                $("#tipwindow_span").html(data.message);
                            },
                            close:function () {
                                $("#receiving-inputer").focus();
                            }
                        };
                        receiving_commonService.receiving_tip_dialog("tipwindow",options);
                    });
                }else{
                    if(scan_product_content_MEASURED===false){
                        currentMode = "scan_product_content_MEASURED";
                        receivingService.scanStorageLocation(inputvalue,INBOUND_CONSTANT.MEASURED,$rootScope.stationName,$rootScope.receiveProcessDTOList[1].destinationId,$rootScope.receiveProcessDTOList[1].positionIndex,function (data) {
                            if(data.status==='2'){//有商品,提示用户
                                $scope.scancontainerType = INBOUND_CONSTANT.MEASURED;
                                var options = {
                                    width:600,
                                    height:500,
                                    title:INBOUND_CONSTANT.SUREUSELOCATION,
                                    open:function () {
                                        $scope.wimgstatus='hidden';
                                        $("#win_content").html("当前货框:"+data.cls.storagelocationName+",里面有"+data.cls.amount+"件商品，请重新确认是否继续使用当前货筐进行收货");
                                    },
                                    close:function () {
                                        $("#receiving-inputer").focus();
                                    }
                                };
                                receiving_commonService.receiving_tip_dialog("window_img_ok_cancel",options);
                            }else{
                                scan_product_content_MEASURED = true;
                                $scope.scanmeasurecib = '1';
                                $scope.scanwaitcib='0';
                                $("#receiving_tip").html(INBOUND_CONSTANT.SCANINVESTAGETE);
                                setTimeout(function(){ $("#receiving-inputer").focus();}, 200);
                            }
                        },function (data) {
                            var options = {
                                title:INBOUND_CONSTANT.RESCANLOCATION,
                                open:function () {
                                    $("#tipwindow_span").html(data.message);
                                },
                                close:function () {
                                    $("#receiving-inputer").focus();
                                }
                            };
                            receiving_commonService.receiving_tip_dialog("tipwindow",options);
                        });
                    }else{
                        if(scan_product_content_TO_INVESTIGATE===false){
                            currentMode = "scan_product_content_TO_INVESTIGATE";
                            receivingService.scanStorageLocation(inputvalue,INBOUND_CONSTANT.TO_INVESTIGATE,$rootScope.stationName,$rootScope.receiveProcessDTOList[2].destinationId,$rootScope.receiveProcessDTOList[2].positionIndex,function (data) {
                                if(data.status==='2'){//有商品,提示用户
                                    $scope.scancontainerType = INBOUND_CONSTANT.TO_INVESTIGATE;
                                    var options = {
                                        width:600,
                                        height:500,
                                        title:INBOUND_CONSTANT.SUREUSELOCATION,
                                        open:function () {
                                            $scope.wimgstatus='hidden';
                                            $("#win_content").html("当前货框:"+data.cls.storagelocationName+",里面有"+data.cls.amount+"件商品，请重新确认是否继续使用当前货筐进行收货");
                                        },
                                        close:function () {
                                            $("#receiving-inputer").focus();
                                        }
                                    };
                                    receiving_commonService.receiving_tip_dialog("window_img_ok_cancel",options);
                                }else{
                                    scan_product_content_TO_INVESTIGATE = true;
                                    $scope.scanwaitcib='1';
                                    var xval = parseInt(scanNums/3);
                                    var yval = scanNums-(xval*3);
                                    console.log("xval-->"+xval+"/yval-->"+yval);
                                    $("#receivegrid"+xval+yval).css({"backgroundColor":"#00b0ff"});
                                    $("#receiving_tip").html(INBOUND_CONSTANT.SCANLOCATIONORDN);
                                }
                            },function (data) {
                                var options = {
                                    title:INBOUND_CONSTANT.RESCANLOCATION,
                                    open:function () {
                                        $("#tipwindow_span").html(data.message);
                                    },
                                    close:function () {
                                        $("#receiving-inputer").focus();
                                    }
                                };
                                receiving_commonService.receiving_tip_dialog("tipwindow",options);
                            });
                        }else{
                            if(isScanConstainerFinish===false){
                                currentMode = "scan_product_content_GENUINE";
                                receivingService.scanStorageLocation(inputvalue,INBOUND_CONSTANT.GENUINE,$rootScope.stationName,$rootScope.receiveProcessDTOList[(scanNums+3)].destinationId,$rootScope.receiveProcessDTOList[(scanNums+3)].positionIndex,function (data) {
                                    var xval = parseInt(scanNums/3);
                                    var yval = scanNums-(xval*3);
                                    console.log("xval-->"+xval+"/yval-->"+yval);
                                    $("#receivegrid"+xval+yval).css({"backgroundColor":"#00b0ff"});
                                    $("#receiving_tip").html(INBOUND_CONSTANT.SCANLOCATIONORDN);
                                    if(data.status==='2'){//有商品,提示用户
                                        $scope.scancontainerType = INBOUND_CONSTANT.TO_INVESTIGATE;
                                        var options = {
                                            width:600,
                                            height:500,
                                            title:INBOUND_CONSTANT.SUREUSELOCATION,
                                            open:function () {
                                                $scope.wimgstatus='hidden';
                                                $("#win_content").html("当前货框:"+data.cls.storagelocationName+",里面有"+data.cls.amount+"件商品，请重新确认是否继续使用当前货筐进行收货");
                                            },
                                            close:function () {
                                                $("#receiving-inputer").focus();
                                            }
                                        };
                                        receiving_commonService.receiving_tip_dialog("window_img_ok_cancel",options);
                                    }else{
                                        scanNums++;
                                        if(scanNums===($rootScope.maxAmount-3)){
                                            isScanConstainerFinish = true;
                                            $("#receiving_dn_span").css({"backgroundColor":"#FFDEAD"});
                                            $("#receiving_dn_span").html(INBOUND_CONSTANT.SCANDN);
                                        }
                                        setTimeout(function(){ $("#receiving-inputer").focus();}, 200);
                                    }
                                },function (data) {
                                    var options = {
                                        title:INBOUND_CONSTANT.RESCANLOCATION,
                                        open:function () {
                                            $("#tipwindow_span").html(data.message);
                                        },
                                        close:function () {
                                            $("#receiving-inputer").focus();
                                        }
                                    };
                                    receiving_commonService.receiving_tip_dialog("tipwindow",options);
                                });
                            }else{
                                if(scan_DN===false){
                                    console.log("ScanningDN...");
                                    receivingService.scanDN(inputvalue,function (data) {
                                        scan_DN = true;
                                        adviceNo = data.cls.request.adviceNo;
                                        $("#receiving_dn_span").html(adviceNo);
                                        $scope.product_info_con = '1';
                                        $("#receiving_dn_span").css({"backgroundColor":"#EEEEE0"});
                                        $("#product_info_span").css({"backgroundColor":"#FFDEAD"});
                                        $("#product_info_span").html(INBOUND_CONSTANT.SCANITEM);
                                    },function (data) {
                                        var options = {
                                            title:INBOUND_CONSTANT.SCANDN,
                                            open:function () {
                                                $("#tipwindow_span").html(data.message);
                                            },
                                            close:function () {
                                                $("#receiving-inputer").focus();
                                            }
                                        };
                                        receiving_commonService.receiving_tip_dialog("tipwindow",options);
                                    });
                                }else{
                                    if(scan_product_info===false){
                                        itemid = inputvalue;
                                        receivingService.scanItem(adviceNo,itemid,function (data) {
                                            scan_product_info=true;
                                            $('#receiving_tip').html(INBOUND_CONSTANT.SCANLOCATIONORDN);
                                            $scope.product_info_con = '0';
                                            $("#product_info_title").html("SKU:"+data.cls.itemData.skuNo);
                                            $("#product_info_text").html("商品名称:"+data.itemData.name);
                                            setTimeout(function(){ $("#receiving-inputer").focus();}, 200);
                                            // checkType(data.cls.itemData);
                                        },function (data) {
                                            var options = {
                                                title:INBOUND_CONSTANT.SCANITEM,
                                                open:function () {
                                                    $("#tipwindow_span").html(data.message);
                                                },
                                                close:function () {
                                                    $("#receiving-inputer").focus();
                                                }
                                            };
                                            receiving_commonService.receiving_tip_dialog("tipwindow",options);
                                        });
                                    }else{
                                        //检查上架货位
                                        storageid = inputvalue;
                                        receivingService.checkContainer(storageid,itemid,useAfter,$rootScope.stationName,function (data) {
                                            scan_bin = true;
                                            finishGoods();
                                        },function (data) {
                                            storageid = "";
                                            if(data.key==='-5'){
                                                var options = {
                                                    width:500,
                                                    height:300,
                                                    title:INBOUND_CONSTANT.SCANLOCATIONORDN,
                                                    open:function () {
                                                        document.getElementById("tipwindow_span").innerHTML = "<h3>"+data.message.key+"</h3><br>"+data.message.message;
                                                    },
                                                    close:function () {
                                                        $("#pod-inputer").focus();
                                                    }
                                                };
                                                receiving_commonService.receiving_tip_dialog("tipwindow",options);
                                            }else{
                                                var options = {
                                                    title:INBOUND_CONSTANT.RESCANLOCATION,
                                                    open:function () {
                                                        $("#tipwindow_span").html(data.message);
                                                    },
                                                    close:function () {
                                                        $("#receiving-inputer").focus();
                                                    }
                                                };
                                                receiving_commonService.receiving_tip_dialog("tipwindow",options);
                                            }
                                        });
                                    }
                                }
                            }
                        }
                    }
                }
            }
        // }
        //确认使用当前货筐
        $scope.win_receivingok = function () {
            switch(currentMode){
                case "scan_product_content_DAMAGED":{
                    scan_product_content_DAMAGED = true;
                    $scope.scanbadcib='1';
                    $scope.scanmeasurecib = '0';
                    $("#receiving_tip").html(INBOUND_CONSTANT.SCANMEASURE);
                }break;
                case "scan_product_content_MEASURED":{
                    scan_product_content_MEASURED = true;
                    $scope.scanmeasurecib='1';
                    $scope.scanwaitcib = '0';
                    $("#receiving_tip").html(INBOUND_CONSTANT.SCANINVESTAGETE);
                }break;
                case "scan_product_content_TO_INVESTIGATE":{
                    scan_product_content_TO_INVESTIGATE = true;
                    $scope.scanwaitcib='1';
                    var xval = parseInt(scanNums/3);
                    var yval = scanNums-(((xval+1)*3)-1);
                    console.log("xval-->"+xval+"/yval-->"+yval);
                    $("#receivegrid"+xval+yval).css({"backgroundColor":"#00b0ff"});
                    $("#receiving_tip").html(INBOUND_CONSTANT.SCANLOCATIONORDN);
                }break;
                case "scan_product_content_GENUINE":{
                    scanNums++;
                    if(scanNums===($rootScope.maxAmount-3)){
                        isScanConstainerFinish = true;
                        $("#receiving_dn_span").css({"backgroundColor":"#FFDEAD"});
                        $("#receiving_dn_span").html(INBOUND_CONSTANT.SCANDN);
                    }else{
                        var xval = parseInt(scanNums/3);
                        var yval = scanNums-(((xval+1)*3)-1);
                        console.log("xval-->"+xval+"/yval-->"+yval);
                        $("#receivegrid"+xval+yval).css({"backgroundColor":"#00b0ff"});
                        $("#receiving_tip").html(INBOUND_CONSTANT.SCANLOCATIONORDN);
                    }
                }break;
            }
            setTimeout(function(){ $("#receiving-inputer").focus();}, 200);
        }
        $scope.win_receivingcancel = function () {
            receiving_commonService.CloseWindowByBtn("window_img_ok_cancel");
            switch(currentMode){
                case "scan_product_content_DAMAGED":{
                    $scope.scanbadcib='0';
                    $("#receiving_tip").html(INBOUND_CONSTANT.SCANDAMAGED);
                }break;
                case "scan_product_content_MEASURED":{
                    $scope.scanmeasurecib='0';
                    $("#receiving_tip").html(INBOUND_CONSTANT.SCANMEASURE);
                }break;
                case "scan_product_content_TO_INVESTIGATE":{
                    $scope.scanwaitcib='0';
                    $("#receiving_tip").html(INBOUND_CONSTANT.SCANINVESTAGETE);
                }break;
                case "scan_product_content_GENUINE":{
                    if(scanNums===($rootScope.maxAmount-3)){
                        isScanConstainerFinish = true;
                        $("#receiving_dn_span").css({"backgroundColor":"#FFDEAD"});
                        $("#receiving_dn_span").html(INBOUND_CONSTANT.SCANDN);
                    }else{
                        var xval = parseInt(scanNums/3);
                        var yval = scanNums-(((xval+1)*3)-1);
                        console.log("xval-->"+xval+"/yval-->"+yval);
                        $("#receivegrid"+xval+yval).css({"backgroundColor":"#00b0ff"});
                        $("#receiving_tip").html(INBOUND_CONSTANT.SCANLOCATIONORDN);
                    }
                }break;
            }
            setTimeout(function(){ $("#receiving-inputer").focus();}, 200);
        }
        $scope.autoClose = function (e) {
            if(!receiving_commonService.autoAddEvent(e)) return;
            var window = $("#tipwindow").data("kendoWindow");
            window.close();
        }
        //显示有效期弹窗
        $scope.showAvaTimeWindow = function () {
            var options = {
                title:"请输入商品有效期",
                width:800,
                height:600,
                open:function () {
                    $("#avatime_pop_window_madeyear").val("");
                    $("#avatime_pop_window_mademonth").val("");
                    $("#avatime_pop_window_madeday").val("");
                    $("#avatime_pop_window_avatime").val("");
                    receiving_commonService.avatime_keyboard_fillGrid($("#avatime_pop_window_keyboard"),2,5,"avatime_pop","keyboard_layout_item",0,"32");
                },
                close:function () {

                }
            };
            receiving_commonService.receiving_tip_dialog("avatime_pop_window",options);
        }
        //显示问题菜单弹窗
        $scope.showProMenuWindow = function () {
            var options = {
                title:"请选择问题菜单",
                width:800,
                height:600,
                open:function () {

                    // receiving_commonService.avatime_keyboard_fillGrid($("#avatime_pop_window_keyboard"),2,5,"avatime_pop","keyboard_layout_item",0,"32");
                },
                close:function () {

                }
            };
            receiving_commonService.receiving_tip_dialog_normal("promenu_pop_window",options);
        }
        //有效期输入框焦点函数
        $scope.avatimemethod = function (currentid) {
            receiving_commonService.getavatimeid(currentid);
        }
        //
        // $scope.startPod = function () {
        //     $scope.fullfinish = '1';
        //     // $scope.podstatus = '0';
        //     // $scope.receivingMode= 'init';
        //     // $scope.receivingButton= 'init';
        //     // 跳转收货页面
        //     // setTimeout(function(){
        //     //     $state.go($scope.receivingCurrent==='single'? "main.receivingSingle": "main.receivingPallet");
        //     // }, 1000);
        //     // fillGrid(document.getElementById("receiving_pod_layout"),6,6,"receiving_pod_layout","receiving_pod_layout_item",5,"px");
        //     receiving_commonService.reveive_ToteFillGrid($("#receivetotote_grid"),2,3,"receivegrid","receiveToToteDiv",0,0);
        //     setTimeout(function(){ $("#receiving-inputer").focus();}, 200);
        // }
        // 初始化
        $scope.receivingCurrent = $stateParams.id; // 当前收货模式
        var baseStyle = {style: "font-size:18px;"};
        var columns= [
            {field: "positionIndex", headerTemplate: "<span translate='POSITION_INDEX'></span>", attributes: baseStyle},
            {field: "receivingDestination.name", headerTemplate: "<span translate='DESTINATION'></span>", attributes: baseStyle},
            {field: "container.name", headerTemplate: "<span translate='CARTS_BINDING'></span>", attributes: baseStyle}
        ];
        $scope.receivingGridOptions = {selectable: "row", height: 260, sortable: true, columns: columns};
        columns.push({field: "amount", headerTemplate: "<span translate='AMOUNT'></span>", attributes: baseStyle});
        $scope.receivedGridOptions = {selectable: "row", height: 260, sortable: true, columns: columns};
        if(!scan_product_content_DAMAGED){
            $scope.scanbadcib='0';
            // $scope.scanmeasurecib = '';
            $("#receiving_tip").html(INBOUND_CONSTANT.SCANDAMAGED);
        }
        console.log("$rootScope.maxAmount--->"+$rootScope.maxAmount);
        receiving_commonService.reveive_ToteFillGrid($("#receivetotote_grid"),($rootScope.maxAmount-3),3,"receivegrid","receiveToToteDiv",0,0);
        setTimeout(function(){ $("#receiving_station").focus();}, 200); // 首获焦
    });
})();