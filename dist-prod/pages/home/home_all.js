!function(e){"function"==typeof define&&define.amd?define(e):e()}((function(){"use strict";$((function(){var e=new Swiper(".swiper-container",{pagination:{el:".swiper-pagination",type:"fraction"},navigation:{nextEl:".swiper-button-next",prevEl:".swiper-button-prev"},loop:!0,autoplay:{delay:3e3,disableOnInteraction:!1}});e.el.onmouseover=function(){e.autoplay.stop()},e.el.onmouseleave=function(){e.autoplay.start()},$(window).scroll((function(e){var n=$(window).scrollTop(),o=$(".navbar-default.nkcshade");n>10?o.addClass("home-fixed-header"):o.removeClass("home-fixed-header")}))}))}));