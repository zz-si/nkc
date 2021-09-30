const router = require('koa-router')();
module.exports = router;
router
  .get('/', async (ctx, next) => {
    const {db, data} = ctx;
    data.categoryTree = await db.ThreadCategoryModel.getCategoryTree();
    ctx.template = 'experimental/settings/threadCategory/threadCategory.pug';
    await next();
  })
  .post('/', async (ctx, next) => {
    const {db, body, data, nkcModules} = ctx;
    const {checkString} = nkcModules.checkData;
    const {name, description, cid} = body;
    checkString(name, {
      name: '分类名',
      minLength: 0,
      maxLength: 20
    });
    const saveName = await db.ThreadCategoryModel.countDocuments({name});
    if(saveName) ctx.throw(400, `分类名已存在`);
    checkString(description, {
      name: '分类介绍',
      minLength: 0,
      maxLength: 1000
    });
    if(cid) {
      const category = await db.ThreadCategoryModel.findOne({_id: cid});
      if(!category) ctx.throw(400, `上级分类不存在 cid: ${cid}`);
    }
    await db.ThreadCategoryModel.newCategory(name, description, cid);
    data.categoryTree = await db.ThreadCategoryModel.getCategoryTree();
    await next();
  })
  .put('/', async (ctx, next) => {
    const {db, body, data} = ctx;
    const {categories} = body;
    console.log(categories)
    for(const c of categories) {
      const {cid, order} = c;
      await db.ThreadCategoryModel.updateOne({_id: cid}, {
        $set: {
          order,
        }
      });
    }
    data.categoryTree = await db.ThreadCategoryModel.getCategoryTree();
    await next();
  })
  .put('/:cid', async (ctx, next) => {
    const {db, body, nkcModules, params} = ctx;
    const {cid} = params;
    const {name, description} = body;
    const {checkString} = nkcModules.checkData;
    checkString(name, {
      name: '分类名',
      minLength: 0,
      maxLength: 20
    });
    const saveName = await db.ThreadCategoryModel.countDocuments({name, _id: cid});
    if(saveName) ctx.throw(400, `分类名已存在`);
    checkString(description, {
      name: '分类介绍',
      minLength: 0,
      maxLength: 1000
    });
    const category = await db.ThreadCategoryModel.findOnly({_id: cid});
    await category.updateOne({
      $set: {
        name,
        description,
      }
    });
    await next();
  });
