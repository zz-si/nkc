!function(e){"function"==typeof define&&define.amd?define(e):e()}((function(){"use strict";function e(e){return e=(e/100).toFixed(2)}new Vue({el:"#app",data:{random:{close:!1,awards:[]},draftFee:{close:!1,defaultCount:1,minCount:1,maxCount:5},share:{},randomDemo:{},draftFeeDemo:{},shareDemo:{}},mounted:function(){var t=NKC.methods.getDataById("data");for(var a in t.redEnvelopeSettings.random.awards)t.redEnvelopeSettings.random.awards[a].kcb=e(t.redEnvelopeSettings.random.awards[a].kcb);this.random=t.redEnvelopeSettings.random,t.redEnvelopeSettings.draftFee.defaultCount=e(t.redEnvelopeSettings.draftFee.defaultCount),t.redEnvelopeSettings.draftFee.minCount=e(t.redEnvelopeSettings.draftFee.minCount),t.redEnvelopeSettings.draftFee.maxCount=e(t.redEnvelopeSettings.draftFee.maxCount),this.draftFee=t.redEnvelopeSettings.draftFee;var r,n=[],o={};for(var s in t.redEnvelopeSettings.share)t.redEnvelopeSettings.share.hasOwnProperty(s)&&((r=t.redEnvelopeSettings.share[s]).id=s,n[r.order-1]=r);for(var d=0;d<n.length;d++)(r=n[d]).maxKcb=e(r.maxKcb),r.kcb=e(r.kcb),o[r.id]=r,delete r.id;this.share=o,0===this.random.awards.length&&(this.random.awards=[{name:"",kcb:"",chance:"",float:""}])},methods:{remove:function(e){this.random.awards.splice(e,1)},add:function(e){this.random.awards.splice(e+1,0,{name:"",kcb:"",chance:"",float:""})},save:function(){for(var e in"false"===this.random.close&&(this.random.close=!1),"true"===this.random.close&&(this.random.close=!0),"false"===this.draftFee.close&&(this.draftFee.close=!1),"true"===this.draftFee.close&&(this.draftFee.close=!0),this.randomDemo=JSON.parse(JSON.stringify(this.random)),this.randomDemo.awards)this.randomDemo.awards[e].kcb=100*this.randomDemo.awards[e].kcb;for(var t in this.draftFeeDemo=JSON.parse(JSON.stringify(this.draftFee)),this.draftFeeDemo.defaultCount=100*this.draftFeeDemo.defaultCount,this.draftFeeDemo.maxCount=100*this.draftFeeDemo.maxCount,this.draftFeeDemo.minCount=100*this.draftFeeDemo.minCount,this.shareDemo=JSON.parse(JSON.stringify(this.share)),this.shareDemo)this.shareDemo[t].maxKcb=100*this.shareDemo[t].maxKcb,this.shareDemo[t].kcb=100*this.shareDemo[t].kcb;var a={random:this.randomDemo,draftFee:this.draftFeeDemo,share:this.shareDemo};nkcAPI("/e/settings/red-envelope","PUT",a).then((function(){screenTopAlert("保存成功")})).catch((function(e){screenTopWarning(e.error||e)}))}}}),window.numToFloatTwo=e}));