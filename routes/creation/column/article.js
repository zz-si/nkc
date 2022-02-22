const router = require('koa-router')();
router
  .get('/', async (ctx, next) => {
    const {
      query,
      state,
      db,
      nkcModules,
      data
    } = ctx;
    const {page = 0} = query;
    const {column: columnSource} = await db.ArticleModel.getArticleSources();
    const {normal: normalStatus} = await db.ArticleModel.getArticleStatus();
    const match = {
      uid: state.uid,
      source: columnSource,
      status: normalStatus
    };
    const count = await db.ArticleModel.countDocuments(match);
    const paging = nkcModules.apiFunction.paging(page, count);
    const articles = await db.ArticleModel.find(match)
      .sort({toc: -1})
      .skip(paging.start)
      .limit(paging.perpage);
    data.paging = paging;
    data.articlesList = await db.ArticleModel.extendArticlesList(articles);
    await next();
  });
module.exports = router;