/**
 * Created by frank.zhou on 2017/04/14.
 * Updated by frank.zhou on 2017/04/17.
 */
(function(){
  "use strict";

  angular.module("myApp").service("commonService", function($http, $window, $translate, BACKEND_CONFIG){
    // grid请求
    function gridMushiny(options){
      return {
        dataSource: options.dataSource,
        selectable: options.selectModel || "row",
        height: options.height || $(document.body).height() - 191,
        sortable: true,
        scrollable: true,
        pageable: {
          pageSize: 50,
          pageSizes: [50, 100, 200],
          previousNext: true,
          numeric: true,
          input: false,
          info: true
        },
        columns: options.columns,
        detailInit: options.detailInit
      };
    }

    // 对话框
    function dialogMushiny(window, options){
      window.setOptions({
        width: options.width || 300,
        height: options.height || 105,
        title: options.title || "",
        content: {
          url: options.url || "modules/common/templates/"+ (options.type || "delete")+ "Window.html"
        },
        open: function(){
          options.open && options.open(this);
        }
      });
      window.refresh();
      window.center();
      window.open();
    }

    // ajax请求(同步)
    function ajaxSync(options){
      // 临时
      var preUrl = "";
      if(options.url.indexOf("http://") >= 0) preUrl = "";
      else if(options.url.indexOf(".json") >= 0) preUrl = "http://localhost:8080/";
      else if(options.url.indexOf("masterdata") >= 0) preUrl = BACKEND_CONFIG.masterData;
      else if(options.url.indexOf("andon") >= 0) preUrl = BACKEND_CONFIG.andon;
      else if(options.url.indexOf("icqa") >= 0) preUrl = BACKEND_CONFIG.icqa;
      else if(options.url.indexOf("inbound-problem") >= 0) preUrl = BACKEND_CONFIG.inboundProblem;
      else if(options.url.indexOf("inbound") >= 0) preUrl = BACKEND_CONFIG.inbound;
      else if(options.url.indexOf("internal") >= 0) preUrl = BACKEND_CONFIG.internalTool;
      else if(options.url.indexOf("outboundproblem") >= 0) preUrl = BACKEND_CONFIG.outboundProblem;
      else if(options.url.indexOf("outbound") >= 0) preUrl = BACKEND_CONFIG.outbound;
      else if(options.url.indexOf("report") >= 0) preUrl = BACKEND_CONFIG.report;
      else if(options.url.indexOf("system") >= 0) preUrl = BACKEND_CONFIG.system;
      else preUrl = BACKEND_CONFIG.main;
      //
      $.ajax({
        type: options.type || "GET",
        url: preUrl+ options.url,
        cache: false,
        async: (options.async!=null? options.async: false),
        dataType: options.dataType || "json",
        contentType: options.contentType || "application/json;charset=utf-8",
        data: options.data || {},
        beforeSend: function(XMLHttpRequest){
          XMLHttpRequest.setRequestHeader("Warehouse", $window.localStorage["warehouseId"]);
          XMLHttpRequest.setRequestHeader("Authorization", "Bearer "+ $window.localStorage["accessToken"]);
        },
        success: function(data){
          options.success && options.success(data);
        },
        error: function(){
          console.log("ajax error", arguments);
        }
      });
    }

    // ajax请求(异步）
    function ajaxAsync(options){
      // 临时
      var preUrl = "";
      if(options.url.indexOf("http://") >= 0) preUrl = "";
      else if(options.url.indexOf(".json") >= 0) preUrl = "http://localhost:8080/";
      else if(options.url.indexOf("masterdata") >= 0) preUrl = BACKEND_CONFIG.masterData;
      else if(options.url.indexOf("andon") >= 0) preUrl = BACKEND_CONFIG.andon;
      else if(options.url.indexOf("icqa") >= 0) preUrl = BACKEND_CONFIG.icqa;
      else if(options.url.indexOf("inbound-problem") >= 0) preUrl = BACKEND_CONFIG.inboundProblem;
      else if(options.url.indexOf("inbound") >= 0) preUrl = BACKEND_CONFIG.inbound;
      else if(options.url.indexOf("internal") >= 0) preUrl = BACKEND_CONFIG.internalTool;
      else if(options.url.indexOf("outboundproblem") >= 0) preUrl = BACKEND_CONFIG.outboundProblem;
      else if(options.url.indexOf("outbound") >= 0) preUrl = BACKEND_CONFIG.outbound;
      else if(options.url.indexOf("report") >= 0) preUrl = BACKEND_CONFIG.report;
      else if(options.url.indexOf("system") >= 0) preUrl = BACKEND_CONFIG.system;
      else preUrl = BACKEND_CONFIG.main;
      //
      kendo.ui.progress($(document.body), true); // 加载请求
      $http({
        url: preUrl+ options.url,
        method: options.method || "GET",
        headers: {
          "Content-Type": options.contentType || "application/json;charset=utf-8",
          "Warehouse": $window.localStorage["warehouseId"],
          "Authorization": "Bearer "+ $window.localStorage["accessToken"]
        },
        data: options.data || {}
      }).then(function(datas){
        kendo.ui.progress($(document.body), false); // 结束请求
        options.success && options.success(datas);
      }, function(datas){
        kendo.ui.progress($(document.body), false); // 结束请求
        if(options.error)
          options.error(datas);
        else{
          var win = $("#mushinyWindow").data("kendoWindow");
          dialogMushiny(win, {width: 320, height: 160, type: "warn", open: function(){
            setTimeout(function(){
              $("#warnContent").html($translate.instant(datas.data.message))
            }, 0);
          }});
        }
      });
    }

    // ajax请求
    function ajaxMushiny(options){
      options.async == null && (options.async = true); // 默认异步
      if(options.async) this.ajaxAsync(options);
      else this.ajaxSync(options);
    }

    return {
      gridMushiny: gridMushiny,
      dialogMushiny: dialogMushiny,
      ajaxSync: ajaxSync,
      ajaxAsync: ajaxAsync,
      ajaxMushiny: ajaxMushiny
    };
  });
})();