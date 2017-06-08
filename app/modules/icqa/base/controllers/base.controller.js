/**
 * Created by frank.zhou on 2017/05/22.
 */
(function () {
  'use strict';

  angular.module('myApp').controller("icqaCtl", function ($rootScope, $scope, $state, $translate, $window, commonService, ICQA_FILTER, ICQABaseService) {
    // ======================================================================================================================
    function search(options, isSearchInWin){
      isSearchInWin == null && (isSearchInWin = false); // 默认非弹窗
      var currentItem = options.currentItem, gridId = currentItem+ "Grid";
      var grid = $("#"+ gridId).data("kendoGrid"), filterItems = ICQA_FILTER[currentItem] || [];
      for(var i = 0, filters = []; i < filterItems.length; i++) {
        var filter = filterItems[i], fields = filter.field.split("."), key = fields[0], value = fields[1];
        // *****************entity_lock: start*********************
        if (["entityLock", "locale"].indexOf(key) >= 0 && $scope[key]) {
          value = "selectionValue";
          if ($scope[key][value] === "all") continue;
        }
        // ******************entity_lock: end**********************
        var data = (isSearchInWin? options: $scope);
        data[key] && filters.push({field: (filter.field==="client.id"? "clientId": filter.field), operator: filter.operator || "contains", value: value ? data[key][value] : data[key]});
      }
      grid.dataSource.filter(filters);
    }

    // ======================================================================================================================
    $rootScope.searchGrid = function(){
      var currentItem = $window.localStorage["currentItem"];
      if(currentItem == null) return;
      search({currentItem: currentItem});
    };

    $rootScope.create = function(){
      var currentItem = $window.localStorage["currentItem"];
      if(currentItem == null) return;
      $state.go("main."+ currentItem+ "Create");
    };

    $rootScope.update = function(){
      var currentItem = $window.localStorage["currentItem"];
      if(currentItem == null) return;
      var grid = $("#"+ currentItem+ "Grid").data("kendoGrid");
      var rows = grid.select();
      if(rows.length){
        var rowData = grid.dataItem(rows[0]);
        $state.go("main."+ currentItem+ "Update", {id: rowData.id});
      }
    };

    $rootScope.delete = function(){
      var currentItem = $window.localStorage["currentItem"];
      if(currentItem == null) return;
      var grid = $("#"+ currentItem+ "Grid").data("kendoGrid");
      var rows = grid.select();
      if(rows.length){
        commonService.dialogMushiny($scope.window, {
          open: function(win){
            $rootScope.deleteSure = function(){
              var rowData = grid.dataItem(rows[0]);
              ICQABaseService.deleteOne(currentItem, rowData.id, function(){
                win.close();
                grid.dataSource.read(); // 刷新表格
              });
            };
          }
        });
      }
    };

    // 新增明细
    $rootScope.createDetail = function(id){
      var grid = $("#"+ id).data("kendoGrid");
      grid.addRow();
    };

    // 删除明细
    $rootScope.deleteDetail = function(id){
      var grid = $("#"+ id).data("kendoGrid");
      grid.removeRow(grid.select());
    };

    // warehouse
    $rootScope.warehouseSource = ICQABaseService.getDataSource({key: "getWarehouse", text: "name", value: "id"});

    // client
    $rootScope.clientSource =  ICQABaseService.getDataSource({key: "getClient", text: "name", value: "id"});

  });
})();