const mongoose = require('../settings/database');

const articleSources = {
  column: 'column'
};

const articleStatus = {
  normal: 'normal',
  'default': 'default',
  deleted: 'deleted',
  cancelled: 'cancelled'
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
  // 其他引用模块类型
  references: {
    type: String,
    default: [],
    index: 1
  }
}, {
  collection: 'articles'
});

/*
* 获取 status
* */
schema.statics.getArticleStatus = async () => {
  return articleStatus;
};

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
* 向 book 中添加文章，创建 article、document
* @param {Object} props
*   @param {String} title 文章标题，可为空
*   @param {String} content 文章富文本内容，可为空
*   @param {String} uid 作者，不可为空
* @return {Object} 创建的 article 对象
* */
schema.statics.createArticle = async (props) => {
  const {title, content, coverFile, uid} = props;
  const toc = new Date();
  const ArticleModel = mongoose.model('articles');
  const SettingModel = mongoose.model('settings');
  const DocumentModel = mongoose.model('documents');
  const {article: documentSource} = await DocumentModel.getDocumentSources();
  const aid = await SettingModel.getNewId();
  const document = await DocumentModel.createBetaDocument({
    uid,
    coverFile,
    title,
    content,
    toc,
    source: documentSource,
    sid: aid
  });
  const article = new ArticleModel({
    _id: aid,
    uid,
    toc,
    did: document.did,
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
* 修改 book 中的文章
* @param {Object} props
*   @param {String} title 文章标题，可为空
*   @param {String} content 文章内容，可为空
*   @param {String} cover 原封面 ID，可为空
*   @param {File} coverFile 新的封面图文件对象
* */
schema.methods.modifyArticle = async function(props) {
  const DocumentModel = mongoose.model('documents');
  const {title, content, cover, coverFile} = props;
  const {did} = this;
  const toc = new Date();
  await DocumentModel.updateDocumentByDid(did, {
    title,
    content,
    cover,
    coverFile,
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
schema.methods.publishArticle = async function() {
  const DocumentModel = mongoose.model('documents');
  const {did} = this;
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
  const DocumentModel = mongoose.model('documents');
  const BooksModel = mongoose.model('books');
  const {article: documentSource} = await DocumentModel.getDocumentSources();
  const {timeFormat, getUrl} = require('../nkcModules/tools');
  const articlesId = [];
  for(const article of articles) {
    articlesId.push(article._id);
  }
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
  const bookObj = {};
  const books = await BooksModel.find({list: {$in: articlesId}});
  for(const book of books) {
    articlesId.map(id => {
      if(book.list.includes(id)) {
        bookObj[id] = book;
      }
    })
  }
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
    const result = {
      _id,
      uid,
      bid: bookObj[article._id]._id,
      published: !!stableDocument,
      hasBeta: !!betaDocument,
      title: title || '未填写标题',
      bookUrl: `/book/${bookObj[article._id]._id}`,
      bookName:  bookObj[article._id].name,
      url: getUrl('bookContent', bookObj[article._id]._id, article._id),
      time: timeFormat(toc),
      did,
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
* 拓展独立文章列表，用于显示文章列表
* @param {[Article]}
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
    const {_id: articleId, source, sid} = article;
    const stableDocument = stableDocumentsObj[articleId];
    if(!stableDocument) continue;
    let column = null;
    if(source === columnSource) {
      const targetColumn = columnsObj[sid];
      if(targetColumn) column = {
        _id: targetColumn._id,
        name: targetColumn.name,
        description: targetColumn.description
      };
    }
    articlesList.push({
      articleSource: source,
      articleSourceId: sid,
      articleId,
      title: stableDocument.title,
      content: nkcRender.htmlToPlain(stableDocument.content, 200),
      time: tools.timeFormat(stableDocument.toc),
      mTime: tools.timeFormat(stableDocument.tlm),
      column,
    });
  }
  return articlesList;
}

module.exports = mongoose.model('articles', schema);
