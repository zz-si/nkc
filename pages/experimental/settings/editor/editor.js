!function n(i,o,u){function s(e,t){if(!o[e]){if(!i[e]){var r="function"==typeof require&&require;if(!t&&r)return r(e,!0);if(c)return c(e,!0);throw(r=new Error("Cannot find module '"+e+"'")).code="MODULE_NOT_FOUND",r}r=o[e]={exports:{}},i[e][0].call(r.exports,function(t){return s(i[e][1][t]||t)},r,r.exports,n,i,o,u)}return o[e].exports}for(var c="function"==typeof require&&require,t=0;t<u.length;t++)s(u[t]);return s}({1:[function(t,e,r){"use strict";var n=NKC.methods.getDataById("data");new Vue({el:"#app",data:{editorSettings:n.editorSettings},methods:{submit:function(){nkcAPI("/e/settings/editor","PUT",{editorSettings:this.editorSettings}).then(function(){sweetSuccess("保存成功")}).catch(sweetError)}}})},{}]},{},[1]);