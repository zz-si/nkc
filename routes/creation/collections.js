const router = require('koa-router')();
router
  .get('/', async (ctx, next) => {
    await next();
  })
  .get('/data', async (ctx, next) => {
    await next();
  });
module.exports = router;
