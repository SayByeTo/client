/**
 * Created by thoma.bian on 2017/5/10.
 */
(function () {
  'use strict';
  angular.module('myApp').controller("problemOutboundPickCtl", function ($scope, $sce, $state, problemOutboundService) {

    $scope.checkGoodsBack = true;
    $scope.checkGoodsEnd = false;

    $scope.pickingShow ='licensePlates';
    $scope.goodsContent = false;

    $scope.obpPick='allWallContent';

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
          htmls.push("<td style='background:"+ (cell.state == "Occupied"? colors[cell.yPos-1]: "#d9d9d9")+ ";cursor:pointer;'>"+ cell.name.split("-")[1]+ "</td>");
        }
        htmls.push("</tr>");
      }
      $scope.obpWallContent = $sce.trustAsHtml(htmls.join(""));
    });

   //请扫描拣货车牌
    $scope.pickingLicensePlates = function(e){
      var keycode = window.event ? e.keyCode : e.which;
      if (keycode == 13) {
        $scope.obpPick='pickCarContent';
        $scope.pickingShow = 'checkGoodsNumber';
        // $scope.pickingLicensePlate="00000006AA02";
        // $scope.obpWallId = "obpWall01";
        problemOutboundService.scanPickingLicensePlate($scope.pickingLicensePlate,$scope.obpWallId,function(datas){
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
               htmls.push("<td style='background:"+ (cell.goodsInCell == true? colors[cell.yPos-1]: "#d9d9d9")+ ";cursor:pointer;'>"+ cell.name.split("-")[1]+ "<br>"+(cell.amountScanedProblem>0?cell.amountScanedProblem+"/"+cell.amountProblem:"")+"</td>");
            }
            htmls.push("</tr>");
          }
          $scope.obpPickCarContent = $sce.trustAsHtml(htmls.join(""));
         });
      }
    };

    //请检查并扫描商品
    $scope.checkGoods = function(e){
      var keycode = window.event ? e.keyCode : e.which;
      if (keycode == 13) {
       // $scope.checkGood ='142058949667550';
        $scope.obpPick='pickGoodsContent';
        problemOutboundService.checkScanGoods($scope.pickingLicensePlate,$scope.obpWallId,$scope.checkGood,function(datas) {
          for(var i = 0, items = []; i < datas.numberOfRows; i++){
            items[i] = datas.obpCellPositions.slice(i*10, i*10+ datas.numberOfColumns);
          }
          var colors = ["#00b050", "#66ffff", "#ffff00", "#ff7c80", "#c00000", "#7030a0", "#FF00FF", "#FF9900"];
          for(var i = 0, htmls = []; i < datas.numberOfRows; i++){
            htmls.push("<tr>");
            for(var cells = items[i], j = cells.length -1 ; j >= 0; j--){
              var cell = cells[j];
              var color="";
              if(cell.goodsInCell == true){
                if(cell.amountScanedProblem == cell.amountProblem){
                  color = "#92d050";
                }else {
                  color = colors[cell.yPos - 1];
                }
              }else{
                color = "#d9d9d9";
              }
              htmls.push("<td style='background:"+color+ ";cursor:pointer;'>"+ cell.name.split("-")[1]+ "<br>"+(cell.amountScanedProblem>0?cell.amountScanedProblem+"/"+cell.amountProblem:"")+"</td>");
            }
            htmls.push("</tr>");
          }
          $scope.obpPickGoodsContent = $sce.trustAsHtml(htmls.join(""));
        //   $scope.goodsContent = true;
        //   $scope.checkGoodsBack = false;
        //   $scope.checkGoodsEnd = true;
         })
      }
    };

    //返回
    $scope.returnBack = function(){
      $state.go("main.problemOutboundRead");
    };

    //结束
    $scope.checkGoodsEnds = function(){
      $("#assignmentEndsId").parent().addClass("windowTitle");
      $scope.assignmentEndsWindow.setOptions({
        width:800,
        height: 200,
        visible: false,
        actions: false
      });
      $scope.assignmentEndsWindow.center();
      $scope.assignmentEndsWindow.open();
    };

    //结束确定
    $scope.assignmentEndsSure = function(){
      $scope.assignmentEndsWindow.close();
      $state.go("main.problemOutboundRead");
    }

  }).controller("problemOutboundGoodsCtl", function ($scope, $state,$sce, problemOutboundService) {

    $scope.goodsContent = false;
    $scope.obpPick='allWallContent';
    // 放置有货 每行颜色
    problemOutboundService.problemCellPlaceGoods($scope.obpWallId, function(datas){
      //
      for(var i = 0, items = []; i < datas.numberOfRows; i++){
        items[i] = datas.obpCellPositions.slice(i*10, i*10+ datas.numberOfColumns);
      }
      //

      for(var i = 0, htmls = []; i < datas.numberOfRows; i++){
        htmls.push("<tr>");
        for(var cells = items[i], j = cells.length -1 ; j >= 0; j--){
          var cell = cells[j];
          htmls.push("<td style='background:#d9d9d9;cursor:pointer;'>"+ cell.name.split("-")[1]+ "</td>");
        }
        htmls.push("</tr>");
      }
      $scope.obpWallContent = $sce.trustAsHtml(htmls.join(""));
    });

    //请扫描拣货商品
    $scope.pickingLicensePlates = function(e){
      var keycode = window.event ? e.keyCode : e.which;
      if (keycode == 13) {
        $scope.obpPick='pickGoodsContent';
        $scope.pickingLicensePlate ='142058949667550';

        problemOutboundService.scanPickingGoods($scope.obpWallId,$scope.pickingLicensePlate,function(datas) {
          for(var i = 0, items = []; i < datas.numberOfRows; i++){
            items[i] = datas.obpCellPositions.slice(i*10, i*10+ datas.numberOfColumns);
          }
          var colors = ["#00b050", "#66ffff", "#ffff00", "#ff7c80", "#c00000", "#7030a0", "#FF00FF", "#FF9900"];
          for(var i = 0, htmls = []; i < datas.numberOfRows; i++){
            htmls.push("<tr>");
            for(var cells = items[i], j = cells.length -1 ; j >= 0; j--){
              var cell = cells[j];
              htmls.push("<td style='background:"+(cell.goodsInCell == true? colors[cell.yPos-1]: "#d9d9d9")+";cursor:pointer;'>"+ cell.name.split("-")[1]+ "</td>");
            }
            htmls.push("</tr>");
          }
          $scope.obpPickGoodsContent = $sce.trustAsHtml(htmls.join(""));
          $scope.goodsContent = true;
        })
      }
    };
    //返回
    $scope.returnBack = function(){
      $state.go("main.problemOutboundRead");
    };

  })
})();