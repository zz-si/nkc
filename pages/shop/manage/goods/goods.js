!function o(r,a,i){function c(t,e){if(!a[t]){if(!r[t]){var n="function"==typeof require&&require;if(!e&&n)return n(t,!0);if(u)return u(t,!0);throw(n=new Error("Cannot find module '"+t+"'")).code="MODULE_NOT_FOUND",n}n=a[t]={exports:{}},r[t][0].call(n.exports,function(e){return c(r[t][1][e]||e)},n,n.exports,o,r,a,i)}return a[t].exports}for(var u="function"==typeof require&&require,e=0;e<i.length;e++)c(i[e]);return c}({1:[function(e,t,n){"use strict";var r=new NKC.modules.CommonModal;window.modifyParam=function(n,o){var e=getParam(n,o);r.open(function(e){var t={name:e[0].value,originPrice:e[1].value,stocksSurplus:e[2].value,price:e[3].value,useDiscount:e[4].value,isEnable:e[5].value,paramId:o,productId:n};nkcAPI("/shop/manage/".concat(NKC.configs.uid,"/goodslist/editParam"),"PUT",{paramData:t}).then(function(){sweetSuccess("修改成功"),r.close(),setParam(n,o,t)}).catch(sweetError)},{title:"修改规格",data:[{dom:"input",type:"text",label:"名称",value:e.name},{dom:"input",type:"number",label:"价格（元，精确到0.01）",value:e.originPrice},{dom:"input",type:"number",label:"库存",value:e.stocksSurplus},{dom:"input",type:"number",label:"优惠价（元，精确到0.01）",value:e.price},{dom:"radio",label:"是否使用优惠价",value:e.useDiscount,radios:[{value:!0,name:"是"},{value:!1,name:"否"}]},{dom:"radio",label:"是否屏蔽",value:e.isEnable,radios:[{value:!1,name:"是"},{value:!0,name:"否"}]}]})},window.computeStocks=function(e){},window.getNumber=function(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0;return e=(e+="").replace("￥",""),e=(e=parseFloat(e)).toFixed(t),parseFloat(e)},window.getParamDom=function(e,t){var n=$(".param[data-product-id='".concat(e,"'][data-param-id='").concat(t,"']")),o=n.find(".origin-price"),r=n.find(".price"),e=n.find(".name"),t=n.find(".stocks-surplus");return{dom:n,name:e,originPrice:o,price:r,stocksSurplus:t}},window.getParam=function(e,t){var n=getParamDom(e,t),o=n.dom,r=n.originPrice,a=n.price,i=n.name,e=n.stocksSurplus,r=getNumber(r.text(),2),t=!1;"无"===a.text()?a="":(a=getNumber(a.text(),2),t=!0),e=getNumber(e.text());n=!0;return o.hasClass("disabled")&&(n=!1),{name:i=i.text(),isEnable:n,useDiscount:t,originPrice:r,price:a,stocksSurplus:e}},window.setParam=function(a,e,t){var i=getParamDom(a,e),c=t.name,u=t.originPrice,s=t.price,d=t.useDiscount,l=t.stocksSurplus,m=t.isEnable,t=NKC.methods.checkData,p=t.checkString,f=t.checkNumber;Promise.resolve().then(function(){if(p(c,{name:"名称",minLength:1,maxLength:100}),f(l,{name:"库存",min:0}),f(u,{name:"价格",min:.01,fractionDigits:2}),d){if(u<=s)throw"规格优惠价必须小于原价";f(s,{name:"优惠价",min:.01,fractionDigits:2})}m?i.dom.removeClass("disabled"):i.dom.addClass("disabled"),i.name.text(c),i.originPrice.text("￥".concat(u.toFixed(2))),i.stocksSurplus.text(l),d?i.price.text("￥".concat(s.toFixed(2))).addClass("number"):i.price.text("无").removeClass("number");for(var e=$(".product[data-product-id='".concat(a,"'] .stocks-surplus")),t=$(".param[data-product-id='".concat(a,"'] .stocks-surplus")),n=0,o=0;o<t.length;o++){var r=t.eq(o);n+=getNumber(r.text())}e.text(n)}).catch(sweetError)},window.shelfNow=function(e){sweetQuestion("确认要上架该商品？").then(function(){return nkcAPI("/shop/manage/".concat(NKC.configs.uid,"/goodslist/shelfRightNow"),"PUT",{productId:e})}).then(function(){sweetSuccess("商品已上架")}).catch(sweetError)},window.stopSale=function(e){sweetQuestion("确认要停售该商品？").then(function(){return nkcAPI("/shop/manage/".concat(NKC.configs.uid,"/goodslist/productStopSale"),"PUT",{productId:e})}).then(function(){sweetSuccess("商品已停售")}).catch(sweetError)},window.goonSale=function(e){sweetQuestion("确认要复售该商品？").then(function(){return nkcAPI("/shop/manage/".concat(NKC.configs.uid,"/goodslist/productGoonSale"),"PUT",{productId:e})}).then(function(){sweetSuccess("商品已复售")}).catch(sweetError)}},{}]},{},[1]);