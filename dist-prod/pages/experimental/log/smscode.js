!function(e){"function"==typeof define&&define.amd?define(e):e()}((function(){"use strict";!function(){function e(e,t){var n,a={"y+":t.getFullYear().toString(),"M+":(t.getMonth()+1).toString(),"d+":t.getDate().toString(),"H+":t.getHours().toString(),"m+":t.getMinutes().toString(),"s+":t.getSeconds().toString()};for(var i in a)(n=new RegExp("("+i+")").exec(e))&&(e=e.replace(n[1],1==n[1].length?a[i]:a[i].padStart(n[1].length,"0")));return e}var t=$("#timeRange").attr("stime"),n=$("#timeRange").attr("etime");laydate.render({elem:"#timeRange",format:"yyyy-M-d H:m:s",value:t&&n?e("yyyy-M-d H:m:s",new Date(parseInt(t)))+" - "+e("yyyy-M-d H:m:s",new Date(parseInt(n))):"",type:"datetime",range:!0,done:function(e){$("#timeRange").val(e)},ready:function(){if(window.screen.width<=480){var e="280px";window.screen.height<600&&(e="-5px",$(".layui-laydate-content").css({padding:"5px 10px"})),$(".layui-laydate-range").css({left:"50%",top:e,marginLeft:"-137px",width:"274px"}),$(".layui-laydate-main").css({display:"block"})}}}),$("#search").on("click",(function(){var e=($("#timeRange").val()||"").split(" - "),t={sTime:new Date(e[0]).getTime(),eTime:new Date(e[1]).getTime(),ip:$("#ip").val()||"",optype:$("#optype").val()||"",nationCode:$("#nationCode").val()||"",phonenumber:$("#phonenumber").val()||""};NKC.methods.visitUrl("/e/log/smscode?c="+NKC.methods.strToBase64(JSON.stringify(t)))}))}()}));
