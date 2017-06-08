/**
 * Created by thoma.bian on 2017/5/10.
 */
(function () {
  'use strict';
  angular.module('myApp').controller("icqaAdjustmentCtl", function ($scope, $window,icqaAdjustmentService,ICQABaseService) {

    var columns = [
      // {field: "a", headerTemplate: "<span translate='操作时间'></span>", template: function (item) {
      //   return item.modifiedDate ? kendo.format("{0:yyyy-MM-dd HH:mm:ss}", kendo.parseDate(item.modifiedDate)) : "";
      // }},
     // {field: "b", headerTemplate: "<span translate='问题类型'></span>"},
      {field: "client", headerTemplate: "<span translate='客户'></span>",template:function(item){
        return item.client? item.client.name: "";
      }},
      {field: "itemNo",headerTemplate: "<span translate='SKU'></span>"},
      {field: "sku", headerTemplate: "<span translate='GOODS_NAME'></span>"},
     // {field: "f", headerTemplate: "<span translate='触发问题工具'></span>"},
     // {field: "g", headerTemplate: "<span translate='操作工具'></span>"},
      {field: "fromStorageLocation", headerTemplate: "<span translate='原始容器'></span>",hidden:true},
      {field: "toStorageLocation", headerTemplate: "<span translate='目的容器'></span>",hidden:true},
      {field: "amount", headerTemplate: "<span translate='COUNT'></span>"},
      {field: "operator", headerTemplate: "<span translate='操作人'></span>"},
      {field: "thoseResponsible", headerTemplate: "<span translate='责任人'></span>",editor: function (container, options) {
        $('<input  name="' + options.field + '" class="k-textbox" />').appendTo(container);
      }},
      {field: "adjustReason", headerTemplate: "<span translate='原因'></span>",editor: function (container, options) {
        $('<input  name="' + options.field + '" class="k-textbox" />').appendTo(container);
      }},
      // {field: "p", headerTemplate: "<span translate='分析人员'></span>",editor: function (container, options) {
      //   $('<input  name="' + options.field + '" class="k-textbox" />').appendTo(container);
      // }},
      // {field: "q", headerTemplate: "<span translate='调整分析'></span>", editor: function (container, options) {
      //   $('<input  name="' + options.field + '" class="k-textbox" />').appendTo(container);
      // }},
      {field: "other",menu:false}];
   // $scope.option = {"state":"","anDonMasterType":"","seek": $scope.seekContent,"stateDate":$scope.stateDate,"endDate":$scope.endDate};


    $scope.seekContent = "";
    icqaAdjustmentService.getItemAdjust($scope.seekContent,function(data){
      $scope.icqaAdjustmentGridOption = ICQABaseService.grids({
        columns: columns,
        dataSource:{
          data:data,
          schema: {
            model: {
              id: "id",
              fields: {
               // "a" :{ editable: false },
               // "b" :{ editable: false},
               // "'client.name'" :{ editable: false},
                "sku" :{ editable: false},
                "itemNo" :{ editable: false},
                //"f" :{ editable: false},
               // "g" :{ editable: false},
                "fromStorageLocation" :{ editable: false},
                "toStorageLocation" :{ editable: false},
                "operator" :{ editable: false},
                "amount" :{ editable: false},
                "thoseResponsible" :{ editable: false}
              }
            }
          }
        },
        height: $(document.body).height() - 210
      }, function(e){
        var grid = $("#icqaAdjustmentGrid").data("kendoGrid");
        // grid.thead.find("[data-field=a]>.k-header-column-menu").remove();
        // grid.thead.find("[data-field=b]>.k-header-column-menu").remove();
        grid.thead.find("[data-field='client']>.k-header-column-menu").remove();
        grid.thead.find("[data-field='sku']>.k-header-column-menu").remove();
        grid.thead.find("[data-field='itemNo']>.k-header-column-menu").remove();
        // grid.thead.find("[data-field=f]>.k-header-column-menu").remove();
        // grid.thead.find("[data-field=g]>.k-header-column-menu").remove();
        grid.thead.find("[data-field='fromStorageLocation']>.k-header-column-menu").remove();
        grid.thead.find("[data-field='toStorageLocation']>.k-header-column-menu").remove();
        grid.thead.find("[data-field='thoseResponsible']>.k-header-column-menu").remove();
        grid.thead.find("[data-field='operator']>.k-header-column-menu").remove();
        grid.thead.find("[data-field='amount']>.k-header-column-menu").remove();
        grid.thead.find("[data-field='adjustReason']>.k-header-column-menu").remove();
        // grid.thead.find("[data-field=p]>.k-header-column-menu").remove();
        // grid.thead.find("[data-field=q]>.k-header-column-menu").remove();

      });
    });

    $scope.icqaAdjustmentSearch = function(){
     icqaAdjustmentService.getItemAdjust($scope.seekContent,function(data){
       var grid = $("#icqaAdjustmentGrid").data("kendoGrid");
       grid.setDataSource(new kendo.data.DataSource({data: data}));
      })
    };

  })
})();
