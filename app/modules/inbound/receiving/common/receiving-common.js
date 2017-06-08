/**
 * Created by 123 on 2017/4/20.
 */
// 对话框

(function(){
    "use strict";
    angular.module("myApp").service("receiving_commonService", function($http, $window, $translate, BACKEND_CONFIG,commonService, INBOUND_CONSTANT){
        var inputcrrentid;
        var selectedArrays = [];
        var selectedAreaArrays = [];
        function receiving_dialog(window, options,callBackMethod){
            window.setOptions({
                width: options.width || 300,
                height: options.height || 105,
                title: options.title || "",
                content: {
                    url: options.url || "modules/common/templates/"+ (options.type || "delete")+ "Window.html"
                },
                open: function(){
                    options.open && options.open(this);
                },
                close:callBackMethod
            });
            window.refresh();
            window.center();
            window.open();
        }

        function receiving_tip_dialog(window_div_id,options) {
            $('#'+window_div_id).parent().addClass("myWindow"); // title css
            var win = $("#"+window_div_id).data("kendoWindow");
            win.setOptions({
                    width: options.width||500,
                    height: options.height||400,
                    title: options.title,
                    open: options.open,
                    close:options.close
                }
            );
            win.center();
            win.open();
        }

        function receiving_tip_dialog_normal(window_div_id,options) {
            $('#'+window_div_id).parent().addClass("mySelect"); // title css
            var win = $("#"+window_div_id).data("kendoWindow");
            win.setOptions({
                    width: options.width||500,
                    height: options.height||400,
                    title: options.title,
                    open: options.open,
                    close:options.close
                }
            );
            win.center();
            win.open();
        }

        /**根据数据动态生成div表格
         *  @param rootdiv 生成div表格的容器
         * @param row 表格的行数
         * @param column 表格的列数
         * @param flag动态生成的div加标志位
         * @param ispercentage 宽高单位是否为百分比
         * @param tablespace 分割线距离
         */
        function fillGrid(rootdiv,row,flag,temlateClass,dataresource) {
            if(rootdiv==null||rootdiv==undefined||row<1)return;
            var count  = "";
            for(var key in dataresource){
                var length = dataresource[key][0];
                var multi = 100-length;
                var yushu = multi%length;
                var width = parseInt(multi/length);
                var leftrightspace = (yushu+1)/2;
                var num = 0;
                count += "<div style='float: left;width:100%;height:10%;margin-top: 6%'>";
                for (var j=0;j<length;j++){
                    if(num===0){
                        count +="<div class='"+temlateClass+"' id='"+flag+key+num+"'"+
                            "style='width:"+width+"%;height:100%;margin-left: "+leftrightspace+"%'> " +
                            "<span id='"+flag+key+dataresource[key][j]+"' style='color: #FFFFFF;line-height: 2;font-size:large'></span> " +
                            "</div>";
                    }else if(num===dataresource[key]-1){
                        count +="<div class='"+temlateClass+"' id='"+flag+key+num+"'"+
                            "style='width:"+width+"%;height:100%;margin-right: "+leftrightspace+"%'> " +
                            "<span id='"+flag+key+dataresource[key][j]+"' style='color: #FFFFFF;line-height: 2;;font-size:large'></span> " +
                            "</div>";
                    }else{
                        count +="<div class='"+temlateClass+"' id='"+flag+key+num+"'"+
                            "style='width:"+width+"%;height:100%;margin-left: 1%'> " +
                            "<span id='"+flag+key+dataresource[key][j]+"' style='color: #FFFFFF;line-height: 2;;font-size:large'></span> " +
                            "</div>";
                    }
                    num++;
                }
                count+="</div>";
            }
            rootdiv.innerHTML = count;
            // $('.'+temlateClass).each(function(){
            //     $(this).click(function(){
            //         if(scan_product_info===false)return;
            //         thisid = this.id;
            //         $('.'+temlateClass).each(function(){
            //             if(this.id!=thisid){
            //                 this.style.backgroundColor = '#8c8c8c';
            //             }
            //         })
            //         receiving_commonService.receiving_tip_dialog_normal("keyboard_window",{
            //             width:600,
            //             height:400,
            //             title:INBOUND_CONSTANT.INPUTNUM,
            //             open:function () {
            //                 receiving_commonService.keyboard_fillGrid($("#keyboard_keys"),2,5,"keyboard","keyboard_layout_item");
            //             },
            //             close:function () {
            //                 $("#keyboard_inputer").value = "";
            //             }
            //         });
            //     })
            // })
        }

		function findStorageLocation(stoName,resources){
            var length = getObjCount(resources);
            for(var i=0;i<length;i++){
                if(resources[i].name===stoName){
                    console.log("xpos-->"+resources[i].xpos+"/ypos-->"+(resources[i].ypos-1));
                    return "receiving_pod_layout"+resources[i].xpos+(resources[i].ypos-1);
                }
            }
        }
		
        function autoClose(e,window_div_id) {
            autoAddEvent(e);
            var window = $("#"+window_div_id).data("kendoWindow");
            window.close();
        }
        function CloseWindowByBtn(window_div_id) {
            var window = $("#"+window_div_id).data("kendoWindow");
            window.close();
        }
        function autoAddEvent(event) {
            var keyCode = window.event? event.keyCode: event.which;
            return keyCode == 13 ? true:false;
        }
        
        function grid_BayType(typearrays,column,row) {
            //计算行数
            var isSELECT = false;
            var SELECTID;
            var countNum = 0;
            var root_div = $("#select_bin_grid");
            var typearraylength = getObjCount(typearrays);
            var count  = "";
            for (var i = 0;i<row;i++){
                countNum = i*column;
                count += "<div style='float: left;margin-left:8%;width:80%;height:25%'>"
                for (var j=0;j<column;j++){
                    var num = countNum+j;
                    console.log("num-->"+num);
                    if(num===typearraylength){
                        break;
                    }else{
                        count +="<div class='box_shadow_with_radius' id='bin_item"+num+"'"+
                            "<span id='bin_item_title' style='font-size: 24px;line-height: 80px;color: #FFFFFF;'>"+typearrays[num].name+"</span> " +
                            "</div>";
                        continue;
                    }
                }
                count+="</div>";
            }
            root_div.html(count);
            $('.box_shadow_with_radius').each(function(){
                $(this).click(function(){
                    var index = this.id.replace('selected_','').substring(8);
                    if(this.id.substring(0,this.id.indexOf("bin_item"))==='selected_'){//已经选中
                        this.id = this.id.replace('selected_','');
                        document.getElementById(this.id).style.backgroundColor = '#E0EEEE';
                        removeByValue(selectedArrays,typearrays[index]);
                    }else{//未选中
                        this.style.backgroundColor = '#00a2eb';
                        this.id='selected_'+this.id;
                        selectedArrays.push(typearrays[index]);
                    }
                })
            })
        }

        function grid_AreaList(typearrays,column,row) {
            //计算行数
            var isSELECT = false;
            var SELECTID;
            var countNum = 0;
            var root_div = $("#select_area_grid");
            var typearraylength = getObjCount(typearrays);
            var count  = "";
            for (var i = 0;i<row;i++){
                countNum = i*column;
                count += "<div style='float: left;margin-left:8%;width:80%;height:25%'>"
                for (var j=0;j<column;j++){
                    var num = countNum+j;
                    console.log("num-->"+num);
                    if(num===typearraylength){
                        break;
                    }else{
                        count +="<div class='box_shadow_with_radius' id='area_item"+num+"'"+
                            "<span id='bin_area_title' style='font-size: 24px;line-height: 80px;color: #FFFFFF;'>"+typearrays[num].name+"</span> " +
                            "</div>";
                        continue;
                    }
                }
                count+="</div>";
            }
            root_div.html(count);
            $('.box_shadow_with_radius').each(function(){
                $(this).click(function(){
                    var index = this.id.replace('selected_','').substring(8);
                    if(this.id.substring(0,this.id.indexOf("area_item"))==='selected_'){//已经选中
                        this.id = this.id.replace('selected_','');
                        document.getElementById(this.id).style.backgroundColor = '#E0EEEE';
                        removeByValue(selectedAreaArrays,typearrays[index]);
                    }else{//未选中
                        this.style.backgroundColor = '#00a2eb';
                        this.id='selected_'+this.id;
                        selectedAreaArrays.push(typearrays[index]);
                    }
                })
            })
        }
        
        function keyboard_fillGrid(rootdiv,row,column,flag,temlateClass) {
            if(rootdiv==null||rootdiv==undefined||row<1||column<1)return;
            var count  = "";
            for (var i = 0;i<row;i++){
                count += "<div style='float: left;width:100%;height:45%;margin-top: 2%'>"
                for (var j=0;j<column;j++){
                    if(i==0){
                        count +="<div class='"+temlateClass+"' id='"+flag+i+j+"'"+
                            "style='width:18%;height:97.5%;'> " +
                            "<span id='"+flag+i+j+"_span' style='color: #0f0f0f;font-size: 48px;line-height: 2'>"+(j+1)+"</span> " +
                            "</div>";
                    }else if(i==1){
                        if(j==(column-1)){
                            count +="<div class='"+temlateClass+"' id='"+flag+i+j+"'"+
                                "style='width:18%;height:97.5%;'> " +
                                "<span id='"+flag+i+j+"_span' style='color: #0f0f0f;font-size: 48px;line-height: 2'>0</span> " +
                                "</div>";
                        }else{
                            count +="<div class='"+temlateClass+"' id='"+flag+i+j+"'"+
                                "style='width:18%;height:97.5%;'> " +
                                "<span id='"+flag+i+j+"_span' style='color: #0f0f0f;font-size: 48px;line-height: 2'>"+(column+j+1)+"</span> " +
                                "</div>";
                        }
                    }
                }
                count+="</div>";
            }
            rootdiv.html(count);
            $('.'+temlateClass).each(function(){
                $(this).click(function(){
                    if(inputcrrentid===undefined||inputcrrentid===null){
                        return;
                    }
                    var numsinput = document.getElementById(inputcrrentid);
                    var span = $("#"+this.id).children("span");
                    if(numsinput.value<1){
                        if(span.text()==='0'){
                            return;
                        }
                    }
                    numsinput.value = numsinput.value+span.text();
                })
            })
            // rootdiv.html(count);
        }
        function avatime_keyboard_fillGrid(rootdiv,row,column,flag,temlateClass,tableSpace,SpanFontSize) {
            if(rootdiv==null||rootdiv==undefined||row<1||column<1)return;
            var count  = "";
            for (var i = 0;i<row;i++){
                count += "<div style='float: left;width:100%;height:45%;margin-top: 2%'>"
                for (var j=0;j<column;j++){
                    if(i==0){
                        count +="<div class='"+temlateClass+"' id='"+flag+i+j+"'"+
                            "style='width:18%;height:97.5%;'> " +
                            "<span id='"+flag+i+j+"_span' style='color: #0f0f0f;font-size: "+SpanFontSize+"px;line-height: 2'>"+(j+1)+"</span> " +
                            "</div>";
                    }else if(i==1){
                        if(j==(column-1)){
                            count +="<div class='"+temlateClass+"' id='"+flag+i+j+"'"+
                                "style='width:18%;height:97.5%;'> " +
                                "<span id='"+flag+i+j+"_span' style='color: #0f0f0f;font-size: "+SpanFontSize+"px;line-height: 2'>0</span> " +
                                "</div>";
                        }else{
                            count +="<div class='"+temlateClass+"' id='"+flag+i+j+"'"+
                                "style='width:18%;height:97.5%;'> " +
                                "<span id='"+flag+i+j+"_span' style='color: #0f0f0f;font-size: "+SpanFontSize+"px;line-height: 2'>"+(column+j+1)+"</span> " +
                                "</div>";
                        }
                    }
                }
                count+="</div>";
            }
            rootdiv.html(count);
            $('.'+temlateClass).each(function(){
                $(this).click(function(){
                    if(inputcrrentid===undefined||inputcrrentid===null){
                        return;
                    }
                    var avainput = document.getElementById(inputcrrentid);
                    var span = $("#"+this.id).children("span");
                    if(avainput.value<1){
                        if(span.text()==='0'){
                            return;
                        }
                    }
                    avainput.value = avainput.value+span.text();
                })
            })
        }
        
        function deleteinput(inputid) {
            if(inputid===null||inputid===undefined){
                return;
            }
            console.log("inputer.valueType-->"+typeof $("#"+inputid).val());
            if('number'===typeof inputid){
                if($("#"+inputid).val()<=0){
                    return;
                }else{
                    $("#"+inputid).val($("#"+inputid).val()-1);
                }
            }
            if('string'=== typeof inputid){
                var inputlength = $("#"+inputid).val().length;
                if(inputlength<=0){
                    $("#"+inputid).val("");
                }else{
                    $("#"+inputid).val($("#"+inputid).val().substring(0,inputlength-1));
                }
            }
        }
        
        function reveive_ToteFillGrid(rootdiv,totalnum,column,flag,temlateClass,tableSpace,SpanFontSize) {
            if(rootdiv==null||rootdiv==undefined||row<1||column<1)return;
            var count  = "";
            var row = parseInt(totalnum/3);
            var yushu = parseInt(totalnum%3);
            var isYushu = false;
            var num = 0;
            if(yushu>0){
                row=row+1;
                isYushu = true;
            }
            for (var i = 0;i<row;i++){
                count += "<div style='float: left;width:100%;height:45%;margin-top: 2%'>"
                for (var j=0;j<3;j++){
                    count +="<div class='"+temlateClass+"' style='width:32%;height:97.5%;margin-left: 1%'> " +
                        "<span class='receiveToToteSpan'>"+num+j+"</span>"+
                        "<div class='receiveToToteInnerDiv' id='"+flag+i+j+"'>" +
                        "<span ng-show='scanbadcib==='0'" +
                        "class='receiving-uptopod-label' style='background-color:red ;'>"+j+"</span>" +
                        "</div>"+
                        "</div>";
                }
                if(i===(row-1)&&isYushu){
                    for (var j=0;j<yushu;j++){
                        count +="<div class='"+temlateClass+"' id='"+flag+i+j+"'"+
                            "style='width:32%;height:97.5%;margin-left: 1%'> " +
                            "<span class='receiveToToteSpan'>"+num+j+"</span>"+
                            "<div class='receiveToToteInnerDiv'>" +
                            "<span ng-show='scanbadcib==='0'" +
                            "class='receiving-uptopod-label' style='background-color:red ;'>"+j+"</span>" +
                            "</div>"+
                            "</div>";
                    }
                }
                count+="</div>";
                num++;
            }
            rootdiv.html(count);
            $('.'+temlateClass).each(function(){
                $(this).click(function(){
                    if(inputcrrentid===undefined||inputcrrentid===null){
                        return;
                    }
                    var avainput = document.getElementById(inputcrrentid);
                    var span = $("#"+this.id).children("span");
                    if(avainput.value<1){
                        if(span.text()==='0'){
                            return;
                        }
                    }
                    avainput.value = avainput.value+span.text();
                });
            });
        }

        function getavatimeid(currentid) {
            inputcrrentid = currentid;
        }

        function getLocationTypes(callback) {
            callback:callback(selectedArrays,selectedAreaArrays);
        }
        function removeByValue(arrays,val){
            for(var i=0; i<arrays.length; i++) {
                if(arrays[i] == val) {
                    arrays.splice(i, 1);
                    break;
                }
            }
        }

        function getObjCount(obj){
            var objType = typeof obj;
            if(objType == "string"){
                return obj.length;
            }else if(objType == "object"){
                var objLen = 0;
                for(var i in obj){
                    objLen++;
                }
                return objLen;
            }
            return false;
        }
        
        function checkDateIsValid(date) {
            var currentDate = new Date();
            var year = parseInt(date.substring(0,4));
            var month = parseInt(date.substring(4,6));
            var year = parseInt(date.substring(6,8));
            if(year<currentDate.getFullYear()){
                return "输入年份不得小于当前年份";
            }else{

            }
        }
        //自动匹配扫的是DN还是商品编码
        function isDN(str) {
            var indexOne = str.indexOf("D");
            var indexTwo = str.indexOf("N");
            var length = getObjCount(str);
            console.log("D--->"+indexOne);
            console.log("N--->"+indexTwo);
            if(indexOne===0&&indexTwo===1&&length===17){
                return true;
            }else{
                return false;
            }
        }
        function closePopWindow(windowid) {
            var window = $("#"+windowid).data("kendoWindow");
            console.log(""+windowid+"/window-->"+window);
            window.close();
        }

        return {
            receiving_dialog: receiving_dialog,
            receiving_tip_dialog:receiving_tip_dialog,
            autoAddEvent:autoAddEvent,
            autoClose:autoClose,
            keyboard_fillGrid:keyboard_fillGrid,
            CloseWindowByBtn:CloseWindowByBtn,
            receiving_tip_dialog_normal:receiving_tip_dialog_normal,
            avatime_keyboard_fillGrid:avatime_keyboard_fillGrid,
            getavatimeid:getavatimeid,
            reveive_ToteFillGrid:reveive_ToteFillGrid,
            grid_BayType:grid_BayType,
            getObjCount:getObjCount,
            closePopWindow:closePopWindow,
            fillGrid:fillGrid,
            getLocationTypes:function (callback) {
                callback(selectedArrays);
            },
            deleteinput:deleteinput,
            findStorageLocation:findStorageLocation,
            isDN :isDN
        };
    });
    })();