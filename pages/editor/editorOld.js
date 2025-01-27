/* 编辑器 2019-9-11

* 对于编辑器而言，编辑类型总共只有以下5中情况：
*   newThread: 发表新文章
*   newPost: 发表新回复
*   modifyThread: 修改文章内容
*   modifyPost: 修改回复内容
*   modifyForumDeclare: 编辑专业说明
*
* 保存草稿的类型如下：
*   forum: 发表新文章的草稿
*   thread: 发表新回复的草稿
*   post: 编辑回复或文章的草稿
*   forumDeclare: 编辑专业说明的草稿
*
* */

import {nkcAPI} from "../lib/js/netAPI";

window.editor = undefined;
window.PostInfo = undefined;
window.PostButton = undefined;
window.FloatPostButton = undefined;
window.PostToColumn = undefined;
window.PostSurvey = undefined;
window.ForumSelector = undefined;
window.CommonModal = undefined;
// 标志：编辑器是否已初始化
let EditorReady = false;
window.data = undefined;
import {getEditorConfigs} from "../lib/js/editor";
import {objToStr} from "../lib/js/tools";
import Editor from "../lib/vue/Editor";
import ImageSelector from "../lib/vue/ImageSelector";
import ResourceSelector from "../lib/vue/ResourceSelector";
import {fileToBase64} from "../lib/js/file";
$(function() {
  window.data = NKC.methods.getDataById("data");
  for(const c of window.data.threadCategories) {
    c.selectedNode = null;
    if(c.defaultNode === 'none') continue;
    if(c.defaultNode === 'default') {
      c.selectedNode = c.defaultNode;
    } else {
      const nodeId = Number(c.defaultNode);
      if(isNaN(nodeId)) continue;
      for(const node of c.nodes) {
        if(node._id !== nodeId) continue;
        c.selectedNode = node;
      }
    }
  }

  // window.editor = UE.getEditor("content", getEditorConfigs());
  // editor.methods = {};
  // editor.addListener( 'ready', function( status ) {
    // 编辑器准备就绪
    // 计算工具栏上边距
    // 开始初始化vue
  //   resetBodyPaddingTop();
  //   EditorReady = true;
  //   initVueApp();
  //   initPostButton();
  // });
  window.data.threadCategories.map(c => c.selectedNode = null);
  window.editorContainer = new Vue({
    el: "#content",
    data: {
      editorPlugs: {
        resourceSelector: true,
        draftSelector: true,
        stickerSelector: true,
        xsfSelector: true,
        mathJaxSelector: true,
      },
      // 是否允许触发contentChange
      contentChangeEventFlag: true,
    },
    mounted() {},
    computed: {
      editorConfigs() {
        return getEditorConfigs();
      },
    },
    components: {
      'editor': Editor,
    },
    methods: {
      getRef(){
        return this.$refs.threadEditor;
      },
      onContentChange(){
        if(!this.contentChangeEventFlag) {
          this.contentChangeEventFlag = true;
          return;
        }
        window.PostInfo.watchContentChange();
      },
      editorReady() {
        //编辑器准备就绪
        resetBodyPaddingTop();
        EditorReady = true;
        initVueApp();
        initPostButton();
      },
    }
  });
  window.editor = editorContainer.getRef();
  // window.editor = UE.getEditor("content", NKC.configs.ueditor.editorConfigs);
  editor.methods = {};
  // editor.addListener( 'ready', function( status ) {
  //   // 编辑器准备就绪
  //   // 计算工具栏上边距
  //   // 开始初始化vue
  //   resetBodyPaddingTop();
  //   EditorReady = true;
  //   initVueApp();
  //   initPostButton();
  // });
  // NKC.methods.ueditor.initDownloadEvent(editor);
  // 实例化专栏模块，如果不存在构造函数则用户没有权限转发。
  // 在提交数据前，读取专栏分类的时候，注意判断是否存在实例PostToColumn。
  if(NKC.modules.SelectColumnCategories) {
    window.PostToColumn = new NKC.modules.SelectColumnCategories();
  }
  // 实例化投票模块
  // 获取数据时需判断实例是否存在
  if(NKC.modules.SurveyEdit && $("#moduleSurveyEdit").length) {
    window.PostSurvey = new NKC.modules.SurveyEdit();
    PostSurvey.init({surveyId: data.post? data.post.surveyId: ""});
    if(data.type !== "newThread") {
      hideButton();
    }
    if(data.post && data.post.surveyId) {
      disabledSurveyForm();
    }
  }
  // window.editor = editor;
});

function initVueApp() {
  // 内容相关的vue实例
  // 下边的PostButton是按钮及提示相关的vue实例
  // 分开写是因为在这两部分中间可能插入其他通过vue实现的模块
  window.PostInfo = new Vue({
    el: "#postInfo",
    data: {
      // 辅助专业数量限制
      minorForumCount: data.minorForumCount || {},
      // 自动保存草稿时间
      saveDraftTimeout: 60000,
      // 原创申明最小字数限制
      originalWordLimit: data.originalWordLimit || 0,
      type: "newThread",
      // 当前内容相关的文章
      // @param {String} title 文章标题
      // @param {String} tid 文章ID
      // @param {String} url 文章链接
      thread: "",
      // 当前内容，可能来自草稿箱
      post: "",
      // 当前内容相关的专业信息
      // @param {String} title 专业标题
      // @param {String} tid 专业ID
      // @param {String} url 专业链接
      forum: "",
      // 当前内容所对应的草稿ID
      draftId: "",
      // 检测到草稿箱存有未被发表的草稿
      oldDraft: "",

      forums: [],

      selectedForums: [], // 已选择的专业

      anonymous: false,

      parentPostId: "", // 评论的上级post

      abstractCn: "", // 中文摘要
      abstractEn: "", // 英文摘要

      title: "", // 文章标题
      content: "", // 文章内容
      contentLength: "", // 本次文章内容字数
      oldContentLength: 0, // 上一次保存的草稿的全部内容字数


      cover: "",
      // 新选择的封面图的本地路径
      coverUrl: "",

      coverData: "",

      keyWordsCn: [], // 中文关键词
      keyWordsEn: [], // 英文关键词

      authorInfos: [], // 作者信息

      originState: 0, // 原创声明

      surveyId: "",

      quoteHtml: "",

      showCloseInfo: false,

      websiteUserId: data.websiteCode + "ID",

      threadCategories: data.threadCategories
    },
    components: {
      'image-selector': ImageSelector,
      'resource-selector': ResourceSelector
    },
    mounted: function() {
      let this_ = this;
      // editor.editorMethods("contentChange", function () {
      //   this_.watchContentChange();
      // });
      data.mainForums = data.mainForums || [];
      for(let i = 0; i < data.mainForums.length;i++) {
        this_.initForumCategory(data.mainForums[i]);
      }
      this.selectedForums = data.mainForums || [];
      this.thread = data.thread;
      this.post = data.post;
      this.forum = data.forum;
      this.type = data.type;

      this.draftId = data.draftId;
      this.oldDraft = data.oldDraft;
      this.initPost(data.post);
      let self = this;
      editor.methods.selectedDraft = function(draft) {
        self.insertDraftInfo(draft);
      };
      // 判断草稿箱里是否存在该类型且未被删掉的草稿。
      // 若存在则此内容未发表。
      if(self.oldDraft) { // 存在未提交的草稿，提示用户是否加载草稿
        let info = "是否加载 " + self.format("YYYY/MM/DD HH:ss:mm", self.oldDraft.tlm) + " 编辑但未提交的内容？";
        sweetQuestion(info)
          .then(function() { // 用户选择了加载，则跳转到相应的草稿页面
            if(NKC.configs.isApp) {
              window.location.href = "/editor?type=redit&id=" + self.oldDraft.did;
            } else {
              self.visitUrl("/editor?type=redit&id=" + self.oldDraft.did);
            }

          })
          .catch(function() { // 用户选择了取消加载，则启动自动保存草稿且开启关闭页面的警告
            self.autoSaveToDraft();
            self.showCloseInfo = true;
            self.getContentFromLocal();
            self.alertPermissionInfo();
          })
      } else { // 没有未提交的相应草稿，启动自动保存草稿且开启关闭页面的警告
        self.autoSaveToDraft();
        self.showCloseInfo = true;
        setTimeout(function() {
          self.getContentFromLocal();
        }, 2000);
        self.alertPermissionInfo();
      }
    },
    watch: {
      selectedForums: function() {
        let self = this;
        /*setTimeout(function() {
          floatForumPanel.initPanel();
        }, 100)*/
        const postButton = getPostButton();
        if(postButton) { // 检测是否可以勾选匿名
          postButton.checkAnonymous();
        }
      }
    },
    computed: {
      getOriginLevel(index) {
        let obj = {
          "0": "不声明",
          "1": "普通转载",
          "2": "获授权转载",
          "3": "受权发表(包括投稿)",
          "4": "发表人参与原创(翻译)",
          "5": "发表人是合作者之一",
          "6": "发表人本人原创"
        };
        if(!index) {
          return obj;
        }else{
          for(let i in obj) {
            if(i == index) {
              return obj[i]
            }
          }
        }
      },
      // 是否能够申明原创
      allowedOriginal: function() {
        let allowed = this.contentLength >= this.originalWordLimit;
        if(!allowed) this.originState = 0;
        return allowed;
      },
      // 关键词字数
      keywordsLength: function() {
        return this.keyWordsEn.length + this.keyWordsCn.length;
      },
      // 摘要的字节数
      abstractCnLength: function() {
        return this.getLength(this.abstractCn);
      },
      abstractEnLength: function() {
        return this.getLength(this.abstractEn);
      },
      // 获取已选择专业ID组成的数组
      selectedForumsId: function() {
        let arr = [];
        let selectedForums = this.selectedForums;
        for(let i = 0; i < selectedForums.length; i++) {
          let forum = selectedForums[i];
          if(forum.fid) arr.push(forum.fid);
        }
        return arr;
      },
      // 获取已选择文章分类ID组成的数组
      selectedCategoriesId: function() {
        let arr = [];
        let selectedForums = this.selectedForums;
        for(let i = 0; i < selectedForums.length; i++) {
          let forum = selectedForums[i];
          if(forum.cid) arr.push(forum.cid);
        }
        return arr;
      },
      mainForum: function() {
        return this.selectedForums[0];
      },
      minorForums: function() {
        let arr = [].concat(this.selectedForums);
        arr.shift();
        return arr;
      }
    },
    updated(){

    },
    methods: {
      objToStr: objToStr,
      getLength: NKC.methods.checkData.getLength,
      checkString: NKC.methods.checkData.checkString,
      checkEmail: NKC.methods.checkData.checkEmail,
      visitUrl: NKC.methods.visitUrl,
      fromNow: NKC.methods.fromNow,
      format: NKC.methods.format,
      getUrl: NKC.methods.tools.getUrl,
      selectThreadCategory(c, n) {
        c.selectedNode = n;
      },
      insertDraftInfo: function(draft) {
        // 从草稿箱插入草稿后的回调
        /* console.log(draft);
        let type = this.type;
        if(type === "newThread") {
          if(draft.mainForums && draft.mainForums.length) {
            this.selectedForums = draft.mainForums;
          }
          this.title = draft.t || this.title;
          this.setTitle();
          this.cover = draft.cover || this.cover;
          this.abstractCn = draft.abstractCn || this.cover;
          this.abstractEn = draft.abstractEn || this.abstractEn;
          this.originState = draft.originState || this.originState;
          this.keyWordsCn = draft.keyWordsCn || this.keyWordsCn;
          this.keyWordsEn = draft.keyWordsEn || this.keyWordsEn;
          this.authorInfos = draft.authorInfos || this.authorInfos;
          this.surveyId = draft.surveyId || this.surveyId;
          if(draft.surveyId) {
            PostSurvey.init({surveyId: draft.surveyId});
          }
        } */
      },
      // 监听内容输入
      watchContentChange: function() {
        const content = editor.getContentTxt();
        const _content = editor.getContent();
        this.content = _content;
        this.contentLength = content.length;
      },
      // 判断发表权限
      alertPermissionInfo: function() {
        if(data.permissionInfo) {
          sweetInfo(data.permissionInfo);
        }
      },
      // app判断本地存储
      getContentFromLocal: function() {
        // 当且仅当发表新文章时才去判断
        if(NKC.configs.isApp && data.type === "newThread" && (!data.post || !data.post.c)) {
          setLocalContentToUE();
        }
      },
      removeCover: function() {
        this.cover = "";
        this.coverData = "";
        this.coverUrl = "";
      },
      selectCover: function() {
        let self = this;
        // if(!NKC.modules.SelectResource) {
        //   return sweetError("未引入资源选择模块");
        // }
        // if(!NKC.methods.selectImage) {
        //   return sweetError("未引入图片裁剪模块");
        // }
        // if(!window.SelectResource) {
        //   window.SelectResource = new NKC.modules.SelectResource();
        // }
        // if(!window.SelectImage) {
        //   window.SelectImage = new NKC.methods.selectImage();
        // }
        self.$refs.resourceSelector.open(function(data) {
          let r = data.resources[0];
          let url;
          if(r.originId) {
            url = "/ro/" + r.originId;
          } else {
            url = "/r/" + r.rid;
          }
          self.$refs.imageSelector.open({
            aspectRatio: 3/2,
            url
          })
            .then(res => {
              self.coverData = res;
              fileToBase64(res)
                .then(res => {
                  self.coverUrl = res;
                })
                .catch(err => {
                  sweetError(err);
                })
              self.$refs.imageSelector.close();
            })
            .then(() => {
              self.$refs.resourceSelector.close();
            })
            .catch(err => {
              console.log(err);
              sweetError(err);
            });
          // SelectImage.show(function(data) {
          //   self.coverData = data;
          //   NKC.methods.fileToUrl(NKC.methods.blobToFile(data))
          //     .then(function(data) {
          //       debugger
          //       self.coverUrl = data;
          //       SelectImage.close();
          //     })
          // }, {
          //   aspectRatio: 3/2,
          //   url: url
          // });
        }, {
          allowedExt: ["picture"],
          countLimit: 1
        });
      },
      // 自动保存草稿
      autoSaveToDraft: function() {
        let self = this;
        let type = this.type;
        // 内容为空时不自动保存草稿,不做任何操作
        if(!self.content) return;
        if(type === "newThread") {
          if(
            !self.title &&
            !self.content &&
            (!self.selectedForums || !self.selectedForums.length) &&
            !self.cover &&
            !self.abstractCn &&
            !self.abstractEn &&
            !self.keyWordsCn &&
            !self.keyWordsEn &&
            !self.authorInfos &&
            !self.surveyId
          ) return;
        } else if(type === "newPost") {
          if(
            !self.title &&
            !self.content
          ) return;
        }
        setTimeout(function() {
          self.saveToDraftBase()
            .then(function() {
              const postButton = getPostButton();
              postButton.saveToDraftSuccess();
              self.autoSaveToDraft();
            })
            .catch(function(data) {
              sweetError("草稿保存失败：" + (data.error || data));
              self.autoSaveToDraft();
            });
        }, self.saveDraftTimeout);
      },
      // 手动保存草稿，相比自动保存草稿多了一个成功提示框。
      // 如果编辑器中的内容为空就提示用户要先输入内容
      // 如果编辑器中的内容与上一次对比减少了，就提示用户是否要保存
      saveToDraft: function() {
        let self = this;
        self.saveToDraftBase();
      },
      // 设置post相关的数据
      initPost: function(post) {
        if(!post) return;
        this.title = post.t;
        this.setTitle();
        let reg = /<blockquote cite.+?blockquote>/;
        let quoteHtml = post.c.match(reg);
        if(quoteHtml && quoteHtml[0]) {
          this.quoteHtml = quoteHtml[0];
        }
        this.content = post.c.replace(reg, "");
        this.setContent();
        this.cover = post.cover;
        this.parentPostId = post.parentPostId;
        this.abstractCn = post.abstractCn;
        this.abstractEn = post.abstractEn;
        this.originState = post.originState;
        this.keyWordsCn = post.keyWordsCn;
        this.keyWordsEn = post.keyWordsEn;
        this.authorInfos = post.authorInfos;
        this.surveyId = post.surveyId;
        this.initThreadCategory(post.tcId);
      },
      initThreadCategory(tcId) {
        for(const tc of this.threadCategories) {
          tc.selectedNode = null;
          for(const n of tc.nodes) {
            if(!tcId.includes(n._id)) continue;
            tc.selectedNode = n;
            break;
          }
        }
      },
      getThreadCategoriesId() {
        const tcId = [];
        for(const tc of this.threadCategories) {
          if([null, 'default'].includes(tc.selectedNode)) continue;
          tcId.push(tc.selectedNode._id);
        }
        return tcId;
      },
      checkThreadCategory() {
        for(const tc of this.threadCategories) {
          if(tc.selectedNode === null) {
            throw new Error(`请选择${tc.name}`);
          }
        }
      },
      // 获取标题输入框的内容
      getTitle: function() {
        this.title = $("#title").val();
      },
      // 设置标题输入框的内容
      setTitle: function() {
        $("#title").val(this.title);
      },
      // 获取编辑器中的内容
      getContent: function() {
        if(!EditorReady) {
          return sweetError("编辑器尚未初始化");
        } else {
          this.content = editor.getContent();
        }
      },
      // 设置编辑器中的内容
      setContent: function() {
        if(!EditorReady) {
          return sweetError("编辑器尚未初始化");
        } else {
          window.editorContainer.contentChangeEventFlag = false;
          editor.setContent(this.content);
        }
      },
      // 添加作者信息
      addAuthor: function() {
        let authorInfos = this.authorInfos;
        authorInfos.push({
          name: "",
          kcid: "",
          agency: "",
          agencyCountry: "",
          agencyAdd: "",
          isContract: false,
          contractObj: {
            contractEmail: "",
            contractTel: "",
            contractAdd: "",
            contractCode: ""
          }
        });
      },
      // 如果专业不存在文章分类，则默认选择不分类
      initForumCategory: function(f) {
        if(!f.forum.threadTypes || !f.forum.threadTypes.length) {
          f.cid = '';
        }
      },
      // 上/下移动作者信息
      moveAuthor: function(index, type) {
        let authorInfos = this.authorInfos;
        let otherIndex;
        if(type === "up") {
          if(index === 0) return;
          otherIndex = index - 1;
        } else {
          if((index + 1) === authorInfos.length) return;
          otherIndex = index + 1;
        }
        let info = authorInfos[index];
        authorInfos[index] = authorInfos[otherIndex];
        authorInfos[otherIndex] = info;
        Vue.set(authorInfos, 0, authorInfos[0]);
      },
      // 移除作者信息
      removeAuthor: function(index, arr) {
        sweetQuestion("确定要删除该条作者信息？")
          .then(function() {
            arr.splice(index, 1);
          })
          .catch(function(){})
      },
      // 移除关键词
      removeKeyword: function(index, arr) {
        arr.splice(index, 1);
      },
      // 通过fid找到forum对象
      getForumById: function(fid) {
        let forums = this.forums;
        for(let i = 0; i < forums.length; i++) {
          let forum = forums[i];
          if(forum.fid === fid) return forum;
        }
      },
      // 移除已选择的专业
      removeSelectedForums: function(index) {
        this.selectedForums.splice(index, 1);
      },
      // 添加关键词，借助commonModal模块
      addKeyword: function() {
        let self = this;
        if(!NKC.modules.CommonModal) {
          return sweetError("未引入表单模块");
        }
        if(!window.CommonModal) {
          window.CommonModal = new NKC.modules.CommonModal();
        }
        CommonModal.open(function(data) {
          self.keyWordsEn = [];
          self.keyWordsCn = [];
          let keywordCn = data[0].value;
          let keywordEn = data[1].value;
          keywordCn = keywordCn.replace(/，/ig, ",");
          keywordEn = keywordEn.replace(/，/ig, ",");
          let cnArr = keywordCn.split(",");
          let enArr = keywordEn.split(",");
          for(let i = 0; i < cnArr.length; i++) {
            let cn = cnArr[i];
            cn = cn.trim();
            if(cn && self.keyWordsCn.indexOf(cn) === -1) {
              self.keyWordsCn.push(cn);
            }
          }
          for(let i = 0; i < enArr.length; i++) {
            let en = enArr[i];
            en = en.trim();
            if(en && self.keyWordsEn.indexOf(en) === -1) {
              self.keyWordsEn.push(en);
            }
          }
          if(!cnArr.length && !enArr.length) return sweetError("请输入关键词");
          CommonModal.close();
        }, {
          data: [
            {
              label: "中文，添加多个请以逗号分隔",
              dom: "textarea",
              value: this.keyWordsCn.join("，")
            },
            {
              label: "英文，添加多个请以逗号分隔",
              dom: "textarea",
              value: this.keyWordsEn.join(",")
            }
          ],
          title: "添加关键词"
        });
      },
      // 选择专业，借助moveThread模块
      /*selectForums: function() {
        let self = this;
        if(!NKC.modules.MoveThread) {
          return sweetError("未引入专业选择模块");
        }
        if(!window.MoveThread) {
          window.MoveThread = new NKC.modules.MoveThread();
        }
        MoveThread.open(function(data) {
          self.selectedForums = data.forums;
          MoveThread.close();
        }, {
          hideMoveType: true,
          forumCountLimit: 2,
          selectedForumsId: this.selectedForumsId,
          selectedCategoriesId: this.selectedCategoriesId
        });
      },*/
      selectForumsByType: function(type) {
        let self = this;
        if(!window.ForumSelector)
          window.ForumSelector = new NKC.modules.ForumSelector();
        let selectedForumsId = [].concat(self.selectedForumsId);
        let highlightForumId = '';
        if(type === 'mainForum') {
          highlightForumId = selectedForumsId.shift();
        }
        ForumSelector.open(function(r) {
          r.logo = r.forum.logo;
          r.color = r.forum.color;
          r.fName = r.forum.displayName;
          r.cName = r.threadType? r.threadType.name: '';
          if(type === 'mainForum') {
            Vue.set(self.selectedForums, 0, r)
          } else {
            if(self.selectedForumsId.indexOf(r.fid) !== -1) return;
            self.selectedForums.push(r);
          }
        }, {
          highlightForumId: highlightForumId,
          selectedForumsId: selectedForumsId,
          disabledForumsId: []
        });
      },
      // 检测作者信息
      checkAuthorInfos: function() {
        let self = this;
        let checkAuthorInfos = this.checkAuthorInfos;
        for(let i = 0; i < checkAuthorInfos.length; i++) {
          let info = checkAuthorInfos[i];
          this.checkString(info.name, {
            name: "作者姓名",
            minLength: 1,
            maxLength: 100
          });
          this.checkString(info.kcid, {
            name: self.websiteUserId,
            minLength: 0,
            maxLength: 100
          });
          this.checkString(info.agency, {
            name: "机构名称",
            minLength: 0,
            maxLength: 100
          });
          this.checkString(info.agencyAdd, {
            name: "机构地址",
            minLength: 0,
            maxLength: 100
          });
          if(!info.isContract) continue;
          // 检测邮箱
          this.checkEmail(info.contractObj.contractEmail);
          this.checkString(info.contractObj.contractEmail, {
            name: "通信邮箱",
            minLength: 1,
            maxLength: 200
          });
          this.checkString(info.contractObj.contractTel, {
            name: "通信电话",
            minLength: 0,
            maxLength: 100
          });
          this.checkString(info.contractObj.contractAdd, {
            name: "通信地址",
            minLength: 0,
            maxLength: 200
          });
          this.checkString(info.contractObj.contractCode, {
            name: "通信邮编",
            minLength: 0,
            maxLength: 100
          });
        }
      },
      // 检测标题
      checkTitle: function() {
        if(this.title.length < 3) throw new Error('标题不能少于3个字');
        if(this.title.length > 100) throw new Error('标题不能超过100个字');
      },
      // 检测内容
      checkContent: function() {
        let contentText = $(this.content).text();
        if(contentText.length > 100000) {
          throw new Error('内容不能超过10万字');
        }
        if(contentText.length < 2) {
          throw new Error('内容不能少于2个字');
        }
      },
      // 检测摘要
      checkAbstract: function() {
        this.checkString(this.abstractCn, {
          name: "中文摘要",
          minLength: 0,
          maxLength: 1000
        });
        this.checkString(this.abstractEn, {
          name: "英文摘要",
          minLength: 0,
          maxLength: 1000
        });
      },
      // 检测已选专业
      checkForums: function() {
        if(!this.selectedForumsId.length) throw "请至少选择一个专业";
        for(let i = 0; i < this.selectedForums.length; i++) {
          let f = this.selectedForums[i];
          if(f.cid === null) throw "请选择完整的专业分类";
        }
      },
      // 检测关键词
      checkKeywords: function() {
        if(this.keywordsLength > 50) throw "关键词数量超出限制"
      },
      // 根据用户已输入的信息组成post对象
      getPost: function() {
        let post = {};
        let self = this;
        self.getTitle();
        self.getContent();
        // 摘要
        post.abstractCn = self.abstractCn;
        post.abstractEn = self.abstractEn;
        // 评论ID
        post.parentPostId = self.parentPostId;
        // 关键词
        post.keyWordsEn = self.keyWordsEn;
        post.keyWordsCn = self.keyWordsCn;
        // 封面
        post.cover = self.cover;
        // 标题
        post.t = self.title;
        // 主分类id
        post.fids = self.selectedForumsId;
        post.cids = self.selectedCategoriesId;
        // 内容
        post.c = (self.quoteHtml||"") + self.content;
        // 作者信息
        post.authorInfos = self.authorInfos;
        // 原创
        post.originState = self.originState;
        // 草稿ID
        post.did = self.draftId;
        // 仅当用户有权发表匿名内容且当前专业允许发表匿名内容时，才将匿名标志提交到服务器。
        const postButton = getPostButton();
        if(postButton.havePermissionToSendAnonymousPost && postButton.allowedAnonymous) {
          post.anonymous = !!postButton.anonymous;
        }
        // 判断用户有没有勾选"同时转发到专栏，勾选则获取专业分类"
        if(PostToColumn && PostToColumn.getStatus) {
          let status = PostToColumn.getStatus();
          if(status.checkbox) {
            // post.columnCategoriesId = status.selectedCategoriesId || [];
            post.columnMainCategoriesId = status.selectedMainCategoriesId || [];
            post.columnMinorCategoriesId = status.selectedMinorCategoriesId || [];
          }
        }
        // 调查表单数据
        if(PostSurvey) {
          let survey = PostSurvey.getSurvey();
          if(survey) post.survey = survey;
        }
        post.tcId = self.getThreadCategoriesId();
        return post;
      },
      disablePostButton() {
        if(window.PostButton) window.PostButton.disabledSubmit = true;
        if(window.FloatPostButton) window.FloatPostButton.disabledSubmit = true;
      },
      enablePostButton() {
        if(window.PostButton) window.PostButton.disabledSubmit = false;
        if(window.FloatPostButton) window.FloatPostButton.disabledSubmit = false;
      },
      // 提交内容
      submit: function() {
        let self = this;
        let post = {}, type;
        Promise.resolve()
          .then(function() {
            // 锁住发表按钮
            self.disablePostButton();
            type = self.type;
            post = self.getPost();
          })
          .then(function() {
            if(type === "newThread") { // 发新帖：从专业点发表、首页点发表、草稿箱
              self.checkTitle();
              self.checkContent();
              self.checkAbstract();
              self.checkForums();
              self.checkThreadCategory();
              self.checkKeywords();
              self.checkAuthorInfos();
              let formData = new FormData();
              formData.append("body", JSON.stringify({post: post}));
              if(self.coverData) {
                formData.append("postCover", NKC.methods.blobToFile(self.coverData), 'cover.png');
              }
              return nkcUploadFile("/f/" + post.fids[0], "POST", formData)
            } else if(type === "newPost") { // 发表回复：从文章页点"去编辑器"、草稿箱
              self.checkString(self.title, {
                name: "标题",
                minLength: 0,
                maxLength: 200
              });
              self.checkContent();
              return nkcAPI("/t/" + self.thread.tid, "POST", {post: post})
            } else if(type === "modifyPost") { // 修改post
              self.checkString(self.title, {
                name: "标题",
                minLength: 0,
                maxLength: 200
              });
              self.checkContent();
              let formData = new FormData();
              formData.append("body", JSON.stringify({post: post}));
              if(self.coverData) {
                formData.append("postCover", NKC.methods.blobToFile(self.coverData), 'cover.png');
              }
              return nkcUploadFile("/p/" + self.post.pid, "PUT", formData);
            } else if(type === "modifyThread") { // 修改thread
              self.checkTitle();
              self.checkContent();
              self.checkAbstract();
              self.checkKeywords();
              self.checkAuthorInfos();
              let formData = new FormData();
              formData.append("body", JSON.stringify({post: post}));
              if(self.coverData) {
                formData.append("postCover", NKC.methods.blobToFile(self.coverData), 'cover.png');
              }
              return nkcUploadFile("/p/" + self.post.pid, "PUT", formData);
            }
            // else if(type === "modifyForumDeclare") { // 修改专业详情
            //   self.checkContent();
            //   return nkcAPI("/f/" + self.forum.fid + "/settings/info", "PUT", {
            //     declare: post.c,
            //     did: self.draftId,
            //     operation: "updateDeclare"
            //   });
            // } else if(type === "modifyForumLatestNotice") {
            //   self.checkContent();
            //   return nkcAPI("/f/" + self.forum.fid + "/settings/info", "PUT", {
            //     content: post.c,
            //     operation: "modifyForumLatestNotice"
            //   });
            // }
          })
          .then(function(data) {
            editor.removeNoticeEvent();
            self.showCloseInfo = false;
            if(NKC.configs.platform === 'reactNative') {
              NKC.methods.visitUrlAndClose(data.redirect);
              /*self.visitUrl(data.redirect || "/", true);
              setTimeout(() => {
                NKC.methods.appClosePage();
              }, 1000);*/
            } else if(NKC.configs.platform === 'apiCloud') {
              self.visitUrl(data.redirect || "/");
              setTimeout(function() {
                api.closeWin();
              }, 1000);
            } else {
              self.visitUrl(data.redirect || "/");
            }
            // 解锁发表按钮
            // PostButton.disabledSubmit = false;
          })
          .catch(function(data) {
            // 解锁发表按钮
            self.enablePostButton();
            sweetError(data);
          })
      },
      //保存草稿
      saveToDraftBase: function() {
        let self = this;
        if(!self.content) return sweetError('请先输入内容');
        return Promise.resolve()
          .then(() => {
            // 获取本次编辑器内容的全部长度
            const allContentLength = editor.getContent();
            // 如果内容相对上一次减少了就提示用户是否需要保存
            if(allContentLength.length < self.oldContentLength) {
              return sweetQuestion(`您输入的内容发生了变化，是否还要继续保存？`)
                .then(() => {
                  return;
                })
                .catch(err => {
                  sweetError(err);
                })
            } else {
              return;
            }
          })
          .then(function() {
            let post = self.getPost();
            let desType, desTypeId;
            let type = self.type;
            if(type === "newThread") {
              desType = "forum";
            } else if(type === "newPost") {
              desType = "thread";
              desTypeId = self.thread.tid;
            } else if(type === "modifyPost") {
              desType = "post";
              desTypeId = self.post.pid;
            } else if(type === "modifyThread") {
              desType = "post";
              desTypeId = self.post.pid;
            } else if(type === "modifyForumDeclare") {
              desType = "forumDeclare";
              desTypeId = self.forum.fid;
            } else if(type === 'modifyForumLatestNotice') {
              desType = "forumLatestNotice";
              desTypeId = self.forum.fid;
            } else {
              throw "未知的草稿类型";
            }
            let formData = new FormData();
            formData.append("body", JSON.stringify({
              post: post,
              draftId: self.draftId,
              desType: desType,
              desTypeId: desTypeId,
            }));
            if(self.coverData) {
              formData.append("postCover", NKC.methods.blobToFile(self.coverData), 'cover.png');
            }
            // 保存草稿
            // 当编辑器中的字数减少时提示用户是否需要保存，避免其他窗口的自动保存覆盖内容
            return nkcUploadFile("/u/" + NKC.configs.uid + "/drafts", "POST", formData);
          })
          .then(function(data) {
            //保存草稿的全部内容长度
            if(data.contentLength) {
              self.oldContentLength = data.contentLength;
            }
            self.draftId = data.draft.did;
            if(data.draft.cover) {
              self.coverData = "";
              self.coverUrl = "";
              self.cover = data.draft.cover;
            }
            return Promise.resolve();
          })
          .then(function(res) {
            const postButton = getPostButton();
            postButton.saveToDraftSuccess();
            sweetSuccess("草稿已保存");
          })
          .catch(function(data) {
            sweetError("草稿保存失败：" + (data.error || data));
          });
      },
    }
  });
}


/*
* 实例化提交按钮
* */
function initPostButtonVueApp(postButtonType) {
  const data = NKC.methods.getDataById("data");
  window[postButtonType] = new Vue({
    el: `#${postButtonType}`,
    data: {
      disabledSubmit: false, // 锁定提交按钮
      checkProtocol: true, // 是否勾选协议
      // 当前用户是否有权限发表匿名内容
      havePermissionToSendAnonymousPost: data.havePermissionToSendAnonymousPost || false,
      // 允许发表匿名内容的专业ID
      allowedAnonymousForumsId: data.allowedAnonymousForumsId || [],
      // 根据当前所选专业判断用户是否有权限勾选匿名，若无权则此处无需将匿名标志提交到服务器。（新发表时不匿名，修改时无法需改匿名标志）
      allowedAnonymous: false,
      // 是否匿名
      anonymous: data.post? data.post.anonymous: false,
      autoSaveInfo: ""
    },
    created() {
      // this.setFloatDom();
    },
    methods: {
      setFloatDom() {
        const oldDom = $("#submit-scroll-sm");
        const scrollWidth = oldDom.width();
        const {left, top} = oldDom.offset();
        $("#submit-scroll").css({
          'width': scrollWidth + 30,
          display: "block",
          left,
          top
        });
      },
      checkAnonymous: function() {
        let selectedForumsId = window.PostInfo.selectedForumsId;
        let havePermission = false;
        for(let i = 0; i < selectedForumsId.length; i++) {
          let fid = selectedForumsId[i];
          if(this.allowedAnonymousForumsId.indexOf(fid) !== -1) {
            havePermission = true;
            break;
          }
        }
        if(!havePermission) {
          this.anonymous = false;
          this.allowedAnonymous = false;
        } else {
          this.allowedAnonymous = true;
        }
      },
      format: NKC.methods.format,
      saveToDraftSuccess: function() {
        let time = new Date();
        this.autoSaveInfo = "草稿已保存 " + this.format("HH:mm:ss", time);
      },
      autoSaveToDraft: window.PostInfo.autoSaveToDraft,
      saveToDraft: window.PostInfo.saveToDraft,
      submit: function() {
        window.PostInfo.submit();
      },
    }
  })
}

/*
* 根据屏幕宽度获取按钮类型
* */
function getPostButtonTypeByWindowWidth() {
  const width = $(window).width();
  return width < 992? 'PostButton': 'FloatPostButton';
}

/*
* 根据屏幕宽度实例化对应的 vue 实例
* */
function initPostButton() {
  initFloatPostButtonContainer();
  const postButtonType = getPostButtonTypeByWindowWidth();
  // 判断当前是否需要重新实例化按钮
  if(window[postButtonType]) return;
  initPostButtonVueApp(postButtonType);
}
/*
* 设置浮动面板的位置和大小
* */
function initFloatPostButtonContainer() {
  const postButtonType = getPostButtonTypeByWindowWidth();
  const container = $('#FloatPostButtonContainer');
  const containerTemplate = $('#FloatPostButtonContainerTemplate');
  if(postButtonType !== 'FloatPostButton') {
    container.css({
      display: 'none'
    })
  } else {
    const offset = containerTemplate.offset();
    const width = containerTemplate.width();
    const paddingLeft = containerTemplate.css('padding-left');
    container.css({
      width: width + 2 * parseFloat(paddingLeft),
      top: offset.top,
      left: offset.left,
      display: 'block'
    });
  }

}
/*
* 根据屏幕宽度获取对应的 vue 实例
* */
function getPostButton() {
  const postButtonType = getPostButtonTypeByWindowWidth();
  return window[postButtonType];
}

new Vue({
  el: "#notes",
  data: {
    openOnEditNotes: localStorage.getItem("open-on-edit-notes") === "yes"
  },
  watch: {
    openOnEditNotes: function(val) {
      localStorage.setItem("open-on-edit-notes", val? "yes" : "no");
    }
  }
});

// 根据导航栏和工具栏的高度重置body的padding-top
function resetBodyPaddingTop() {
  let tools = $(".editor .edui-editor-toolbarbox.edui-default");
  if(NKC.methods.getRunType() === "app") {
    tools.css("top", 0);
    $("body").css("padding-top", tools.height() + 40);
  } else {
    let header = $(".navbar.navbar-default.navbar-fixed-top.nkcshade");
    let height = header.height() + tools.height();
    $("body").css("padding-top", height + 40);
  }
}

// 若存在调查表则自动展开
function disabledSurveyForm() {
  if(!PostSurvey) return;
  let button = $("#disabledSurveyButton");
  if(PostSurvey.app.disabled) {
    button.text("取消").removeClass("btn-success").addClass("btn-danger");
  } else {
    button.text("创建").removeClass("btn-danger").addClass("btn-success");
  }
  PostSurvey.app.disabled = !PostSurvey.app.disabled;
}

// 若为编辑文章，则隐藏 取消/创建 按钮
function hideButton() {
  $("#disabledSurveyButton").hide();
}

// 适配APP快捷插入图片、资源等
function mediaInsertUE(rid, fileType, name, mediaType) {
  let resource = {
    rid: rid,
    ext: fileType,
    oname: name,
    mediaType: mediaType
  };
  NKC.methods.appResourceToHtml(resource)
    .then(function(html) {
      try{
        editor.execCommand("inserthtml", html);
      } catch(err) {
        console.log(err);
        sweetError("编辑器未准备就绪");
      }
    });
}

// 适配app，将编辑器内容存在app本地
function saveUEContentToLocal() {
  let content = editor.getContent();
  api.setPrefs({
    key: "ueContent",
    value: content
  });
}

// 适配app，将编辑器内容存在app本地
function setLocalContentToUE() {
  let content = api.getPrefs({
    key: "ueContent",
    sync: true
  });
  editor.setContent(content);
}

// app相关编辑功能

/**
 * app视频拍摄、上传、及插入
 */
function appUpdateVideo() {
  let protocol = window.location.protocol;
  let host = window.location.host;
  let url = protocol + "//" + host + "/r";
  $("#attach").css("display", "none");
  api.getPicture({
    sourceType: 'camera',
    encodingType: 'jpg',
    mediaValue: 'video',
    destinationType: 'url',
    allowEdit: false,
    quality: 100,
    saveToPhotoAlbum: false,
    videoQuality: "medium"
  }, function(ret, err) {
    if (ret) {
      api.toast({
        msg: "视频正在处理，请稍后...",
        duration: 3000,
        location: "bottom"
      })
      api.ajax({
        url: url,
        method: "post",
        timeout: 15,
        headers: {
          "FROM":"nkcAPI"
        },
        data:{
          values: {},
          files: {
            file: ret.data
          }
        }
      },function(ret, err) {
        if(ret) {
          mediaInsertUE(ret.r.rid, ret.r.ext, ret.r.oname, ret.r.mediaType);
          api.toast({
            msg: "视频处理完毕",
            duration: 1000,
            location: "bottom"
          })
        }else{
          api.toast({
            msg: "视频处理失败，请检查当前网络环境...",
            duration: 1000,
            location: "bottom"
          })
        }
      })
    } else {
      api.toast({
        msg: "已取消视频处理",
        duration: 1000,
        location: "bottom"
      })
    }
  });
}

/**
 * app图片拍摄、上传、及插入
 */
function appUpdateImage() {
  let protocol = window.location.protocol;
  let host = window.location.host;
  let url = protocol + "//" + host + "/r";
  $("#attach").css("display", "none");
  api.getPicture({
    sourceType: 'camera',
    encodingType: 'jpg',
    mediaValue: 'pic',
    destinationType: 'url',
    allowEdit: false,
    quality: 100,
    saveToPhotoAlbum: false
  }, function(ret, err) {
    if (ret) {
      api.toast({
        msg: "图片正在处理，请稍后...",
        duration: 2000,
        location: "bottom"
      })
      api.ajax({
        url: url,
        method: "post",
        timeout: 15,
        headers: {
          "FROM":"nkcAPI",
        },
        data: {
          values: {},
          files:{
            file: ret.data
          }
        }
      }, function(ret ,err) {
        if(ret) {
          mediaInsertUE(ret.r.rid, ret.r.ext, ret.r.oname, ret.r.mediaType);
          api.toast({
            msg: "图片已处理",
            duration: 1000,
            location: "bottom"
          })
        }else{
          api.toast({
            msg: "已取消图片处理",
            duration: 1000,
            location: "bottom"
          })
        }
      })
    } else {
      api.toast({
        msg: "已取消图片处理",
        duration: 1000,
        location: "bottom"
      })
    }
  });
}

// 监听页面变化，调整工具栏位置
window.onresize = function(){
  resetBodyPaddingTop();
  initPostButton();
};
// 监听页面关闭，提示保存草稿
window.onbeforeunload = function() {
  if(PostInfo.showCloseInfo){
    // 离开前保存草稿
    /*try{
      PostInfo.saveToDraftBase();
    } catch(err) {
      console.log(err);
    }*/
    return "离开前保存草稿了吗？"
  }
};
NKC.methods.selectedDraft = function(draft) {
  PostInfo.insertDraft(draft);
}

Object.assign(window, {
  initVueApp,
  resetBodyPaddingTop,
  disabledSurveyForm,
  hideButton,
  mediaInsertUE,
  saveUEContentToLocal,
  setLocalContentToUE,
  appUpdateVideo,
  appUpdateImage,
  EditorReady
});
