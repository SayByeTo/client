/**
 * Created by thoma.bian on 2017/5/10.
 */

(function () {
  'use strict';
  angular.module('myApp').controller("icqaAndonCtl", function ($scope, $window,ICQABaseService,icqaAndonService) {
    $("#noRemarksId").addClass("buttonColorGray");
    $scope.state="";
    var columns = [
      {field: "anDonMasterType", headerTemplate: "<span translate='问题类型'></span>", template: function(item){
        return item.anDonMasterType? item.anDonMasterType.description: "";
      }},
      {field: "storageLocation", headerTemplate: "<span translate='货位/扫描枪'></span>", template: function(item){
        return item.storageLocation? item.storageLocation.name: "";
      }},
      {field: "modifiedBy", headerTemplate: "<span translate='触发人员'></span>"},
      {field: "modifiedDate",headerTemplate: "<span translate='触发时间'></span>", template: function (item) {
        return item.modifiedDate ? kendo.format("{0:yyyy-MM-dd HH:mm:ss}", kendo.parseDate(item.modifiedDate)) : "";
      }},
      {field: "anDonMasterPeSolve", headerTemplate: "<span translate='处理方式'></span>",
        template: function (item) {
           return item.anDonMasterPeSolve ? item.anDonMasterPeSolve.name:"";
        },
        editor: function (container, options) {
         $('<input id="anDonMasterPeSolveId" name="' + options.field + '"  />')
          .appendTo(container)
          .kendoComboBox({
            dataTextField: "name",
            dataValueField: "id"
           });
          icqaAndonService.selectAndonType(options.model.anDonMasterType.id,function(data){
            var grid = $("#anDonMasterPeSolveId").data("kendoComboBox");
            grid.setDataSource(new kendo.data.DataSource({data: data}));
          });
        }
      },
      {field: "solveBy", headerTemplate: "<span translate='处理人员'></span>", editor: function (container, options) {
        $('<input  name="' + options.field + '" class="k-textbox" />').appendTo(container);
       }
      }];
    $scope.option={"state":$scope.state,"anDonMasterType":"","seek": $scope.seekContent,"stateDate":$scope.stateDate,"endDate":$scope.endDate};

    icqaAndonService.getAndonMasters($scope.option,function(data){
      $scope.icqaAndonGridOption=ICQABaseService.editGrid({
        columns: columns,
          dataSource:{
            data:data,
            schema: {
              model: {
                id: "id",
                fields: {
                  //"anDonMasterType.description": { editable: false},
                  //"storageLocation.name":{editable:false},
                  "modifiedBy" :{ editable: false },
                  "modifiedDate" :{ editable: false}
                }
              }
            },
            change:function(e){
              if(e.item) {
                var anDonMasterPeSolve = e.items[0].anDonMasterPeSolve;
                var dataMap = {"id": e.items[0].id, "state": $scope.state, "solveBy": e.items[0].solveBy};
                anDonMasterPeSolve && (dataMap.anDonMasterPeSolveId = anDonMasterPeSolve.id);
                icqaAndonService.updateAndonMasters(dataMap, function (data) {
                });
              }
            }
          },
        height: $(document.body).height() - 210
      });
    });

    $scope.icqaAndonAllSearch = function(){
      $("#noRemarksId").addClass("buttonColorGray");
      $("#allContentId").removeClass("buttonColorGray");
      $scope.state ="";
      $scope.option={"state":$scope.state,"anDonMasterType":"","seek": $scope.seekContent,"stateDate":$scope.stateDate,"endDate":$scope.endDate};
      icqaAndonService.getAndonMasters($scope.option,function(data){
        var grid = $("#icqaAndonGrid").data("kendoGrid");
        grid.setDataSource(new kendo.data.DataSource({data: data}));
      })
    };

    $scope.icqaAndonNoRemarksSearch = function(){
      $("#allContentId").addClass("buttonColorGray");
      $("#noRemarksId").removeClass("buttonColorGray");
      $scope.state ="undisposed";
      $scope.option={"state":$scope.state,"anDonMasterType":"","seek": $scope.seekContent,"stateDate":$scope.stateDate,"endDate":$scope.endDate};
      icqaAndonService.getAndonMasters($scope.option,function(data){
        var grid = $("#icqaAndonGrid").data("kendoGrid");
        grid.setDataSource(new kendo.data.DataSource({data: data}));
      })
    };

    $scope.icqaAndonSearch = function(){
      $scope.option={"state":$scope.state,"anDonMasterType":"","seek": $scope.seekContent,"stateDate":$scope.stateDate,"endDate":$scope.endDate};
      icqaAndonService.getAndonMasters($scope.option,function(data){
        var grid = $("#icqaAndonGrid").data("kendoGrid");
        grid.setDataSource(new kendo.data.DataSource({data: data}));
      })
    };
   })
})();