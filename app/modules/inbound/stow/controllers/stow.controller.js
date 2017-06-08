/**
 * Created by frank.zhou on 2017/04/18.
 */
(function(){
  "use strict";

  angular.module('myApp').controller("stowCtl", function ($window,$scope, $rootScope, $state, $stateParams,receivingService,INBOUND_CONSTANT,receiving_commonService,commonService) {
    $window.localStorage["currentItem"] = "stow";
      $("#receiving_user").html($window.localStorage["name"]); // 当前用户
// ========================================================================================
      $scope.scanstatus = '0';
      $scope.scanhead = '0';
      var scan_DAMAGED = false;
      var scan_ciper = false;
      var scan_pod = false;
      var scan_product_content= false;
      var scan_Bin= false;
      var scan_DN = false;
      var scan_product_info= false;
      var isSingle = false;
      var finishType = INBOUND_CONSTANT.ALL;
      var stowType = INBOUND_CONSTANT.GENUINE;
      var thisid;
      var inputvalue = '';
      var ciper = '';
      var itemid = '';
      var storageid = '';
      var useAfter = '';
      var podid = '';
      var amount = '';
      var storages = new Array();
      if($rootScope.scan_product_content_DAMAGED===undefined)
          $rootScope.scan_product_content_DAMAGED=false;

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
          $scope.scanhead = '1';
          $scope.status = '1';
          $scope.fullfinish = '1';
          $scope.podstatus = '0';
          scan_DAMAGED = true;
          setTimeout(function(){ $("#receiving-inputer").focus();}, 200); // 首获焦

      };

      // 扫描工作站
      $scope.scanStation = function(e){
          var keyCode = window.event? e.keyCode: e.which;
          if(keyCode != 13) return;
          receivingService.scanStowStation($("#receiving_station").val(),function (data) {
              $scope.maxAmount=data.cls.transValue;
              $scope.stationId = data.cls.receiveStationId; // 工作站id
              $scope.stationName = data.cls.receiveStationName; // 工作站name
              $rootScope.stationId = data.cls.stowStationId;
              $rootScope.stationName = data.cls.stowStationName;
              $rootScope.locationTypeSize=data.cls.locationTypeSize;
              $rootScope.maxAmount=data.cls.maxAmount;
              $rootScope.processSize = data.cls.processSize;
              $rootScope.receiveProcessDTOList = data.cls.receiveProcessDTOList;
              if($rootScope.processSize===0){
                  scan_DAMAGED=false;
                  if($rootScope.locationTypeSize===0){
                      $scope.fullfinish = '0';
                      $scope.podstatus = '1';
                      $scope.scanhead = '1';
                      receivingService.getStorageLocationTypes(function (data) {
                          //填充数据
                          receiving_commonService.grid_BayType(data.cls.storageLocationDTOList,data.cls.binTypeColumn.column,data.cls.binTypeColumn.row);
                      });
                  }else{
                      $scope.fullfinish = '1';
                      $scope.podstatus = '0';
                      $scope.scanhead = '1';
                      $scope.scanbadcib='0';
                      $("#receiving_tip").html(INBOUND_CONSTANT.SCANDAMAGED);
                  }
                  // $state.go($scope.receivingCurrent==='single'? "main.receivingSingle": "main.receivingPallet");
              }else{
                  $scope.status='max';
                  $scope.scanhead='1';
                  $scope.receivingButton='!confirm';
                  scan_DAMAGED=false;
                  var array = new Array();
                  for (var i=0;i<$rootScope.processSize;i++){
                      array.push(data.cls.receiveProcessDTOList[i]);
                  }
                  $("#receivedGRID").data("kendoGrid").setDataSource(new kendo.data.DataSource({data: array}));
              }
          },function (data) {
              $scope.scanstatus = '1';
              $("#warnStation").html(data.message);
          });
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

      // 自动满筐所有车牌
      $scope.deleteReceivingContainer = function(e){
          console.log("stowStation-->"+$rootScope.stationName);
          $scope.status= 'init';
          $scope.receivingMode= 'init';
          $scope.receivingButton= 'init';
          $scope.fullfinish = '0';
          receivingService.autoFullStowLocation($rootScope.stationName,function (data) {
              scan_DAMAGED=false;
              conslole.log("autoFullStorageLocation");
              receivingService.getStorageLocationTypes(function (data) {
                  //填充数据
                  receiving_commonService.grid_BayType(data.cls,data.transValue.row,data.transValue.column);
              });
          },function (data) {
              alert("autoFull error");
          });
          // var isSELECT = false;
          // var SELECTID;
          // var root_div = $("#select_bin_grid");
          // console.log("开始填充");
          // var count  = "";
          // for (var i = 0;i<5;i++){
          //     count += "<div style='float: left;margin-left:8%;width:80%;height:25%'>"
          //     for (var j=0;j<4;j++){
          //         count +="<div class='box_shadow_with_radius' id='bin_item"+i+j+"'"+
          //             // "style='width:20%;height:70%;background-color: #E0EEEE;margin-left:5%;float: left'> " +
          //             "<span id='bin_item_title' style='font-size: 24px;line-height: 80px;color: #FFFFFF;'>"+j+"</span> " +
          //             "</div>";
          //     }
          //     count+="</div>";
          // }
          // root_div.html(count);
          // $('.box_shadow_with_radius').each(function(){
          //     $(this).click(function(){
          //         if(isSELECT){
          //             console.log("有选-id--->"+SELECTID);
          //             document.getElementById(SELECTID).style.backgroundColor = '#E0EEEE';
          //             // this.style.backgroundColor = '#FF0000';
          //             // SELECTID = this.id;
          //         }else{
          //             console.log("未选id--->"+SELECTID);
          //             isSELECT = true;
          //         }
          //         SELECTID = this.id;
          //         this.style.backgroundColor = '#00a2eb';
          //     })
          // })
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
          if(rootdiv==null||rootdiv==undefined||row<1||column<1){
              console.log("arguments is invalid");
              return;
          }
          var count  = "";
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
          rootdiv.html(count);
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
      //收货数量弹出框确定
      $scope.finish_keyboard = function () {
          if($("#keyboard_inputer").val()===undefined||$("#keyboard_inputer").val()<1){
              $scope.keyboardStatus='0';
              return;
          }else{
              $scope.keyboardStatus='1';
          }
          /**
           *  private String storageId;
           //车牌Name
           private String ciperName;
           //上架数量
           private int amount;
           //DN号码
           private String adviceNo;
           //podid
           private String podid;
           //收货模式（单件／批量）
           private String finishType;
           //上架模式（残品／正品）
           private String stowType;
           //itemid
           private String itemid;
           */
          amount = $("#keyboard_inputer").val();
          receivingService.finishStow({
              "storageId":storageid,
              "ciperName":ciper,
              "amount":amount,
              "podid":podid,
              "finishType":finishType,
              "stowType":stowType,
              "itemid":itemid
          },function (data) {
              alert("stow success!");
              receiving_commonService.CloseWindowByBtn("keyboard_window");
          });
      }


      $scope.receivingscan = function (e) {
          if(!receiving_commonService.autoAddEvent(e)) return;
          var input_value = $("#receiving-inputer").val();
          console.log("input_value-->"+input_value);
          $("#receiving-inputer").val("");
          if(scan_DAMAGED===false){
              receivingService.scanStowContainer(input_value,INBOUND_CONSTANT.DAMAGED,$rootScope.stationName,function (data) {
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
                      scan_DAMAGED = true;
                      $scope.scanbadcib='1';
                      $("#receiving_tip").html(INBOUND_CONSTANT.WAITPODINFO);
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
              if(scan_pod===false){
                  console.log("podid-->"+input_value);
                  podid = input_value;
                  console.log("podid-copy-->"+podid);
                  receivingService.getPodInfo(input_value,INBOUND_CONSTANT.BIN,function (data) {
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
                          storages = data.storageLocations;
                          $("#receiving_pod_layout").html("");
                          receiving_commonService.fillGrid(document.getElementById("receiving_pod_layout"),data.cls.totalRow,"receiving_pod_layout","receiving_pod_layout_item",data.cls.columnMap);
                          $('#receiving_tip').html(INBOUND_CONSTANT.SCANCIPER);
                          $('#receiving_dn_span').html(INBOUND_CONSTANT.SCANCIPER);
                          $('#stow-ciper-title').html(INBOUND_CONSTANT.SCANCIPER);
                          setTimeout(function(){ $("#receiving-inputer").focus();}, 200);
                      }
                  });
              }else{
                  if(scan_ciper===false){//第一次扫描ciper号码
                      ciper = input_value;
                      receivingService.scanStowCiper(input_value,INBOUND_CONSTANT.CONTAINER,$rootScope.stationName,function (data) {
                            scan_ciper = true;
                          $('#receiving_dn_span').html(ciper);
                          $("#stow-ciper-title").html(INBOUND_CONSTANT.SCANCIPER+"-"+data.cls.amount);
                          $scope.product_info_con = '1';
                          $("#product_info_span").html(INBOUND_CONSTANT.SCANITEMS);
                          $('#receiving_tip').html(INBOUND_CONSTANT.SCANITEM);
                      },function (data) {
                          var options = {
                              width:500,
                              height:300,
                              title:INBOUND_CONSTANT.NOTGETPOD,
                              open:function () {
                                  document.getElementById("tipwindow_span").innerHTML = data.key;
                              },
                              close:function () {
                                  $("#receiving-inputer").focus();
                              }
                          };
                          receiving_commonService.receiving_tip_dialog("tipwindow",options);
                      });
                  }else{//开始扫描货筐
                      if(scan_product_content===false){
                          itemid = input_value;
                          receivingService.scanStowItem(itemid,function (data) {
                              $scope.product_info_con = '0';
                              scan_product_content = true;
                              $("#product_info_title").html(data.skuNo);
                              $("#product_info_text").html(data.name);
                              $('#receiving_tip').html(INBOUND_CONSTANT.SCANLOCATIONORDN);
                          },function (data) {
                              var options = {
                                  width:500,
                                  height:300,
                                  title:INBOUND_CONSTANT.NOTGETPOD,
                                  open:function () {
                                      document.getElementById("tipwindow_span").innerHTML = data.key;
                                  },
                                  close:function () {
                                      $("#receiving-inputer").focus();
                                  }
                              };
                              receiving_commonService.receiving_tip_dialog("tipwindow",options);
                          });
                      }else{
                          if(scan_Bin===false){
                              //检查上架货位
                              storageid = input_value;
                              receivingService.checkStowBin(storageid,itemid,podid,function (data) {
                                  scan_Bin = true;
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

      function finishGoods() {
          if(isSingle){//是否单件收货
              receivingService.finishStow({
                  "storageId":storageid,
                  "ciperName":ciper,
                  "amount":1,
                  "podid":podid,
                  "finishType":finishType,
                  "stowType":stowType,
                  "itemid":itemid
              },function (data) {
                  alert("stow success!");
                  receiving_commonService.CloseWindowByBtn("keyboard_window");
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
              //     receivingService.finishStow({
              //         "storageId":storageid,
              //         "ciperName":ciper,
              //         "amount":amount,
              //         "podid":podid,
              //         "finishType":finishType,
              //         "stowType":stowType,
              //         "itemid":itemid
              //     },function (data) {
              //         alert("stow success!");
              //         receiving_commonService.CloseWindowByBtn("keyboard_window");
              //     });
              // }else{
              //
              // }
          }
      }

      //确认使用当前货筐
      $scope.win_receivingok = function (type) {
          scan_DAMAGED = true;
          $('#receiving_tip').html(INBOUND_CONSTANT.SCANCIPER);
          receiving_commonService.CloseWindowByBtn("window_img_ok_cancel");
      }

      $scope.win_receivingcancel = function (type) {
          scan_DAMAGED = false;
          $('#receiving_tip').html(INBOUND_CONSTANT.SCANDAMAGED);
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
    //结束收货取消
    $scope.closeGeneralWindow = function(){
      var window = $("#window_general_ok_cancel").data("kendoWindow");
      window.close();
    }
      //有效期输入框焦点函数
      $scope.avatimemethod = function (currentid) {
          receiving_commonService.getavatimeid(currentid);
      }

      $scope.startPod = function () {
          receiving_commonService.getLocationTypes(function (data) {
              console.log("data-->"+data);
              receivingService.bindStorageLocationTypesToStow({
                  "locationTypeDTOS":data,
                  "stationid":$rootScope.stationId
              },function (data) {
                  $scope.fullfinish = '1';
                  $scope.podstatus = '0';
                  $scope.scanbadcib='0';
                  $scope.scanhead = '1';
                  $("#").html(INBOUND_CONSTANT.SCANDAMAGED);
                  setTimeout(function(){ $("#receive-inputer").focus();}, 200);
              },function (data) {
                  console.log("bindTypeerror");
                  if(data.key==='该工作站已绑定货位类型'){
                      $scope.fullfinish = '1';
                      $scope.podstatus = '0';
                      $scope.scanbadcib='0';
                      $scope.scanhead = '1';
                      $("#").html(INBOUND_CONSTANT.SCANDAMAGED);
                      //聚焦pod输入框
                      setTimeout(function(){ $("#receive-inputer").focus();}, 200);
                  }
              });
          });
      }

      //初始化
      $scope.receivingCurrent = $stateParams.id; //当前收货模式
      var baseStyle = {style: "font-size:18px;"};
      var columns= [
          {field: "positionIndex", headerTemplate: "<span translate='POSITION_INDEX'></span>", attributes: baseStyle},
          {field: "container.name", headerTemplate: "<span translate='CARTS_BINDING'></span>", attributes: baseStyle}
      ];
      $scope.receivingGridOptions = {selectable: "row", height: 260, sortable: true, columns: columns};
      columns.push({field: "amount", headerTemplate: "<span translate='AMOUNT'></span>", attributes: baseStyle});
      $scope.receivedGridOptions = {selectable: "row", height: 260, sortable: true, columns: columns};
      setTimeout(function(){ $("#receiving_station").focus();}, 200); // 首获焦
  });
})();