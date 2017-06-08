
/**
 * Created by frank.zhou on 2016/12/13.
 */
(function () {
  'use strict';

  angular.module('myApp').controller("receivingCtl", function ($scope, $window){
    $("#receiving_user").html($window.localStorage["name"]); // 当前用户

  }).controller("receivingContainerCtl", function($scope, $rootScope, $state, $stateParams,receiving_commonService,commonService){
    // ========================================================================================
      $scope.scanstatus = '0';
      $scope.scanhead = '0';
      var scan_pod = false;
      var scan_product_content= false;
      var scan_DN = false;
      var scan_product_info= false;
      var thisid;
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
      //收货数量弹出框确定
      $scope.finish_keyboard = function () {
          if($("#keyboard_inputer").val()<1){
              $scope.keyboardStatus='0';
              return;
          }
          if($("#"+thisid)===undefined||$("#"+thisid)===null)return;
          $("#"+thisid).children("span").text($("#keyboard_inputer").val());
          $("#receiving_status_span").html("已成功收货上架"+$("#keyboard_inputer").val()+"件商品至"+thisid);
          $("#status_value").css({"background": "#00AB00"});
          $("#"+thisid).css({"backgroundColor":"#FF0000"});
          receiving_commonService.CloseWindowByBtn("keyboard_window");
      }
    
    $scope.receivingscan = function (e) {
        if(!receiving_commonService.autoAddEvent(e)) return;
        if(scan_pod===false){//第一次扫描pod号码
            if($("#receiving-inputer").val()==='11'){
                scan_pod = true;
                $('#receiving_tip').html("请扫描残品货筐，并将货筐放于指定位置");
                $scope.scanbadcib = '0';
                $("#receiving-inputer").focus();
                scan_pod = true;
            }else{
                var options = {
                    width:500,
                    height:300,
                    title:"请重新扫描残品货筐",
                    open:function () {
                        
                    },
                    close:function () {
                        $("#receiving-inputer").focus();
                    }
                };
                receiving_commonService.receiving_tip_dialog("tipwindow",options);
            }
        }else{//开始扫描货筐
            if(scan_product_content===false){
                if($("#receiving-inputer").val()==='12'){
                    var options = {
                        width:600,
                        height:500,
                        title:"请确认是否使用当前货筐",
                        open:function () {
                            $("#win_content").html("车牌号码：CIB12345678，里面有3件商品，请重新确认是否继续使用当前货筐进行收货");
                        },
                        close:function () {
                            $("#receiving-inputer").focus();
                        }
                    };
                    receiving_commonService.receiving_tip_dialog("window_img_ok_cancel",options);
                }else{//货筐条码无效
                    var options = {
                        title:"请重新扫描货筐条码",
                        open:function () {

                        },
                        close:function () {
                            $("#receiving-inputer").focus();
                        }
                    };
                    receiving_commonService.receiving_tip_dialog("tipwindow",options);
                }
            }else{
                if(scan_DN===false){//录入dn条码
                    $("#receiving_dn_span").html($("#receiving-inputer").val());
                    $('#receiving_tip').html("请扫描/检查DN条码");
                    $("#product_info_span").html("扫描商品条码");
                    scan_DN = true;
                }else{
                    // $("#product_info_span").html($("#receiving-inputer").val());
                    $scope.product_info_con = '0';
                    $('#receiving_tip').html("请扫描上架货位条码");
                    $("#product_info_title").html("SKU:Docker");
                    $("#product_info_text").html("Docker 是一个开源的应用容器引擎，让开发者可以打包他们的应用以及依赖包到一个可移植的容器中，然后发布到任何流行的 Linux 机器上，也可以实现虚拟化。容器是完全使用沙箱机制，相互之间不会有任何接口。");
                    $scope.product_info_img='0';
                    $("#receiving_pod_layout22").css({"background": "#00a2eb"});
                    $("#receiving_pod_layout32").css({"background": "#00a2eb"});
                    $("#receiving_pod_layout52").css({"background": "#00a2eb"});
                    $("#receiving_pod_layout12").css({"background": "#00a2eb"});
                    scan_product_info = true;
                    $("#receiving-inputer").focus();
                }
            }
        }
    }
    //确认使用当前货筐
    $scope.win_receivingok = function () {
        $scope.product_info_con = '1';
        $("#receiving_dn_span").html("请扫描DN条码");
        $('#receiving_tip').html("请扫描DN条码");
        scan_product_content = true;
        receiving_commonService.CloseWindowByBtn("window_img_ok_cancel");
    }
    $scope.win_receivingcancel = function () {
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
    
    //有效期输入框焦点函数
    $scope.avatimemethod = function (currentid) {
        receiving_commonService.getavatimeid(currentid);
    }
    
    $scope.startPod = function () {
        $scope.fullfinish = '1';
        $scope.podstatus = '0';
        $scope.receivingMode= 'init';
        $scope.receivingButton= 'init';
        // 跳转收货页面
        setTimeout(function(){
            $state.go($scope.receivingCurrent==='single'? "main.receivingSingle": "main.receivingPallet");
        }, 1000);
        // fillGrid(document.getElementById("receiving_pod_layout"),6,6,"receiving_pod_layout","receiving_pod_layout_item",5,"px");
        receiving_commonService.reveive_ToteFillGrid($("#receivetotote_grid"),2,3,"receivegrid","receiveToToteDiv",0,0);
        setTimeout(function(){ $("#receiving-inputer").focus();}, 200);
        // setTimeout(function(){ $("#receiving-inputer").focus();}, 200);
        // $state.go($scope.receivingCurrent==='single'? "main.receivingSingle": "main.receivingPallet");
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
  });
})();