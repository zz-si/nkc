const nationCodes = [
  {"location":"china","chineseName":"中国","abbr":"ZH","code":"86","unitPrice":"1"},
  {"location":"Taiwan","chineseName":"中国台湾","abbr":"TW","code":"886","unitPrice":"0.0540 "},
  {"location":"Hong Kong","chineseName":"中国香港","abbr":"HK","code":"852","unitPrice":"0.0448 "},
  {"location":"Macau","chineseName":"中国澳门","abbr":"MO","code":"853","unitPrice":"0.0267 "},
  {"location":"United States","chineseName":"美国","abbr":"US","code":"1","unitPrice":"0.0063 "},
  {"location":"Canada","chineseName":"加拿大","abbr":"CA","code":"1","unitPrice":"0.0080 "},
  {"location":"Kazakhstan","chineseName":"哈萨克斯坦","abbr":"KZ","code":"7","unitPrice":"0.0783 "},
  {"location":"Russia","chineseName":"俄罗斯","abbr":"RU","code":"7","unitPrice":"0.0321 "},
  {"location":"Egypt","chineseName":"埃及","abbr":"EG","code":"20","unitPrice":"0.0492 "},
  {"location":"South Africa","chineseName":"南非","abbr":"ZA","code":"27","unitPrice":"0.0319 "},
  {"location":"Greece","chineseName":"希腊","abbr":"GR","code":"30","unitPrice":"0.1013 "},
  {"location":"Netherlands","chineseName":"荷兰","abbr":"NL","code":"31","unitPrice":"0.1564 "},
  {"location":"Belgium","chineseName":"比利时","abbr":"BE","code":"32","unitPrice":"0.0825 "},
  {"location":"France","chineseName":"法国","abbr":"FR","code":"33","unitPrice":"0.0778 "},
  {"location":"Spain","chineseName":"西班牙","abbr":"ES","code":"34","unitPrice":"0.0988 "},
  {"location":"Hungary","chineseName":"匈牙利","abbr":"HU","code":"36","unitPrice":"0.1197 "},
  {"location":"Italy","chineseName":"意大利","abbr":"IT","code":"39","unitPrice":"0.0823 "},
  {"location":"Romania","chineseName":"罗马尼亚","abbr":"RO","code":"40","unitPrice":"0.0744 "},
  {"location":"Switzerland","chineseName":"瑞士","abbr":"CH","code":"41","unitPrice":"0.0712 "},
  {"location":"Austria","chineseName":"奥地利","abbr":"AT","code":"43","unitPrice":"0.1287 "},
  {"location":"United Kingdom","chineseName":"英国","abbr":"GB","code":"44","unitPrice":"0.0464 "},
  {"location":"Denmark","chineseName":"丹麦","abbr":"DK","code":"45","unitPrice":"0.0532 "},
  {"location":"Sweden","chineseName":"瑞典","abbr":"SE","code":"46","unitPrice":"0.1066 "},
  {"location":"Norway","chineseName":"挪威","abbr":"NO","code":"47","unitPrice":"0.0942 "},
  {"location":"Poland","chineseName":"波兰","abbr":"PL","code":"48","unitPrice":"0.0411 "},
  {"location":"Germany","chineseName":"德国","abbr":"DE","code":"49","unitPrice":"0.1000 "},
  {"location":"Peru","chineseName":"秘鲁","abbr":"PE","code":"51","unitPrice":"0.0440 "},
  {"location":"Mexico","chineseName":"墨西哥","abbr":"MX","code":"52","unitPrice":"0.0332 "},
  {"location":"Cuba","chineseName":"古巴","abbr":"CU","code":"53","unitPrice":"0.0638 "},
  {"location":"Argentina","chineseName":"阿根廷","abbr":"AR","code":"54","unitPrice":"0.0301 "},
  {"location":"Brazil","chineseName":"巴西","abbr":"BR","code":"55","unitPrice":"0.0167 "},
  {"location":"Chile","chineseName":"智利","abbr":"CL","code":"56","unitPrice":"0.0680 "},
  {"location":"Colombia","chineseName":"哥伦比亚","abbr":"CO","code":"57","unitPrice":"0.0414 "},
  {"location":"Venezuela","chineseName":"委内瑞拉","abbr":"VE","code":"58","unitPrice":"0.0203 "},
  {"location":"Malaysia","chineseName":"马来西亚","abbr":"MY","code":"60","unitPrice":"0.0362 "},
  {"location":"Australia","chineseName":"澳大利亚","abbr":"AU","code":"61","unitPrice":"0.0804 "},
  {"location":"Indonesia","chineseName":"印度尼西亚","abbr":"ID","code":"62","unitPrice":"0.0334 "},
  {"location":"Philippines","chineseName":"菲律宾","abbr":"PH","code":"63","unitPrice":"0.0355 "},
  {"location":"New Zealand","chineseName":"新西兰","abbr":"NZ","code":"64","unitPrice":"0.1162 "},
  {"location":"Singapore","chineseName":"新加坡","abbr":"SG","code":"65","unitPrice":"0.0380 "},
  {"location":"Thailand","chineseName":"泰国","abbr":"TH","code":"66","unitPrice":"0.0192 "},
  {"location":"Japan","chineseName":"日本","abbr":"JP","code":"81","unitPrice":"0.0750 "},
  {"location":"South Korea","chineseName":"韩国","abbr":"KR","code":"82","unitPrice":"0.0357 "},
  {"location":"Vietnam","chineseName":"越南","abbr":"VN","code":"84","unitPrice":"0.0399 "},
  {"location":"Turkey","chineseName":"土耳其","abbr":"TR","code":"90","unitPrice":"0.0090 "},
  {"location":"India","chineseName":"印度","abbr":"IN","code":"91","unitPrice":"0.0085 "},
  {"location":"Pakistan","chineseName":"巴基斯坦","abbr":"PK","code":"92","unitPrice":"0.0226 "},
  {"location":"Afghanistan","chineseName":"阿富汗","abbr":"AF","code":"93","unitPrice":"0.0731 "},
  {"location":"Sri Lanka","chineseName":"斯里兰卡","abbr":"LK","code":"94","unitPrice":"0.0690 "},
  {"location":"Myanmar","chineseName":"缅甸","abbr":"MM","code":"95","unitPrice":"0.0940 "},
  {"location":"Iran","chineseName":"伊朗","abbr":"IR","code":"98","unitPrice":"0.0337 "},
  {"location":"Morocco","chineseName":"摩洛哥","abbr":"MA","code":"212","unitPrice":"0.0832 "},
  {"location":"Algeria","chineseName":"阿尔及利亚","abbr":"DZ","code":"213","unitPrice":"0.1656 "},
  {"location":"Tunisia","chineseName":"突尼斯","abbr":"TN","code":"216","unitPrice":"0.1255 "},
  {"location":"Libya","chineseName":"利比亚","abbr":"LY","code":"218","unitPrice":"0.0569 "},
  {"location":"Gambia","chineseName":"冈比亚","abbr":"GM","code":"220","unitPrice":"0.0454 "},
  {"location":"Senegal","chineseName":"塞内加尔","abbr":"SN","code":"221","unitPrice":"0.0719 "},
  {"location":"Mauritania","chineseName":"毛里塔尼亚","abbr":"MR","code":"222","unitPrice":"0.0800 "},
  {"location":"Mali","chineseName":"马里","abbr":"ML","code":"223","unitPrice":"0.1927 "},
  {"location":"Guinea","chineseName":"几内亚","abbr":"GN","code":"224","unitPrice":"0.0884 "},
  {"location":"Ivory Coast","chineseName":"象牙海岸","abbr":"CI","code":"225","unitPrice":"0.0819 "},
  {"location":"Burkina Faso","chineseName":"布基纳法索","abbr":"BF","code":"226","unitPrice":"0.0776 "},
  {"location":"Niger","chineseName":"尼日尔","abbr":"NE","code":"227","unitPrice":"0.0769 "},
  {"location":"Togo","chineseName":"多哥","abbr":"TG","code":"228","unitPrice":"0.0348 "},
  {"location":"Benin","chineseName":"贝宁","abbr":"BJ","code":"229","unitPrice":"0.0498 "},
  {"location":"Mauritius","chineseName":"毛里求斯","abbr":"MU","code":"230","unitPrice":"0.0509 "},
  {"location":"Liberia","chineseName":"利比里亚","abbr":"LR","code":"231","unitPrice":"0.0709 "},
  {"location":"Sierra Leone","chineseName":"塞拉利昂","abbr":"SL","code":"232","unitPrice":"0.0305 "},
  {"location":"Ghana","chineseName":"加纳","abbr":"GH","code":"233","unitPrice":"0.0244 "},
  {"location":"Nigeria","chineseName":"尼日利亚","abbr":"NG","code":"234","unitPrice":"0.0314 "},
  {"location":"Chad","chineseName":"乍得","abbr":"TD","code":"235","unitPrice":"0.0378 "},
  {"location":"Central African Republic","chineseName":"中非共和国","abbr":"CF","code":"236","unitPrice":"0.0633 "},
  {"location":"Cameroon","chineseName":"喀麦隆","abbr":"CM","code":"237","unitPrice":"0.0548 "},
  {"location":"Cape Verde","chineseName":"开普","abbr":"CV","code":"238","unitPrice":"0.0869 "},
  {"location":"Sao Tome and Principe","chineseName":"圣多美和普林西比","abbr":"ST","code":"239","unitPrice":"0.1149 "},
  {"location":"Equatorial Guinea","chineseName":"赤道几内亚","abbr":"GQ","code":"240","unitPrice":"0.0863 "},
  {"location":"Gabon","chineseName":"加蓬","abbr":"GA","code":"241","unitPrice":"0.0357 "},
  {"location":"Republic Of The Congo","chineseName":"刚果共和国","abbr":"CG","code":"242","unitPrice":"0.0664 "},
  {"location":"Democratic Republic of theCongo","chineseName":"刚果民主共和国","abbr":"CD","code":"243","unitPrice":"0.0513 "},
  {"location":"Angola","chineseName":"安哥拉","abbr":"AO","code":"244","unitPrice":"0.0633 "},
  {"location":"Guinea-Bissau","chineseName":"几内亚比绍共和国","abbr":"GW","code":"245","unitPrice":"0.0978 "},
  {"location":"Seychelles","chineseName":"塞舌尔","abbr":"SC","code":"248","unitPrice":"0.0644 "},
  {"location":"Sudan","chineseName":"苏丹","abbr":"SD","code":"249","unitPrice":"0.0510 "},
  {"location":"Rwanda","chineseName":"卢旺达","abbr":"RW","code":"250","unitPrice":"0.0366 "},
  {"location":"Ethiopia","chineseName":"埃塞俄比亚","abbr":"ET","code":"251","unitPrice":"0.0336 "},
  {"location":"Somalia","chineseName":"索马里","abbr":"SO","code":"252","unitPrice":"0.0873 "},
  {"location":"Djibouti","chineseName":"吉布提","abbr":"DJ","code":"253","unitPrice":"0.1106 "},
  {"location":"Kenya","chineseName":"肯尼亚","abbr":"KE","code":"254","unitPrice":"0.0299 "},
  {"location":"Tanzania","chineseName":"坦桑尼亚","abbr":"TZ","code":"255","unitPrice":"0.0422 "},
  {"location":"Uganda","chineseName":"乌干达","abbr":"UG","code":"256","unitPrice":"0.0776 "},
  {"location":"Burundi","chineseName":"布隆迪","abbr":"BI","code":"257","unitPrice":"0.0383 "},
  {"location":"Mozambique","chineseName":"莫桑比克","abbr":"MZ","code":"258","unitPrice":"0.0315 "},
  {"location":"Zambia","chineseName":"赞比亚","abbr":"ZM","code":"260","unitPrice":"0.0422 "},
  {"location":"Madagascar","chineseName":"马达加斯加","abbr":"MG","code":"261","unitPrice":"0.0564 "},
  {"location":"Réunion Island","chineseName":"留尼汪","abbr":"RE","code":"262","unitPrice":"0.2108 "},
  {"location":"Zimbabwe","chineseName":"津巴布韦","abbr":"ZW","code":"263","unitPrice":"0.0253 "},
  {"location":"Namibia","chineseName":"纳米比亚","abbr":"NA","code":"264","unitPrice":"0.0429 "},
  {"location":"Malawi","chineseName":"马拉维","abbr":"MW","code":"265","unitPrice":"0.0486 "},
  {"location":"Lesotho","chineseName":"莱索托","abbr":"LS","code":"266","unitPrice":"0.0589 "},
  {"location":"Botswana","chineseName":"博茨瓦纳","abbr":"BW","code":"267","unitPrice":"0.0427 "},
  {"location":"Swaziland","chineseName":"斯威士兰","abbr":"SZ","code":"268","unitPrice":"0.0748 "},
  {"location":"Comoros","chineseName":"科摩罗","abbr":"KM","code":"269","unitPrice":"0.0459 "},
  {"location":"Mayotte","chineseName":"马约特","abbr":"YT","code":"269","unitPrice":"0.1589 "},
  {"location":"Eritrea","chineseName":"厄立特里亚","abbr":"ER","code":"291","unitPrice":"0.0915 "},
  {"location":"Aruba","chineseName":"阿鲁巴","abbr":"AW","code":"297","unitPrice":"0.0553 "},
  {"location":"Faroe Islands","chineseName":"法罗群岛","abbr":"FO","code":"298","unitPrice":"0.0158 "},
  {"location":"Greenland","chineseName":"格陵兰岛","abbr":"GL","code":"299","unitPrice":"0.0128 "},
  {"location":"Gibraltar","chineseName":"直布罗陀","abbr":"GI","code":"350","unitPrice":"0.0201 "},
  {"location":"Portugal","chineseName":"葡萄牙","abbr":"PT","code":"351","unitPrice":"0.0522 "},
  {"location":"Luxembourg","chineseName":"卢森堡","abbr":"LU","code":"352","unitPrice":"0.0157 "},
  {"location":"Ireland","chineseName":"爱尔兰","abbr":"IE","code":"353","unitPrice":"0.0824 "},
  {"location":"Iceland","chineseName":"冰岛","abbr":"IS","code":"354","unitPrice":"0.0333 "},
  {"location":"Albania","chineseName":"阿尔巴尼亚","abbr":"AL","code":"355","unitPrice":"0.0949 "},
  {"location":"Malta","chineseName":"马耳他","abbr":"MT","code":"356","unitPrice":"0.0316 "},
  {"location":"Cyprus","chineseName":"塞浦路斯","abbr":"CY","code":"357","unitPrice":"0.0335 "},
  {"location":"Finland","chineseName":"芬兰","abbr":"FI","code":"358","unitPrice":"0.1390 "},
  {"location":"Bulgaria","chineseName":"保加利亚","abbr":"BG","code":"359","unitPrice":"0.0737 "},
  {"location":"Lithuania","chineseName":"立陶宛","abbr":"LT","code":"370","unitPrice":"0.0419 "},
  {"location":"Latvia","chineseName":"拉脱维亚","abbr":"LV","code":"371","unitPrice":"0.0696 "},
  {"location":"Estonia","chineseName":"爱沙尼亚","abbr":"EE","code":"372","unitPrice":"0.1141 "},
  {"location":"Moldova","chineseName":"摩尔多瓦","abbr":"MD","code":"373","unitPrice":"0.0954 "},
  {"location":"Armenia","chineseName":"亚美尼亚","abbr":"AM","code":"374","unitPrice":"0.0813 "},
  {"location":"Belarus","chineseName":"白俄罗斯","abbr":"BY","code":"375","unitPrice":"0.0638 "},
  {"location":"Andorra","chineseName":"安道尔","abbr":"AD","code":"376","unitPrice":"0.0651 "},
  {"location":"Monaco","chineseName":"摩纳哥","abbr":"MC","code":"377","unitPrice":"0.0638 "},
  {"location":"San Marino","chineseName":"圣马力诺","abbr":"SM","code":"378","unitPrice":"0.0587 "},
  {"location":"Ukraine","chineseName":"乌克兰","abbr":"UA","code":"380","unitPrice":"0.0533 "},
  {"location":"Serbia","chineseName":"塞尔维亚","abbr":"RS","code":"381","unitPrice":"0.0472 "},
  {"location":"Montenegro","chineseName":"黑山","abbr":"ME","code":"382","unitPrice":"0.0358 "},
  {"location":"Croatia","chineseName":"克罗地亚","abbr":"HR","code":"385","unitPrice":"0.0801 "},
  {"location":"Slovenia","chineseName":"斯洛文尼亚","abbr":"SI","code":"386","unitPrice":"0.0383 "},
  {"location":"Bosniaand Herzegovina","chineseName":"波斯尼亚和黑塞哥维那","abbr":"BA","code":"387","unitPrice":"0.0772 "},
  {"location":"Macedonia","chineseName":"马其顿","abbr":"MK","code":"389","unitPrice":"0.0303 "},
  {"location":"Czech","chineseName":"捷克","abbr":"CZ","code":"420","unitPrice":"0.0801 "},
  {"location":"Slovakia","chineseName":"斯洛伐克","abbr":"SK","code":"421","unitPrice":"0.0999 "},
  {"location":"Liechtenstein","chineseName":"列支敦士登","abbr":"LI","code":"423","unitPrice":"0.0297 "},
  {"location":"Belize","chineseName":"伯利兹","abbr":"BZ","code":"501","unitPrice":"0.0330 "},
  {"location":"Guatemala","chineseName":"瓜地马拉","abbr":"GT","code":"502","unitPrice":"0.0555 "},
  {"location":"ElSalvador","chineseName":"萨尔瓦多","abbr":"SV","code":"503","unitPrice":"0.0574 "},
  {"location":"Honduras","chineseName":"洪都拉斯","abbr":"HN","code":"504","unitPrice":"0.0645 "},
  {"location":"Nicaragua","chineseName":"尼加拉瓜","abbr":"NI","code":"505","unitPrice":"0.0726 "},
  {"location":"CostaRica","chineseName":"哥斯达黎加","abbr":"CR","code":"506","unitPrice":"0.0694 "},
  {"location":"Panama","chineseName":"巴拿马","abbr":"PA","code":"507","unitPrice":"0.0723 "},
  {"location":"Saint Pierreand Miquelon","chineseName":"圣彼埃尔和密克隆岛","abbr":"PM","code":"508","unitPrice":"0.0580 "},
  {"location":"Haiti","chineseName":"海地","abbr":"HT","code":"509","unitPrice":"0.0848 "},
  {"location":"Guadeloupe","chineseName":"瓜德罗普岛","abbr":"GP","code":"590","unitPrice":"0.2772 "},
  {"location":"Bolivia","chineseName":"玻利维亚","abbr":"BO","code":"591","unitPrice":"0.0649 "},
  {"location":"Guyana","chineseName":"圭亚那","abbr":"GY","code":"592","unitPrice":"0.0726 "},
  {"location":"Ecuador","chineseName":"厄瓜多尔","abbr":"EC","code":"593","unitPrice":"0.1068 "},
  {"location":"French Guiana","chineseName":"法属圭亚那","abbr":"GF","code":"594","unitPrice":"0.1515 "},
  {"location":"Paraguay","chineseName":"巴拉圭","abbr":"PY","code":"595","unitPrice":"0.0306 "},
  {"location":"Suriname","chineseName":"苏里南","abbr":"SR","code":"597","unitPrice":"0.0495 "},
  {"location":"Uruguay","chineseName":"乌拉圭","abbr":"UY","code":"598","unitPrice":"0.1093 "},
  {"location":"Caribisch Nederland","chineseName":"荷兰加勒比","abbr":"BQ","code":"599","unitPrice":"0.0443 "},
  {"location":"Curacao","chineseName":"库拉索","abbr":"CW","code":"599","unitPrice":"0.0489 "},
  {"location":"East Timor","chineseName":"东帝汶","abbr":"TL","code":"670","unitPrice":"0.0656 "},
  {"location":"Brunei","chineseName":"文莱","abbr":"BN","code":"673","unitPrice":"0.0173 "},
  {"location":"Nauru","chineseName":"拿鲁岛","abbr":"NR","code":"674","unitPrice":"0.0842 "},
  {"location":"Papua New Guinea","chineseName":"巴布亚新几内亚","abbr":"PG","code":"675","unitPrice":"0.0692 "},
  {"location":"Tonga","chineseName":"汤加","abbr":"TO","code":"676","unitPrice":"0.0371 "},
  {"location":"Solomon Islands","chineseName":"所罗门群岛","abbr":"SB","code":"677","unitPrice":"0.0303 "},
  {"location":"Vanuatu","chineseName":"瓦努阿图","abbr":"VU","code":"678","unitPrice":"0.0611 "},
  {"location":"Fiji","chineseName":"斐济","abbr":"FJ","code":"679","unitPrice":"0.0367 "},
  {"location":"Palau","chineseName":"帕劳","abbr":"PW","code":"680","unitPrice":"0.0855 "},
  {"location":"Cook Islands","chineseName":"库克群岛","abbr":"CK","code":"682","unitPrice":"0.0403 "},
  {"location":"Samoa","chineseName":"萨摩亚","abbr":"WS","code":"685","unitPrice":"0.0774 "},
  {"location":"Kiribati","chineseName":"基里巴斯","abbr":"KI","code":"686","unitPrice":"0.0510 "},
  {"location":"New Caledonia","chineseName":"新喀里多尼亚","abbr":"NC","code":"687","unitPrice":"0.2356 "},
  {"location":"French Polynesia","chineseName":"法属波利尼西亚","abbr":"PF","code":"689","unitPrice":"0.1246 "},
  {"location":"Micronesia","chineseName":"密克罗尼西亚","abbr":"FM","code":"691","unitPrice":"0.1491 "},
  {"location":"Marshall Islands","chineseName":"马绍尔群岛","abbr":"MH","code":"692","unitPrice":"0.1323 "},
  {"location":"Korea Democratic Rep.","chineseName":"朝鲜","abbr":"KP","code":"850","unitPrice":"0.0505 "},
  {"location":"Cambodia","chineseName":"柬埔寨","abbr":"KH","code":"855","unitPrice":"0.0561 "},
  {"location":"Laos","chineseName":"老挝","abbr":"LA","code":"856","unitPrice":"0.0456 "},
  {"location":"Bangladesh","chineseName":"孟加拉国","abbr":"BD","code":"880","unitPrice":"0.0846 "},
  {"location":"Maldives","chineseName":"马尔代夫","abbr":"MV","code":"960","unitPrice":"0.0340 "},
  {"location":"Lebanon","chineseName":"黎巴嫩","abbr":"LB","code":"961","unitPrice":"0.0464 "},
  {"location":"Jordan","chineseName":"约旦","abbr":"JO","code":"962","unitPrice":"0.0700 "},
  {"location":"Syria","chineseName":"叙利亚","abbr":"SY","code":"963","unitPrice":"0.0574 "},
  {"location":"Iraq","chineseName":"伊拉克","abbr":"IQ","code":"964","unitPrice":"0.0611 "},
  {"location":"Kuwait","chineseName":"科威特","abbr":"KW","code":"965","unitPrice":"0.0518 "},
  {"location":"Saudi Arabia","chineseName":"沙特阿拉伯","abbr":"SA","code":"966","unitPrice":"0.0357 "},
  {"location":"Yemen","chineseName":"也门","abbr":"YE","code":"967","unitPrice":"0.0284 "},
  {"location":"Oman","chineseName":"阿曼","abbr":"OM","code":"968","unitPrice":"0.0750 "},
  {"location":"United Arab Emirates","chineseName":"阿拉伯联合酋长国","abbr":"AE","code":"971","unitPrice":"0.0415 "},
  {"location":"Israel","chineseName":"以色列","abbr":"IL","code":"972","unitPrice":"0.0173 "},
  {"location":"Bahrain","chineseName":"巴林","abbr":"BH","code":"973","unitPrice":"0.0229 "},
  {"location":"Qatar","chineseName":"卡塔尔","abbr":"QA","code":"974","unitPrice":"0.0526 "},
  {"location":"Bhutan","chineseName":"不丹","abbr":"BT","code":"975","unitPrice":"0.0396 "},
  {"location":"Mongolia","chineseName":"蒙古","abbr":"MN","code":"976","unitPrice":"0.0645 "},
  {"location":"Nepal","chineseName":"尼泊尔","abbr":"NP","code":"977","unitPrice":"0.1029 "},
  {"location":"Tajikistan","chineseName":"塔吉克斯坦","abbr":"TJ","code":"992","unitPrice":"0.0607 "},
  {"location":"Turkmenistan","chineseName":"土库曼斯坦","abbr":"TM","code":"993","unitPrice":"0.0580 "},
  {"location":"Azerbaijan","chineseName":"阿塞拜疆","abbr":"AZ","code":"994","unitPrice":"0.1462 "},
  {"location":"Georgia","chineseName":"格鲁吉亚","abbr":"GE","code":"995","unitPrice":"0.0218 "},
  {"location":"Kyrgyzstan","chineseName":"吉尔吉斯斯坦","abbr":"KG","code":"996","unitPrice":"0.0564 "},
  {"location":"Uzbekistan","chineseName":"乌兹别克斯坦","abbr":"UZ","code":"998","unitPrice":"0.1411 "},
  {"location":"Bahamas","chineseName":"巴哈马","abbr":"BS","code":"1242","unitPrice":"0.0390 "},
  {"location":"Barbados","chineseName":"巴巴多斯","abbr":"BB","code":"1246","unitPrice":"0.0521 "},
  {"location":"Anguilla","chineseName":"安圭拉","abbr":"AI","code":"1264","unitPrice":"0.0454 "},
  {"location":"Antigua and Barbuda","chineseName":"安提瓜和巴布达","abbr":"AG","code":"1268","unitPrice":"0.0781 "},
  {"location":"VirginIslands,British","chineseName":"英属处女群岛","abbr":"VG","code":"1284","unitPrice":"0.0480 "},
  {"location":"Cayman Islands","chineseName":"开曼群岛","abbr":"KY","code":"1345","unitPrice":"0.0463 "},
  {"location":"Bermuda","chineseName":"百慕大群岛","abbr":"BM","code":"1441","unitPrice":"0.0548 "},
  {"location":"Grenada","chineseName":"格林纳达","abbr":"GD","code":"1473","unitPrice":"0.0489 "},
  {"location":"Turksand Caicos Islands","chineseName":"特克斯和凯科斯群岛","abbr":"TC","code":"1649","unitPrice":"0.0411 "},
  {"location":"Montserrat","chineseName":"蒙特塞拉特岛","abbr":"MS","code":"1664","unitPrice":"0.0685 "},
  {"location":"Guam","chineseName":"关岛","abbr":"GU","code":"1671","unitPrice":"0.0564 "},
  {"location":"American Samoa","chineseName":"美属萨摩亚","abbr":"AS","code":"1684","unitPrice":"0.1100 "},
  {"location":"Saint Lucia","chineseName":"圣露西亚","abbr":"LC","code":"1758","unitPrice":"0.0414 "},
  {"location":"Dominica","chineseName":"多米尼加","abbr":"DM","code":"1767","unitPrice":"0.0550 "},
  {"location":"Saint Vincent and The Grenadines","chineseName":"圣文森特和格林纳丁斯","abbr":"VC","code":"1784","unitPrice":"0.0619 "},
  {"location":"Puerto Rico","chineseName":"波多黎各","abbr":"PR","code":"1787","unitPrice":"0.0564 "},
  {"location":"dominican republic","chineseName":"多米尼加共和国","abbr":"DO","code":"1809","unitPrice":"0.0519 "},
  {"location":"Trinidadand Tobago","chineseName":"特立尼达和多巴哥","abbr":"TT","code":"1868","unitPrice":"0.0384 "},
  {"location":"Saint Kitts and Nevis","chineseName":"圣基茨和尼维斯","abbr":"KN","code":"1869","unitPrice":"0.0947 "},
  {"location":"Jamaica","chineseName":"牙买加","abbr":"JM","code":"1876","unitPrice":"0.0374 "}
];

export function getNationCodes() {
  return nationCodes;
}