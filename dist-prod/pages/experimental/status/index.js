!function(t){"function"==typeof define&&define.amd?define(t):t()}((function(){"use strict";function t(){return(t=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(t[a]=n[a])}return t}).apply(this,arguments)}function e(){$(".time").datetimepicker({language:"zh-CN",format:"yyyy-mm",autoclose:1,todayHighlight:1,startView:4,minView:3,forceParse:0})}function n(t){var e=t.type;"custom"===e?$("#custom").show():($("#custom").hide(),a(e))}function a(t){var e="/e/status?type="+t;"custom"===t&&(e="/e/status?type="+t+"&time1="+$('#custom input[name="time1"]').val()+"&time2="+$('#custom input[name="time2"]').val());nkcAPI(e,"GET",{}).then((function(t){i(t.results)})).catch((function(t){screenTopWarning(t.error||t)}))}function i(t){var e=echarts.init(document.getElementById("main")),n={title:{text:""},tooltip:{trigger:"axis"},legend:{data:["发表文章","发表回复","用户注册"]},xAxis:{data:t.x},yAxis:{},series:[{name:"发表文章",type:"line",stack:"发表文章",data:t.threadsData},{name:"发表回复",type:"line",stack:"发表回复",data:t.postsData},{name:"用户注册",type:"line",stack:"用户注册",data:t.usersData}]};e.setOption(n)}$((function(){e(),n({type:"today"});var t=$('input:radio[name="statusType"]');t.on("ifChanged",(function(){for(var e=0;e<t.length;e++){var a=t.eq(e);if(a.prop("checked"))n({type:a.attr("data-type")})}}))})),t(window,{initTime:e,getResults:n,reset:function(){$('#custom input[name="time1"]').val(""),$('#custom input[name="time2"]').val("")},getData:a,display:i,getLogs:function(){nkcAPI("/e/status?type=logs","GET").then((function(t){console.log(t)})).catch((function(t){sweetError(t)}))}})}));