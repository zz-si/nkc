!function(e){"function"==typeof define&&define.amd?define(e):e()}((function(){"use strict";function e(){return(e=Object.assign||function(e){for(var n=1;n<arguments.length;n++){var o=arguments[n];for(var t in o)Object.prototype.hasOwnProperty.call(o,t)&&(e[t]=o[t])}return e}).apply(this,arguments)}$((function(){moduleToColumn.init()})),e(window,{setPerpage:function(){var e=$("#perpage"),n=e.attr("data-column-id"),o=e.val();o=parseInt(o),(isNaN(o)||o<1)&&(o=""),openToNewLocation("/m/"+n+"/settings/post/add?c="+o)},showInfo:function(e){$(".column-thread-info[data-info-tid='"+e+"']").toggle()},showAll:function(){for(var e=$(".column-thread-info"),n=e.length,o=0,t=0;t<e.length;t++){"none"!==e.eq(t).css("display")&&o++}o===n?e.hide():e.show()},selectAll:function(){for(var e=$("input[type='checkbox']"),n=e.length,o=0,t=0;t<n;t++){e.eq(t).prop("checked")&&o++}n===o?e.prop("checked",!1):e.prop("checked",!0)},selectMark:function(){for(var e=$("input[type='checkbox']"),n=[],o=0;o<e.length;o++){var t=e.eq(o);t.prop("checked")&&n.push(t.attr("data-thread-oc"))}0!==n.length&&moduleToColumn.show((function(e){var o=e.mainCategoriesId,t=e.minorCategoriesId,c=e.columnId;nkcAPI("/m/"+c+"/post","POST",{postsId:n,mainCategoriesId:o,minorCategoriesId:t,type:"addToColumn"}).then((function(){screenTopAlert("操作成功"),moduleToColumn.hide()})).catch((function(e){screenTopWarning(e)}))}),{selectMul:!0})}})}));