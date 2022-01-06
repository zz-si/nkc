const router = require("koa-router")();
router
  .get("/", async (ctx, next) => {
    const {db, data, state} = ctx;
    const categories = await db.ResourceCategoryModel.find({uid: state.uid});
    data.categories = categories.reverse();
    await next();
  })
  .post("/", async (ctx, next) => {
    //添加或修改分类
    const {db, state, body, nkcModules} = ctx;
    const {name, type, _id, description} = body;
    const {checkString} = nkcModules.checkData;
    checkString(name, {
      name: '文件名',
      minLength: 1,
      maxLength: 10
    });
    const oldCategory = await db.ResourceCategoryModel.findOne({uid: state.uid, name});
    if(oldCategory) ctx.throw(403, '已存在相同分组名');
    if(type === 'create') {
      const count = await db.ResourceCategoryModel.countDocuments({uid: state.uid});
      if(count === 10) ctx.throw(403, '最多添加10个分组');
      const category = db.ResourceCategoryModel({
        _id: await db.SettingModel.operateSystemID('resourceCategory', 1),
        name,
        uid: state.uid,
        description
      });
      await category.save();
    } else if(type === 'modify') {
      await db.ResourceCategoryModel.updateOne({_id}, {
        $set: {
          name,
          description,
          tlm: new Date(),
        }
      });
    } else if (type === 'delete') {
      //删除分组
      await db.ResourceCategoryModel.deleteOne({_id});
    }
    await next();
  })
  .post('/:cid/move', async(ctx, next) => {
    const {db, data, body, params} = ctx;
    const {resources} = body;
    const {cid} = params;
    await db.ResourceModel.updateMany({rid: {$in: resources}}, {
      $set: {
        cid
      }
    });
    await next();
  })
module.exports = router;