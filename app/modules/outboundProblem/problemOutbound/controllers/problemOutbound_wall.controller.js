/**
 * Created by frank.zhou on 2017/5/15.
 * Updated by frank.zhou on 2017/5/20.
 */
(function () {
  'use strict';

  angular.module('myApp').controller("problemOutboundWallCtl", function ($scope, $rootScope, $state, $sce, problemOutboundService) {

    // 放置有货 每行颜色
    problemOutboundService.problemCellPlaceGoods($scope.obpWallId, function(datas){
      //
      for(var i = 0, items = []; i < datas.numberOfRows; i++){
        items[i] = datas.obpCellPositions.slice(i*10, i*10+ datas.numberOfColumns);
      }
      //
      var colors = ["#00b050", "#66ffff", "#ffff00", "#ff7c80", "#c00000", "#7030a0", "#FF00FF", "#FF9900"];
      for(var i = 0, htmls = []; i < datas.numberOfRows; i++){
        htmls.push("<tr>");
        for(var cells = items[i], j = cells.length -1 ; j >= 0; j--){
          var cell = cells[j];
          htmls.push("<td id='"+ cell.id+ "' name='"+ cell.name+ "' style='background:"+ (cell.state == "Occupied"? colors[cell.yPos-1]: "#d9d9d9")+ ";cursor:pointer;'>"+ cell.name.split("-")[1]+ "</td>");
        }
        htmls.push("</tr>");
      }
      $scope.obpWallContent = $sce.trustAsHtml(htmls.join(""));
      setTimeout(function(){
        $("#obp_wallContent td").each(function(){
          $(this).bind("click", function(){
            var name = $(this).attr("name"), id = $(this).attr("id");
            $rootScope.obpCellName = name;
            $rootScope.obpCellId = id;
            problemOutboundService.bindCell($rootScope.shipmentNo, name, function(){
              $state.go("main.problemOutboundDetail");
            });
          });
        });
      }, 300);
    });
  });
})();