!function(e){"function"==typeof define&&define.amd?define(e):e()}((function(){"use strict";function e(){return(e=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e}).apply(this,arguments)}var t=NKC.methods.getDataById("data").logs,n=new NKC.modules.CommonModal;$("#app").length&&new Vue({el:"#app",data:{version:"",description:"",submitting:!1,progress:0,appPlatForm:"android"},methods:{submit:function(){var e=this;Promise.resolve().then((function(){if(!e.appPlatForm)throw"请选择平台";if(!e.version)throw"请输入版本号";if(!e.description)throw"请输入更新说明";var t=document.getElementById("appInput");if(!t.files.length)throw"请选择安装包";var n=t.files[0],o=new FormData;return o.append("file",n),o.append("appPlatform",e.appPlatForm),o.append("appVersion",e.version),o.append("appDescription",e.description),e.submitting=!0,nkcUploadFile("/e/settings/app","POST",o,(function(t,n){e.progress=n}))})).then((function(){e.submitting=!1,sweetSuccess("发布成功")})).catch((function(t){sweetError(t),e.submitting=!1}))}}}),e(window,{logs:t,CommonModal:n,setStable:function(e,t){sweetQuestion("确定要执行当前操作？").then((function(){nkcAPI("/e/settings/app","PUT",{operation:"modifyStable",hash:e,stable:!!t}).then((function(){sweetSuccess("修改成功"),window.location.reload()})).catch(sweetError)})).catch((function(){}))},setDisabled:function(e,t){sweetQuestion("确定要执行当前操作？").then((function(){nkcAPI("/e/settings/app","PUT",{operation:"modifyDisabled",hash:e,disabled:!!t}).then((function(){sweetSuccess("修改成功"),window.location.reload()})).catch(sweetError)})).catch((function(){}))},edit:function(e){for(var o,i=0;i<t.length;i++)if(t[i].hash===e){o=t[i];break}o&&n.open((function(t){nkcAPI("/e/settings/app","PUT",{operation:"modifyVersion",hash:e,version:t[0].value,description:t[1].value}).then((function(){n.close(),sweetSuccess("修改成功"),window.location.reload()})).catch(sweetError)}),{title:"修改版本信息",data:[{dom:"input",label:"版本号",value:o.appVersion},{dom:"textarea",label:"更新说明",disabledKeyup:!0,value:o.appDescription}]})}})}));