!function(t){"function"==typeof define&&define.amd?define(t):t()}((function(){"use strict";NKC.modules.SelectAddress=function(){var t=this;t.dom=$("#moduleSelectAddress"),t.dom.modal({show:!1}),t.app=new Vue({el:"#moduleSelectAddressApp",data:{locationsOrigin:NKC.configs.locations,onlyChina:!0,selectedLocations:[],activeLocation:""},computed:{canClickButton:function(){var t=this.selectedLocations;if(!t.length)return!1;var n=t[t.length-1].childrens;return!n||!n.length},childrenLocations:function(){return this.activeLocation?this.activeLocation.childrens:this.locations},locationsObj:function(){var t=this.locations,n={},i=[];!function t(n){for(var o=0;o<n.length;o++){var e=n[o];i.push(e),e.childrens&&e.childrens.length>0&&t(e.childrens)}}(t);for(var o=0;o<i.length;o++){var e=i[o];n[e.id]=e}return n},locations:function(){return this.onlyChina?this.locationsOrigin[0].childrens:this.locationsOrigin}},methods:{selected:function(){for(var n=[],i=0;i<this.selectedLocations.length;i++)n.push(this.selectedLocations[i].cname);t.callback(n),t.close()},selectAll:function(){this.activeLocation=""},getLocationById:function(t){return this.locationsObj[t]},getLevel:function(t){var n=0;this.locations;for(var i=t;;){var o=this.getLocationById(i.pid);if(!o)break;n++,i=o}return n},selectLocation:function(t){var n=this.selectedLocations,i=this.getLevel(t);n[i]!==t&&(n[i]=t,n.splice(i+1,100),this.activeLocation=t)},cancelSelect:function(t){this.activeLocation=t}}}),t.open=function(n,i){t.callback=n,void 0!==(i=i||{}).onlyChina?t.app.onlyChina=i.onlyChina:t.app.onlyChina=!0,t.dom.modal("show")},t.close=function(){t.dom.modal("hide"),setTimeout((function(){t.app.selectedLocations=[],t.app.activeLocation=""}),1e3)}}}));