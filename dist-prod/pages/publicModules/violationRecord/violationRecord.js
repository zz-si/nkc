!function(o){"function"==typeof define&&define.amd?define(o):o()}((function(){"use strict";NKC.modules.violationRecord=new function(){var o=$("#violationRecord");o.modal({show:!1}),this.$dom=o,this.vm=new Vue({el:"#violationRecordApp",data:{list:[],loading:!0,blacklistCount:{}},methods:{open:function(i){var t=this;t.list=[],o.modal("show"),t.loading=!0,nkcAPI("/u/"+i.uid+"/violationRecord","GET").then((function(o){t.loading=!1,t.list=o.record,t.blacklistCount=o.blacklistCount}))},close:function(){o.modal("hide")},format:NKC.methods.format}}),this.open=this.vm.open,this.close=this.vm.close}}));