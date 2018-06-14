const Router = require('koa-router');
const router = new Router();

router
  .patch('/', async (ctx, next) => {
    const {disabled, para} = ctx.body;
    const {pid} = ctx.params;
    const {db, data} = ctx;
		const {user} = data;
    if(disabled === undefined) ctx.throw(400, '参数不正确');
    const targetPost = await db.PostModel.findOnly({pid});
    const targetThread = await db.ThreadModel.findOnly({tid: targetPost.tid});
    const targetForum = await targetThread.extendForum();
    const isModerator = await targetForum.isModerator(data.user?data.user.uid:'');
    if(!isModerator) {
    	if(!data.userOperationsId.includes('disabledPost')) ctx.throw(400, '权限不足');
    }
    // if(!await targetThread.ensurePermissionOfModerators(ctx)) ctx.throw(403,'权限不足');
    const obj = {disabled: false};
    if(disabled) obj.disabled = true;
    if(obj.disabled) {
    	const posts = await db.PostModel.find({tid: targetThread.tid, disabled: false}, {pid: 1});
    	if(posts.length === 1 && posts[0].pid === pid) {
		    ctx.throw(400, '无法屏蔽仅有一条post的帖子，请移动至回收站。');
	    }
    }
    await targetPost.update(obj);
    if(targetPost.disabled === disabled) {
      if(!disabled) ctx.throw(400, '操作失败！该回复未被屏蔽，请刷新');
      if(disabled) ctx.throw(400, '操作失败！该回复在您操作之前已经被屏蔽了，请刷新');
    }
    data.targetUser = await targetPost.extendUser();
    if(obj.disabled && para && para.illegalType) {
    	const log = db.UsersScoreLogModel({
				uid: user.uid,
		    type: 'score',
		    operationId: 'violation',
		    description: '屏蔽回复并标记为违规',
		    change: 0,
		    targetCount: 1,
		    targetUid: data.targetUser.uid,
		    pid,
		    tid: targetThread.tid,
		    fid: targetThread.fid
	    });
    	await log.save();
    	data.targetUser.violation++;
    	await data.targetUser.update({$inc: {violationCount: 1}});
    	await data.targetUser.calculateScore();
    }
    await targetThread.updateThreadMessage();
    // 删除回复 添加日志
    if(disabled === false){
      let delPostLog = await db.DelPostLogModel.find({"postId":pid,"modifyType":false})
      for(var i in delPostLog){
        await delPostLog[i].update({"modifyType":true})
      }
      await targetPost.update({"toDraft":null})
    }
    if(disabled === true){
      let {para} = ctx.body
      let post = await db.PostModel.findOne({"pid":pid})
			let oc = targetThread.oc;
			let postFirst = await db.PostModel.findOne({"pid":oc})
      para.delUserId = targetPost.uid
      para.userId = user.uid;
      para.delPostTitle = postFirst.t;
      const delLog = new db.DelPostLogModel(para);
      await delLog.save();
      if(para.noticeType === true){
        let uid = targetPost.uid;
        const toUser = await db.UsersPersonalModel.findOnly({uid});
        await toUser.increasePsnl('system', 1);
      }
    }
    await next();
  });

module.exports = router;