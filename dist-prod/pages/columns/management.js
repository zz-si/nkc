!function(n){"function"==typeof define&&define.amd?define(n):n()}((function(){"use strict";function n(){return(n=Object.assign||function(n){for(var e=1;e<arguments.length;e++){var o=arguments[e];for(var t in o)Object.prototype.hasOwnProperty.call(o,t)&&(n[t]=o[t])}return n}).apply(this,arguments)}$((function(){window.CommonModal||(window.CommonModal=new NKC.modules.CommonModal)})),n(window,{disabledColumn:function(n,e,o){window.CommonModal.open((function(){confirm("确定要执行该操作？")&&nkcAPI("/m/"+n+"/disabled","POST",{type:e,index:o}).then((function(){screenTopAlert("操作成功")})).catch((function(n){screenTopWarning(n)}))}),{title:"专栏",data:[{_id:"reason",dom:"textarea",rows:5,label:"请输入屏蔽原因：",value:"",type:"text",placeholder:""}]})},managementColumn:function(n,e,o){var t="POST",a="/m/"+n+"/disabled",i={type:e,disabled:o};o?window.CommonModal.open((function(n){if(!n[0].value)return screenTopWarning("请填写屏蔽原因");i.reason=n[0].value,nkcAPI(a,t,i).then((function(){window.CommonModal.close(),screenTopAlert("操作成功")})).catch((function(n){screenTopWarning(n)}))}),{title:"专栏",data:[{dom:"textarea",rows:5,label:"请输入屏蔽原因：",value:"",type:"text",placeholder:""}]}):nkcAPI(a,t,i).then((function(){screenTopAlert("操作成功")})).catch((function(n){screenTopWarning(n)}))}})}));
