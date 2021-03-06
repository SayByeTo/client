/**
 * Created by frank.zhou on 2017/04/17.
 */
(function () {
  'use strict';

  angular.module('myApp').controller("systemCtl", function ($rootScope, $scope, $state, $window, commonService, SYSTEM_FILTER, systemService) {
    $rootScope.searchGrid = function(){
      var currentItem = $window.localStorage["currentItem"];
      if(currentItem == null) return;
      var grid = $("#"+ currentItem+ "Grid").data("kendoGrid"), filterItems = SYSTEM_FILTER[currentItem] || [];
      for(var i = 0, filters = []; i < filterItems.length; i++){
        var filter = filterItems[i], fields = filter.field.split("."), key = fields[0], value = fields[1];
        // ================entity_lock: start=====================
        if(["entityLock", "locale"].indexOf(key) >= 0 && $scope[key]){
          value = "selectionValue";
          if($scope[key][value] === "all") continue;
        }
        // ================entity_lock: end=======================
        $scope[key] && filters.push({field: filter.field, operator: filter.operator || "contains", value: value? $scope[key][value]: $scope[key]});
      }
      grid.dataSource.filter(filters);
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
              systemService.deleteOne(currentItem, rowData.id, function(){
                win.close();
                grid.dataSource.read(); // 刷新表格
              });
            };
          }
        });
      }
    };

    $rootScope.import = function(){
      var currentItem = $window.localStorage["currentItem"];
      if(currentItem == null) return;
    };

    $rootScope.export = function(){
      var currentItem = $window.localStorage["currentItem"];
      if(currentItem == null) return;
    };

    // warehouse
    $rootScope.warehouseSource = systemService.getDataSource({key: "getWarehouse", text: "name", value: "id"});

    // client
    $rootScope.clientSource =  systemService.getDataSource({key: "getClient", text: "name", value: "id"});

    // entity_lock
    $rootScope.entityLockSource = systemService.getDataSource({
      key: "getSelectionBySelectionKey",
      value: "selectionValue",
      text: "resourceKey",
      data: {selectionKey: "ENTITY_LOCK"}
    });
  });
})();