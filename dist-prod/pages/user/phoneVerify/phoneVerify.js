!function(t){"function"==typeof define&&define.amd?define(t):t()}((function(){"use strict";new Vue({el:"#app",data:{statu:"wait",time:0,code:"",complete:!1},methods:{sendSmsCode:function(){var t=this;t.statu="sendding",nkcAPI("./phoneVerify/sendSmsCode","POST").then((function(e){var n=e.countdownLen;t.time=n,t.statu="countdown";var o=setInterval((function(){t.time-=1,0===t.time&&(clearInterval(o),t.statu="wait",t.time=0)}),1e3)})).catch((function(e){sweetError(e),t.statu="wait",t.time=0}))},submit:function(){var t=this;nkcAPI("./phoneVerify","POST",{code:t.code}).then((function(){return t.complete=!0,sweetAlert("验证成功")})).then((function(){location.href=document.referrer})).catch(sweetError)},toModifyPhoneNumber:function(){location.href="./settings/security"}}})}));
