!function(e){"function"==typeof define&&define.amd?define(e):e()}((function(){"use strict";function e(){return(e=Object.assign||function(e){for(var r=1;r<arguments.length;r++){var t=arguments[r];for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])}return e}).apply(this,arguments)}window.upLoadFile=void 0;var r=UE.getEditor("editor",NKC.configs.ueditor.activityConfigs);function t(e,r){clearErrTips(r);var t=$(e).val(),n="";if(!t)return n+="请选择时间",errInfoTips(n,r),!1;var o=(new Date).getTime(),i=new Date(t).getTime();return!(parseInt(o)>parseInt(i))||(n+="不得早于当前时间",errInfoTips(n,r),!1)}function n(e,r,t){var n=new Date(e).getTime(),o=new Date(r).getTime();return!(parseInt(o)<=parseInt(n))||(errInfoTips("结束时间不得早于或等于开始时间",t),!1)}function o(){var e=new FormData;e.append("file",upLoadFile),$.ajax({url:"/poster",method:"POST",cache:!1,data:e,headers:{FROM:"nkcAPI"},dataType:"json",contentType:!1,processData:!1}).done((function(e){var r='<img style="width:100%" id="poster" srcs="'+e.picname+'" src="/poster/'+e.picname+'">';$("#exampleImg").html(r),screenTopAlert("海报上传成功")})).fail((function(e){sweetError(JSON.parse(e.responseText))}))}window.ue=r,$.getJSON("../location.json",(function(e){for(var r=0;r<e.length;r++){var t={id:e[r].id,name:e[r].cname,level:e[r].level,parentId:e[r].upid};e[r]=t}$(".bs-chinese-region").chineseRegion("source",e),$("#location").val($("#location").attr("data"))})),$("#inputFile").on("change",(function(){var e=$("#inputFile")[0].files[0];e&&(window.upLoadFile=e),o()})),window.customForm=void 0,NKC.modules.customForm&&(window.customForm=new NKC.modules.customForm),$(document).ready((function(){customForm.init()})),e(window,{ue:r,customForm:customForm,insertToImage:function(e){var r='<img id="poster" style="width:100%;" srcs="" src="'+e+'">';$("#exampleImg").html(r)},submitRelease:function(){var e=$("#activityTitle").val().trim();if(clearErrTips("#titleErr"),e&&0!=e.length){var o=$("#enrollStartTime").val(),i=$("#enrollEndTime").val(),a=$("#holdStartTime").val(),s=$("#holdEndTime").val();if(t("#enrollEndTime","#enrollEndTimeErr")&&n(o,i,"#enrollEndTimeErr")&&t("#holdEndTime","#holdEndTimeErr")&&n(a,s,"#holdEndTimeErr")){var l=$("#location").val();if(clearErrTips("#locationErr"),!l)return errInfoTips("请选择地区","#locationErr");var c=$("#address").val();if(clearErrTips("#addressErr"),!c)return errInfoTips("请填写详细地址","#addressErr");c=l+c,clearErrTips("#posterErr");var d=$("#poster").attr("srcs");if(0==d.length)return errInfoTips("请上传一张海报","#posterErr");var p=$("#sponsor").val();if(clearErrTips("#sponsorErr"),!p.length)return errInfoTips("请填写主办方名称","#sponsorErr");var u=$("#contactNum").val().trim();if(clearErrTips("#contactNumErr"),""==u)return errInfoTips("请填写联系电话","#contactNumErr");var m=$("#activityPartNum").val();clearErrTips("#activityPartNumErr");if("0"!=m&&!/^\+?[1-9][0-9]*$/.test(m))return errInfoTips("请填写正确数字","#activityPartNumErr");for(var f=$("#continueTofull").is(":checked"),v=customForm.outputJSON(),T=0;T<v.length;T++){if(0===v[T].infoName.length)return errInfoTips("表单名称不可为空！");if(v[T].errorInfo&&v[T].errorInfo.length>0)return errInfoTips(v[T].errorInfo)}var E=r.getContent();E=common.URLifyHTML(E);var h={activityType:"release",activityTitle:e,limitNum:m,enrollStartTime:new Date(o).toJSON(),enrollEndTime:new Date(i).toJSON(),holdStartTime:new Date(a).toJSON(),holdEndTime:new Date(s).toJSON(),address:c,sponsor:p,contactNum:u,posterId:d,description:E,conditions:v,continueTofull:f};geid("save").disabled=!0,nkcAPI("/activity/release","POST",{post:h}).then((function(e){openToNewLocation("/activity")})).catch((function(e){screenTopWarning(e||e.error),geid("save").disabled=!1}))}}else errInfoTips("请填写活动标题","#titleErr")},timeStampCheck:t,deadlineCheck:n,postPoster:function(){},choosePoster:function(){},savePoster:o,addOneForm:function(){$("#conditions").append('<div class="form-inline"><input class="form-control" id="infoName" type="text" value="" placeholder="名称">&nbsp;<input class="form-control" id="infoDesc" type="text" value="" placeholder="提示信息">&nbsp;<button class="btn btn-default" onclick="delOneForm(this)"><i class="fa fa-trash"></i></button></div>')},delOneForm:function(e){$(e).parent().remove()}})}));