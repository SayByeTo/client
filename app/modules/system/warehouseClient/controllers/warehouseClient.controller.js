/**
 * Created by frank.zhou on 2017/04/18.
 */
(function(){
  "use strict";

  angular.module('myApp').controller("warehouseClientCtl", function ($scope, commonService, systemService, warehouseClientService){
    // ==========================================================================================================
    function getKendoList(id){
      return $("#"+ id).data("kendoListView");
    }

    function select(list, length){
      var selectItems = list.element.children().filter(function(idx){ return idx < length;});
      list.select(selectItems);
    }

    function getComboxOption(options){
      return {
        dataSource: systemService.getDataSource({key: options.key, value: "id", text: "name"}),
        dataTextField: "name",
        dataValueField: "id",
        filter: "contains",
        change: function(){
          options.change && options.change();
        }
      };
    }

    // input
    $scope.filterInput = function(event, id, value){
      var keycode = window.event? event.keyCode: event.which; // 获取按键编码
      if(keycode === 13){
        var listView = getKendoList(id);
        listView.dataSource.filter({field: "name", operator: "contains", value: value});
      }
    };

    // ==========================================================================================================
    $scope.selectWarehouseOptions = getComboxOption({
      key: "getSelectWarehouse", change: function(){
        var warehouseId = $scope.selectWarehouse.id;
        warehouseClientService.getUnassignedClientByWarehouse(warehouseId, function(unAssigned){
          getKendoList("listUnassignClients").setDataSource(new kendo.data.DataSource({data: unAssigned}));
        });
        warehouseClientService.getAssignedClientByWarehouse(warehouseId, function(assigned){
          getKendoList("listAssignClients").setDataSource(new kendo.data.DataSource({data: assigned}));
        });
      }
    });
    $scope.selectClientOptions = getComboxOption({
      key: "getSelectClient", change: function(){
        var clientId = $scope.selectClient.id;
        warehouseClientService.getUnassignedWarehouseByClient(clientId, function(unAssigned){
          getKendoList("listUnassignWarehouses").setDataSource(new kendo.data.DataSource({data: unAssigned}));
        });
        warehouseClientService.getAssignedWarehouseByClient(clientId, function(assigned){
          getKendoList("listAssignWarehouses").setDataSource(new kendo.data.DataSource({data: assigned}));
        });
      }
    });
    // assigned
    $scope.listAssignClients = systemService.getJsonForListView({data: []});
    $scope.listAssignWarehouses = systemService.getJsonForListView({data: []});
    // unassigned
    $scope.listUnassignClients = systemService.getJsonForListView({data: []});
    $scope.listUnassignWarehouses = systemService.getJsonForListView({data: []});

    // horizontal
    $scope.moveLeftAll = function(leftId, rightId){
      leftId == null && (leftId = "listUnassignClients");
      rightId == null && (rightId = "listAssignClients");
      var listLeft = getKendoList(leftId), listRight = getKendoList(rightId);
      for(var i = 0, items = listRight.dataItems(), len = items.length; i < len; i++){
        listRight.dataSource.remove(items[i]);
        listLeft.dataSource.insert(0, items[i]);
      }
      select(listLeft, len);
    };
    $scope.moveLeftSelect = function(leftId, rightId){
      leftId == null && (leftId = "listUnassignClients");
      rightId == null && (rightId = "listAssignClients");
      var listLeft = getKendoList(leftId), listRight = getKendoList(rightId);
      var selections = listRight.select(), len = selections.length;
      for(var i = 0; i < len; i++){
        var item = listRight.dataItem(selections[i]);
        listRight.dataSource.remove(item);
        listLeft.dataSource.insert(0, item);
      }
      select(listLeft, len);
    };
    $scope.moveRightSelect = function(leftId, rightId){
      leftId == null && (leftId = "listUnassignClients");
      rightId == null && (rightId = "listAssignClients");
      var listLeft = getKendoList(leftId), listRight = getKendoList(rightId);
      var selections = listLeft.select(), len = selections.length;
      for(var i = 0; i < len; i++){
        var item = listLeft.dataItem(selections[i]);
        listLeft.dataSource.remove(item);
        listRight.dataSource.insert(0, item);
      }
      select(listRight, len);
    };
    $scope.moveRightAll = function(leftId, rightId){
      leftId == null && (leftId = "listUnassignClients");
      rightId == null && (rightId = "listAssignClients");
      var listLeft = getKendoList(leftId), listRight = getKendoList(rightId);
      for(var i = 0, items = listLeft.dataItems(), len = items.length; i < len; i++){
        listLeft.dataSource.remove(items[i]);
        listRight.dataSource.insert(0, items[i]);
      }
      select(listRight, len);
    };

    // 保存
    $scope.save = function(inputObj, listViewId, requestKey){
      var listView = getKendoList(listViewId), listItems = listView.dataItems();
      for(var i = 0, items = []; i < listItems.length; i++) items.push(listItems[i].id);
      warehouseClientService.save(requestKey, inputObj.id, items, function(){
        commonService.dialogMushiny($scope.window, {type: "success"});
      });
    };
  });
})();