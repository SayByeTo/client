
/**
 * Created by frank.zhou on 2016/12/28.
 */
(function () {
  'use strict';
    angular.module('myApp').controller("receivingSingleCtl", function($scope, $rootScope, $state, $stateParams,INBOUND_CONSTANT,receiving_commonService,receivingService,commonService){
      $scope.scanstatus = '0';
      $scope.fullfinish = '0';
      var innormalBin = false;
      var receiveType = INBOUND_CONSTANT.GENUINE;
      var finishType = INBOUND_CONSTANT.ALL;
	  console.log("$rootScope.scan_product_content_DAMAGED-->"+$rootScope.scan_product_content_DAMAGED);
      if($rootScope.scan_product_content_DAMAGED===undefined)
          $rootScope.scan_product_content_DAMAGED=false;
      if($rootScope.scan_product_content_MEASURED===undefined)
          $rootScope.scan_product_content_MEASURED=false;
      if($rootScope.scan_product_content_TO_INVESTIGATE===undefined)
          $rootScope.scan_product_content_TO_INVESTIGATE=false;
      var scan_product_content_GENUINE= false;
      var scan_product_content_DAMAGED= $rootScope.scan_product_content_DAMAGED;
      var scan_product_content_MEASURED= $rootScope.scan_product_content_MEASURED;
      var scan_product_content_TO_INVESTIGATE= $rootScope.scan_product_content_TO_INVESTIGATE;
      var scan_pod = false;
      var scan_DN = false;
      var scan_product_info= false;
      var scan_bin= false;
      var isSingle= false;
      //是否测量
      var isMeasured= false;
      //是否待调查
      var isInvest = false;
        var adviceNo = "";
        var storageid = "";
        var amount = "";
        var itemid = "";
        var sn = "";
        var useAfter = "";
      var podid = "";

      var thisid;
      var storages = new Array();
      // ========================================================================================
      // 跳转收货页面
      $scope.toReceiving = function(){
          $state.go($scope.receivingCurrent==='single'? "main.receivingSingle": "main.receivingPallet");
      };


      // 自动满筐所有车牌
      // function grid_BayType(){
      //     // $scope.status= 'init';
      //     // $scope.receivingMode= 'init';
      //     // $scope.receivingButton= 'init';
      //     $scope.fullfinish = '0';
      //     var isSELECT = false;
      //     var SELECTID;
      //     var root_div = $("#select_bin_grid");
      //     console.log("开始填充");
      //     var count  = "";
      //     for (var i = 0;i<5;i++){
      //         count += "<div style='float: left;margin-left:8%;width:80%;height:25%'>"
      //         for (var j=0;j<4;j++){
      //             count +="<div class='box_shadow_with_radius' id='bin_item"+i+j+"'"+
      //                 // "style='width:20%;height:70%;background-color: #E0EEEE;margin-left:5%;float: left'> " +
      //                 "<span id='bin_item_title' style='font-size: 24px;line-height: 80px;color: #FFFFFF;'>"+j+"</span> " +
      //                 "</div>";
      //         }
      //         count+="</div>";
      //     }
      //     root_div.html(count);
      //     $('.box_shadow_with_radius').each(function(){
      //         $(this).click(function(){
      //             if(isSELECT){
      //                 console.log("有选-id--->"+SELECTID);
      //                 document.getElementById(SELECTID).style.backgroundColor = '#E0EEEE';
      //                 // this.style.backgroundColor = '#FF0000';
      //                 // SELECTID = this.id;
      //             }else{
      //                 console.log("未选id--->"+SELECTID);
      //                 isSELECT = true;
      //             }
      //             SELECTID = this.id;
      //             this.style.backgroundColor = '#00a2eb';
      //         })
      //     })
      //
      //     // receivingService.deleteReceivingContainer($scope.stationId, function(){
      //     //   $scope.
      //     //   $scope.receivingMode= 'init';
      //     //   $scope.receivingButton= 'init';
      //     // });
      // };


      //收货数量弹出框
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
                scan_product_info = true;
                $("#receiving_tip").html(INBOUND_CONSTANT.SCANITEM);
                $("#receiving_status_span").html("已成功收货上架"+amount+"件商品至</br>"+storageid);
                var id = receiving_commonService.findStorageLocation(storageid,storages);
                $("#"+id).css({"backgroundColor":"#008B00"});
                $("#"+id).children("span").text(amount);
                var window = $("#keyboard_window").data("kendoWindow");
                window.close();
                // receiving_commonService.closePopWindow("keyboard_window");
            });
        }
      //有效期弹出框确定
      $scope.finish_avatime_keyboard = function () {
          var date = $scope.avatime_pop_window_madeyear.val()+","+
                      $scope.avatime_pop_window_madeyear.val()+","+
                      $scope.avatime_pop_window_madeyear.val();
          var Year = day.getFullYear();
          var Month = day.getMonth()+1;
          var Day = day.getDate();
          var CurrentDate ;
          CurrentDate+= Year + "-";
          if (Month >= 10 )
          {
              CurrentDate += Month + "-";
          }
          else
          {
              CurrentDate += "0" + Month + "-";
          }
          if (Day >= 10 )
          {
              CurrentDate += Day ;
          }
          else {
              CurrentDate += "0" + Day;
          }
          var cDate = new Date(CurrentDate.replace("-",",")).getTime() ;
          if(new Date(date).getTime()<cDate){
              var options = {
                  title:INBOUND_CONSTANT.CANTBECURRENTTIME,
                  open:function () {
                      $("#tipwindow_span").innerHTML = INBOUND_CONSTANT.CANTBECURRENTTIME;
                  }
              };
              receiving_commonService.receiving_tip_dialog("tipwindow",options);
            return;
          }
          useAfter = date;
          receivingService.checkAvaTime(itemid,useAfter,function () {
              var window = $("#avatime_pop_window").data("kendoWindow");
              window.close();
              setTimeout(function(){ $("#receiving-inputer").focus();}, 200);
          },function (data) {
              alert("有效期验证失败"+data);
          });
      }

      $scope.receivingscan = function (e) {
          if(!receiving_commonService.autoAddEvent(e)) return;
          var inputvalue = $("#receiving-inputer").val().trim();
          console.log("inputvalue-->"+inputvalue);
          $("#receiving-inputer").val("");
          if(scan_pod===false){//开始扫描pod号码
              podid = inputvalue;
              receivingService.getPodInfo(inputvalue,INBOUND_CONSTANT.BIN,function (data) {
                  if(Number(data.status)<0||data.cls.totalRow===0){//pod信息不合法
                      var options = {
                          width:500,
                          height:300,
                          title:INBOUND_CONSTANT.NOTGETPOD,
                          open:function () {
                              document.getElementById("tipwindow_span").innerHTML = INBOUND_CONSTANT.NOTGETPOD;
                          },
                          close:function () {
                              $("#receiving-inputer").focus();
                          }
                      };
                      receiving_commonService.receiving_tip_dialog("tipwindow",options);
                  }else{
                      scan_pod = true;
                      if(scan_product_content_DAMAGED===false){
                          $scope.scanbadcib='0';
                          $("#receiving_tip").html(INBOUND_CONSTANT.SCANDAMAGED);
                      }else{
                          $("#receiving_tip").html(INBOUND_CONSTANT.SCANDN);
                          $("#receiving_dn_span").html(INBOUND_CONSTANT.SCANDN);
                          $("#receiving_dn_span").css({"backgroundColor":"#FFDEAD"});
                      }
                      storages = data.cls.storageLocations;
                      $("#receiving_pod_layout").html("");
                      receiving_commonService.fillGrid(document.getElementById("receiving_pod_layout"),data.cls.totalRow,"receiving_pod_layout","receiving_pod_layout_item",data.cls.columnMap);
                      setTimeout(function(){ $("#receiving-inputer").focus();}, 200);
                  }
              });
          }else{//开始扫描货筐
              if(scan_product_content_DAMAGED===false){
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
                          receivingService.scanStorageLocation(inputvalue,INBOUND_CONSTANT.TO_INVESTIGATE,$rootScope.stationName,$rootScope.receiveProcessDTOList[2].destinationId,$rootScope.receiveProcessDTOList[2].positionIndex,function (data) {
                              $("#receiving_dn_span").css({"backgroundColor":"#FFDEAD"});
                              $("#receiving_dn_span").html(INBOUND_CONSTANT.SCANDN);
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
                                  $('#receiving_tip').html(INBOUND_CONSTANT.SCANDN);
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
                          if(receiving_commonService.isDN(inputvalue)){
                              scan_DN = false;
                              scan_product_info= false;
                              scan_bin= false;
                              isSingle= false;
                              //是否测量
                              isMeasured= false;
                              //是否待调查
                              isInvest = false;
                              adviceNo = "";
                              storageid = "";
                              amount = "";
                              itemid = "";
                              sn = "";
                              useAfter = "";
                          }
                          if(scan_DN===false){
                              console.log("ScanningDN...");
                              receivingService.scanDN(inputvalue,function (data) {
                                  scan_DN = true;
                                  adviceNo = data.cls.request.adviceNo;
                                  $scope.product_info_con = '1';
                                  $("#receiving_dn_span").html(adviceNo);
                                  $("#receiving_dn_span").css({"backgroundColor":"#EEEEE0"});
                                  $("#product_info_span").css({"backgroundColor":"#FFDEAD"});
                                  $("#product_info_span").html(INBOUND_CONSTANT.SCANITEMS);
                                  $("#receiving_tip").html(INBOUND_CONSTANT.SCANITEM);
                              },function (data) {
                                $("#receiving_tip").html(INBOUND_CONSTANT.RESCANDN);
                                  var options = {
                                      title:INBOUND_CONSTANT.RESCANDN,
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
                                      $scope.product_info_con = '0';
                                      $("#product_info_title").html("SKU:"+data.cls.itemData.skuNo);
                                      $("#product_info_text").html("商品名称:"+data.cls.itemData.name);
                                      setTimeout(function(){ $("#receiving-inputer").focus();}, 200);
                                    if(data.status==='1'){//测量商品
                                        isMeasured = true;
                                        isSingle = true;
                                        finishType = INBOUND_CONSTANT.PALLET;
                                        $('#receiving_tip').html(INBOUND_CONSTANT.SCANMEASURE);
                                        $scope.scanmeasurecib = '0';
                                    }else{
                                        $('#receiving_tip').html(INBOUND_CONSTANT.SCANLOCATIONORDN);
                                    }
                                      // checkType(data.cls.itemData);
                                },function (data) {
                                    $("#receiving_tip").html(INBOUND_CONSTANT.RESCANITEM);
                                    var options = {
                                        title:INBOUND_CONSTANT.RESCANITEM,
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
                                  if(isMeasured){
                    //                  receiveType = INBOUND_CONSTANT.MEASURED;
                                        isSingle = true;
                                        receivingService.checkNotGenuisContainer(storageid,$rootScope.stationName,INBOUND_CONSTANT.MEASURED,function (data) {
                                            finishGoods();
                                        });
                                  }else{
                                      receivingService.checkBin(storageid,itemid,useAfter,podid,function (data) {
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
                  // if(scan_DN===false){//录入dn条码
                  //     $("#receiving_dn_span").html($("#receiving-inputer").val());
                  //     $('#receiving_tip').html("请扫描/检查DN条码");
                  //     $("#product_info_span").html("扫描商品条码");
                  //     scan_DN = true;
                  // }else{
                  //     // $("#product_info_span").html($("#receiving-inputer").val());
                  //     $scope.product_info_con = '0';
                  //     $('#receiving_tip').html("请扫描上架货位条码");
                  //     $("#product_info_title").html("SKU:Docker");
                  //     $("#product_info_text").html("Docker 是一个开源的应用容器引擎，让开发者可以打包他们的应用以及依赖包到一个可移植的容器中，然后发布到任何流行的 Linux 机器上，也可以实现虚拟化。容器是完全使用沙箱机制，相互之间不会有任何接口。");
                  //     $scope.product_info_img='0';
                  //     $("#receiving_pod_layout22").css({"background": "#00a2eb"});
                  //     $("#receiving_pod_layout32").css({"background": "#00a2eb"});
                  //     $("#receiving_pod_layout52").css({"background": "#00a2eb"});
                  //     $("#receiving_pod_layout12").css({"background": "#00a2eb"});
                  //     scan_product_info = true;
                  //     $("#receiving-inputer").focus();
                  // }
              }
          }
      }

      $scope.switchMode = function (modeData) {
          isSingle = modeData;
          if(modeData){//是单件
            $("#receiving-footer-button-single").css({"backgroundColor":"##6E6E6E"});
            $("#receiving-footer-button-single").onclick = function() {
              $("#receiving-footer-button-single").disabled = "disabled";
            }
          }else{//不是单件
            $("#receiving-footer-button-all").css({"backgroundColor":"##6E6E6E"});
            $("#receiving-footer-button-all").onclick = function() {
              $("#receiving-footer-button-all").disabled = "disabled";
            }

          }
      }

      function checkType(itemData) {
          if (itemData.itemDataGlobal.serialRecordType === INBOUND_CONSTANT.alwaysrecord) {
              var options = {
                  title: INBOUND_CONSTANT.SCANSERIALNO,
                  open: function () {
                      $("#inputwindow_span").html(data.cls.itemData.name);
                      setTimeout(function () {
                          $("#window-receiving-inputer").focus();
                      });
                  },
                  close: function () {
                      $("#receiving-inputer").focus();
                  }
              };
              receiving_commonService.receiving_tip_dialog("scanwindow", options);
          } else {
              if (itemData.itemDataGlobal.lotMandatory) {
                  var options = {
                      title:INBOUND_CONSTANT.INPUTAVATIME,
                      width:800,
                      height:600,
                      open:function () {
                          $("#avatime_pop_window_madeyear").val("");
                          $("#avatime_pop_window_mademonth").val("");
                          $("#avatime_pop_window_madeday").val("");
                          $("#avatime_pop_window_avatime").val("");
                          receiving_commonService.avatime_keyboard_fillGrid($("#avatime_pop_window_keyboard"),2,5,"avatime_pop","keyboard_layout_item");
                      }
                  };
                  receiving_commonService.receiving_tip_dialog("avatime_pop_window",options);
              }else{
                  if(itemData.measured){
                      $scope.scanmeasurecib='0';
                      finishType = INBOUND_CONSTANT.SINGLE;
                      receiveType = INBOUND_CONSTANT.MEASURED;
                      isSingle = true;
                      setTimeout(function(){ $("#receiving-inputer").focus();}, 200);
                  }
              }
          }
      }

      function finishGoods() {
          if(isSingle===true){//是否单件收货
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
                  $("#receiving_status_span").html("已成功收货上架1件商品至</br>"+storageid);
                  var id = receiving_commonService.findStorageLocation(storageid,storages);
                  $("#"+id).css({"backgroundColor":"#008B00"});
                  $("#"+id).children("span").text(amount);
                  receiving_commonService.closePopWindow("keyboard_window");
                  scan_product_info = true;

                $("#receiving_tip").html(INBOUND_CONSTANT.SCANITEM);

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
      
      //序列号弹出框扫描
      $scope.windowScan = function (e) {
            receivingService.checkSN($("#window-receiving-inputer").val(),function () {
                var window = $("#scanwindow").data("kendoWindow");
                window.close();
                $("#receiving_tip").html(INBOUND_CONSTANT.SCANLOCATIONORDN);
                $("#receiving-inputer").focus();
            },function (data) {
                $("#serwindowspan").html('<h3>'+data.key+'</h3>不是有效的序列号,请重新扫描</br>'+'商品:<h3>'+data.message+'</h3></br>'+INBOUND_CONSTANT.serialNoTip);
                // var window = $("#scanwindow").data("kendoWindow");
                // window.close();
                // var options = {
                //     width:600,
                //     height:500,
                //     title:INBOUND_CONSTANT.SCANSERIALNO,
                //     open:function () {
                //         $scope.serimgstatus='show';
                //         $("#serwindowspan").html('<h3>'+data.key+'</h3>不是有效的序列号,请重新扫描</br>'+'商品:<h3>'+data.message+'</h3></br>'+INBOUND_CONSTANT.serialNoTip);
                //     },
                //     close:function () {
                //         $("#receiving-inputer").focus();
                //     }
                // };
                // receiving_commonService.receiving_tip_dialog("window_img_sno_ok_cancel",options);
            });
      }
        /**
         * 序列号确定方法
         */
      $scope.win_serok = function () {
          $scope.scanwaitcib='0';
          scan_product_info = false;
          var window = $("#window_img_sno_ok_cancel").data("kendoWindow");
          window.close();
      }
      $scope.win_sercancle = function () {
          var window = $("#window_img_sno_ok_cancel").data("kendoWindow");
          window.close();
      }
        //确认使用当前货筐
      $scope.win_receivingok = function (type) {
          if(type===INBOUND_CONSTANT.DAMAGED){
              scan_product_content_DAMAGED = true;
              $('#receiving_tip').html(INBOUND_CONSTANT.SCANMEASURE);
          }
          if(type===INBOUND_CONSTANT.MEASURED){
              scan_product_content_MEASURED = true;
              $('#receiving_tip').html(INBOUND_CONSTANT.SCANINVESTAGETE);
          }
          if(type===INBOUND_CONSTANT.TO_INVESTIGATE){
              scan_product_content_TO_INVESTIGATE = true;
              $('#receiving_tip').html(INBOUND_CONSTANT.SCANDAMAGEDCIBER);
              $("#receiving_dn_span").html(INBOUND_CONSTANT.SCANDAMAGEDCIBER);
          }
          receiving_commonService.CloseWindowByBtn("window_img_ok_cancel");
      }

      $scope.win_receivingcancel = function (type) {
          if(type===INBOUND_CONSTANT.DAMAGED){
              scan_product_content_DAMAGED = false;
              $('#receiving_tip').html(INBOUND_CONSTANT.SCANDAMAGED);
          }
          if(type===INBOUND_CONSTANT.MEASURED){
              scan_product_content_MEASURED = true;
              $('#receiving_tip').html(INBOUND_CONSTANT.SCANMEASURE);
          }
          if(type===INBOUND_CONSTANT.TO_INVESTIGATE){
              scan_product_content_TO_INVESTIGATE = true;
              $('#receiving_tip').html(INBOUND_CONSTANT.SCANINVESTAGETE);
          }
          receiving_commonService.CloseWindowByBtn("window_img_ok_cancel");
      }

      $scope.autoClose = function (e) {
          if(!receiving_commonService.autoAddEvent(e)) return;
          var window = $("#tipwindow").data("kendoWindow");
          window.close();
      }

      //显示有效期弹窗
      $scope.showAvaTimeWindow = function () {
          var options = {
              title:INBOUND_CONSTANT.INPUTAVATIME,
              width:800,
              height:600,
              open:function () {
                  $("#avatime_pop_window_madeyear").val("");
                  $("#avatime_pop_window_mademonth").val("");
                  $("#avatime_pop_window_madeday").val("");
                  $("#avatime_pop_window_avatime").val("");
                  receiving_commonService.avatime_keyboard_fillGrid($("#avatime_pop_window_keyboard"),2,5,"avatime_pop","keyboard_layout_item");
              },
              close:function () {

              }
          };
          receiving_commonService.receiving_tip_dialog("avatime_pop_window",options);
      }
      //显示问题菜单弹窗
      $scope.showProMenuWindow = function () {
          var options = {
              title:INBOUND_CONSTANT.SELECTPMENU,
              width:800,
              height:600,
              open:function () {
                  receiving_commonService.avatime_keyboard_fillGrid($("#avatime_pop_window_keyboard"),2,5,"avatime_pop","keyboard_layout_item",0,"32");
              },
              close:function () {

              }
          };
          receiving_commonService.receiving_tip_dialog_normal("promenu_pop_window",options);
      }
      //结束收货弹窗
      $scope.finishReceiveWindow = function () {
        var options = {
          title:INBOUND_CONSTANT.FINISHMENU,
          width:800,
          height:600,
          open:function () {
              $("#general_content").html(INBOUND_CONSTANT.FINISHRECEIVECONTENT);
          },
          close:function () {
            $("#general_content").html("");
          }
        };
        receiving_commonService.receiving_tip_dialog("window_general_ok_cancel",options);
      }
    //结束收货确定
      $scope.exitStation = function(){
        receivingService.exitReceiveStation(function(){
            $rootScope.stationName="";
            $state.go("main.receiving");
        },
        function(data){

        });
      }
      //结束收获取消
      $scope.closeGeneralWindow = function(){
        var window = $("#window_general_ok_cancel").data("kendoWindow");
        window.close();
      }
      //有效期输入框焦点函数
      $scope.avatimemethod = function (currentid) {
          receiving_commonService.getavatimeid(currentid);
      }

      $scope.startPod = function () {
          receiving_commonService.getLocationTypes(function (bindata,areadata) {
                receivingService.bindStorageLocationTypes({
                    "locationTypeDTOS":bindata,
                    "areaDTOS":areadata,
                    "stationid":$rootScope.stationId
                },function () {
                    $scope.fullfinish = '1';
                    $scope.podstatus = '0';
                    setTimeout(function(){ $("#receive-inputer").focus();}, 200);
                },function (data) {
                    if(data.key==='该工作站已绑定货位类型'){
                        $scope.fullfinish = '1';
                        $scope.podstatus = '0';
                        //聚焦pod输入框
                        setTimeout(function(){ $("#receive-inputer").focus();}, 200);
                    }
                });
          });
      }

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
      setTimeout(function(){ $("#receiving_station").focus();}, 200); // 首获焦
    // ============================================================================================
    function getPositionNo(positions, id){
      var positionNo = null;
      for(var i = 0; i < positions.length; i++){
        var position = positions[i];
        if(position.receivingDestination.id === id){
          positionNo = position.positionNo;
          break;
        }
      }
      return positionNo;
    }

    // 字符补位
    function pad(str){
      str = str+ "";
      var pad = "00";
      return (pad.length>str.length? pad.substring(0, pad.length - str.length) + str: str)
    }

    // 刷新车目的地
    function refreshReceivingContainer(){
      receivingService.getReceivingContainer($rootScope.stationId, function(datas){
        $rootScope.receivingProcessContainers = datas;
      });
    }

    // 匹配车
    function matchContainer(containerName){
      for(var i = 0, container = null; i < $rootScope.receivingProcessContainers.length; i++){
        var rpc = $rootScope.receivingProcessContainers[i];
        if(rpc.container.name.toUpperCase() === containerName.toUpperCase()){
          container = rpc.container;
          break;
        }
      }
      return container;
    }

    // 取测量车
    function getCubiScanContainer(){
      for(var i = 0, container = null; i < $rootScope.receivingProcessContainers.length; i++){
        var rpc = $rootScope.receivingProcessContainers[i];
        if(rpc.container.containerType.name.indexOf("Cubi_Scan") >= 0){
          container = rpc.container;
          break;
        }
      }
      return container;
    }

    // 处理测量商品
    function operatorMeasureGoods(){
      var measureContainer = getCubiScanContainer(); // 取测量车
      receivingService.checkContainer(measureContainer.id, $scope.itemData.id, $scope.useNotAfter, function(){
        $scope.goodsStatus = "measure";
        setTimeout(function(){ $("#receiving_measure").focus();}, 100);
      }, function(){
        $scope.goodsStatus = "normal";
        setTimeout(function(){ $("#receiving_paid_number_"+ $scope.positionNo).focus();}, 100);
      });
    }

    // 初始化变量
    function init(){
      $scope.receivingDestination = null; // 目的地初始状态
      $scope.measuredStatus = "init"; // 测量初始状态
      $scope.goodsStatus = "init"; // 商品初始状态
      $scope.number = ""; // 收货数量
      $scope.containerName = ""; // 绑定车
      $scope.useNotAfter = ""; // 初始有效期
      $scope.year = ""; $scope.month = ""; $scope.day = ""; $scope.months = "";
      $scope.expiredYear = ""; $scope.expiredMonth = ""; $scope.expiredDay = "";
      $scope.measureContainer = ""; // 测量车
      $scope.goodsNumber = ""; $scope.damageContainer = ""; // 残品车
      $scope.oldContainer = ""; $scope.newContainer = ""; // 货筐已满
      $scope.serialNo = ""; // 初始序列号
    }

        /**
         * 开始扫描pod信息
         */
    $scope.receivingpod = function (e) {
        if(receiving_commonService.autoAddEvent(e)===false)return;
        receivingService.getPodInfo($scope.pod,function (data) {
            if(Number(data.status)<0||data.cls.totalRow===0){//pod信息不合法
                var options = {
                    width:500,
                    height:300,
                    title:"获取pod信息失败,请重新扫描",
                    open:function () {
                        document.getElementById("tipwindow_span").innerHTML = "POD信息无效,请重新扫描";
                    },
                    close:function () {
                        $("#pod-inputer").focus();
                    }
                };
                receiving_commonService.receiving_tip_dialog("tipwindow",options);
            }else{
                receiving_commonService.fillGrid(document.getElementById("receiving_pod_layout"),data.cls.totalRow,6,"receiving_pod_layout","receiving_pod_layout_item",5,data.cls.columnMap);
                scan_pod = true;
                setTimeout(function(){ $("#receiving-inputer").focus();}, 200);
            }
        });
    }


    // ============================================================================================
    // 查看收货数据
    $scope.readReceivingData = function(){
      receivingService.getReceivingContainer($rootScope.stationId, function(datas){
        var baseStyle = {style: "font-size:18px;"};
        $rootScope.readInWindow({
          source: datas,
          columns: [
            {field: "receivingDestination.name", headerTemplate: "<span translate='RECEIVING_AREA'></span>", attributes: baseStyle},
            {field: "container.name", headerTemplate: "<span translate='CARTS_BINDING'></span>", attributes: baseStyle},
            {field: "amount", headerTemplate: "<span translate='AMOUNT'></span>", attributes: baseStyle}
          ]
        });
      });
    };

    // 满筐
    $scope.goodsFull = function(){
      $scope.goodsStatus = 'full';
      setTimeout(function(){ $('#receiving_oldContainer').focus();}, 100);
    };

    // 商品残损
    $scope.goodsDamage = function(){
      $scope.goodsStatus = 'damage';
      setTimeout(function(){ $('#receiving_goodsNumber').focus();}, 100);
    };

    // 扫描收货单
    $scope.scanReceiving = function(e){
      var keyCode = window.event? e.keyCode : e.which;
      if(keyCode != 13) return;
      $scope.receivingDestination = null;
      receivingService.scanReceiving($scope.adviceNo, function(data){
        $scope.adviceId = data.id;
        $("#receiving_item_data").focus();
      });
    };

    // 扫描商品
    $scope.scanItemData = function(e){
      // **************************************************************************************
      function checkItemData(){
        // 有效期
        if($scope.itemData.lotMandatory) $scope.goodsStatus = "lotMandatory";
        // 测量
        else if($scope.itemData.measured) operatorMeasureGoods();
        // 正常
        else{
          $scope.goodsStatus = "normal";
          setTimeout(function(){ $("#receiving_paid_number_"+ $scope.positionNo).focus();}, 100);
        }
      }

      // **************************************************************************************
      var keyCode = window.event? e.keyCode : e.which;
      if(keyCode != 13) return;
      init(); // 初始化信息
      receivingService.scanItemData($scope.adviceId, $scope.itemNo, function(data){
        $scope.amount = data.amount; // 总数
        $scope.receiveAmount = data.receiveAmount; // 已收数量
        $scope.itemData = data.itemData; // 商品
        // 筛选目的地
        receivingService.screenReceivingDestination($scope.itemData.id, "EACH RECEIVE", function(data){
          $scope.positionNo = getPositionNo($rootScope.stationTypePositions, data.id); // 索引号
          // 未找到目标位置
          if($scope.positionNo == null){
            commonService.dialogMushiny($scope.window, {
              width: 320, height: 160, type: "warn",
              open: function(){
                setTimeout(function(){ $("#warnContent").html($translate.instant("EX_RECEIVING_STATION_ITEM_DATA_ERROR"));}, 100);
              }
            });
            return;
          }
          // 目的地
          $scope.receivingDestination = data;
          // 扫序列号
          if($scope.itemData.serialRecordType === "ALWAYS_RECORD"){
            $('#scanSerialNoWindow').parent().addClass("myWindow"); // title css
            var win = $("#scanSerialNoWindow").data("kendoWindow");
            win.setOptions({width: 520, height: 270, open: function(){
              setTimeout(function(){ $("#receiving_serial_no").focus();}, 500); // 输入框获焦
              $scope.scanSerialNo = function(e, serialNo){
                var keyCode = window.event? e.keyCode : e.which;
                if(keyCode != 13) return;
                $scope.serialNo = serialNo;
                win.close();
                checkItemData();
              };
            }});
            win.center();
            win.open();
          }else
            checkItemData();
        });
      });
    };

    // 有效期
    $scope.doMandatory = function(e, year, month, day, months){
      var keyCode = window.event? e.keyCode : e.which;
      if(keyCode != 13) return;
      var date = new Date(), y = date.getFullYear();
      month = parseInt(month + (months || 0)); // 月份
      while(month > 12){
        year++;
        month -= 12;
      }
      $scope.useNotAfter = year+ "-"+ pad(month)+ "-"+ pad(day);
      // 测量
      if($scope.itemData.measured) operatorMeasureGoods();
      else{
        $scope.goodsStatus = "normal";
        setTimeout(function(){ $("#receiving_paid_number_"+ $scope.positionNo).focus();}, 100);
      }
    };

    // 扫测量车
    $scope.scanMeasureContainer = function(e, containerName){
      var keyCode = window.event? e.keyCode : e.which;
      if(keyCode != 13) return;
      $scope.measuredStatus = "start";
      var container = matchContainer(containerName); // 匹配车
      if(!container || container.containerType.name.indexOf("Cubi_Scan") < 0){
        commonService.dialogMushiny($scope.window, {
          width: 320, height: 160, type: "warn",
          open: function(){
            setTimeout(function(){
              $("#warnContent").html($translate.instant("EX_SCANNING_OBJECT_NOT_FOUND").replace("{0}", containerName));
            }, 10);
          }
        });
        return;
      }
      receivingService.receivingGoodsToCubiScan({
        adviceId: $scope.adviceId,
        amount: 1,
        itemDataId: $scope.itemData.id,
        receivingContainerId: container.id,
        receivingType: "EACH RECEIVE",
        serialNo: $scope.serialNo,
        useNotAfter: $scope.useNotAfter
      }, function(){
        $scope.measuredStatus = "end";
        $("#receiving_item_data").focus();
        $scope.itemNo = ""; // 商品编号
      });
    };

    // 扫描残品车
    $scope.scanDamageContainer = function(e, number, containerName){
      var keyCode = window.event? e.keyCode : e.which;
      if(keyCode != 13) return;
      $scope.damageStatus = "start";
      var container = matchContainer(containerName); // 匹配车
      if(!container || container.containerType.name.indexOf("Damage") < 0){
        commonService.dialogMushiny($scope.window, {
          width: 320, height: 160, type: "warn",
          open: function(){
            setTimeout(function(){
              $("#warnContent").html($translate.instant("EX_SCANNING_OBJECT_NOT_FOUND").replace("{0}", containerName));
            }, 10);
          }
        });
        return;
      }
      receivingService.receivingGoodsToDamage({
        adviceId: $scope.adviceId,
        amount: number,
        itemDataId: $scope.itemData.id,
        receivingContainerId: container.id,
        receivingType: "EACH RECEIVE",
        serialNo: $scope.serialNo,
        useNotAfter: $scope.useNotAfter
      }, function(){
        $scope.damageStatus = "end";
        $("#receiving_item_data").focus();
        $scope.itemNo = ""; // 商品编号
      });
    };

    // 扫描旧车牌
    $scope.scanOldContainer = function(e, oldContainer){
      var keyCode = window.event? e.keyCode : e.which;
      if(keyCode != 13) return;
      var container = matchContainer(oldContainer); // 匹配车
      if(!container){
        commonService.dialogMushiny($scope.window, {
          width: 320, height: 160, type: "warn",
          open: function(){
            setTimeout(function(){
              $("#warnContent").html($translate.instant("EX_SCANNING_OBJECT_NOT_FOUND").replace("{0}", oldContainer));
            }, 10);
          }
        });
        return;
      }
      $scope.oldContainerId = container.id;
      $("#receiving_newContainer").focus();
    };

    // 扫描新车牌
    $scope.scanNewContainer = function(e, newContainer){
      var keyCode = window.event? e.keyCode : e.which;
      if(keyCode != 13) return;
      $scope.fullStatus = "start";
      receivingService.scanContainer(newContainer, function(data) {
        $scope.newContainerId = data.id;
        // 修改车牌信息
        receivingService.replaceContainer($scope.oldContainerId, $scope.newContainerId, function(){
          $scope.fullStatus = "end";
          refreshReceivingContainer(); // 刷新小车目的地
          $("#receiving_item_data").focus();
          $scope.itemNo = ""; // 商品编号
        });
      }, function(data){
        commonService.dialogMushiny($scope.window, {
          width: 320, height: 160, type: "warn",
          open: function(){ setTimeout(function(){ $("#warnContent").html(data.message);}, 10);}
        });
      });
    };

    // 检查数量
    $scope.checkNumber = function(e, number){
      var keyCode = window.event? e.keyCode : e.which;
      if(keyCode != 13) return;
      if(number > ($scope.amount - $scope.receiveAmount)){
        $scope.more = number - ($scope.amount - $scope.receiveAmount);
        commonService.dialogMushiny($scope.moreGoodsWindow, {
          width: 520, height: 300,
          title: $translate.instant("CONFIRM_MORE_THAN_GOODS"),
          url: "modules/inbound/receiving/templates/receiving_moreGoods.html",
          open: function(win){
            $scope.moreGoodsSure = function(){
              win.close();
              $("#receiving_scan_carts_"+ $scope.positionNo).focus();
            };
            $scope.moreGoodsCancel = function(){
              win.close();
              $("#receiving_paid_number_"+ $scope.positionNo).focus();
            };
          }
        });
        return;
      }
      $("#receiving_scan_carts_"+ $scope.positionNo).focus();
    };

    // 检查小车
    $scope.checkContainer = function(e, containerName){
      var keyCode = window.event? e.keyCode : e.which;
      if(keyCode != 13) return;
      // 根据目的地找小车
      for(var i = 0, container = null; i < $rootScope.receivingProcessContainers.length; i++){
        var rpc = $rootScope.receivingProcessContainers[i];
        if(rpc.receivingDestination.id === $scope.receivingDestination.id){
          container = rpc.container;
          break;
        }
      }
      // 比对小车
      if(!container || container.name.toUpperCase() != containerName.toUpperCase()){
        commonService.dialogMushiny($scope.window, {
          width: 320, height: 160, type: "warn",
          open: function(){
            setTimeout(function(){
              $("#warnContent").html($translate.instant("EX_SCANNING_OBJECT_NOT_FOUND").replace("{0}", containerName));
            }, 10);
          }
        });
        return;
      }
      // 检查小车(不同客户的同一商品)
      receivingService.checkContainer(container.id, $scope.itemData.id, $scope.useNotAfter, function(){
        // 正常收货
        receivingService.receivingGoodsToStockUnit({
          adviceId: $scope.adviceId,
          amount: $scope.number,
          itemDataId: $scope.itemData.id,
          receivingContainerId: container.id,
          receivingType: "EACH RECEIVE",
          serialNo: $scope.serialNo,
          useNotAfter: $scope.useNotAfter
        }, function(){
          $("#receiving_item_data").focus();
          $scope.itemNo = ""; // 商品编号
        });
      });
    };
    // 初始化
    $scope.contentWidth = ($rootScope.mainWidth+222-1200)/2;
    $("#receiving_receive").focus();
    //获取货位类型数据
    if($rootScope.locationTypeSize===0){
        $scope.fullfinish = '0';
        $scope.podstatus = '1';
        receivingService.getStorageLocationTypes(function (data) {
            //填充数据
            receiving_commonService.grid_BayType(data.cls.storageLocationDTOList,data.cls.binTypeColumn.column,data.cls.binTypeColumn.row);
        });
    }else{
        $scope.fullfinish = '1';
        $scope.podstatus = '0';
    }
  });
})();