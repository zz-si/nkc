!function(e){"function"==typeof define&&define.amd?define(e):e()}((function(){"use strict";function e(e,r){(null==r||r>e.length)&&(r=e.length);for(var t=0,n=new Array(r);t<r;t++)n[t]=e[t];return n}function r(r,t){var n="undefined"!=typeof Symbol&&r[Symbol.iterator]||r["@@iterator"];if(!n){if(Array.isArray(r)||(n=function(r,t){if(r){if("string"==typeof r)return e(r,t);var n=Object.prototype.toString.call(r).slice(8,-1);return"Object"===n&&r.constructor&&(n=r.constructor.name),"Map"===n||"Set"===n?Array.from(r):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?e(r,t):void 0}}(r))||t&&r&&"number"==typeof r.length){n&&(r=n);var o=0,a=function(){};return{s:a,n:function(){return o>=r.length?{done:!0}:{done:!1,value:r[o++]}},e:function(e){throw e},f:a}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var c,i=!0,s=!1;return{s:function(){n=n.call(r)},n:function(){var e=n.next();return i=e.done,e},e:function(e){s=!0,c=e},f:function(){try{i||null==n.return||n.return()}finally{if(s)throw c}}}}var t=NKC.methods.getDataById("data");t.forumScoreOperations.map((function(e){var n,o=r(t.scoresType);try{for(o.s();!(n=o.n()).done;){var a=n.value,c=e[a];e["_".concat(a)]=void 0===c?0:c/100}}catch(e){o.e(e)}finally{o.f()}}));var n=new Vue({el:"#app",data:{forumAvailableScoreOperations:t.forumAvailableScoreOperations,forumScoreOperations:t.forumScoreOperations,scores:t.scores,scoresType:t.scoresType,forum:t.forum},methods:{checkNumber:NKC.methods.checkData.checkNumber,addScoreOperation:function(){var e,t={type:"",cycle:"day",count:0},n=r(this.scoresType);try{for(n.s();!(e=n.n()).done;){t["_"+e.value]=0}}catch(e){n.e(e)}finally{n.f()}this.forumScoreOperations.push(t)},removeScoreOperation:function(e){this.forumScoreOperations.splice(e,1)},save:function(){var e=this.forumScoreOperations,t=this.checkNumber,n=this.scoresType,o=this.forum;e=JSON.parse(JSON.stringify(e)),Promise.resolve().then((function(){var a,c=r(e);try{for(c.s();!(a=c.n()).done;){var i,s=a.value,f=r(n);try{for(f.s();!(i=f.n()).done;){var u=i.value,l=s["_".concat(u)];t(l,{name:"积分策略中加减的积分值",fractionDigits:2}),s[u]=parseInt(100*l),delete s["_".concat(u)]}}catch(e){f.e(e)}finally{f.f()}}}catch(e){c.e(e)}finally{c.f()}return nkcAPI("/f/".concat(o.fid,"/settings/score"),"PUT",{forumScoreOperations:e})})).then((function(){sweetSuccess("保存成功")})).catch(sweetError)}}});window.app=n}));