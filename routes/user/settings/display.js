const Router = require("koa-router");
const router = new Router();
router
  .get("/", async (ctx, next) => {
    ctx.template = "interface_user_settings_display.pug";
    await next();
  });
module.exports = router;