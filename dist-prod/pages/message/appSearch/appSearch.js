!function(t){"function"==typeof define&&define.amd?define(t):t()}((function(){"use strict";var t=NKC.methods.getDataById("data"),e=new Vue({el:"#app",data:{content:"",users:[],friendsUid:t.friendsUid,page:0,pageCount:999999,end:!1,status:"unSearch"},methods:{getUrl:NKC.methods.tools.getUrl,toast:NKC.methods.appToast,checkContent:function(){var t=this;return new Promise((function(e,n){t.content?e(t.content):n("请输入内容")}))},resetStatus:function(){this.status="unSearch"},getUser:function(){var t=this,e=this.page,n=this.content;if("searching"!==t.status)return t.status="searching",Promise.resolve().then((function(){return nkcAPI("/message/search?uid=".concat(n,"&username=").concat(n,"&page=").concat(e,"&t=").concat(Date.now()),"GET")})).then((function(e){var n=e.paging,s=n.page,a=n.pageCount;t.page=s,t.pageCount=a,t.users=t.users.concat(e.users),s+1>=a&&(t.end=!0),t.resetStatus()}))},search:function(){var t=this;t.checkContent().then((function(){return t.page=0,t.end=!1,t.users=[],t.pageCount=999999,t.getUser()})).catch((function(e){t.resetStatus(),t.toast(e)}))},loadMore:function(){var t=this;t.checkContent().then((function(){if(t.page+1>=t.pageCount)throw"到底了";return t.page+=1,t.getUser()})).catch((function(e){t.resetStatus(),t.toast(e)}))},toSendMessage:function(t){NKC.methods.toChat(t.uid)},addFriend:function(t){NKC.methods.visitUrl("/message/addFriend?uid=".concat(t.uid),!0)}}});window.app=e}));