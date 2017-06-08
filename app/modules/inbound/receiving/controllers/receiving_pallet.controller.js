/**
 * Created by frank.zhou on 2016/12/28.
 */
(function () {
  'use strict';

  angular.module('myApp').controller("receivingPalletCtl", function ($scope, $rootScope, $state, INBOUND_CONSTANT, $stateParams, receiving_commonService, receivingService, commonService) {
    // $scope.scanhead = '0';
    var receiveType = INBOUND_CONSTANT.GENUINE;
    var finishType = INBOUND_CONSTANT.PALLET;
    var scan_product_content_GENUINE = false;
    if ($rootScope.scan_product_content_DAMAGED === undefined)
      $rootScope.scan_product_content_DAMAGED = false;
    if ($rootScope.scan_product_content_MEASURED === undefined)
      $rootScope.scan_product_content_MEASURED = false;
    if ($rootScope.scan_product_content_TO_INVESTIGATE === undefined)
      $rootScope.scan_product_content_TO_INVESTIGATE = false;
    var scan_product_content_DAMAGED = $rootScope.scan_product_content_DAMAGED;
    var scan_product_content_MEASURED = $rootScope.scan_product_content_MEASURED;
    var scan_product_content_TO_INVESTIGATE = $rootScope.scan_product_content_TO_INVESTIGATE;
    var scan_pod = false;
    var scan_DN = false;
    var scan_product_info = false;
    var scan_bin = false;
    var isSingle = false;
    var isMeasured = false;
    var podid = "";
    var adviceNo = "";
    var storageid = "";
    var amount = "";
    var itemid = "";
    var sn = "";
    var useAfter = null;
    var thisid;
    var totalamount = "";
    //扫描商品序列号和有效期的标志位
    var scan_product_signal = false;
    var scan_product_effectdate = false;

    function refreshReceivingContainer(receivingStationId, isInit) {
      isInit == null && (isInit = false);
      receivingService.getReceivingContainer(receivingStationId, function (datas) {
        var isMax = (datas.length === $scope.maxAmount), gridId = "receivingGRID";
        // 初始化
        if (isInit) {
          $scope.status = (isMax ? "max" : "normal");
          $scope.status === "normal" && (setTimeout(function () {
            $("#receiving_destination").focus();
          }, 100));
          isMax && (gridId = "receivedGRID");
        }
        // 数据
        var grid = $("#" + gridId).data("kendoGrid");
        grid.setDataSource(new kendo.data.DataSource({data: datas}));
        $rootScope.receivingProcessContainers = datas;
        // 跳转收货页面
        if (!isInit && isMax) {
          setTimeout(function () {
            $state.go($scope.receivingCurrent === 'single' ? "main.receivingSingle" : "main.receivingPallet");
          }, 1000);
        }
      });
    }

    // ========================================================================================
    // 跳转收货页面
    $scope.toReceiving = function () {
      $rootScope.scan_product_content_DAMAGED = true;
      $rootScope.scan_product_content_MEASURED = true;
      $rootScope.scan_product_content_TO_INVESTIGATE = true;
      $state.go($scope.receivingCurrent === 'single' ? "main.receivingSingle" : "main.receivingPallet");
    };
    // 扫描工作站
    $scope.scanStation = function (e) {
      var keyCode = window.event ? e.keyCode : e.which;
      if (keyCode != 13) return;
      $scope.scanstatus = '1';
      if ($scope.scanstatus === '1') {
        commonService.dialogMushiny($scope.window, {
          url: "modules/inbound/receiving/templates/scan-station-error.html",
          width: 500,
          height: 300
        });
      }
      $scope.status = 'max';
      $scope.scanstatus = '0';
      $scope.scanhead = '1';
      console.log("开始填充");
      var root_div = $scope;

    };

    //收货数量弹出框确定
    $scope.finish_keyboard = function () {
      if ($("#keyboard_inputer").val() < 1) {
        $scope.keyboardStatus = '0';
        return;
      }
      if($("#" + thisid) === undefined || $("#" + thisid) === null){
        return;
      }
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
        scan_product_info = true;
        $("#receiving_tip").html(INBOUND_CONSTANT.SCANITEM);
        $("#" + thisid).children("span").text($("#keyboard_inputer").val());
        $("#receiving_status_span").html("已成功收货上架" + $("#keyboard_inputer").val() + "件商品至" + thisid);
        $("#status_value").css({"background": "#006400"});
        $("#" + thisid).css({"backgroundColor": "#FF0000"});
        receiving_commonService.CloseWindowByBtn("keyboard_window");
      });
    }

    $scope.receivingscans = function (e) {
      if (!receiving_commonService.autoAddEvent(e)) return;
      var inputvalue = $("#receiving-inputer").val();
      $("#receiving-inputer").val("");
      if (scan_pod === false) {//开始扫描pod号码
        podid = inputvalue;
        receivingService.getPodInfo(podid, INBOUND_CONSTANT.BIN, function (data) {
          if (Number(data.status) < 0 || data.cls.totalRow === 0) {//pod信息不合法
            var options = {
              width: 500,
              height: 300,
              title: INBOUND_CONSTANT.NOTGETPOD,
              open: function () {
                document.getElementById("tipwindow_span").innerHTML = INBOUND_CONSTANT.NOTGETPOD;
              },
              close: function () {
                $("#receiving-inputer").focus();
              }
            };
            receiving_commonService.receiving_tip_dialog("tipwindow", options);
          } else {
            scan_pod = true;
            if (scan_product_content_DAMAGED && scan_product_content_MEASURED && scan_product_content_TO_INVESTIGATE) {
              // $scope.scanbadcib='0';
              $scope.podlayout = '0';
              $("#receiving_dn_span").css({"backgroundColor": "#FFDEAD"});
              $("#receiving_dn_span").html(INBOUND_CONSTANT.SCANDN);
              $("#receiving_tip").html(INBOUND_CONSTANT.SCANDN);
            } else {
              $scope.scanbadcib = '0';
              $scope.podlayout = '0';
              $("#receiving_tip").html(INBOUND_CONSTANT.SCANDAMAGED);
            }


            // fillGrid(document.getElementById("receiving_pod_layout"),data.cls.totalRow,"receiving_pod_layout","receiving_pod_layout_item",data.cls.columnMap);
            setTimeout(function () {
              $("#receiving-inputer").focus();
            }, 200);
          }
        });
      } else {//开始扫描货筐
         if (scan_product_content_DAMAGED === false) {
          receivingService.scanStorageLocation(inputvalue, INBOUND_CONSTANT.DAMAGED, $rootScope.stationName, $rootScope.receiveProcessDTOList[0].destinationId, $rootScope.receiveProcessDTOList[0].positionIndex, function (data) {
            if (data.status === '2') {//有商品,提示用户
              $scope.scancontainerType = INBOUND_CONSTANT.DAMAGED;
              var options = {
                width: 600,
                height: 500,
                title: INBOUND_CONSTANT.SUREUSELOCATION,
                open: function () {
                  $scope.wimgstatus = 'hidden';
                  $("#win_content").html("当前货框:" + data.cls.storagelocationName + ",里面有" + data.cls.amount + "件商品，请重新确认是否继续使用当前货筐进行收货");
                },
                close: function () {
                  $("#receiving-inputer").focus();
                }
              };
              receiving_commonService.receiving_tip_dialog("window_img_ok_cancel", options);
            } else {
              scan_product_content_DAMAGED = true;
              $scope.scanbadcib = '1';
              $scope.scanmeasuredcib = '0';
              $("#receiving_tip").html(INBOUND_CONSTANT.SCANMEASURE);
              setTimeout(function () {
                $("#receiving-inputer").focus();
              }, 200);
            }
          }, function (data) {
            var options = {
              title: INBOUND_CONSTANT.RESCANLOCATION,
              open: function () {
                $("#tipwindow_span").html(data.message);
              },
              close: function () {
                $("#receiving-inputer").focus();
              }
            };
            receiving_commonService.receiving_tip_dialog("tipwindow", options);
          });
        } else {

          if (scan_product_content_MEASURED === false) {
            receivingService.scanStorageLocation(inputvalue, INBOUND_CONSTANT.MEASURED, $rootScope.stationName, $rootScope.receiveProcessDTOList[1].destinationId, $rootScope.receiveProcessDTOList[1].positionIndex, function (data) {
              if (data.status === '2') {//有商品,提示用户
                $scope.scancontainerType = INBOUND_CONSTANT.MEASURED;
                var options = {
                  width: 600,
                  height: 500,
                  title: INBOUND_CONSTANT.SUREUSELOCATION,
                  open: function () {
                    $scope.wimgstatus = 'hidden';
                    $("#win_content").html("当前货框:" + data.cls.storagelocationName + ",里面有" + data.cls.amount + "件商品，请重新确认是否继续使用当前货筐进行收货");
                  },
                  close: function () {
                    $("#receiving-inputer").focus();
                  }
                };
                receiving_commonService.receiving_tip_dialog("window_img_ok_cancel", options);
              } else {
                scan_product_content_MEASURED = true;
                $scope.scanmeasuredcib = '1';
                $scope.scaninvestcib = '0';
                $("#receiving_tip").html(INBOUND_CONSTANT.SCANINVESTAGETE);
                setTimeout(function () {
                  $("#receiving-inputer").focus();
                }, 200);
              }
            }, function (data) {
              var options = {
                title: INBOUND_CONSTANT.RESCANLOCATION,
                open: function () {
                  $("#tipwindow_span").html(data.message);
                },
                close: function () {
                  $("#receiving-inputer").focus();
                }
              };
              receiving_commonService.receiving_tip_dialog("tipwindow", options);
            });
          } else {
            if (scan_product_content_TO_INVESTIGATE === false) {
              receivingService.scanStorageLocation(inputvalue, INBOUND_CONSTANT.TO_INVESTIGATE, $rootScope.stationName, $rootScope.receiveProcessDTOList[2].destinationId, $rootScope.receiveProcessDTOList[2].positionIndex, function (data) {
                $("#receiving_dn_span").css({"backgroundColor": "#FFDEAD"});
                $("#receiving_tip").html(INBOUND_CONSTANT.SCANDN);
                $("#receiving_dn_span").html(INBOUND_CONSTANT.SCANDN);
                if (data.status === '2') {//有商品,提示用户
                  $scope.scancontainerType = INBOUND_CONSTANT.TO_INVESTIGATE;
                  var options = {
                    width: 600,
                    height: 500,
                    title: INBOUND_CONSTANT.SUREUSELOCATION,
                    open: function () {
                      $scope.wimgstatus = 'hidden';
                      $("#win_content").html("当前货框:" + data.cls.storagelocationName + ",里面有" + data.cls.amount + "件商品，请重新确认是否继续使用当前货筐进行收货");
                    },
                    close: function () {
                      $("#receiving-inputer").focus();
                    }
                  };
                  receiving_commonService.receiving_tip_dialog("window_img_ok_cancel", options);
                } else {
                  scan_product_content_TO_INVESTIGATE = true;
                  $scope.scanwaitcib = '1';
                  $('#receiving_tip').html(INBOUND_CONSTANT.SCANDN);
                  setTimeout(function () {
                    $("#receiving-inputer").focus();
                  }, 200);
                }
              }, function (data) {
                var options = {
                  title: INBOUND_CONSTANT.RESCANLOCATION,
                  open: function () {
                    $("#tipwindow_span").html(data.message);
                  },
                  close: function () {
                    $("#receiving-inputer").focus();
                  }
                };
                receiving_commonService.receiving_tip_dialog("tipwindow", options);
              });
            } else {
              if(receiving_commonService.isDN(inputvalue)){
                scan_DN = false;
                scan_product_info= false;
                scan_bin= false;
                isSingle= false;
                //是否测量
                isMeasured= false;
                adviceNo = "";
                storageid = "";
                amount = "";
                itemid = "";
                sn = "";
                useAfter = "";
              }
              if (scan_DN === false) {
                console.log("ScanningDN...");
                receivingService.scanDN(inputvalue, function (data) {
                  scan_DN = true;
                  adviceNo = data.cls.request.adviceNo;
                  alert("adviceNo-->" + adviceNo);
                  $("#receiving_dn_span").html(adviceNo);
                  $scope.product_info_con = '1';
                  $("#receiving_dn_span").css({"backgroundColor": "#EEEEE0"});
                  $("#product_info_span").css({"backgroundColor": "#FFDEAD"});
                  $("#product_info_span").html(INBOUND_CONSTANT.SCANITEMS);
                  $("#receiving_tip").html(INBOUND_CONSTANT.SCANITEM);
                }, function (data) {
                  $("#receiving_tip").html(INBOUND_CONSTANT.RESCANDN);
                  var options = {
                    title: INBOUND_CONSTANT.RESCANDN,
                    open: function () {
                      $("#tipwindow_span").html(data.message);
                    },
                    close: function () {
                      $("#receiving-inputer").focus();
                    }
                  };
                  receiving_commonService.receiving_tip_dialog("tipwindow", options);
                });
              } else {
                if (scan_product_info === false) {
                  itemid = inputvalue;
                  receivingService.scanItem(adviceNo, itemid, function (data) {
                    scan_product_info = true;
                    $("#product_info_title").html("SKU:" + data.cls.itemData.skuNo);
                    $("#product_info_text").html("商品名称:" + data.cls.itemData.name);
                    if (data.cls.itemData.itemDataGlobal.serialRecordType === INBOUND_CONSTANT.alwaysrecord) {
                      scan_product_signal = true;
                    }
                    if (data.cls.itemData.itemDataGlobal.lotMandatory) {
                      scan_product_effectdate = true;
                    }
                    if (data.status === '1') {//测量商品
                      isMeasured = true;
                      isSingle = true;
                      finishType = INBOUND_CONSTANT.PALLET;
                      $('#receiving_tip').html(INBOUND_CONSTANT.SCANMEASURE);
                      $scope.scanmeasurecib = '0';
                    } else {
                      $('#receiving_tip').html(INBOUND_CONSTANT.SCANLOCATIONORDN);
                      $scope.product_info_con = '0';
                      setTimeout(function () {
                        $("#receiving-inputer").focus();
                      }, 200);
                    }
                    // if (data.cls.itemData.itemDataGlobal.serialRecordType === INBOUND_CONSTANT.alwaysrecord) {
                    //     var options = {
                    //         title: INBOUND_CONSTANT.SCANSERIALNO,
                    //         open: function () {
                    //             $("#inputwindow_span").html(data.cls.itemData.name);
                    //             setTimeout(function () {
                    //                 $("#window-receiving-inputer").focus();
                    //             });
                    //         },
                    //         close: function () {
                    //             $("#receiving-inputer").focus();
                    //         }
                    //     };
                    //     receiving_commonService.receiving_tip_dialog("scanwindow", options);
                    // } else {
                    //     if (data.cls.itemData.itemDataGlobal.lotMandatory) {
                    //         var options = {
                    //             title:INBOUND_CONSTANT.INPUTAVATIME,
                    //             width:800,
                    //             height:600,
                    //             open:function () {
                    //                 $("#avatime_pop_window_madeyear").val("");
                    //                 $("#avatime_pop_window_mademonth").val("");
                    //                 $("#avatime_pop_window_madeday").val("");
                    //                 $("#avatime_pop_window_avatime").val("");
                    //                 receiving_commonService.avatime_keyboard_fillGrid($("#avatime_pop_window_keyboard"),2,5,"avatime_pop","keyboard_layout_item");
                    //             }
                    //         };
                    //         receiving_commonService.receiving_tip_dialog("avatime_pop_window",options);
                    //     }else{
                    //         if(data.cls.itemData.measured){
                    //             $scope.scanmeasurecib='0';
                    //             setTimeout(function(){ $("#receiving-inputer").focus();}, 200);
                    //         }
                    //     }
                    // }
                  }, function (data) {
                    $("#receiving_tip").html(INBOUND_CONSTANT.RESCANITEM);
                    var options = {
                      title: INBOUND_CONSTANT.RESCANITEM,
                      open: function () {
                        $("#tipwindow_span").html(data.message);
                      },
                      close: function () {
                        $("#receiving-inputer").focus();
                      }
                    };
                    receiving_commonService.receiving_tip_dialog("tipwindow", options);
                  });
                } else {
                  //检查上架货位
                  storageid = inputvalue;
                  receivingService.checkBin(storageid, itemid, useAfter, podid, function (data) {
                    scan_bin = true;
                    if (isSingle) {//是否单件收货
                      receivingService.finishReceive({
                        receiveStationId: $rootScope.stationId,
                        adviceId: adviceNo,
                        sn: sn,
                        useNotAfter: useAfter,
                        itemId: itemid,
                        storageLocationId: storageid,
                        amount: 1,
                        receiveType: receiveType,
                        finishType: finishType
                      }, function () {
                        receiving_commonService.closePopWindow("keyboard_window");
                        scan_product_info = true;
                        $("#receiving_tip").html(INBOUND_CONSTANT.SCANITEM);
                        $("#" + thisid).children("span").text($("#keyboard_inputer").val());
                        $("#receiving_status_span").html("已成功收货上架" + $("#keyboard_inputer").val() + "件商品至" + thisid);
                        $("#status_value").css({"background": "#006400"});
                        $("#" + thisid).css({"backgroundColor": "#FF0000"});
                      }, function (data) {
                        alert("上架失败异常-->" + data);
                      });
                    } else {
                      receiving_commonService.receiving_tip_dialog_normal("keyboard_window", {
                        width: 600,
                        height: 400,
                        title: "请输入收货数量",
                        open: function () {
                          receiving_commonService.keyboard_fillGrid($("#keyboard_keys"), 2, 5, "keyboard", "keyboard_layout_item");
                        }
                      });
                    }
                  }, function (data) {
                    storageid = "";
                    if (data.key === '-5') {
                      var options = {
                        width: 500,
                        height: 300,
                        title: INBOUND_CONSTANT.SCANLOCATIONORDN,
                        open: function () {
                          document.getElementById("tipwindow_span").innerHTML = "<h3>" + data.message.key + "</h3><br>" + data.message.message;
                        },
                        close: function () {
                          $("#pod-inputer").focus();
                        }
                      };
                      receiving_commonService.receiving_tip_dialog("tipwindow", options);
                    } else {
                      var options = {
                        title: INBOUND_CONSTANT.RESCANLOCATION,
                        open: function () {
                          $("#tipwindow_span").html(data.message);
                        },
                        close: function () {
                          $("#receiving-inputer").focus();
                        }
                      };
                      receiving_commonService.receiving_tip_dialog("tipwindow", options);
                    }
                  });
                }
              }
            }
          }
        }
      }
    }
    //确认使用当前货筐
    $scope.win_receivingok = function (type) {
      if (type === INBOUND_CONSTANT.DAMAGED) {
        scan_product_content_DAMAGED = true;
        $('#receiving_tip').html(INBOUND_CONSTANT.SCANMEASURE);
      }
      if (type === INBOUND_CONSTANT.MEASURED) {
        scan_product_content_MEASURED = true;
        $('#receiving_tip').html(INBOUND_CONSTANT.SCANINVESTAGETE);
      }
      if (type === INBOUND_CONSTANT.TO_INVESTIGATE) {
        scan_product_content_TO_INVESTIGATE = true;
        $('#receiving_tip').html(INBOUND_CONSTANT.SCANDN);
        $("#receiving_dn_span").html(INBOUND_CONSTANT.SCANDN);
      }
      receiving_commonService.CloseWindowByBtn("window_img_ok_cancel");
    }
    $scope.win_receivingcancel = function () {
      receiving_commonService.CloseWindowByBtn("window_img_ok_cancel");
    }
    $scope.autoClose = function (e) {
      if (!receiving_commonService.autoAddEvent(e)) return;
      var window = $("#tipwindow").data("kendoWindow");
      window.close();
    }
    //显示有效期弹窗
    $scope.showAvaTimeWindow = function () {
      var options = {
        title: "请输入商品有效期",
        width: 800,
        height: 600,
        open: function () {
          $("#avatime_pop_window_madeyear").val("");
          $("#avatime_pop_window_mademonth").val("");
          $("#avatime_pop_window_madeday").val("");
          $("#avatime_pop_window_avatime").val("");
          receiving_commonService.avatime_keyboard_fillGrid($("#avatime_pop_window_keyboard"), 2, 5, "avatime_pop", "keyboard_layout_item", 0, "32");
        },
        close: function () {

        }
      };
      receiving_commonService.receiving_tip_dialog("avatime_pop_window", options);
    }
    //显示问题菜单弹窗
    $scope.showProMenuWindow = function () {
      var options = {
        title: "请选择问题菜单",
        width: 800,
        height: 600,
        open: function () {

        },
        close: function () {

        }
      };
      receiving_commonService.receiving_tip_dialog_normal("promenu_pop_window", options);
    }
    //显示数量输入窗口
    $scope.showSelectNumsWindow = function () {
      var options = {
        width: 800,
        height: 400,
        title: "请输入收货数量",
        open: function () {
          $("#everpacknums").val("");
          $("#totallevel").val("");
          $("#everlevelpacks").val("");
          $("#uncompletepacks").val("");
          $("#totalnums").val("");
          $scope.everpacknums = 0;
          $scope.totallevel = 0;
          $scope.everlevelpacks = 0;
          $scope.uncompletepacks = 0;
          $scope.totalnums = 0;
          $scope.inputer = '';
          $scope.focusmodel = 0;
          receiving_commonService.keyboard_fillGrid($("#keyboard_keys"), 2, 5, "keyboard", "keyboard_layout_item");
          $("#everpacknums").focus();
        },
        close: function () {
          $("#keyboard_inputer").value = "";
        }
      }
      receiving_commonService.receiving_tip_dialog_normal("keyboard_window", options);
    }
    //输入窗口确认按钮事件
    $scope.inputnumfinish = function () {
      var modeltype = $scope.focusmodel;
      switch (modeltype) {
        case 0: {
          if ($("#everpacknums").val() === undefined || $("#everpacknums").val() === null || $("#everpacknums").val() === 0) {
            $scope.keyboardStatus = '0';
            $scope.inputer = '每箱数量';
            return;
          }
          $scope.keyboardStatus = '1';
          $("#totallevel").focus();
        }
          break;
        case 1: {
          if ($("#totallevel").val() === undefined || $("#totallevel").val() || $("#totallevel").val() === 0) {
            $scope.keyboardStatus = '0';
            $scope.inputer = '完整层数';
            return;
          }
          $scope.keyboardStatus = '1';
          $("#everlevelpacks").focus();
        }
          break;
        case 2: {
          if ($("#everlevelpacks").val() === undefined || $("#everlevelpacks").val() === null || $("#everlevelpacks").val() === 0) {
            $scope.keyboardStatus = '0';
            $scope.inputer = '每层箱数';
            return;
          }
          $scope.keyboardStatus = '1';
          $("#uncompletepacks").focus();
        }
          break;
        case 3: {
          if ($("#uncompletepacks").val() === undefined || $("#uncompletepacks").val() === null || $("#uncompletepacks").val() === 0) {
            $scope.keyboardStatus = '0';
            $scope.inputer = '不足一层箱数';
            return;
          }
          $scope.keyboardStatus = '1';
          $("#totalnums").focus();
        }
        default: {
          // if($scope.everpacknums<=0){
          //     $scope.keyboardStatus ='0';
          //     $scope.inputer = '每箱数量';
          //     $("#everpacknums").focus();
          //     return;
          // };
          // if($scope.totallevel<=0){
          //     $scope.keyboardStatus ='0';
          //     $scope.inputer = '完整层数';
          //     $("#totallevel").focus();
          //     return;
          // };
          // if($scope.everlevelpacks<=0){
          //     $scope.keyboardStatus ='0';
          //     $scope.inputer = '每层箱数';
          //     $("#everlevelpacks").focus();
          //     return;
          // };
          // if($scope.uncompletepacks<=0){
          //     $scope.keyboardStatus ='0';
          //     $scope.inputer = '不足一层箱数';
          //     $("#uncompletepacks").focus();
          //     return;
          // };
          $scope.keyboardStatus = '1';
          amount = ($("#everpacknums").val() * $("#everlevelpacks").val() * $("#totallevel").val()) + ($("#everpacknums").val() * $("#uncompletepacks").val());
          $scope.totalnums = amount;
          receivingService.finishReceive({
            receiveStationId: $rootScope.stationId,
            adviceId: adviceNo,
            sn: sn,
            useNotAfter: useAfter,
            itemId: itemid,
            storageLocationId: storageid,
            amount: amount,
            receiveType: receiveType,
            finishType: finishType
          }, function (data) {
            $("#pallet_storage").css({"backgroundColor": "#008B00"});
            $("#pallet_storage").html("<h1>" + amount + "</h1><br/>当前货位数量总计:" + (amount + totalamount));
            receiving_commonService.CloseWindowByBtn("keyboard_window");
          });
        }
          break;
      }
    }
    //输入窗口删除事件
    $scope.deletecurrentinput = function () {
      switch ($scope.focusmodel) {
        case 0: {
          receiving_commonService.deleteinput("everpacknums");
        }
          break;
        case 1: {
          receiving_commonService.deleteinput("totallevel");
        }
          break;
        case 2: {
          receiving_commonService.deleteinput("everlevelpacks");
        }
          break;
        case 3: {
          receiving_commonService.deleteinput("uncompletepacks");
        }
          break;
      }
    }
    //画pod布局
    $scope.startPod = function () {
      receiving_commonService.getLocationTypes(function (data) {
        receivingService.bindStorageLocationTypes({
          "locationTypeDTOS": data,
          "stationid": $rootScope.stationId
        }, function () {
          $scope.fullfinish = '1';
          $scope.podstatus = '0';
          setTimeout(function () {
            $("#receiving-inputer").focus();
          }, 200);
        }, function (data) {
          if (data.key === '该工作站已绑定货位类型') {
            $scope.fullfinish = '1';
            $scope.podstatus = '0';
            //聚焦pod输入框
            setTimeout(function () {
              $("#receive-inputer").focus();
            }, 200);
          }
        });
      });


      // $scope.receivingMode= 'init';
      // $scope.receivingButton= 'init';
      // // 跳转收货页面
      // setTimeout(function(){
      //     $state.go($scope.receivingCurrent==='single'? "main.receivingSingle": "main.receivingPallet");
      // }, 1000);
      // fillGrid(document.getElementById("receiving_pod_layout"),6,6,"receiving_pod_layout","receiving_pod_layout_item",5,"px");
      // receiving_commonService.reveive_ToteFillGrid($("#receivetotote_grid"),2,3,"receivegrid","receiveToToteDiv",0,0);
      // setTimeout(function(){ $("#receiving-inputer").focus();}, 200);
      // $state.go($scope.receivingCurrent==='single'? "main.receivingSingle": "main.receivingPallet");
    }
    //扫描方法
    $scope.receivingscan = function (e) {
      if (!receiving_commonService.autoAddEvent(e)) return;
      var inputvalue = $("#receiving-inputer").val();
      $("#receiving-inputer").val("");
      if (scan_pod === false) {//开始扫描pod号码
        podid = inputvalue;
        receivingService.getPodInfo(inputvalue, INBOUND_CONSTANT.CONTAINER, INBOUND_CONSTANT.CONTAINER, function (data) {
          if (Number(data.status) < 0 || data.cls.totalRow === 0) {//pod信息不合法
            var options = {
              width: 500,
              height: 300,
              title: INBOUND_CONSTANT.NOTGETPOD,
              open: function () {
                document.getElementById("tipwindow_span").innerHTML = INBOUND_CONSTANT.NOTGETPOD;
              },
              close: function () {
                $("#receiving-inputer").focus();
              }
            };
            receiving_commonService.receiving_tip_dialog("tipwindow", options);
          } else {
            scan_pod = true;
            $scope.scanbadcib = '0';
            $("#receiving_tip").html(INBOUND_CONSTANT.SCANDAMAGED);
            fillGrid(document.getElementById("receiving_pod_layout"), data.cls.totalRow, "receiving_pod_layout", "receiving_pod_layout_item", data.cls.columnMap);
            setTimeout(function () {
              $("#receiving-inputer").focus();
            }, 200);
          }
        });
      } else {//开始扫描货筐
        if (scan_product_content_DAMAGED === false) {
          receivingService.scanStorageLocation(inputvalue, INBOUND_CONSTANT.DAMAGED, $rootScope.stationName, function (data) {
            if (data.status === '2') {//有商品,提示用户
              $scope.scancontainerType = INBOUND_CONSTANT.DAMAGED;
              var options = {
                width: 600,
                height: 500,
                title: INBOUND_CONSTANT.SUREUSELOCATION,
                open: function () {
                  $scope.wimgstatus = 'hidden';
                  $("#win_content").html("当前货框:" + data.cls.storagelocationName + ",里面有" + data.cls.amount + "件商品，请重新确认是否继续使用当前货筐进行收货");
                },
                close: function () {
                  $("#receiving-inputer").focus();
                }
              };
              receiving_commonService.receiving_tip_dialog("window_img_ok_cancel", options);
            } else {
              scan_product_content_DAMAGED = true;
              $scope.scanbadcib = '1';
              $scope.scanmeasurecib = '0';
              $("#receiving_tip").html(INBOUND_CONSTANT.SCANMEASURE);
              setTimeout(function () {
                $("#receiving-inputer").focus();
              }, 200);
            }
          }, function (data) {
            var options = {
              title: INBOUND_CONSTANT.RESCANLOCATION,
              open: function () {
                $("#tipwindow_span").html(data.message);
              },
              close: function () {
                $("#receiving-inputer").focus();
              }
            };
            receiving_commonService.receiving_tip_dialog("tipwindow", options);
          });
        } else {
          if (scan_product_content_MEASURED === false) {
            receivingService.scanStorageLocation(inputvalue, INBOUND_CONSTANT.MEASURED, $rootScope.stationName, function (data) {
              if (data.status === '2') {//有商品,提示用户
                $scope.scancontainerType = INBOUND_CONSTANT.MEASURED;
                var options = {
                  width: 600,
                  height: 500,
                  title: INBOUND_CONSTANT.SUREUSELOCATION,
                  open: function () {
                    $scope.wimgstatus = 'hidden';
                    $("#win_content").html("当前货框:" + data.cls.storagelocationName + ",里面有" + data.cls.amount + "件商品，请重新确认是否继续使用当前货筐进行收货");
                  },
                  close: function () {
                    $("#receiving-inputer").focus();
                  }
                };
                receiving_commonService.receiving_tip_dialog("window_img_ok_cancel", options);
              } else {
                scan_product_content_MEASURED = true;
                $scope.scanmeasurecib = '1';
                $scope.scanwaitcib = '0';
                $("#receiving_tip").html(INBOUND_CONSTANT.SCANINVESTAGETE);
                setTimeout(function () {
                  $("#receiving-inputer").focus();
                }, 200);
              }
            }, function (data) {
              var options = {
                title: INBOUND_CONSTANT.RESCANLOCATION,
                open: function () {
                  $("#tipwindow_span").html(data.message);
                },
                close: function () {
                  $("#receiving-inputer").focus();
                }
              };
              receiving_commonService.receiving_tip_dialog("tipwindow", options);
            });
          } else {
            if (scan_product_content_TO_INVESTIGATE === false) {
              receivingService.scanStorageLocation(inputvalue, INBOUND_CONSTANT.TO_INVESTIGATE, $rootScope.stationName, function (data) {
                $("#receiving_dn_span").css({"backgroundColor": "#FFDEAD"});
                $("#receiving_dn_span").html(INBOUND_CONSTANT.SCANDN);
                if (data.status === '2') {//有商品,提示用户
                  $scope.scancontainerType = INBOUND_CONSTANT.TO_INVESTIGATE;
                  var options = {
                    width: 600,
                    height: 500,
                    title: INBOUND_CONSTANT.SUREUSELOCATION,
                    open: function () {
                      $scope.wimgstatus = 'hidden';
                      $("#win_content").html("当前货框:" + data.cls.storagelocationName + ",里面有" + data.cls.amount + "件商品，请重新确认是否继续使用当前货筐进行收货");
                    },
                    close: function () {
                      $("#receiving-inputer").focus();
                    }
                  };
                  receiving_commonService.receiving_tip_dialog("window_img_ok_cancel", options);
                } else {
                  scan_product_content_TO_INVESTIGATE = true;
                  $scope.scanwaitcib = '1';
                  $('#receiving_tip').html(INBOUND_CONSTANT.SCANDN);
                  setTimeout(function () {
                    $("#receiving-inputer").focus();
                  }, 200);
                }
              }, function (data) {
                var options = {
                  title: INBOUND_CONSTANT.RESCANLOCATION,
                  open: function () {
                    $("#tipwindow_span").html(data.message);
                  },
                  close: function () {
                    $("#receiving-inputer").focus();
                  }
                };
                receiving_commonService.receiving_tip_dialog("tipwindow", options);
              });
            } else {
              if (scan_DN === false) {
                console.log("ScanningDN...");
                receivingService.scanDN(inputvalue, function (data) {
                  scan_DN = true;
                  adviceNo = data.cls.request.adviceNo;
                  $("#receiving_dn_span").html(adviceNo);
                  $scope.product_info_con = '1';
                  $("#receiving_dn_span").css({"backgroundColor": "#EEEEE0"});
                  $("#product_info_span").css({"backgroundColor": "#FFDEAD"});
                  $("#product_info_span").html(INBOUND_CONSTANT.SCANITEMS);
                }, function (data) {
                  var options = {
                    title: INBOUND_CONSTANT.SCANDN,
                    open: function () {
                      $("#tipwindow_span").html(data.message);
                    },
                    close: function () {
                      $("#receiving-inputer").focus();
                    }
                  };
                  receiving_commonService.receiving_tip_dialog("tipwindow", options);
                });
              } else {
                if (scan_product_info === false) {
                  itemid = inputvalue;
                  receivingService.scanItem(adviceNo, itemid, podid, function (data) {
                    scan_product_info = true;
                    if (data.cls.itemData.itemDataGlobal.serialRecordType === INBOUND_CONSTANT.alwaysrecord) {
                      s
                    }
                    $('#receiving_tip').html(INBOUND_CONSTANT.SCANLOCATIONORDN);
                    $scope.product_info_con = '0';
                    $("#product_info_title").html("SKU:" + data.cls.itemData.skuNo);
                    $("#product_info_text").html("商品名称:" + data.cls.itemData.name);
                    setTimeout(function () {
                      $("#receiving-inputer").focus();
                    }, 200);
                    checkPlletType(data.cls.itemData);
                  }, function (data) {
                    var options = {
                      title: INBOUND_CONSTANT.SCANITEM,
                      open: function () {
                        $("#tipwindow_span").html(data.message);
                      },
                      close: function () {
                        $("#receiving-inputer").focus();
                      }
                    };
                    receiving_commonService.receiving_tip_dialog("tipwindow", options);
                  });
                } else {
                  //检查上架货位
                  storageid = inputvalue;
                  receivingService.checkPallet(storageid, itemid, finishType, useAfter, function (data) {
                    scan_bin = true;
                    totalamount = data.transValue;
                    finishPallet();
                  }, function (data) {
                    storageid = "";
                    if (data.key === '-5') {
                      var options = {
                        width: 500,
                        height: 300,
                        title: INBOUND_CONSTANT.SCANLOCATIONORDN,
                        open: function () {
                          document.getElementById("tipwindow_span").innerHTML = "<h3>" + data.message.key + "</h3><br>" + data.message.message;
                        },
                        close: function () {
                          $("#pod-inputer").focus();
                        }
                      };
                      receiving_commonService.receiving_tip_dialog("tipwindow", options);
                    } else {
                      var options = {
                        title: INBOUND_CONSTANT.RESCANLOCATION,
                        open: function () {
                          $("#tipwindow_span").html(data.message);
                        },
                        close: function () {
                          $("#receiving-inputer").focus();
                        }
                      };
                      receiving_commonService.receiving_tip_dialog("tipwindow", options);
                    }
                  });
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

    function finishPallet() {
      if (isSingle) {//是否单件收货
        receivingService.finishReceive({
          receiveStationId: $rootScope.stationId,
          adviceId: adviceNo,
          sn: sn,
          useNotAfter: useAfter,
          itemId: itemid,
          storageLocationId: storageid,
          amount: 1,
          receiveType: receiveType,
          finishType: finishType
        }, function () {
          $("#pallet_storage").css({"backgroundColor": "#008B00"});
          $("#pallet_storage").html("<h1>" + amount + "</h1><br/>当前货位数量总计:" + (amount + totalamount));
        });
      } else {
        receiving_commonService.receiving_tip_dialog_normal("keyboard_window", {
          width: 650,
          height: 400,
          title: "请输入收货数量",
          open: function () {
            receiving_commonService.keyboard_fillGrid($("#keyboard_keys"), 2, 5, "keyboard", "keyboard_layout_item");
          },
          close: function () {
            $("#keyboard_inputer").value = "";
          }
        });
      }
    }

    //序列号弹出框扫描
    $scope.windowScan = function (e) {
      receivingService.checkSN($("#window-receiving-inputer").val(), function () {
        var window = $("#scanwindow").data("kendoWindow");
        window.close();
        $("#receiving_tip").html(INBOUND_CONSTANT.SCANLOCATIONORDN);
        $("#receiving-inputer").focus();
      }, function (data) {
        $("#serwindowspan").html('<h3>' + data.key + '</h3>不是有效的序列号,请重新扫描</br>' + '商品:<h3>' + data.message + '</h3></br>' + INBOUND_CONSTANT.serialNoTip);
        var window = $("#scanwindow").data("kendoWindow");
        window.close();
        var options = {
          width: 600,
          height: 500,
          title: INBOUND_CONSTANT.SCANSERIALNO,
          open: function () {
            $scope.serimgstatus = 'show';
            $("#serwindowspan").html('<h3>' + data.key + '</h3>不是有效的序列号,请重新扫描</br>' + '商品:<h3>' + data.message + '</h3></br>' + INBOUND_CONSTANT.serialNoTip);
          },
          close: function () {
            $("#receiving-inputer").focus();
          }
        };
        receiving_commonService.receiving_tip_dialog("window_img_sno_ok_cancel", options);
      });
    }

    function checkPlletType() {
      //判断此商品是否需要扫描商品序列号商品，若需要进行下一步
      if (scan_product_signal) {
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
        if (scan_product_effectdate) {
          var options = {
            title: INBOUND_CONSTANT.INPUTAVATIME,
            width: 800,
            height: 600,
            open: function () {
              $("#avatime_pop_window_madeyear").val("");
              $("#avatime_pop_window_mademonth").val("");
              $("#avatime_pop_window_madeday").val("");
              $("#avatime_pop_window_avatime").val("");
              receiving_commonService.avatime_keyboard_fillGrid($("#avatime_pop_window_keyboard"), 2, 5, "avatime_pop", "keyboard_layout_item");
            }
          };
          receiving_commonService.receiving_tip_dialog("avatime_pop_window", options);
        } else {
          $('#receiving_tip').html(INBOUND_CONSTANT.SCANLOCATIONORDN);
          $scope.product_info_con = '0';
          setTimeout(function () {
            $("#receiving-inputer").focus();
          }, 200);
        }
      }
    }

    //输入框获取焦点domid
    $scope.numsinputmethod = function (currentid) {
      receiving_commonService.getavatimeid(currentid);
    }
    // 初始化
    $scope.receivingCurrent = $stateParams.id; // 当前收货模式
    var baseStyle = {style: "font-size:18px;"};
    var columns = [
      {field: "positionIndex", headerTemplate: "<span translate='POSITION_INDEX'></span>", attributes: baseStyle},
      {
        field: "receivingDestination.name",
        headerTemplate: "<span translate='DESTINATION'></span>",
        attributes: baseStyle
      },
      {field: "container.name", headerTemplate: "<span translate='CARTS_BINDING'></span>", attributes: baseStyle}
    ];
    $scope.receivingGridOptions = {selectable: "row", height: 260, sortable: true, columns: columns};
    columns.push({field: "amount", headerTemplate: "<span translate='AMOUNT'></span>", attributes: baseStyle});
    $scope.receivedGridOptions = {selectable: "row", height: 260, sortable: true, columns: columns};
    // setTimeout(function(){ $("#receiving_station").focus();}, 200); // 首获焦
    var baseStyle = {style: "font-size:18px;"};
    var columns = [
      {field: "itemNo", width: 200, headerTemplate: "<span translate='ITEM_NO'></span>", attributes: baseStyle},
      {field: "itemName", headerTemplate: "<span translate='ITEM_DATA_NAME'></span>", attributes: baseStyle},
      {field: "amount", width: 80, headerTemplate: "<span translate='AMOUNT'></span>", attributes: baseStyle}
    ];
    $scope.everpacknums;
    $scope.totallevel;
    $scope.everlevelpacks;
    $scope.uncompletepacks;
    $scope.totalnums;
    $scope.inputer = '';
    $scope.focusmodel = 0;
    $scope.receivingGridOptions = {selectable: "row", height: 260, sortable: true, columns: columns};

    /*      if($rootScope.locationTypeSize===0){
     receivingService.getStorageLocationTypes(function (data) {
     //填充数据
     $scope.podstatus = '1';
     $scope.fullfinish = '0';
     receiving_commonService.grid_BayType(data.cls,data.transValue.row,data.transValue.column);
     });
     }else{*/
    $scope.fullfinish = '1';
    $scope.podstatus = '0';
    /*   }*/
    $("#receiving-inputer").focus(); // 首获焦
  });
})();