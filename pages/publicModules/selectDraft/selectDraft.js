!function r(a,c,f){function s(o,t){if(!c[o]){if(!a[o]){var n="function"==typeof require&&require;if(!t&&n)return n(o,!0);if(d)return d(o,!0);var e=new Error("Cannot find module '"+o+"'");throw e.code="MODULE_NOT_FOUND",e}var i=c[o]={exports:{}};a[o][0].call(i.exports,function(t){return s(a[o][1][t]||t)},i,i.exports,r,a,c,f)}return c[o].exports}for(var d="function"==typeof require&&require,t=0;t<f.length;t++)s(f[t]);return s}({1:[function(t,o,n){"use strict";NKC.modules.SelectDraft=function(){return function t(){!function(t,o){if(!(t instanceof o))throw new TypeError("Cannot call a class as a function")}(this,t);var r=this;r.dom=$("#moduleSelectDraft"),r.app=new Vue({el:"#moduleSelectDraftApp",data:{uid:NKC.configs.uid,paging:{},perpage:7,loading:!0,drafts:[]},methods:{fromNow:NKC.methods.fromNow,initDom:function(){r.dom.css({height:"43.5rem"}),r.dom.draggable({scroll:!1,handle:".module-sd-title",drag:function(t,o){o.position.top<0&&(o.position.top=0);var n=$(window).height();o.position.top>n-30&&(o.position.top=n-30);var e=r.dom.width();o.position.left<100-e&&(o.position.left=100-e);var i=$(window).width();o.position.left>i-100&&(o.position.left=i-100)}});var t=$(window).width();t<700?r.dom.css({width:.8*t,top:0,right:0}):r.dom.css("left",.5*(t-r.dom.width())-20),r.dom.show()},getDraftInfo:function(t){var o=t.type,n=t.thread,e=t.forum;return"newThread"===o?"发表文章":"newPost"===o?"在文章《".concat(n.title,"》下发表回复"):"modifyPost"===o?"修改文章《".concat(n.title,"》下的回复"):"modifyThread"===o?"修改文章《".concat(n.title,"》"):"修改专业《".concat(e.title,"modifyForumLatestNotice"===o?"》最新页板块公告":"》的专业说明")},insert:function(o){var t=NKC.methods.ueditor.setContent(o.content);r.callback({content:t}),o.delay=3,function t(){setTimeout(function(){o.delay--,0<o.delay&&t()},1e3)}()},removeDraft:function(t){var o=this;sweetQuestion("确定要删除草稿吗？").then(function(){nkcAPI("/u/"+o.uid+"/drafts/"+t.did,"DELETE").then(function(){r.app.getDrafts(r.app.paging.page)}).catch(function(t){sweetError(t)})})},getDrafts:function(t){var o=0<arguments.length&&void 0!==t?t:0;nkcAPI("/u/".concat(this.uid,"/profile/draft?page=").concat(o,"&perpage=").concat(this.perpage),"GET").then(function(t){t.drafts.map(function(t){t.delay=0}),r.app.drafts=t.drafts,r.app.paging=t.paging,r.app.loading=!1}).catch(sweetError)},loadDraft:function(t){sweetQuestion("继续创作将会覆盖编辑器中全部内容，确定继续？").then(function(){window.PostInfo&&window.PostInfo.showCloseInfo&&(window.PostInfo.showCloseInfo=!1),window.location.href="/editor?type=redit&id=".concat(t.did)}).catch(sweetError)},refresh:function(){this.getDrafts(r.app.paging.page)},open:function(t){r.callback=t,this.initDom(),this.getDrafts()},close:function(){r.dom.hide()}}}),r.open=r.app.open,r.close=r.app.close}}()},{}]},{},[1]);