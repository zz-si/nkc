const router = require('koa-router')();
router
  .post('/', async (ctx, next) => {
    const {body, internalData, data, db, state} = ctx;
    const {moment} = internalData;
    const {voteType, cancel} = body;
    await db.PostsVoteModel.checkVoteType(voteType);
    const {voteUp, voteDown} = await moment.vote(voteType, state.uid, cancel);
    data.vote = {
      voteUp,
      voteDown
    };
    await next();
  });
module.exports = router;
