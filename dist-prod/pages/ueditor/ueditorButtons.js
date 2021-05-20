!function(e){"function"==typeof define&&define.amd?define(e):e()}((function(){"use strict";UE.registerUI("draftSelector",(function(e,t){return NKC.modules.SelectDraft&&!window.SelectDraft&&(window.SelectDraft=new NKC.modules.SelectDraft),new UE.ui.Button({name:"draftSelector",title:"草稿箱",className:"edui-default edui-for-draft edui-icon",onclick:function(){if(!window.SelectDraft)return sweetError("未初始化草稿选择模块");window.SelectDraft.open((function(t){e.execCommand("inserthtml",t.content||"")}))}})})),UE.registerUI("stickerSelector",(function(e,t){return NKC.modules.SelectSticker&&!window.SelectSticker&&(window.SelectSticker=new NKC.modules.SelectSticker),new UE.ui.Button({name:"stickerSelector",title:"插入表情",className:"edui-default edui-for-emotion edui-icon",onclick:function(){if(!window.SelectSticker)return sweetError("未初始化表情选择模块");window.SelectSticker.open((function(t){"emoji"===t.type?e.execCommand("inserthtml",NKC.methods.resourceToHtml("twemoji",t.data)):"sticker"===t.type&&e.execCommand("inserthtml",NKC.methods.resourceToHtml("sticker",t.data.rid))}))}})})),UE.registerUI("imageSelector",(function(e,t){return NKC.modules.SelectResource&&!window.SelectResource&&(window.SelectResource=new NKC.modules.SelectResource),new UE.ui.Button({name:"imageSelector",title:"插入图片和附件",className:"edui-default edui-for-image-selector edui-icon",onclick:function(){if(!window.SelectResource)return sweetError("未初始化资源选择模块");window.SelectResource.open((function(t){t=t.resources?t.resources:[t];for(var n=0;n<t.length;n++){var o=t[n],i=o.mediaType;i=(i=i.substring(5))[0].toLowerCase()+i.substring(1),e.execCommand("inserthtml",NKC.methods.resourceToHtml(i,o.rid,o.oname))}}),{fastSelect:!0})}})})),UE.registerUI("mathFormulaV2",(function(e,t){return NKC.modules.insertMathformula&&!window.insertMathformula&&(window.insertMathformula=new NKC.modules.insertMathformula),new UE.ui.Button({name:"mathFormulaV2",title:"插入公式",className:"edui-default edui-for-mathformula edui-icon",onclick:function(){if(!window.insertMathformula)return sweetError("未初始化");window.insertMathformula.open((function(t){e.execCommand("inserthtml",t)}))}})})),UE.registerUI("hideContent",(function(e,t){return NKC.modules.insertHideContent&&!window.insertHideContent&&(window.insertHideContent=new NKC.modules.insertHideContent),e.ready((function(){var t=e.document,n=function(e){var t=e.target;if("nkcsource"===t.dataset.tag){var n=t.dataset.type,o=t.dataset.id;"xsf"===n&&window.insertHideContent.open((function(e){t.dataset.id=e,t.dataset.message="浏览这段内容需要"+e+"学术分(双击修改)"}),parseFloat(o))}},o=0;t.addEventListener("dblclick",n),t.addEventListener("touchend",(function(e){if(2==++o)return n(e);setTimeout((function(){o=0}),700)}))})),new UE.ui.Button({name:"hideContent",title:"学术分隐藏",className:"edui-default edui-for-hide-content edui-icon",onclick:function(){if(!window.insertHideContent)return sweetError("未初始化资源选择模块");window.insertHideContent.open((function(t){e.execCommand("inserthtml",NKC.methods.resourceToHtml("xsf",t))}))}})}))}));
