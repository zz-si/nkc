!function(e){"function"==typeof define&&define.amd?define(e):e()}((function(){"use strict";function e(e){return function(e){if(Array.isArray(e))return n(e)}(e)||function(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(e)||t(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function t(e,t){if(e){if("string"==typeof e)return n(e,t);var s=Object.prototype.toString.call(e).slice(8,-1);return"Object"===s&&e.constructor&&(s=e.constructor.name),"Map"===s||"Set"===s?Array.from(e):"Arguments"===s||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(s)?n(e,t):void 0}}function n(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,s=new Array(t);n<t;n++)s[n]=e[n];return s}function s(e,n){var s="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!s){if(Array.isArray(e)||(s=t(e))||n&&e&&"number"==typeof e.length){s&&(e=s);var i=0,o=function(){};return{s:o,n:function(){return i>=e.length?{done:!0}:{done:!1,value:e[i++]}},e:function(e){throw e},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var r,a=!0,c=!1;return{s:function(){s=s.call(e)},n:function(){var e=s.next();return a=e.done,e},e:function(e){c=!0,r=e},f:function(){try{a||null==s.return||s.return()}finally{if(c)throw r}}}}var i=NKC.methods.getDataById("data"),o=new Audio;window.audio=o,window.app=new Vue({el:"#app",data:{socketId:Date.now()+""+Math.round(1e3*Math.random()),type:i.type,originMessages:i.messages,showStickerPanel:!1,twemoji:i.twemoji,tUser:i.tUser,mUser:i.mUser,content:"",getMessageStatus:"canLoad",audio:new Audio},methods:{timeFormat:NKC.methods.timeFormat,getUrl:NKC.methods.tools.getUrl,toast:function(e){e=e.error||e.message||e,NKC.methods.rn.emit("toast",{content:e})},scrollToBottom:function(){var e=this;setTimeout((function(){var t=e.$refs.listContent;t.scrollTop=t.scrollHeight+1e4}),200)},switchStickerPanel:function(e){this.showStickerPanel=void 0===e?!this.showStickerPanel:!!e},selectSticker:function(e){var t,n=this,s=this.content,i=this.$refs.input;if(i.selectionStart)t=i.selectionStart;else if(document.selection){i.focus();var o=document.selection.createRange(),r=o.duplicate();r.moveToElementText(i),r.setEndPoint("EndToEnd",o),t=r.text.length-o.text.length}var a="[f/"+e+"]";if(t>1){var c=s.substring(0,t),u=c+a;this.content=s.replace(c,u)}else this.content=a+(this.content||"");setTimeout((function(){n.autoResize()}),200)},autoResize:function(e){var t=this.$refs.input,n=2.8*12;t.style.height=n+"px",!e&&n<t.scrollHeight&&(t.style.height=t.scrollHeight+"px")},keepFocus:function(e){e&&this.$refs.input.focus()},visitImages:function(e){var t,n=[],i=s(this.messages);try{for(i.s();!(t=i.n()).done;){var o=t.value;"img"===o.contentType&&n.push({name:o.content.filename,url:o.content.fileUrl})}}catch(e){i.e(e)}finally{i.f()}var r=n.map((function(e){return e.url})).indexOf(e);n.map((function(e){return e.url=location.origin+e.url})),NKC.methods.rn.emit("viewImage",{index:r,urls:n})},openUserHome:function(e){"UTU"===e.messageType&&(NKC.configs.uid===e.s?NKC.methods.visitUrl(NKC.methods.tools.getUrl("userHome",e.s),!0):NKC.methods.visitUrl(NKC.methods.tools.getUrl("messageUserDetail",e.s),!0))},selectLocalFiles:function(){var e=this.$refs.file;e.value=null,e.click()},selectedLocalFiles:function(){var e,t=s(this.$refs.file.files);try{for(t.s();!(e=t.n()).done;){var n=e.value;this.sendMessage("sendFile",n)}}catch(e){t.e(e)}finally{t.f()}},sendMessage:function(e,t){var n,s=this;if(NKC.methods.rn.emit("getKeyboardStatus",{},(function(e){s.keepFocus("show"===e.keyboardStatus)})),["sendText","sendFile"].includes(e)){var i=Date.now();n={_id:i,contentType:"html",s:s.mUser.uid,r:s.tUser.uid,messageType:"UTU"};var o=new FormData;"sendText"===e?n.content=t:(n.content=t.name,o.append("file",t)),o.append("content",n.content),o.append("socketId",s.socketId),n.formData=o}else n=t;n.status="sending",n.time=Date.now(),Promise.resolve().then((function(){if(!n.content)throw"请输入聊天内容";return"resend"!==e&&s.originMessages.push(n),s.content="",s.autoResize(!0),s.scrollToBottom(),nkcUploadFile("/message/user/".concat(n.r),"POST",n.formData)})).then((function(e){var t=s.originMessages.indexOf(n);n.status="sent",t>=0&&(Vue.set(s.originMessages,t,e.message2),s.scrollToBottom())})).catch((function(e){n.status="error",s.toast(e.error||e.message||e)}))},getMessage:function(){var e=self=this,t=e.firstMessageId,n=e.tUser,s=e.type,i="/message/data?type=".concat(s);if(t&&(i+="&firstMessageId=".concat(t)),n.uid&&(i+="&uid=".concat(n.uid)),"canLoad"===self.getMessageStatus)return self.getMessageStatus="loading",nkcAPI(i,"GET").then((function(e){self.originMessages=self.originMessages.concat(e.messages2),e.messages2.length?self.getMessageStatus="canLoad":self.getMessageStatus="cantLoad"})).catch((function(e){self.toast(e),self.getMessageStatus="canLoad"}))},getOriginMessageById:function(e){var t,n=s(this.originMessages);try{for(n.s();!(t=n.n()).done;){var i=t.value;if(i._id===e)return i}}catch(e){n.e(e)}finally{n.f()}},insertMessage:function(e){var t=e.messageType,n=e.r,s=e.s,i=this.tUser,o=this.mUser;if("UTU"===t){var r=[i.uid,o.uid];if(!r.includes(n)||!r.includes(s))return;this.mUser.uid!==e.s&&this.markAsRead()}else if("STU"===t){if(n!==o.uid)return;this.markAsRead()}else if("STE"===t)this.markAsRead();else if("friendsApplication"===t&&n!==o.uid)return;this.originMessages.push(e),this.scrollToBottom()},withdrawn:function(e,t){var n=this;Promise.resolve().then((function(){if(!t)return nkcAPI("/message/withdrawn","PUT",{messageId:e})})).then((function(){var t=n.getOriginMessageById(e);t&&(t.contentType="withdrawn")})).catch(n.toast)},markAsRead:function(){var e=self=this,t=e.type,n=e.tUser;setTimeout((function(){nkcAPI("/message/mark","PUT",{type:t,uid:n.uid}).catch(self.toast)}),1e3)},useCamera:function(e){var t="takePictureAndSendToUser";"video"===e?t="takeVideoAndSendToUser":"audio"===e&&(t="recordAudioAndSendToUser"),NKC.methods.rn.emit(t,{uid:this.tUser.uid,socketId:null})},newFriendOperation:function(e,t){var n=this.getOriginMessageById(e);nkcAPI("/u/"+n.s+"/friends/agree","POST",{agree:t}).then((function(e){n.content=e.message.content})).catch(this.toast)},playVoice:function(e){var t=this.audio,n=this.stopPlayVoice,s=this.getOriginMessageById;if("playing"===e.content.playStatus)return n();n(),t.src=e.content.fileUrl+"&t=".concat(Date.now()),setTimeout((function(){t.play(),s(e._id).content.playStatus="playing"}),200)},stopPlayVoice:function(){var e=this.audio;try{e.pause()}catch(e){}var t,n=s(this.originMessages);try{for(n.s();!(t=n.n()).done;){var i=t.value;"voice"===i.contentType&&(i.content.playStatus="unPlay")}}catch(e){n.e(e)}finally{n.f()}}},computed:{firstMessageId:function(){var e,t=s(this.messages);try{for(t.s();!(e=t.n()).done;){var n=e.value;if("time"!==n.contentType)return n._id}}catch(e){t.e(e)}finally{t.f()}},messages:function(){var t,n=this.originMessages,i=this.mUser,o=this.tUser,r=(new Date).getTime(),a=[],c={},u=[],l=s(n);try{for(l.s();!(t=l.n()).done;){var f=t.value,d=f._id,h=f.s===i.uid;a.push(d),f.position=h?"right":"left",f.sUser=h?i:o,f.canWithdrawn="sent"===f.status&&h&&r-new Date(f.time)<6e4,c[d]=f}}catch(e){l.e(e)}finally{l.f()}var g,m=s(a=(a=e(new Set(a))).sort((function(e,t){return e-t})));try{for(m.s();!(g=m.n()).done;){var p=g.value;u.push(c[p])}}catch(e){m.e(e)}finally{m.f()}for(var y=[],v=0;v<u.length;v++){var T=u[v],w=T.time;if(0===v)y.push({contentType:"time",content:w});else{var U=u[v-1];new Date(w).getTime()-new Date(U.time).getTime()>6e4&&y.push({contentType:"time",content:w})}y.push(T)}return y}},mounted:function(){var e=this,t=e.$refs.listContent;window.addEventListener("click",(function(){e.showStickerPanel&&e.switchStickerPanel(!1)})),e.scrollToBottom(),t.onscroll=function(){this.scrollTop>20||(t.scrollTo=t.scrollTop,t.height=t.scrollHeight,e.getMessage().then((function(){var e=t.scrollHeight;t.scrollTop=e-t.height})).catch((function(t){e.toast(t.error||t.message||t)})))},e.audio.addEventListener("ended",(function(){e.stopPlayVoice()}))}})}));
