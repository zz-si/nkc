!function n(i,r,s){function a(e,t){if(!r[e]){if(!i[e]){var o="function"==typeof require&&require;if(!t&&o)return o(e,!0);if(c)return c(e,!0);throw(o=new Error("Cannot find module '"+e+"'")).code="MODULE_NOT_FOUND",o}o=r[e]={exports:{}},i[e][0].call(o.exports,function(t){return a(i[e][1][t]||t)},o,o.exports,n,i,r,s)}return r[e].exports}for(var c="function"==typeof require&&require,t=0;t<s.length;t++)a(s[t]);return a}({1:[function(t,e,o){"use strict";var n;NKC.modules.downloadResource=function(){function e(){!function(t){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this);var n=this;n.dom=$("#moduleDownloadResource"),n.app=new Vue({el:"#moduleDownloadResourceApp",data:{uid:NKC.configs.uid,rid:"",fileName:"未知",type:"",size:0,costs:[],hold:[],status:"loading",fileCountLimitInfo:"",errorInfo:"",settingNoNeed:!1},computed:{costMessage:function(){return this.costs.map(function(t){return t.name+t.number}).join("、")},holdMessage:function(){return this.hold.map(function(t){return t.name+t.number}).join("、")}},methods:{fromNow:NKC.methods.fromNow,initDom:function(){n.dom.css({height:"37rem"}),n.dom.draggable({scroll:!1,handle:".module-sd-title",drag:function(t,e){e.position.top<0&&(e.position.top=0);var o=$(window).height();e.position.top>o-30&&(e.position.top=o-30);o=n.dom.width();e.position.left<100-o&&(e.position.left=100-o);o=$(window).width();e.position.left>o-100&&(e.position.left=o-100)}});var t=$(window).width();t<700?n.dom.css({width:.8*t,top:0,right:0}):n.dom.css("left",.5*(t-n.dom.width())-20),n.dom.show()},getResourceInfo:function(t){var r=this;r.status="loading",r.errorInfo="",nkcAPI("/r/".concat(t,"/detail"),"GET").then(function(t){var e=t.detail,o=e.free,n=e.paid,i=e.resource,t=e.costScores,e=e.fileCountLimitInfo;r.fileCountLimitInfo=e,i.isFileExist?(r.status=o||n?"noNeedScore":"needScore",r.free=o,r.paid=n,r.fileName=i.oname,r.rid=i.rid,r.type=i.ext,r.size=NKC.methods.getSize(i.size),t&&(r.costs=t.map(function(t){return{name:t.name,number:t.addNumber/100*-1}}),r.hold=t.map(function(t){return{name:t.name,number:t.number/100}}))):r.status="fileNotExist"}).catch(function(t){r.fileCountLimitInfo=t.fileCountLimitInfo,r.status="error",r.errorInfo=t.error||t.message||t})},download:function(){var t=this,e=this.rid,o=this.fileName;nkcAPI("/r/".concat(e,"/pay"),"POST").then(function(){var t=document.createElement("a");t.setAttribute("download",o),t.href="/r/".concat(e),t.click()}).catch(sweetError).then(function(){return t.getResourceInfo(t.rid)})},fetchResource:function(){var t=this.rid,e=this.fileName,o=document.createElement("a");o.setAttribute("download",e),o.href="/r/".concat(t),o.click()},open:function(t){this.status="loading",this.initDom(),this.getResourceInfo(t)},close:function(){n.dom.hide()}}}),n.open=n.app.open,n.close=n.app.close}return e}(),n=new NKC.modules.downloadResource,NKC.methods.openFilePanel=function(t){n.open(t)},$("#wrap, .post").on("click",function(t){if("clickAttachmentTitle"===$(t.target).attr("data-type")){t.preventDefault(),t.stopPropagation();t=$(t.target).attr("data-id");return n.open(t),!1}})},{}]},{},[1]);