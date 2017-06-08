/**
 * Created by feiyu.pan on 2017/4/24.
 * Updated by feiyu.pan on 2017/5/31
 */
(function () {
  "use strict";

  angular.module('myApp').controller("deliverySystemCtl", function ($timeout,$scope, $window, $state, $rootScope,outboundService,deliverySystemService) {
    $scope.startTime=kendo.format("{0:yyyy-MM-dd}",new Date());//默认开始时间
    $scope.endTime=kendo.format("{0:yyyy-MM-dd}",new Date(new Date().setDate(new Date().getDate()+1)));//默认结束时间
    $scope.checked=true ;//是否只显示未发货的
    $scope.reloadable=true;//能否重新装载
    $scope.bindDoorAble=false;//能否绑定门
    var columns=[
      {field:"deliveryPoint",width:80,headerTemplate:"<span translate='DATE'></span>"},
      {field:"exSD",width:80,headerTemplate:"<span translate='ExSD'></span>"},
      {field:"sortCode",width:80,headerTemplate:"<span translate='Sort Code'></span>",template:function (item) {
        var sortCode=item.sortCode;
        var state=item.state;
        var date=item.date;
        if(typeof(sortCode)==="undefined"){
          sortCode="";
        }
        var html="<a ng-click='jump(\""+sortCode+"\",\""+state+"\",\""+date+"\")'>"+sortCode+"</a>";
        return html;
      }},
      {field:"dockDoor",width:80,headerTemplate:"<span translate='DOCK_DOOR'></span>"},
      {field:"outGoodsTotal",width:100,headerTemplate:"<span translate='发货总单量'></span>"},
      {field:"unpickTotal",width:110,headerTemplate:"<span translate='尚未分拣单量'></span>"},
      {field:"unloadedTotal",width:100,headerTemplate:"<span translate='已分拣尚未装载单量'></span>"},
      {field:"loadedTotal",width:110,headerTemplate:"<span translate='已装载单量'></span>"},
      {field:"usecontainerTotal",width:110,headerTemplate:"<span translate='使用笼车总数量'></span>"},
      {field:"unloadContainerTotal",width:110,headerTemplate:"<span translate='尚未装载笼车数量'></span>"},
      {field:"loadedContainerTotal",width:110,headerTemplate:"<span translate='已经装载笼车数量'></span>"},
      {field:"state",width:80,headerTemplate:"<span translate='STATE'></span>",template:function (item) {
        //改变状态获取当前行信息
        var exSD=item.deliveryPoint+" "+item.exSD;
        var sortCode=item.sortCode;
        var state=item.state;
        if(typeof(sortCode)==="undefined"){
          state="";
        }
        var html="<a ng-click='changeState(\""+sortCode+"\",\""+exSD+"\",\""+state+"\")'>"+state+"</a>";
        return html;
      }},
      {field:"sendDate",width:120,headerTemplate:"<span translate='发货时间'></span>"}];
    $scope.deliverGoodsGridOptions=outboundService.reGrids("",columns,$(document.body).height()-203);
    //按照上面部分条件搜索
    $scope.determineSearchCriteria=function () {
      $scope.airTime=$scope.startTime;
      $scope.finishTime=$scope.endTime;
      $scope.searchOption="";
      $scope.search();
    };
    //按照搜索框结合上面部分条件搜索
    $scope.search=function(){
      deliverySystemService.getDeliverySystemData($scope.searchOption,$scope.startTime,$scope.endTime,$scope.checked,function (data) {
        var dataSource=[];
        for(var i=0;i<data.length;i++) {
          var totalData ={
            "deliveryPoint":kendo.format("{0:yyyy/MM/dd}",kendo.parseDate(data[i].goodsInnerClassList[0].deliveryPoint)),
            "exSD":"Total",
            "outGoodsTotal":data[i].outGoodsTotal,
            "unpickTotal":data[i].unpickTotal,
            "pickedTotal":data[i].pickedTotal,
            "unloadedTotal":data[i].unloadContainerTotal,
            "loadedTotal":data[i].loadedTotal,
            "usecontainerTotal":data[i].usecontainerTotal,
            "unloadContainerTotal":data[i].unloadContainerTotal,
            "loadedContainerTotal":data[i].loadedContainerTotal
          };
          dataSource.push(totalData);
        }
        for(var j=0;j<data.length;j++){
          for(var k=0;k<data[j].goodsInnerClassList.length;k++){
            data[j].goodsInnerClassList[k].deliveryPoint=kendo.format("{0:yyyy/MM/dd}",kendo.parseDate(data[j].goodsInnerClassList[k].deliveryPoint));
            data[j].goodsInnerClassList[k]["exSD"]=kendo.format("{0:hh:mm:ss}",kendo.parseDate(data[j].goodsInnerClassList[k].deliveryPoint));
            dataSource.push(data[j].goodsInnerClassList[k])
          }
        }
        var grid=$("#deliverGoodsGrid").data("kendoGrid");
          grid.setOptions({change:function () {
          //选中行获得信息
          var row=grid.select();
          var item=grid.dataItem(row);
          $scope.sortCode=item.sortCode;
          $scope.deliveryTime=item.deliveryPoint+" "+item.exSD;
          $scope.dockDoor=item.dockDoor;
          if(item.state=="0"){
            $timeout(function () {
                 $scope.bindDoorAble=false;
            })
          }else if(item.state=="200" || item.state=="300") {
            $timeout(function () {
              $scope.reloadable = false;
            })
          }else {
            $timeout(function () {
              $scope.reloadable = true;
              $scope.bindDoorAble = true;
            })
          }
        },dataBound:function () {
          //合并单元格
          for (var i = 0; i < dataSource.length; i++) {
            this.tbody.find("tr:eq(" + i + ")").each(function () {
              var td = $(this).find("td:eq(1)");
              if (td.text() == "Total") {
                td.attr("colspan", 3);
                var l = 0;
                while (l < 2) {
                  $(this).find("td:eq(2)").remove();
                  l++
                }
              }
            });
          }
        }});
          grid.setOptions({dataSource:dataSource});
      })
    };
    $scope.search();
    //跳转
    $scope.jump=function (sortCode,state) {
      $state.go('main.deliverySystemPrint',{params: angular.toJson({sortCode: sortCode, state: state})})
    };
    //修改状态
    $scope.changeState=function (sortCode,exSD,state) {
      if(state==100 || state==300) {
        deliverySystemService.changeState(sortCode, exSD, state, function () {
          $scope.search()
        })
      }
    };
    //确认收获门
    $scope.confirmReloadBindDoor=function () {
      $scope.openWindow("#bindDoor",$scope.bindDoorWindow);
      deliverySystemService.getDockDoor(function (data) {
        $scope.dockDoorDataSource=data;
        var dropDownList=$("#dockDoor").data("kendoDropDownList");
        dropDownList.value("");
      });
    };
    //绑定收获门
    $scope.bindDoor=function () {
      var dropDownList=$("#dockDoor").data("kendoDropDownList");
      $scope.dockDoor=dropDownList.value();
      deliverySystemService.bindDoor($scope.dockDoor,$scope.sortCode,$scope.deliveryTime,function () {
        $scope.search();
        $scope.bindDoorWindow.close();
      })
    };
    //确认重新装载
    $scope.confirmReload=function () {
      $scope.openWindow("#reload",$scope.reloadWindow);
      $scope.reloadWindow.close();
    };
    //重新装载
    $scope.reload=function () {
      deliverySystemService.reload($scope.sortCode,function () {
        $scope.search();
      })
    };
    $scope.openWindow = function (windowId, windowName) {
      $(windowId).parent().addClass("deliverySystemWindow");
      windowName.setOptions({
        width:650,
        closable: true
      });
      windowName.center();
      windowName.open();
    };

    }).controller("deliverySystemPrintCtl",function ($stateParams,$scope,$state,deliverySystemService) {
    $scope.printable=true;//是否能够打印
    var params=angular.fromJson($stateParams.params);
    $scope.sortCode=params.sortCode;
    $scope.state=params.state;//状态
    $scope.warehouse=localStorage["warehouseId"];//仓库名
    $scope.nowDate=kendo.format("{0:yyyy/MM/dd hh:mm:ss}",new Date());
    if($scope.state == "200" || $scope.state == "300"){
      $scope.printable=false;
    }
    //打印
    $scope.print=function () {
      deliverySystemService.print($scope.sortCode,function () {

      })
    };
    $scope.orderNumber=[
      {date:"2017/3/7",exSD:"20:00",totalShipments:"80"},
      {date:"2017/3/7",exSD:"21:00",totalShipments:"100"}];
    $scope.date=$scope.orderNumber[0].date;
    //总单量跳转
    $scope.jump=function () {
      $state.go('main.delivery_shipments_detail',{params: angular.toJson({sortCode: $scope.sortCode, startTime: $scope.date, endTime: $scope.date})})
    };
    //细节单量跳转
    $scope.toJump=function(exSD){
      $state.go('main.delivery_shipments_detail',{params: angular.toJson({sortCode: $scope.sortCode, startTime: $scope.date, endTime  : $scope.date,exSD:exSD})})
    };
  })
})();