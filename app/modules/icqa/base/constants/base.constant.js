/**
 * Created by thoma.bian on 2017/5/10.
 * Updated by frank.zhou on 2017/5/22.
 */

(function() {
  "use strict";

  // ==========================================================================================================
  function transformItem(str){
    for(var i = 0, outs = [], preIdx = 0; i < str.length; i++){
      var c = str.charAt(i);
      if(i == str.length - 1){
        var last = str.substring(preIdx);
        outs.push(last.substring(0, 1).toLowerCase()+ last.substring(1));
      }
      if(c < "A" || c > "Z") continue;
      var mid = str.substring(preIdx, i);
      outs.push(outs.length? mid.substring(0, 1).toLowerCase()+ mid.substring(1): mid);
      outs.push("-");
      preIdx = i;
    }
    return outs.join("");
  }

  // ==========================================================================================================
  var items = ["stocktakingStation", "stocktakingStationType"];
  var baseConstant = {};
  for(var i = 0; i < items.length; i++){
    var item = items[i], key = item.substring(0, 1).toUpperCase()+ item.substring(1);
    item = "masterdata/icqa/"+ transformItem(item); // 转换item
    baseConstant["find"+ key] = item+ "s";
    baseConstant["create"+ key] = item+ "s";
    baseConstant["get"+ key] = item+ "s";
    baseConstant["read"+ key] = item+ "s/#id#";
    baseConstant["update"+ key] = item+ "s";
    baseConstant["delete"+ key] = item+ "s/#id#";
  }
  angular.module("myApp").constant("ICQA_FILTER", {
    "stocktakingStation": [{"field": "name"}],
    "stocktakingStationType": [{"field": "name"}]
  }).constant("ICQA_CONSTANT", angular.extend(baseConstant, {
    "getWarehouse": "system/warehouses",
    "getClient": "system/clients",
    "getSelectionBySelectionKey": "system/selections",
    "getWorkstation": "masterdata/workstations",
    //
    "getAndonMasters":"andon-masters/universalSearch",
    "updateAndonMasters":"andon-masters",
    "selectAndonType":"andon-master/pe-solve",

    "getStocktaking0rder": "icqa/stocktaking-orders",
    "getStocktaking0rderUser": "icqa/stocktaking-orders/users",
    "createStocktaking": "icqa/stocktakings",
    "findSelectRoundOfInventory": "icqa/stocktaking-orders/round-of-inventorys",
    "selectRoundOfInventoryId": "icqa/stocktaking-orders/round-of-inventory-ones",
    "select0rdersByStocktakingIds": "icqa/stocktaking-orders/details-webs",
    "getZone": "icqa/stocktaking-orders/zones",
    "getStocktakingRules": "icqa/stocktaking-rules",
    "saveStocktaking":"icqa/stocktakings",
    "saveStocktakingUser": "icqa/stocktaking-users",
    "checkInventory": "icqa/stocktaking-users/check-users-times",
    "checkOneInventory": "icqa/stocktaking-orders/check-lefts",
    "deleteUsers": "icqa/stocktaking-users/delete-users",
    "selectInventoryCount": "icqa/stocktaking-orders/amounts",
    "getItemAdjust":"internal-tool/search-inventory/item-adjust-records"
  }));
})();