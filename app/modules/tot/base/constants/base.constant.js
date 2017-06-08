/**
 * Created by frank.zhou 2017/06/06.
 */
(function(){
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
  var totOne = ["processPaths", "processPathTypes"];
  var items = totOne.concat([]);
  var baseConstant = {};
  for(var i = 0; i < items.length; i++){
    var item = items[i], key = item.substring(0, 1).toUpperCase()+ item.substring(1);
    item = "tot/" + transformItem(item); // 转换item
    baseConstant["find"+ key] = item;
    baseConstant["create"+ key] = item;
    baseConstant["get"+ key] = item;
    baseConstant["read"+ key] = item+ "/#id#";
    baseConstant["update"+ key] = item;
    baseConstant["delete"+ key] = item+ "/#id#";
  }
  angular.module("myApp").constant("TOT_FILTER", {
    // *****************************************************tot****************************************************
    "processPaths": [{"field": "name"}, {"field": "entityLock", operator: "eq"}],
    "processPathTypes": [{"field": "name"}, {"field": "entityLock", operator: "eq"}]
  }).constant("TOT_CONSTANT", angular.extend(baseConstant, {
    "getWarehouse": "system/warehouses",
    "getClient": "system/clients",
    "getSelectionBySelectionKey": "system/selections"
    // ******************************************************tot*****************************************************
  }));
})();