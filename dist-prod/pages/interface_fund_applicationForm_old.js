!function(t){"function"==typeof define&&define.amd?define(t):t()}((function(){"use strict";function t(){return(t=Object.assign||function(t){for(var a=1;a<arguments.length;a++){var n=arguments[a];for(var e in n)Object.prototype.hasOwnProperty.call(n,e)&&(t[e]=n[e])}return t}).apply(this,arguments)}function a(t,a){(null==a||a>t.length)&&(a=t.length);for(var n=0,e=new Array(a);n<a;n++)e[n]=t[n];return e}function n(t,n){var e="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!e){if(Array.isArray(t)||(e=function(t,n){if(t){if("string"==typeof t)return a(t,n);var e=Object.prototype.toString.call(t).slice(8,-1);return"Object"===e&&t.constructor&&(e=t.constructor.name),"Map"===e||"Set"===e?Array.from(t):"Arguments"===e||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e)?a(t,n):void 0}}(t))||n&&t&&"number"==typeof t.length){e&&(t=e);var r=0,o=function(){};return{s:o,n:function(){return r>=t.length?{done:!0}:{done:!1,value:t[r++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,d=!0,l=!1;return{s:function(){e=e.call(t)},n:function(){var t=e.next();return d=t.done,t},e:function(t){l=!0,i=t},f:function(){try{d||null==e.return||e.return()}finally{if(l)throw i}}}}var e=[],r={threads:[]};function o(t,a){var r="/me/threads";t&&(r="/me/threads?page="+t),void 0!==a&&(r="/me/threads?pid="+a),nkcAPI(r,"GET",{}).then((function(t){var a,r=n(t.threads);try{for(r.s();!(a=r.n()).done;){var o,i=a.value,d=!1,l=n(e);try{for(l.s();!(o=l.n()).done;){(g=o.value).tid===i.tid&&(d=!0)}}catch(t){l.e(t)}finally{l.f()}d||e.push(i)}}catch(t){r.e(t)}finally{r.f()}var s=t.threads,c=t.paging;console.log(t);var h="",f="";if(c&&c.pageCount>1)for(var u=0;u<c.pageCount;u++)console.log(c.page),u===c.page?h+="<li>"+(u+1)+"</li>":h+='<li><a href="###" onclick="loadThreads('+u+')">'+(u+1)+"</a></li>";var p,v=n(s);try{for(v.s();!(p=v.n()).done;){var g;f+='<div class="thread-list-body"><div class="col-xs-12 col-md-10 thread-list-title"><a href="/t/'+(g=p.value).tid+'" target="_blank">'+g.firstPost.t+'</a></div><div class="col-xs-12 col-md-2"><span class="glyphicon glyphicon-plus-sign" onclick="chooseThread('+g.tid+')"></span></div></div>'}}catch(t){v.e(t)}finally{v.f()}$("#threadListPage").html(h),$("#threadList").html(f)})).catch((function(t){jwarning(t.error)}))}function i(){var t,a="",o=n(r.threads);try{for(o.s();!(t=o.n()).done;){var i,d=t.value,l=n(e);try{for(l.s();!(i=l.n()).done;){var s=i.value;s.tid==d&&(a+='<div class="thread-list-body"><div class="col-xs-12 col-md-10 thread-list-title"><a href="/t/'+s.tid+'" target="_blank">'+s.firstPost.t+'</a></div><div class="col-xs-12 col-md-2"><span class="glyphicon glyphicon-minus-sign" onclick="removeThread('+s.tid+')"></span></div></div>')}}catch(t){l.e(t)}finally{l.f()}}}catch(t){o.e(t)}finally{o.f()}$("#threadListChose").html(a),$("#choseThread").html("&nbsp;"+r.threads.length+"&nbsp;篇")}function d(t,a){var n=new XMLHttpRequest;n.upload.onprogress=function(t){var a=t.loaded/t.total*100;console.log("Uploaded "+a+"%")},n.onreadystatechange=function(){4==n.readyState&&(n.status>=200&&n.status<300?a(JSON.parse(n.responseText)):(console.log(n.responseText),jwarning(n.status.toString()+" "+n.responseText)))},n.open("POST","/photo",!0),n.setRequestHeader("FROM","nkcAPI"),n.send(t)}function l(t,a){$(t).on("change",(function(){var n,e=$(t).get(0);if(!(e.files.length>0))return jwarning("未选择图片");n=e.files[0];var r=new FormData;r.append("file",n),r.append("photoType",a),d(r,s)}))}function s(t){var a=t.photoType,n=t.photoId;"idCardA"===a?$("#idCardPhotoA img").attr("src","/photo_small/"+n):"idCardB"===a?$("#idCardPhotoB img").attr("src","/photo_small/"+n):"HandheldIdCard"===a?$("#idCardPhotoHandheld img").attr("src","/photo_small/"+n):"life"===a?alert("上传的是生活照"):alert("未知的证件类型")}function c(){$("#submitOfSearch").on("click",(function(){var t=$("#pid").val();if(""===t)return jwarning("输入不能为空");o(0,t)})),$("#idCardPhotoA").on("click",(function(){$("#uploadIdCardA").click()})),$("#idCardPhotoB").on("click",(function(){$("#uploadIdCardB").click()})),$("#idCardPhotoHandheld").on("click",(function(){$("#uploadIdCardHandheld").click()})),$("#lifePhoto").on("click",(function(){$("#uploadLife").click()})),l("#uploadIdCardA","idCardA"),l("#uploadIdCardB","idCardB"),l("#uploadIdCardHandheld","HandheldIdCard"),l("#uploadLife","life")}$((function(){c()})),t(window,{threads:e,application:r,loadThreads:o,chooseThread:function(t){var a,o=n(e);try{for(o.s();!(a=o.n()).done;){a.value.tid!=t||r.threads.includes(t)||(r.threads.push(t),i())}}catch(t){o.e(t)}finally{o.f()}},displayThreadList:i,removeThread:function(t){var a=r.threads;for(var n in r.threads)a[n]==t&&(r.threads.splice(n,1),i())},clearThreads:function(){$("#threadListPage").html(""),$("#threadList").html("")},postUpload:d,uploadPhoto:l,uploadSuccess:s,init:c})}));