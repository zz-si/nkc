const mongoose = require('../settings/database');
const moment = require('moment');

const articleSources = {
  column: 'column',
  zone: 'zone',
};

const articleStatus = {
  normal: 'normal',// 正常
  'default': 'default',// 默认状态 创建了article但未进行任何操作
  disabled: 'disabled', //禁用
  faulty: 'faulty', //退修
  unknown: 'unknown',// 未审核
  deleted: 'deleted',//article被删除
  cancelled: 'cancelled'// 取消发布
};

const schema = new mongoose.Schema({
  _id: String,
  // 文章创建时间
  toc: {
    type: Date,
    default: Date.now,
    index: 1
  },
  // 文章最后修改时间
  tlm: {
    type: Date,
    default: null,
    index: 1
  },
  // 发表人
  uid: {
    type: String,
    required: true,
    index: 1
  },
  // document did
  did: {
    type: Number,
    default: null,
    index: 1
  },
  // 文章状态
  // normal: 正常的（已发布，未被删除）
  // default: 未发布的（正在编辑，待发布）
  // deleted: 被删除的（已发布，但被删除了）
  // cancelled: 被取消发表的（未发布过，在草稿箱被删除）
  // disabled: 被禁用的（已发布但被管理员禁用了）
  // faulty: 被退修的 （已发布但被管理员退修了）
  // unknown: 状态位置的 （已发布未审核
  status: {
    type: String,
    default: articleStatus.default,
    index: 1,
  },
  // 当前文章是否包含草稿
  hasDraft: {
    type: Boolean,
    default: true,
    index: 1
  },
  // 引用文章的模块类型
  source: {
    type: String, // column, alone
    required: true,
    index: 1
  },
  // 引用文章的模块类型所对应的 ID
  sid: {
    type: String,
    default: '',
    index: 1
  },
  // 文章阅读量
  hits: {
    type: Number,
    default: 0,
  },
  // 支持数
  voteUp: {
    type: Number,
    default: 0,
  },
  // 反对数
  voteDown: {
    type: Number,
    default: 0,
  },
  // 评论数
  comment: {
    type: Number,
    default: 0,
  },
  // 其他引用模块类型
  references: {
    type: [String],
    default: [],
    index: 1
  }
}, {
  collection: 'articles',
  toObject: {
    getters: true,
    virtuals: true
  }
});

schema.virtual('user')
  .get(function() {
    return this._user
  })
  .set(function(user) {
    this._user = user
  });

schema.virtual('content')
  .get(function() {
    return this._content
  })
  .set(function(content) {
    this._content = content
  });

schema.virtual('url')
  .get(function() {
    return this._url
  })
  .set(function(url) {
    this._url = url
  });


/*
* 获取 status
* */
schema.statics.getArticleStatus = async () => {
  return articleStatus;
};

/*
* 改变article的status
* @param {String} status 需要改变的状态
* */
schema.methods.changeStatus = async function(status) {
  const ArticleModel = mongoose.model('articles');
  const articleStatus = await ArticleModel.getArticleStatus();
  if(!articleStatus[status]) throw(400, `不存在状态 ${status}`);
  await this.updateOne({
    $set: {
      status,
    }
  });
}

/*
*
* 根据did来设置article的status
* */
schema.statics.setStatus = async function(did, status) {
  const ArticleModel= mongoose.model('articles');
  const article = await ArticleModel.findOnly({did});
  await article.updateOne({
    $set: {
      status,
    }
  });
}

/*
* 获取 source
* */
schema.statics.getArticleSources = async () => {
  return articleSources;
};

/*
* 检验 status 是否合法
* @param {String} status 状态
* */
schema.statics.checkArticleStatus = async (status) => {
  const ArticleModel = mongoose.model('articles');
  const articleStatus = await ArticleModel.getArticleStatus();
  if(!Object.values(articleStatus).includes(status)) {
    throwErr(500, `article status error. status=${status}`);
  }
}
/*
* 检验 source 是否合法
* @param {String} source 来源
* */
schema.statics.checkArticleSource = async (source) => {
  const ArticleModel = mongoose.model('articles');
  const articleSources = await ArticleModel.getArticleSources();
  if(!Object.values(articleSources).includes(source)) {
    throwErr(500, `article source error. source=${source}`);
  }
};
/*
*  根据 文章id 查找文章 包括 article docuemnt documentResource
*/
schema.statics.getDocumentInfoById = async (_id)=>{
  const ArticleModel = mongoose.model('articles');
  const DocumentModel = mongoose.model('documents');
  let articleInfo = await ArticleModel.findOne({_id});
  articleInfo = articleInfo.toObject()
  if(!articleInfo) throwErr(500, '未查找到对应文章');
  let document = await DocumentModel.getStableArticleById(_id);
  const documentResourceId = await document.getResourceReferenceId();

  document = document.toObject()

  return {articleInfo, document, documentResourceId}
}

/*
@param{object} filterData 过滤的数据
@param{array} allowKey filterData保留的key

*/
schema.statics.filterData = (filterData, allowKey)=>{
  //
  if(!filterData) return {}
  const {timeFormat} = require('../nkcModules/tools');
  let newObj = {}
  for (const key in filterData) {
    if (Object.hasOwnProperty.call(filterData, key)) {
      if(allowKey.includes(key)){
        if(key === 'toc') {
          newObj[key] = timeFormat(filterData[key])
          continue;
        }
        const item = filterData[key];
        newObj[key] = item
      }
    }
  }
  return newObj
}
/*
* 获取空间文章显示的内容
* @param {String} id 文章id
*/
schema.statics.getZoneArticle = async (id)=>{
  const nkcRender = require('../nkcModules/nkcRender');
  const UserModel = mongoose.model("users");

  const ArticleModel = mongoose.model('articles');
  const ResourceModel = mongoose.model('resources')
  const {articleInfo, document, documentResourceId} = await ArticleModel.getDocumentInfoById(id);
  const documentAllowKey = ['title', 'content', 'abstract', 'abstractEN', 'keywords', 'keywordsEN', 'authorInfos', 'toc', 'origin', 'uid', 'collectedCount'];
  const filteredDocument = await ArticleModel.filterData(document, documentAllowKey)
  const documentContent = await ArticleModel.changeKey(filteredDocument)
  let user = await UserModel.findOne({uid:articleInfo.uid});
  user = user.toObject();
  let resources = await ResourceModel.getResourcesByReference(documentResourceId);
  documentContent.c = nkcRender.renderHTML({
    type: 'article',
    post: {
      c: documentContent.c,
      resources
    },
    user:{xsf: user.xsf}
  });
  return {post: documentContent,  userAvatar: user.avatar ,thread: articleInfo, column:{} ,collectedCount:'' , mainCategory:[],auxiliaryCategory:[]}
}
/*
* 修改为文章(/columns/article/article.pug)指定的字段
* param {ObJect} content 文章正文数据
*/
schema.statics.changeKey = async (content)=>{
  let changeKeyPost = {}
    const map ={
      title: 't',
      content: 'c',
      c: 'c',
      abstract: 'abstractCn',
      abstractEN: 'abstractEn',
      keywords: 'keyWordsCn',
      keywordsEN: 'keyWordsEn',
      authorInfos: 'authorInfos',
      toc: 'toc',
      origin: 'originState',
      uid : 'uid',
      collectedCount: 'collectedCount'
    }
    for (const key in content) {
      if (Object.hasOwnProperty.call(content, key)) {
        const element = content[key];
        changeKeyPost[map[key]] = element
      }
    }
    return changeKeyPost
}
/*
* 获取新的 article id
* @return {String}
* */
schema.statics.getNewId = async () => {
  const ArticleModel = mongoose.model('articles');
  const redLock = require('../nkcModules/redLock');
  const getRedisKeys = require('../nkcModules/getRedisKeys');
  const {getRandomString} = require('../nkcModules/apiFunction');
  const key = getRedisKeys('newArticleId');
  let newId = '';
  let n = 10;
  const lock = await redLock.lock(key, 10000);
  try{
    while(true) {
      n = n - 1;
      const _id = getRandomString('a0', 6);
      const article = await ArticleModel.findOne({
        _id
      }, {
        _id: 1
      });
      if(!article) {
        newId = _id;
        break;
      }
      if(n === 0) {
        break;
      }
    }
  } catch(err) {}
  await lock.unlock();
  if(!newId) {
    throwErr(500, `article id error`);
  }
  return newId;
};


/*
* 获取指定 文章 id 和作者 id 的文章
* @param {String} aid 文章 ID
* @param {String} uid 作者 ID
* @return {Object} article 对象
* */
schema.statics.getArticleByIdAndUid = async (aid, uid) => {
  const ArticleModel = mongoose.model('articles');
  return await ArticleModel.findOnly({_id: aid, uid});
}

/*
* 向 book 中添加文章，创建 article、document
* @param {Object} props
*   @param {String} title 文章标题，可为空
*   @param {String} content 文章富文本内容，可为空
*   @param {String} uid 作者，不可为空
*   @param {File} coverFile 新的封面图文件对象
*   @param {String} keywords 关键字中文
*   @param {String} keywordsEN 英文关键字
*   @param {String} abstract 摘要中文
*   @param {String} abstractEN 摘要英文
*   @param {Boolean} origin 是否原创
* @return {Object} 创建的 article 对象
* */
schema.statics.createArticle = async (props) => {
  const {
    uid,
    title,
    content,
    coverFile,
    keywords,
    keywordsEN,
    abstract,
    abstractEN,
    origin,
    source,
    sid,
    authorInfos
  } = props;
  const toc = new Date();
  const ArticleModel = mongoose.model('articles');
  const DocumentModel = mongoose.model('documents');
  const {article: documentSource} = await DocumentModel.getDocumentSources();
  const aid = await ArticleModel.getNewId();
  const {default: defaultStatus} = await ArticleModel.getArticleStatus();
  const document = await DocumentModel.createBetaDocument({
    uid,
    coverFile,
    title,
    content,
    keywords,
    keywordsEN,
    abstract,
    abstractEN,
    origin,
    toc,
    source: documentSource,
    sid: aid,
    authorInfos
  });
  const article = new ArticleModel({
    _id: aid,
    uid,
    toc,
    did: document.did,
    source,
    sid,
    status: defaultStatus,
  });
  await article.save();
  return article;
}
schema.methods.getBetaDocumentCoverId = async function() {
  const DocumentModel = mongoose.model('documents');
  const {article: documentSource} = await DocumentModel.getDocumentSources();
  const betaDocument = await DocumentModel.getBetaDocumentBySource(documentSource, this._id);
  return betaDocument? betaDocument.cover: '';
};

/*
* 删除文章的草稿
* */
schema.methods.deleteDraft = async function() {
  const DocumentModel = mongoose.model('documents');
  const ArticleModel = mongoose.model('articles');
  const {_id: articleId, status} = this;
  const {article: articleSource} = await DocumentModel.getDocumentSources();
  const {
    cancelled: cancelledStatus,
    default: defaultStatus,
  } = await ArticleModel.getArticleStatus();
  // 如果是未发布过的文章，则需要将文章状态改为 cancelled（取消发表）
  if(status === defaultStatus) {
    await this.updateOne({
      $set: {
        status: cancelledStatus,
        hasDraft: false,
        tlm: new Date()
      }
    });
  }

  await DocumentModel.setBetaDocumentAsHistoryBySource(articleSource, articleId);
  await this.changeHasDraftStatus();
};

/*
* 刪除文章
* */
schema.methods.deleteArticle = async function() {
  const ArticleModel = mongoose.model('articles');
  const ColumnPostModel = mongoose.model('columnPosts');
  const {normal: normalStatus, deleted: deletedStatus} = await ArticleModel.getArticleStatus();
  const {column: columnSource, zone: zoneSource} = await ArticleModel.getArticleSources();
  const {status, source, _id} = this;
  if(status !== normalStatus) {
    throwErr(500, `文章状态异常 status=${this.status}`);
  }
  // 删除草稿
  await this.deleteDraft();
  //根据文章id删除引用
  if(source === columnSource) await ColumnPostModel.deleteColumnPost(_id);
  // 删除文章
  this.status = deletedStatus;
  await this.updateOne({
    $set: {
      status: this.status
    }
  });
};

/*
* 删除文章引用
* */
schema.methods.deleteReferences = async function() {
  const {source, sid, references} = this;
  const ArticleModel = mongoose.model('articles');
  const {
    column: columnSource,
  } = await ArticleModel.getArticleSources();
  if(source === columnSource) {

  }
}
/*
* 删除文章并删除文章引用
* */
schema.methods.deleteArticleAndReferences = async function() {
  await this.deleteArticle();
  await this.deleteReferences();
};

/*
* 修改article
* @param {Object} props
*   @param {String} title 文章标题，可为空
*   @param {String} content 文章内容，可为空
*   @param {String} cover 原封面 ID，可为空
*   @param {File} coverFile 新的封面图文件对象
*   @param {String} keywords 关键字中文
*   @param {String} keywordsEN 英文关键字
*   @param {String} abstract 摘要中文
*   @param {String} abstractEN 摘要英文
*   @param {Boolean} origin 是否原创
*   @param {Array} authorInfos 作者信息
* */
schema.methods.modifyArticle = async function(props) {
  const DocumentModel = mongoose.model('documents');
  const {
    title,
    content,
    coverFile,
    cover,
    keywords,
    keywordsEN,
    abstract,
    abstractEN,
    origin,
    authorInfos
  } = props;
  const {did} = this;
  const toc = new Date();
  //更改document
  await DocumentModel.updateDocumentByDid(did, {
    title,
    content,
    cover,
    coverFile,
    keywords,
    keywordsEN,
    abstract,
    abstractEN,
    origin,
    authorInfos,
    tlm: toc,
  });
  await this.updateOne({
    $set: {
      tlm: toc
    }
  });
}
/*
* 发布 article
* 如果有正式版就将正式版设为历史
* 将测试版设为正式版
* */
schema.methods.publishArticle = async function(options) {
  const ArticleModel = mongoose.model('articles');
  const ColumnPostModel = mongoose.model('columnPosts');
  const MomentModel = mongoose.model('moments');
  const {normal} = await ArticleModel.getArticleStatus();
  const {article: articleQuoteType} = await MomentModel.getMomentQuoteTypes();
  const {article: articleType} = await ColumnPostModel.getColumnPostTypes();
  const {source, selectCategory} = options;
  const DocumentModel = mongoose.model('documents');
  const {did, uid, _id: articleId} = this;
  //将当前article的状态改为正常
  await this.changeStatus(normal);
  if(source === 'column') {
    //如果发表专栏的文章就将创建文章专栏分类引用记录 先查找是否存在引用，如果没有就创建一条新的引用
    const columnPost = await ColumnPostModel.findOne({pid: articleId, type: articleType});
    if(!columnPost) {
      await ColumnPostModel.createColumnPost(this, selectCategory);
    }
  } else if(source === 'zone') {
    //如果发布的article为空间文章就创建一条新的动态并绑定当前article
    const {_id: momentId} = await MomentModel.createQuoteMomentAndPublish({
      uid,
      quoteType: articleQuoteType,
      quoteId: articleId
    });
    await this.updateOne({
      $set: {
        sid: momentId,
      }
    });
  }
  await DocumentModel.publishDocumentByDid(did);
}

schema.methods.getStableDocId = async function () {
  const {did} = this;
  const DocumentModel = mongoose.model('documents');
  const document = await DocumentModel.findOne({
    did,
    type: 'stable'
  });
  return document? document._id: null
}

schema.methods.getNote = async function() {
  const NoteModel = mongoose.model('notes');
  const stableDocId = await this.getStableDocId();
  return {
    type: 'document',
    targetId: stableDocId,
    notes: await NoteModel.getNotesByDocId(stableDocId)
  }
}
/*
* 保存 article
* 将测试版变为历史版
* */
schema.methods.saveArticle = async function() {
  const DocumentModel = mongoose.model('documents');
  const {article: documentSource} = await DocumentModel.getDocumentSources();
  await DocumentModel.copyBetaToHistoryBySource(documentSource, this._id);
}
schema.statics.checkArticleInfo = async (article) => {
  const {title, content} = article;
  const {checkString} = require('../nkcModules/checkData');
  checkString(title, {
    name: '文章标题',
    minTextLength: 1,
    maxLength: 500
  });
  checkString(content, {
    name: '文章内容',
    maxLength: 200000,
    minTextLength: 1,
    maxTextLength: 10000,
  });
}

schema.methods.getEditorBetaDocumentContent = async function() {
  const DocumentModel = mongoose.model('documents');
  const {article: documentSource} = await DocumentModel.getDocumentSources();
  return DocumentModel.getEditorBetaDocumentContentBySource(documentSource, this._id);
};

/*
* 拓展articles
* */
schema.statics.extendArticles = async function(articles) {
  const ArticleModel = mongoose.model('articles');
  const ColumnPostModel = mongoose.model('columnPosts');
  const DocumentModel = mongoose.model('documents');
  const {article: documentSource} = await DocumentModel.getDocumentSources();
  const articleSource = await ArticleModel.getArticleSources();
  const {timeFormat, getUrl} = require('../nkcModules/tools');
  const articlesId = [];
  const columnPostArr = [];
  const columnPostObj = {};
  for(const article of articles) {
    articlesId.push(article._id);
    if(article.source === articleSource.column) columnPostArr.push(article._id);
  }
  const {article: articleType} = await ColumnPostModel.getColumnPostTypes();
  //查找出独立文章所在的专栏
  const columnPosts = await ColumnPostModel.find({pid: {$in: columnPostArr}, type: articleType});
  for(const columnPost of columnPosts) {
    columnPostObj[columnPost.pid] = columnPost;
  }
  //根据article查找出独立文章下的内容
  const documents = await DocumentModel.find({
    type: {
      $in: ['beta', 'stable']
    },
    source: documentSource,
    sid: {
      $in: articlesId
    }
  });
  const articlesObj = {};
  for(const d of documents) {
    const {type, sid} = d;
    if (!articlesObj[sid]) articlesObj[sid] = {};
    articlesObj[sid][type] = d;
  }
  const results = [];
  for(const article of articles) {
    const {
      _id,
      toc,
      uid,
    } = article;
    const articleObj = articlesObj[_id];
    if(!articleObj) continue;
    const betaDocument = articlesObj[_id].beta;
    const stableDocument = articlesObj[_id].stable;
    if(!stableDocument && !betaDocument) {
      continue;
    }
    const document = stableDocument || betaDocument;
    const {title, did} = document;
    let columnPost;
    if(article.source === articleSource.column) {
      columnPost = columnPostObj[article._id];
    }
    let url;
    if(article.source === articleSource.column) {
      if(columnPost) {
        url = `/m/${columnPost.columnId}/a${article._id}`;
      } else {
        url = '';
      }
    } else {
      url = '';
    }
    const result = {
      _id,
      uid,
      published: !!stableDocument,
      hasBeta: !!betaDocument,
      title: title || '未填写标题',
      url: `/m/${columnPostObj[_id].columnId}/a/${columnPostObj[_id]._id}`,
      time: timeFormat(toc),
      did,
      source: article.source,
    };
    results.push(result);
  }
  return results;
}

schema.statics.getBetaDocumentsObjectByArticlesId = async function(articlesId) {
  const DocumentModel = mongoose.model('documents');
  const {article: articleSource} = await DocumentModel.getDocumentSources();
  const betaDocuments = await DocumentModel.getBetaDocumentsBySource(articleSource, articlesId);
  const betaDocumentsObj = {};
  for(const document of betaDocuments) {
    betaDocumentsObj[document.sid] = document;
  }
  return betaDocumentsObj;
}

/*
* 返回文章页链接和编辑器链接
* @param {String} articleId 文章 ID
* @param {String} source 文章来源
* @param {String} sid 文章来源所对应的 ID
* @return {Object}
*   @param {String} editorUrl 文章编辑器 url
*   @param {String} articleUrl 文章的显示页 url
* */
schema.statics.getArticleUrlBySource = async function(articleId, source, sid, status) {
  const tools = require('../nkcModules/tools');
  const ArticleModel = mongoose.model('articles');
  const {column: columnSource, zone: zoneSource} = await ArticleModel.getArticleSources();
  const {default: defaultStatus} = await ArticleModel.getArticleStatus();
  let editorUrl = '';
  let articleUrl = '';
  if(source === columnSource) {
    editorUrl = tools.getUrl('columnArticleEditor', sid, articleId);
    const ColumnPostModel = mongoose.model('columnPosts');
    const {article: articleType} = await ColumnPostModel.getColumnPostTypes();
    const columnPost = await ColumnPostModel.findOne({type: articleType, pid: articleId}, {_id: 1});
    if(columnPost) {
      articleUrl = tools.getUrl('columnArticle', sid, columnPost._id);
    }
  } else if(source === zoneSource) {
    editorUrl = tools.getUrl('zoneArticleEditor', sid, articleId);
    articleUrl = tools.getUrl('zoneArticle', articleId);
  }

  return {
    editorUrl,
    articleUrl,
  }
}

/*
* 拓展独立文章列表，用于显示文章列表
* @param {[Article]}
* @return {[Object]}
*   @param {String} articleSource 文章来源
*   @param {String} articleSourceId 来源 ID
*   @param {String} articleId 文章 ID
*   @param {String} articleUrl 文章链接
*   @param {String} articleEditorUrl 文章编辑器链接
*   @param {Number} hits 阅读量
*   @param {Number} voteUp 点赞数
*   @param {Number} comment 评论数
*   @param {String} title 文章标题
*   @param {String} content 文章摘要
*   @param {String} coverUrl 封面图链接
*   @param {String} time 格式化之后的文章内容创建时间
*   @param {String} mTime 格式化之后的文章内容最后修改时间
*   @param {Object} column
*     @param {Number} _id 专栏 ID
*     @param {String} name 专栏名称
*     @param {String} description 专栏介绍
*     @param {String} homeUrl 专栏首页链接
* */
schema.statics.extendArticlesList = async (articles) => {
  const DocumentModel = mongoose.model('documents');
  const ArticleModel = mongoose.model('articles');
  const ColumnModel = mongoose.model('columns');
  const nkcRender = require("../nkcModules/nkcRender");
  const tools = require('../nkcModules/tools');
  const {column: columnSource} = await ArticleModel.getArticleSources();
  const articlesId = [];
  const columnsId = [];
  for(const article of articles) {
    const {_id, source, sid} = article;
    articlesId.push(_id);
    if(source === columnSource) {
      columnsId.push(sid);
    }
  }
  const {article: articleSource} = await DocumentModel.getDocumentSources();
  const stableDocumentsObj = await DocumentModel.getStableDocumentsBySource(articleSource, articlesId, 'object');
  const columnsObj = await ColumnModel.getColumnsById(columnsId, 'object');

  const articlesList = [];
  for(const article of articles) {
    const {
      _id: articleId,
      source,
      sid,
      voteUp,
      hits,
      comment,
      status
    } = article;
    const stableDocument = stableDocumentsObj[articleId];
    if(!stableDocument) continue;
    let column;
    const {articleUrl, editorUrl} = await ArticleModel.getArticleUrlBySource(articleId, source, sid, status);
    if(source === columnSource) {
      const targetColumn = columnsObj[sid];
      if(targetColumn) {
        column = {
          _id: targetColumn._id,
          name: targetColumn.name,
          description: targetColumn.description,
          homeUrl: tools.getUrl('columnHome', targetColumn._id)
        };
      }
    }
    articlesList.push({
      articleSource: source,
      articleSourceId: sid,
      articleId,
      articleUrl,
      articleEditorUrl: editorUrl,
      voteUp,
      hits,
      comment,
      title: stableDocument.title,
      content: nkcRender.htmlToPlain(stableDocument.content, 200),
      coverUrl: stableDocument.cover? tools.getUrl('documentCover', stableDocument.cover): '',
      time: moment(stableDocument.toc).format(`YYYY/MM/DD`),
      mTime: tools.fromNow(stableDocument.tlm),
      column,
    });
  }
  return articlesList;
}

/*
* 拓展独立文章草稿页列表，用于显示文章草稿列表
* @param {[Article]}
* @return {[Object]}
*   @param {String} type 表示草稿类型 create(新写文章) modify(编辑文章)
*   @param {String} articleId 文章 ID
*   @param {String} title 文章标题
*   @param {String} content 文章摘要
*   @param {String} coverUrl 封面图链接
*   @param {String} articleUrl 文章链接
*   @param {String} articleEditorUrl 文章编辑器链接
*   @param {String} time 格式化之后的文章内容创建时间
*   @param {String} mTime 格式化之后的文章内容最后修改时间
*   @param {Object} column
*     @param {Number} _id 专栏 ID
*     @param {String} name 专栏名称
*     @param {String} description 专栏介绍
*     @param {String} homeUrl 专栏首页链接
* */
schema.statics.extendArticlesDraftList = async (articles) => {
  const ArticleModel = mongoose.model('articles');
  const DocumentModel = mongoose.model('documents');
  const ColumnModel = mongoose.model('columns');
  const nkcRender = require('../nkcModules/nkcRender');
  const tools = require('../nkcModules/tools');
  const {column: columnSource} = await ArticleModel.getArticleSources();
  const {article: articleSource} = await DocumentModel.getDocumentSources();
  const articlesId = [];
  const columnsId = [];
  for(const article of articles) {
    if(article.source === columnSource) {
      columnsId.push(article.sid);
    }
    articlesId.push(article._id);
  }
  const betaDocumentsObject = await DocumentModel.getBetaDocumentsBySource(
    articleSource,
    articlesId,
    'object'
  );
  const columnsObj = await ColumnModel.getColumnsById(columnsId, 'object');
  const results = [];
  for(const article of articles) {
    const betaDocument = betaDocumentsObject[article._id];
    if(!betaDocument) continue;
    let column;
    if(article.source === columnSource) {
      const targetColumn = columnsObj[article.sid];
      if(targetColumn) {
        column = {
          _id: targetColumn._id,
          name: targetColumn.name,
          description: targetColumn.description,
          homeUrl: tools.getUrl('columnHome', targetColumn._id)
        };
      }
    }
    const {
      title,
      content,
      toc,
      tlm,
      cover,
    } = betaDocument;
    const {
      _id: articleId,
      status,
      source,
      sid
    } = article;
    const {articleUrl, editorUrl} = await ArticleModel.getArticleUrlBySource(articleId, source, sid);
    results.push({
      type: status === 'default'? 'create': 'modify',
      articleId,
      title: title || '未填写',
      content: nkcRender.htmlToPlain(content, 200),
      coverUrl: cover? tools.getUrl('documentCover', cover): '',
      articleUrl,
      articleEditorUrl: editorUrl,
      column,
      time: tools.timeFormat(toc),
      mTime: tools.fromNow(tlm),
    });
  }
  return results;
};


/*
* 更改article的hasDraft字段状态
* @param {Boolean} type 要改变的状态
* */
schema.methods.changeHasDraftStatus = async function() {
  const DocumentModel = mongoose.model('documents');
  const {article} = await DocumentModel.getDocumentSources();
  const {beta} = await DocumentModel.getDocumentTypes();
  const count = await DocumentModel.countDocuments({
    sid: this._id,
    source: article,
    type: beta
  });
  this.hasDraft = count > 0;
  await this.updateOne({
    $set: {
      hasDraft: this.hasDraft,
    }
  });
}

/*
* 拓展article下的document
* @param {Object} articles 需要拓展document的article
* @param {string} type 需要拓展的类型 stable beta
* @param {Array} options article需要拓展document的内容
* document: [
*   _id,
*   title,
*   content,
*   uid,
*   cover,
*   keywordsEN,
*   keywords,
*   abstractEN,
*   abstract,
*   reviewed,
*   wordCount,
*   ip,
*   port,
*   did,
*   toc,
*   type，
*   source,
* ]
* */
schema.statics.extendDocumentsOfArticles = async function(articles, type = 'beta', options) {
  const DocumentModel = mongoose.model('documents');
  const arr = [];
  const obj = {};
  const _articles = [];
  for(const article of articles) {
    if(article.type === 'deletes') continue;
    arr.push(article.did);
  }
  const documentType = await DocumentModel.getDocumentTypes();
  const {article} = await DocumentModel.getDocumentSources();
  const documents = await DocumentModel.find({did: {$in: arr}, type: documentType[type], source: article});
  for(const document of documents) {
    const a = {};
    for(const t of options) {
      a[t] = document[t];
    }
    obj[document.did] = a;
  }
  for(const article of articles) {
    const {_id, did, toc, status, hasDraft, sid, uid, source} = article;
    const document = obj[article.did];
    if(!document) continue;
    _articles.push({
      _id,
      did,
      toc,
      status,
      hasDraft,
      sid,
      uid,
      source,
      document,
    })
  }
  return _articles;
}

/*
* 获取当前用户的专家权限
* */
schema.methods.isModerator = async function(uid) {
  const {uid: articleUid} = this;
  return uid === articleUid;
}

/*
* 获取当前article的文章链接链接
* @param {object} articles 需要拓展文章链接的文章article
* res： {
*   articles: [
*     {
*       article, 原article
*       url, 文章链接地址
*       editorUrl， 文章编辑地址
*       user, 文章的用户信息
*       replies, 文章回复数
* }]}
* */
schema.statics.getArticlesInfo = async function(articles) {
  const UserModel = mongoose.model('users');
  const ColumnPostModel = mongoose.model('columnPosts');
  const ArticleModel = mongoose.model('articles');
  const DocumentModel = mongoose.model('documents');
  const ReviewModel = mongoose.model('reviews');
  const ArticlePostModel = mongoose.model('articlePosts');
  const columnArticlesId = [];
  const articlesDid = [];
  const articleId = [];
  const articleDocumentsObj = {};
  const uidArr = [];
  const userObj = {};
  const {column: columnSource, zone: zoneSource} = await ArticleModel.getArticleSources();
  for(const article of articles) {
    if(article.source === columnSource) {
      columnArticlesId.push(article._id);
    }
    articleId.push(article._id);
    articlesDid.push(article.did);
    uidArr.push(article.uid);
  }
  const users = await UserModel.find({uid: {$in: uidArr}});
  for(const user of users) {
    userObj[user.uid] = user;
  }
  const {article: articleSource} = await DocumentModel.getDocumentSources();
  const {stable: stableType} = await DocumentModel.getDocumentTypes();
  const articleDocuments = await DocumentModel.find({did: {$in: articlesDid}, source: articleSource, type: stableType});
  for(const d of articleDocuments) {
    articleDocumentsObj[d.did] = d;
  }
  const {article: articleType} = await ColumnPostModel.getColumnPostTypes();
  //查找专栏文章引用
  const columnPosts = await ColumnPostModel.find({pid: {$in: columnArticlesId}, type: articleType});
  const columnPostsObj = {};
  for(const columnPost of columnPosts) {
    columnPostsObj[columnPost.pid] =columnPost;
  }
  //查找文章评论引用
  let articlePosts = await ArticlePostModel.find({sid: {$in: articleId}});
  //获取评论引用信息
  const articlePostsObj = {};
  for(const a of articlePosts) {
    articlePostsObj[a.sid] = a;
  }
  const results = [];
  for(const article of articles) {
    let url;
    let editorUrl;
    const document = articleDocumentsObj[article.did];
    let review
    if(document) {
      review = (await ReviewModel.find({docId: document._id}).sort({toc: -1}).limit(1))[0];
    }
    if(article.source === columnSource) {
      const columnPost = columnPostsObj[article._id];
      if(!columnPost) return;
      editorUrl = `/column/editor?source=column&mid=${columnPost.columnId}&aid=${columnPost.pid}`;
      url = `/m/${columnPost.columnId}/a/${columnPost._id}`;
    } else if(article.source === zoneSource) {
      editorUrl = `/creation/editor/zone/article?source=zone&aid=${article._id}`;
      url = `/zone/a/${article._id}`;
    }
    const documentResourceId = await document.getResourceReferenceId()
    //获取文章引用的资源
    // const resources = await ResourceModel.getResourcesByReference(documentResourceId);
    results.push({
      ...article.toObject(),
      reason: review?review.reason:'',
      document,
      documentResourceId,
      editorUrl,
      user: userObj[article.uid],
      count: articlePostsObj[article._id]?articlePostsObj[article._id].count : 0,
      url,
    });
  }
  return results;
}

/*
* 通过指定文章ID获取文章数据
* @param {[String]} articlesId 文章ID组成的数组
* @param {String} type 返回的数据类型 array, object
* @return {[Object] or Object}
*   当返回类型为array时，值为文章数据
*   当返回类型为object时，键为文章ID，值为文章数据
*   文章数据格式如下：
*     @param {String} title 文章标题
*     @param {String} content 文章内容摘要
*     @param {String} coverUrl 文章封面图链接
*     @param {String} username 发表人用户名
*     @param {String} uid 发表人ID
*     @param {String} avatarUrl 发表人头像链接
*     @param {String} userHome 发表人个人名片页链接
*     @param {String} time 格式化之后的发表时间
*     @param {Date} toc 发表时间
*     @param {String} articleId 文章ID
*     @param {String} uid 文章的阅读链接
* */
schema.statics.getArticlesDataByArticlesId = async function(articlesId, type = 'object') {
  const ArticleModel = mongoose.model('articles');
  const UserModel = mongoose.model('users');
  const {getUrl, timeFormat} = require('../nkcModules/tools');
  const nkcRender = require('../nkcModules/nkcRender');
  const articles = await ArticleModel.find({_id: {$in: articlesId}});
  const usersId = [];
  for(const article of articles) {
    usersId.push(article.uid);
  }
  const usersObj = await UserModel.getUsersObjectByUsersId(usersId);
  const DocumentModel = mongoose.model('documents');
  const {article: articleSource} = await DocumentModel.getDocumentSources();
  const stableDocuments = await DocumentModel.getStableDocumentsBySource(articleSource, articlesId, 'object');
  const obj = {};
  for(const article of articles) {
    const articleUrl = await ArticleModel.getArticleUrlBySource(article._id, article.source, article.sid);
    const stableDocument = stableDocuments[article._id];
    if(!stableDocument) continue;
    const user = usersObj[article.uid];
    if(!user) continue;
    const {title, content, cover} = stableDocument;
    obj[article._id] = {
      title,
      content: nkcRender.htmlToPlain(content, 200),
      coverUrl: getUrl('documentCover', cover),
      username: user.username,
      uid: user.uid,
      avatarUrl: getUrl('userAvatar', user.avatar),
      userHome: getUrl('userHome', user.uid),
      time: timeFormat(article.toc),
      toc: article.toc,
      articleId: article._id,
      url: articleUrl.articleUrl
    };
  }
  if(type === 'object') {
    return obj;
  } else {
    const results = [];
    for(const articleId of articlesId) {
      const result = obj[articleId];
      if(!result) continue;
      results.push(result);
    }
    return results;
  }
}

/*
* 文章阅读数量增加
* */
schema.methods.addArticleHits = async function() {
  await this.updateOne({$inc: {hits: 1}});
}

/*
* 获取文章的收藏数
* */
schema.statics.getCollectedCountByAid = async function(aid) {
  const SubscribeModel = mongoose.model('subscribes');
  return await SubscribeModel.countDocuments({
    type: 'article',
    cancel: false,
    tid: aid,
  });
}

/*
*  通过专栏引用获取专栏文章信息
* */
schema.statics.getArticleInfoByColumn = async function(columnPost) {
  const ArticleModel = mongoose.model('articles');
  const ResourceModel = mongoose.model('resources');
  const ColumnPostCategoryModel = mongoose.model('columnPostCategories');
  const ColumnModel = mongoose.model('columns');
  const {pid, cid, mcid, columnId} = columnPost;
  const article = await ArticleModel.findOnly({_id: pid});
  const articleInfo = (await ArticleModel.getArticlesInfo([article]))[0];
  const resources = await ResourceModel.getResourcesByReference(articleInfo.documentResourceId);
  // 获取 专栏名称和id
  let column = await ColumnModel.findOne({_id: columnId})
  column = column.toObject()
  const mainCategory = await ColumnPostCategoryModel.getParentCategoryByIds(cid)
  const auxiliaryCategory = await ColumnPostCategoryModel.getMinorCategories(columnId, mcid)
  return {
    _id: columnPost._id,
    thread: article,
    article: articleInfo,
    resources,
    column,
    mainCategory,
    auxiliaryCategory,
    type: columnPost.type
  };
};
module.exports = mongoose.model('articles', schema);