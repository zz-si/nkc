const Router = require("koa-router");
const router = new Router();
router
  .get("/", async (ctx, next) => {
    const {fs, params, db, settings} = ctx;
    const {forumBannerPath} = settings.upload;
    const {defaultForumBannerPath} = settings.statics;
    const {fid} = params;
    await db.ForumModel.findOnly({fid});
    let filePath = `${forumBannerPath}/${fid}.jpg`;
    if(!fs.existsSync(filePath)) {
      filePath = defaultForumBannerPath;
    }
    ctx.filePath = filePath;
    ctx.type = 'jpg';
    ctx.set('Cache-Control', 'public, no-cache');
    const tlm = await ctx.fs.stat(ctx.filePath);
    ctx.lastModified = new Date(tlm.mtime).toUTCString();
    await next();
  });
module.exports = router;