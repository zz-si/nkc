!function n(i,r,s){function a(o,t){if(!r[o]){if(!i[o]){var e="function"==typeof require&&require;if(!t&&e)return e(o,!0);if(c)return c(o,!0);throw(e=new Error("Cannot find module '"+o+"'")).code="MODULE_NOT_FOUND",e}e=r[o]={exports:{}},i[o][0].call(e.exports,function(t){return a(i[o][1][t]||t)},e,e.exports,n,i,r,s)}return r[o].exports}for(var c="function"==typeof require&&require,t=0;t<s.length;t++)a(s[t]);return a}({1:[function(t,o,e){"use strict";var n;NKC.modules.downloadResource=function(){return function t(){!function(t,o){if(!(t instanceof o))throw new TypeError("Cannot call a class as a function")}(this,t);var n=this;n.dom=$("#moduleDownloadResource"),n.app=new Vue({el:"#moduleDownloadResourceApp",data:{uid:NKC.configs.uid,rid:"",fileName:"未知",type:"",size:0,costs:[],hold:[],status:"loading",fileCountLimitInfo:"",errorInfo:"",settingNoNeed:!1,description:""},computed:{costMessage:function(){return this.costs.map(function(t){return t.name+t.number}).join("、")},holdMessage:function(){return this.hold.map(function(t){return t.name+t.number}).join("、")}},methods:{fromNow:NKC.methods.fromNow,initDom:function(){n.dom.css({height:"37rem"}),n.dom.draggable({scroll:!1,handle:".module-sd-title",drag:function(t,o){o.position.top<0&&(o.position.top=0);var e=$(window).height();o.position.top>e-30&&(o.position.top=e-30),e=n.dom.width(),o.position.left<100-e&&(o.position.left=100-e),e=$(window).width(),o.position.left>e-100&&(o.position.left=e-100)}});var t=$(window).width();t<700?n.dom.css({width:.8*t,top:0,right:0}):n.dom.css("left",.5*(t-n.dom.width())-20),n.dom.show()},getResourceInfo:function(t){var s=this;s.status="loading",s.errorInfo="",nkcAPI("/r/".concat(t,"/detail"),"GET").then(function(t){var o=t.detail,e=o.free,n=o.paid,i=o.resource,r=o.costScores,t=o.fileCountLimitInfo,o=(o.needScore,o.description);s.description=o,s.fileCountLimitInfo=t,i.isFileExist?(s.status=e||n?"noNeedScore":"needScore",s.free=e,s.paid=n,s.fileName=i.oname,s.rid=i.rid,s.type=i.ext,s.size=NKC.methods.getSize(i.size),r&&(s.costs=r.map(function(t){return{name:t.name,number:t.addNumber/100*-1}}),s.hold=r.map(function(t){return{name:t.name,number:t.number/100}}))):s.status="fileNotExist"}).catch(function(t){s.fileCountLimitInfo=t.detail.fileCountLimitInfo,s.status="error",s.errorInfo=t.error||t.message||t})},download:function(){var t=this,o=this.rid;this.fileName,nkcAPI("/r/".concat(o,"/pay"),"POST").then(function(){window.location.href="/r/".concat(o,"?d=attachment")}).catch(sweetError).then(function(){return t.getResourceInfo(t.rid)})},fetchResource:function(){var t=this.rid;this.fileName,window.location.href="/r/".concat(t,"?d=attachment")},open:function(t){this.status="loading",this.initDom(),this.getResourceInfo(t)},close:function(){n.dom.hide()}}}),n.open=n.app.open,n.close=n.app.close}}(),n=new NKC.modules.downloadResource,NKC.methods.openFilePanel=function(t){n.open(t)},$("#wrap, .post").on("click",function(t){if("clickAttachmentTitle"===$(t.target).attr("data-type")){t.preventDefault(),t.stopPropagation();t=$(t.target).attr("data-id");return n.open(t),!1}})},{}]},{},[1]);