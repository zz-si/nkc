!function(e){"function"==typeof define&&define.amd?define(e):e()}((function(){"use strict";$(document).ready((function(){var e="<html><head><meta charset='utf-8' /></head><body>"+document.getElementById("tabExc").outerHTML+"</body></html>",t=new Blob([e],{type:"application/vnd.ms-excel"}),n=document.getElementById("outExc");n.href=URL.createObjectURL(t),n.download="活动报名表.xls"}))}));