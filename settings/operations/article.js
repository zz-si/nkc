module.exports = {
  GET: "getArticleInfo",
  PARAMETER: {
    DELETE: "deleteArticle",
    options: {
      GET: "getArticleOptions"
    },
    unblock: {
      POST: "unblockArticle"
    },
    draft: {
      DELETE: "deleteArticleDraft"
    }
  }
};
