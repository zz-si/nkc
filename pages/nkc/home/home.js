(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var data = NKC.methods.getDataById("data");

var modifyAd = function modifyAd(ad, type) {
  ad.type = type;
};

for (var i = 0; i < data.ads.movable.length; i++) {
  var ad = data.ads.movable[i];
  modifyAd(ad, "movable");
}

for (var _i = 0; _i < data.ads.fixed.length; _i++) {
  var _ad = data.ads.fixed[_i];
  modifyAd(_ad, "fixed");
}

var app = new Vue({
  el: "#app",
  data: {
    ads: data.ads,
    recommendForums: data.recommendForums,
    columns: data.columns,
    goods: data.goods,
    toppedThreads: data.toppedThreads,
    showShopGoods: data.showGoods ? "t" : ""
  },
  mounted: function mounted() {
    window.SelectImage = new NKC.methods.selectImage();
    window.MoveThread = new NKC.modules.MoveThread();
  },
  computed: {
    selectedRecommendForumsId: function selectedRecommendForumsId() {
      return data.recommendForums.map(function (f) {
        return f.fid;
      });
    }
  },
  methods: {
    checkString: NKC.methods.checkData.checkString,
    checkNumber: NKC.methods.checkData.checkNumber,
    getUrl: NKC.methods.tools.getUrl,
    floatUserInfo: NKC.methods.tools.floatUserInfo,
    visitUrl: NKC.methods.visitUrl,
    selectLocalFile: function selectLocalFile(ad) {
      var options = {};

      if (ad.type === "movable") {
        options.aspectRatio = 800 / 336;
      } else {
        options.aspectRatio = 400 / 253;
      }

      SelectImage.show(function (data) {
        var formData = new FormData();
        formData.append("cover", data);
        formData.append("topType", ad.type);
        formData.append("tid", ad.tid);
        nkcUploadFile("/nkc/home", "POST", formData).then(function (data) {
          ad.cover = data.coverHash;
        })["catch"](sweetError);
        SelectImage.close();
      }, options);
    },
    move: function move(ad, type) {
      var ads;

      if (ad.type === "movable") {
        ads = this.ads.movable;
      } else {
        ads = this.ads.fixed;
      }

      var index = ads.indexOf(ad);
      if (type === "left" && index === 0 || type === "right" && index + 1 === ads.length) return;
      var newIndex;

      if (type === "left") {
        newIndex = index - 1;
      } else {
        newIndex = index + 1;
      }

      var otherAd = ads[newIndex];
      ads.splice(index, 1, otherAd);
      ads.splice(newIndex, 1, ad);
    },
    saveAds: function saveAds() {
      var _this$ads = this.ads,
          movable = _this$ads.movable,
          fixed = _this$ads.fixed,
          movableOrder = _this$ads.movableOrder,
          fixedOrder = _this$ads.fixedOrder;
      var self = this;
      Promise.resolve().then(function () {
        movable.concat(fixed).map(function (ad) {
          self.checkString(ad.title, {
            name: "标题",
            minLength: 1,
            maxLength: 200
          });
          if (!ad.cover) throw "封面图不能为空";
          if (!ad.tid) throw "文章ID不能为空";
        });
        return nkcAPI("/nkc/home", "PUT", {
          operation: "saveAds",
          movable: movable,
          fixed: fixed,
          movableOrder: movableOrder,
          fixedOrder: fixedOrder
        });
      }).then(function () {
        sweetSuccess("保存成功");
      })["catch"](sweetError);
    },
    remove: function remove(ads, index) {
      ads.splice(index, 1);
      /*sweetQuestion("确定要执行删除操作？")
        .then(() => {
          ads.splice(index, 1)
        })
        .catch(() => {})*/
    },
    addForum: function addForum() {
      var self = this;
      MoveThread.open(function (data) {
        var originForums = data.originForums;
        originForums.map(function (forum) {
          if (!self.selectedRecommendForumsId.includes(forum.fid)) {
            self.recommendForums.push(forum);
          }
        });
        MoveThread.close();
      }, {
        hideMoveType: true
      });
    },
    moveForum: function moveForum(arr, f, type) {
      var index = arr.indexOf(f);
      if (type === "left" && index === 0 || type === "right" && index + 1 === arr.length) return;
      var newIndex;

      if (type === "left") {
        newIndex = index - 1;
      } else {
        newIndex = index + 1;
      }

      var otherAd = arr[newIndex];
      arr.splice(index, 1, otherAd);
      arr.splice(newIndex, 1, f);
    },
    removeForum: function removeForum(arr, index) {
      arr.splice(index, 1);
      /*const self = this;
      sweetQuestion("确定要执行删除操作？")
        .then(() => {
          arr.splice(index, 1);
        })
        .catch(() => {})*/
    },
    saveRecommendForums: function saveRecommendForums() {
      var forumsId = this.recommendForums.map(function (forum) {
        return forum.fid;
      });
      nkcAPI("/nkc/home", "PUT", {
        operation: "saveRecommendForums",
        forumsId: forumsId
      }).then(function () {
        sweetSuccess("保存成功");
      })["catch"](sweetError);
    },
    saveColumns: function saveColumns() {
      var columnsId = this.columns.map(function (c) {
        return c._id;
      });
      nkcAPI("/nkc/home", "PUT", {
        operation: "saveColumns",
        columnsId: columnsId
      }).then(function () {
        sweetSuccess("保存成功");
      })["catch"](sweetError);
    },
    saveGoods: function saveGoods() {
      var goodsId = this.goods.map(function (g) {
        return g.productId;
      });
      var showShopGoods = !!this.showShopGoods;
      nkcAPI("/nkc/home", "PUT", {
        operation: "saveGoods",
        goodsId: goodsId,
        showShopGoods: showShopGoods
      }).then(function () {
        sweetSuccess("保存成功");
      })["catch"](sweetError);
    },
    saveToppedThreads: function saveToppedThreads() {
      var toppedThreadsId = this.toppedThreads.map(function (t) {
        return t.tid;
      });
      nkcAPI("/nkc/home", "PUT", {
        operation: "saveToppedThreads",
        toppedThreadsId: toppedThreadsId
      }).then(function () {
        sweetSuccess("保存成功");
      })["catch"](sweetError);
    }
  }
});

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwYWdlcy9ua2MvaG9tZS9ob21lLm1qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEsSUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLE9BQUosQ0FBWSxXQUFaLENBQXdCLE1BQXhCLENBQWI7O0FBQ0EsSUFBTSxRQUFRLEdBQUcsU0FBWCxRQUFXLENBQUMsRUFBRCxFQUFLLElBQUwsRUFBYztBQUM3QixFQUFBLEVBQUUsQ0FBQyxJQUFILEdBQVUsSUFBVjtBQUNELENBRkQ7O0FBSUEsS0FBSSxJQUFJLENBQUMsR0FBRyxDQUFaLEVBQWUsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFMLENBQVMsT0FBVCxDQUFpQixNQUFwQyxFQUE0QyxDQUFDLEVBQTdDLEVBQWlEO0FBQy9DLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFMLENBQVMsT0FBVCxDQUFpQixDQUFqQixDQUFYO0FBQ0EsRUFBQSxRQUFRLENBQUMsRUFBRCxFQUFLLFNBQUwsQ0FBUjtBQUNEOztBQUVELEtBQUksSUFBSSxFQUFDLEdBQUcsQ0FBWixFQUFlLEVBQUMsR0FBRyxJQUFJLENBQUMsR0FBTCxDQUFTLEtBQVQsQ0FBZSxNQUFsQyxFQUEwQyxFQUFDLEVBQTNDLEVBQStDO0FBQzdDLE1BQU0sR0FBRSxHQUFHLElBQUksQ0FBQyxHQUFMLENBQVMsS0FBVCxDQUFlLEVBQWYsQ0FBWDtBQUNBLEVBQUEsUUFBUSxDQUFDLEdBQUQsRUFBSyxPQUFMLENBQVI7QUFDRDs7QUFFRCxJQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUosQ0FBUTtBQUNsQixFQUFBLEVBQUUsRUFBRSxNQURjO0FBRWxCLEVBQUEsSUFBSSxFQUFFO0FBQ0osSUFBQSxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBRE47QUFFSixJQUFBLGVBQWUsRUFBRSxJQUFJLENBQUMsZUFGbEI7QUFHSixJQUFBLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FIVjtB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QW5CUyxDQUFSLENBQVoiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJjb25zdCBkYXRhID0gTktDLm1ldGhvZHMuZ2V0RGF0YUJ5SWQoXCJkYXRhXCIpO1xyXG5jb25zdCBtb2RpZnlBZCA9IChhZCwgdHlwZSkgPT4ge1xyXG4gIGFkLnR5cGUgPSB0eXBlO1xyXG59O1xyXG5cclxuZm9yKGxldCBpID0gMDsgaSA8IGRhdGEuYWRzLm1vdmFibGUubGVuZ3RoOyBpKyspIHtcclxuICBjb25zdCBhZCA9IGRhdGEuYWRzLm1vdmFibGVbaV07XHJcbiAgbW9kaWZ5QWQoYWQsIFwibW92YWJsZVwiKTtcclxufVxyXG5cclxuZm9yKGxldCBpID0gMDsgaSA8IGRhdGEuYWRzLmZpeGVkLmxlbmd0aDsgaSsrKSB7XHJcbiAgY29uc3QgYWQgPSBkYXRhLmFkcy5maXhlZFtpXTtcclxuICBtb2RpZnlBZChhZCwgXCJmaXhlZFwiKTtcclxufVxyXG5cclxuY29uc3QgYXBwID0gbmV3IFZ1ZSh7XHJcbiAgZWw6IFwiI2FwcFwiLFxyXG4gIGRhdGE6IHtcclxuICAgIGFkczogZGF0YS5hZHMsXHJcbiAgICByZWNvbW1lbmRGb3J1bXM6IGRhdGEucmVjb21tZW5kRm9ydW1zLFxyXG4gICAgY29sdW1uczogZGF0YS5jb2x1bW5zLFxyXG4gICAgZ29vZHM6IGRhdGEuZ29vZHMsXHJcbiAgICB0b3BwZWRUaHJlYWRzOiBkYXRhLnRvcHBlZFRocmVhZHMsXHJcbiAgICBzaG93U2hvcEdvb2RzOiAoZGF0YS5zaG93R29vZHM/IFwidFwiOiBcIlwiKVxyXG4gIH0sXHJcbiAgbW91bnRlZCgpIHtcclxuICAgIHdpbmRvdy5TZWxlY3RJbWFnZSA9IG5ldyBOS0MubWV0aG9kcy5zZWxlY3RJbWFnZSgpO1xyXG4gICAgd2luZG93Lk1vdmVUaHJlYWQgPSBuZXcgTktDLm1vZHVsZXMuTW92ZVRocmVhZCgpO1xyXG4gIH0sXHJcbiAgY29tcHV0ZWQ6IHtcclxuICAgIHNlbGVjdGVkUmVjb21tZW5kRm9ydW1zSWQoKSB7XHJcbiAgICAgIHJldHVybiBkYXRhLnJlY29tbWVuZEZvcnVtcy5tYXAoZiA9PiBmLmZpZCk7XHJcbiAgICB9XHJcbiAgfSxcclxuICBtZXRob2RzOiB7XHJcbiAgICBjaGVja1N0cmluZzogTktDLm1ldGhvZHMuY2hlY2tEYXRhLmNoZWNrU3RyaW5nLFxyXG4gICAgY2hlY2tOdW1iZXI6IE5LQy5tZXRob2RzLmNoZWNrRGF0YS5jaGVja051bWJlcixcclxuICAgIGdldFVybDogTktDLm1ldGhvZHMudG9vbHMuZ2V0VXJsLFxyXG4gICAgZmxvYXRVc2VySW5mbzogTktDLm1ldGhvZHMudG9vbHMuZmxvYXRVc2VySW5mbyxcclxuICAgIHZpc2l0VXJsOiBOS0MubWV0aG9kcy52aXNpdFVybCxcclxuICAgIHNlbGVjdExvY2FsRmlsZShhZCkge1xyXG4gICAgICBjb25zdCBvcHRpb25zID0ge307XHJcbiAgICAgIGlmKGFkLnR5cGUgPT09IFwibW92YWJsZVwiKSB7XHJcbiAgICAgICAgb3B0aW9ucy5hc3BlY3RSYXRpbyA9IDgwMC8zMzY7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgb3B0aW9ucy5hc3BlY3RSYXRpbyA9IDQwMC8yNTM7XHJcbiAgICAgIH1cclxuICAgICAgU2VsZWN0SW1hZ2Uuc2hvdyhkYXRhID0+IHtcclxuICAgICAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xyXG4gICAgICAgIGZvcm1EYXRhLmFwcGVuZChcImNvdmVyXCIsIGRhdGEpO1xyXG4gICAgICAgIGZvcm1EYXRhLmFwcGVuZChcInRvcFR5cGVcIiwgYWQudHlwZSk7XHJcbiAgICAgICAgZm9ybURhdGEuYXBwZW5kKFwidGlkXCIsIGFkLnRpZCk7XHJcbiAgICAgICAgbmtjVXBsb2FkRmlsZShcIi9ua2MvaG9tZVwiLCBcIlBPU1RcIiwgZm9ybURhdGEpXHJcbiAgICAgICAgICAudGhlbihkYXRhID0+IHtcclxuICAgICAgICAgICAgYWQuY292ZXIgPSBkYXRhLmNvdmVySGFzaDtcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuY2F0Y2goc3dlZXRFcnJvcik7XHJcbiAgICAgICAgU2VsZWN0SW1hZ2UuY2xvc2UoKTtcclxuICAgICAgfSwgb3B0aW9ucyk7XHJcbiAgICB9LFxyXG4gICAgbW92ZShhZCwgdHlwZSkge1xyXG4gICAgICBsZXQgYWRzO1xyXG4gICAgICBpZihhZC50eXBlID09PSBcIm1vdmFibGVcIikge1xyXG4gICAgICAgIGFkcyA9IHRoaXMuYWRzLm1vdmFibGU7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgYWRzID0gdGhpcy5hZHMuZml4ZWQ7XHJcbiAgICAgIH1cclxuICAgICAgY29uc3QgaW5kZXggPSBhZHMuaW5kZXhPZihhZCk7XHJcbiAgICAgIGlmKCh0eXBlID09PSBcImxlZnRcIiAmJiBpbmRleCA9PT0gMCkgfHwgKHR5cGUgPT09IFwicmlnaHRcIiAmJiBpbmRleCsxID09PSBhZHMubGVuZ3RoKSkgcmV0dXJuO1xyXG4gICAgICBsZXQgbmV3SW5kZXg7XHJcbiAgICAgIGlmKHR5cGUgPT09IFwibGVmdFwiKSB7XHJcbiAgICAgICAgbmV3SW5kZXggPSBpbmRleCAtIDE7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbmV3SW5kZXggPSBpbmRleCArIDE7XHJcbiAgICAgIH1cclxuICAgICAgY29uc3Qgb3RoZXJBZCA9IGFkc1tuZXdJbmRleF07XHJcbiAgICAgIGFkcy5zcGxpY2UoaW5kZXgsIDEsIG90aGVyQWQpO1xyXG4gICAgICBhZHMuc3BsaWNlKG5ld0luZGV4LCAxLCBhZCk7XHJcbiAgICB9LFxyXG4gICAgc2F2ZUFkcygpe1xyXG4gICAgICBjb25zdCB7bW92YWJsZSwgZml4ZWQsIG1vdmFibGVPcmRlciwgZml4ZWRPcmRlcn0gPSB0aGlzLmFkcztcclxuICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XHJcbiAgICAgIFByb21pc2UucmVzb2x2ZSgpXHJcbiAgICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgbW92YWJsZS5jb25jYXQoZml4ZWQpLm1hcChhZCA9PiB7XHJcbiAgICAgICAgICAgIHNlbGYuY2hlY2tTdHJpbmcoYWQudGl0bGUsIHtcclxuICAgICAgICAgICAgICBuYW1lOiBcIuagh+mimFwiLFxyXG4gICAgICAgICAgICAgIG1pbkxlbmd0aDogMSxcclxuICAgICAgICAgICAgICBtYXhMZW5ndGg6IDIwMFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaWYoIWFkLmNvdmVyKSB0aHJvdyBcIuWwgemdouWbvuS4jeiDveS4uuepulwiO1xyXG4gICAgICAgICAgICBpZighYWQudGlkKSB0aHJvdyBcIuaWh+eroElE5LiN6IO95Li656m6XCI7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIHJldHVybiBua2NBUEkoXCIvbmtjL2hvbWVcIiwgXCJQVVRcIiwge1xyXG4gICAgICAgICAgICBvcGVyYXRpb246IFwic2F2ZUFkc1wiLFxyXG4gICAgICAgICAgICBtb3ZhYmxlLFxyXG4gICAgICAgICAgICBmaXhlZCxcclxuICAgICAgICAgICAgbW92YWJsZU9yZGVyLFxyXG4gICAgICAgICAgICBmaXhlZE9yZGVyXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAgIHN3ZWV0U3VjY2VzcyhcIuS/neWtmOaIkOWKn1wiKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaChzd2VldEVycm9yKTtcclxuICAgIH0sXHJcbiAgICByZW1vdmUoYWRzLCBpbmRleCl7XHJcbiAgICAgIGFkcy5zcGxpY2UoaW5kZXgsIDEpXHJcbiAgICAgIC8qc3dlZXRRdWVzdGlvbihcIuehruWumuimgeaJp+ihjOWIoOmZpOaTjeS9nO+8n1wiKVxyXG4gICAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAgIGFkcy5zcGxpY2UoaW5kZXgsIDEpXHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goKCkgPT4ge30pKi9cclxuXHJcbiAgICB9LFxyXG4gICAgYWRkRm9ydW0oKSB7XHJcbiAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xyXG4gICAgICBNb3ZlVGhyZWFkLm9wZW4oZGF0YSA9PiB7XHJcbiAgICAgICAgY29uc3Qge29yaWdpbkZvcnVtc30gPSBkYXRhO1xyXG4gICAgICAgIG9yaWdpbkZvcnVtcy5tYXAoZm9ydW0gPT4ge1xyXG4gICAgICAgICAgaWYoIXNlbGYuc2VsZWN0ZWRSZWNvbW1lbmRGb3J1bXNJZC5pbmNsdWRlcyhmb3J1bS5maWQpKSB7XHJcbiAgICAgICAgICAgIHNlbGYucmVjb21tZW5kRm9ydW1zLnB1c2goZm9ydW0pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgTW92ZVRocmVhZC5jbG9zZSgpO1xyXG4gICAgICB9LCB7XHJcbiAgICAgICAgaGlkZU1vdmVUeXBlOiB0cnVlXHJcbiAgICAgIH0pXHJcbiAgICB9LFxyXG4gICAgbW92ZUZvcnVtKGFyciwgZiwgdHlwZSkge1xyXG4gICAgICBjb25zdCBpbmRleCA9IGFyci5pbmRleE9mKGYpO1xyXG4gICAgICBpZigodHlwZSA9PT0gXCJsZWZ0XCIgJiYgaW5kZXggPT09IDApIHx8ICh0eXBlID09PSBcInJpZ2h0XCIgJiYgaW5kZXgrMSA9PT0gYXJyLmxlbmd0aCkpIHJldHVybjtcclxuICAgICAgbGV0IG5ld0luZGV4O1xyXG4gICAgICBpZih0eXBlID09PSBcImxlZnRcIikge1xyXG4gICAgICAgIG5ld0luZGV4ID0gaW5kZXggLSAxO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIG5ld0luZGV4ID0gaW5kZXggKyAxO1xyXG4gICAgICB9XHJcbiAgICAgIGNvbnN0IG90aGVyQWQgPSBhcnJbbmV3SW5kZXhdO1xyXG4gICAgICBhcnIuc3BsaWNlKGluZGV4LCAxLCBvdGhlckFkKTtcclxuICAgICAgYXJyLnNwbGljZShuZXdJbmRleCwgMSwgZik7XHJcbiAgICB9LFxyXG4gICAgcmVtb3ZlRm9ydW0oYXJyLCBpbmRleCkge1xyXG4gICAgICBhcnIuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgLypjb25zdCBzZWxmID0gdGhpcztcclxuICAgICAgc3dlZXRRdWVzdGlvbihcIuehruWumuimgeaJp+ihjOWIoOmZpOaTjeS9nO+8n1wiKVxyXG4gICAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAgIGFyci5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKCgpID0+IHt9KSovXHJcbiAgICB9LFxyXG4gICAgc2F2ZVJlY29tbWVuZEZvcnVtcygpIHtcclxuICAgICAgY29uc3QgZm9ydW1zSWQgPSB0aGlzLnJlY29tbWVuZEZvcnVtcy5tYXAoZm9ydW0gPT4gZm9ydW0uZmlkKTtcclxuICAgICAgbmtjQVBJKFwiL25rYy9ob21lXCIsIFwiUFVUXCIsIHtcclxuICAgICAgICBvcGVyYXRpb246IFwic2F2ZVJlY29tbWVuZEZvcnVtc1wiLFxyXG4gICAgICAgIGZvcnVtc0lkXHJcbiAgICAgIH0pXHJcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICBzd2VldFN1Y2Nlc3MoXCLkv53lrZjmiJDlip9cIik7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goc3dlZXRFcnJvcik7XHJcbiAgICB9LFxyXG4gICAgc2F2ZUNvbHVtbnMoKXtcclxuICAgICAgY29uc3QgY29sdW1uc0lkID0gdGhpcy5jb2x1bW5zLm1hcChjID0+IGMuX2lkKTtcclxuICAgICAgbmtjQVBJKFwiL25rYy9ob21lXCIsIFwiUFVUXCIsIHtcclxuICAgICAgICBvcGVyYXRpb246IFwic2F2ZUNvbHVtbnNcIixcclxuICAgICAgICBjb2x1bW5zSWRcclxuICAgICAgfSlcclxuICAgICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICBzd2VldFN1Y2Nlc3MoXCLkv53lrZjmiJDlip9cIik7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goc3dlZXRFcnJvcik7XHJcbiAgICB9LFxyXG4gICAgc2F2ZUdvb2RzKCkge1xyXG4gICAgICBjb25zdCBnb29kc0lkID0gdGhpcy5nb29kcy5tYXAoZyA9PiBnLnByb2R1Y3RJZCk7XHJcbiAgICAgIGNvbnN0IHNob3dTaG9wR29vZHMgPSAhIXRoaXMuc2hvd1Nob3BHb29kcztcclxuICAgICAgbmtjQVBJKFwiL25rYy9ob21lXCIsIFwiUFVUXCIsIHtcclxuICAgICAgICBvcGVyYXRpb246IFwic2F2ZUdvb2RzXCIsXHJcbiAgICAgICAgZ29vZHNJZCxcclxuICAgICAgICBzaG93U2hvcEdvb2RzXHJcbiAgICAgIH0pXHJcbiAgICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgc3dlZXRTdWNjZXNzKFwi5L+d5a2Y5oiQ5YqfXCIpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKHN3ZWV0RXJyb3IpO1xyXG4gICAgfSxcclxuICAgIHNhdmVUb3BwZWRUaHJlYWRzKCkge1xyXG4gICAgICBjb25zdCB0b3BwZWRUaHJlYWRzSWQgPSB0aGlzLnRvcHBlZFRocmVhZHMubWFwKHQgPT4gdC50aWQpO1xyXG4gICAgICBua2NBUEkoXCIvbmtjL2hvbWVcIiwgXCJQVVRcIiwge1xyXG4gICAgICAgIG9wZXJhdGlvbjogXCJzYXZlVG9wcGVkVGhyZWFkc1wiLFxyXG4gICAgICAgIHRvcHBlZFRocmVhZHNJZFxyXG4gICAgICB9KVxyXG4gICAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAgIHN3ZWV0U3VjY2VzcyhcIuS/neWtmOaIkOWKn1wiKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaChzd2VldEVycm9yKVxyXG4gICAgfVxyXG4gIH1cclxufSk7XHJcbiJdfQ==
