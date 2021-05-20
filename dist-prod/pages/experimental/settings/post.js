!function(t){"function"==typeof define&&define.amd?define(t):t()}((function(){"use strict";var t=new Vue({el:"#app",data:{postSettings:"",roles:[],grades:[],uid:"",users:[],type:"postToForum"},methods:{checkNumber:NKC.methods.checkData.checkNumber,getUrl:NKC.methods.tools.getUrl,addUser:function(t){var e=this.uid,s=this;nkcAPI("/u/"+e+"?from=panel","GET").then((function(e){var o=e.targetUser;if(o){s.users.push(o);var n=s.postSettings[s.type][t].uid;-1===n.indexOf(o.uid)&&n.push(o.uid)}})).catch((function(t){sweetError(t)}))},getUserById:function(t){for(var e=this.users,s=0;s<e.length;s++){var o=e[s];if(o.uid===t)return o}},removeUser:function(t,e){this.postSettings[this.type][e].uid.splice(t,1)},extendVolume:function(){var t=this.postSettings[this.type].exam;-1!==t.indexOf("notPass")?(-1===t.indexOf("volumeA")&&t.push("volumeA"),-1===t.indexOf("volumeB")&&t.push("volumeB")):-1!==t.indexOf("volumeA")&&-1===t.indexOf("volumeB")&&t.push("volumeB")},save:function(){var e=this.postSettings[this.type],s=JSON.parse(JSON.stringify(e)),o=this;Promise.resolve().then((function(){var e=s.exam;s.exam={volumeA:-1!==e.indexOf("volumeA"),volumeB:-1!==e.indexOf("volumeB"),notPass:{status:-1!==e.indexOf("notPass"),unlimited:-1!==[!0,"true"].indexOf(s.examCountLimit.unlimited),countLimit:Number(s.examCountLimit.countLimit)}};var n={roles:t.roles,grades:t.grades};return["postToForum","postToThread"].includes(o.type)&&o.checkNumber(s.survey.deadlineMax,{name:"调查的最长天数",min:.1,fractionDigits:1}),delete s.examCountLimit,delete s.authLevel,n[o.type]=s,nkcAPI("/e/settings/post","PUT",n)})).then((function(){screenTopAlert("保存成功")})).catch((function(t){screenTopWarning(t.error||t)}))}},computed:{defaultRole:function(){for(var t=this.roles,e=0;e<t.length;e++)if("default"===t[e]._id)return t[e]},displayNotPassCountLimit:function(){return-1!==this.postSettings[this.type].exam.indexOf("notPass")},selectedUsers:function(){for(var t=this.postSettings[this.type].anonymous.uid,e=[],s=0;s<t.length;s++){var o=t[s],n=this.getUserById(o);n&&e.push(n)}return e},selectedUsersSurvey:function(){for(var t=this.postSettings[this.type].survey.uid,e=[],s=0;s<t.length;s++){var o=t[s],n=this.getUserById(o);n&&e.push(n)}return e}},mounted:function(){nkcAPI("/e/settings/post?t="+Date.now(),"GET",{}).then((function(e){t.roles=e.roles,t.grades=e.grades,t.users=e.users;var s=[],o=e.postSettings.c.postToForum.exam;o.volumeA&&s.push("volumeA"),o.volumeB&&s.push("volumeB"),o.notPass.status&&s.push("notPass"),e.postSettings.c.postToForum.examCountLimit=o.notPass,e.postSettings.c.postToForum.exam=s,s=[],(o=e.postSettings.c.postToThread.exam).volumeA&&s.push("volumeA"),o.volumeB&&s.push("volumeB"),o.notPass.status&&s.push("notPass"),e.postSettings.c.postToThread.examCountLimit=o.notPass,e.postSettings.c.postToThread.exam=s,s=[],(o=e.postSettings.c.postLibrary.exam).volumeA&&s.push("volumeA"),o.volumeB&&s.push("volumeB"),o.notPass.status&&s.push("notPass"),e.postSettings.c.postLibrary.examCountLimit=o.notPass,e.postSettings.c.postLibrary.exam=s,t.postSettings=e.postSettings.c})).catch((function(t){screenTopWarning(t.error||t)}))}});window.app=t}));
