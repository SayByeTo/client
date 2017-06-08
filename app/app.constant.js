/**
 * Created by frank.zhou on 2017/04/14.
 * Updated by frank.zhou on 2017/06/01.
 */
(function(){
  "use strict";

  angular
    .module("myApp")
    .constant("BACKEND_CONFIG", {
      andon: "http://192.168.1.201:11008/",
      icqa: "http://192.168.1.201:11005/",
      inbound: "http://192.168.1.201:11003/",
      inboundProblem: "http://192.168.1.201:11009/",
      internalTool: "http://192.168.1.201:11007/",
      login: "http://192.168.1.201:8001/",
      main: "http://192.168.1.201:11000/",
      masterData: "http://192.168.1.201:11002/",
      outbound: "http://192.168.1.201:11004/",
      outboundProblem: "http://192.168.1.201:11010/",
      report: "http://192.168.1.201:11006/",
      system: "http://192.168.1.201:11001/"
    });
})();