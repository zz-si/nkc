!function(t){"function"==typeof define&&define.amd?define(t):t()}((function(){"use strict";var t=NKC.methods.getDataById("data");new Vue({el:"#app",data:{toppingSettings:t.toppingSettings,roles:t.roles,grades:t.grades},methods:{submit:function(){var t=this.toppingSettings;nkcAPI("/e/settings/topping","PUT",t).then((function(){sweetSuccess("保存成功")})).catch((function(t){sweetError(t)}))}}})}));
