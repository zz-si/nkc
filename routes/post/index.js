const Router = require('koa-router');
const quote = require('./quote');
const history = require('./history');
const credit = require('./credit');
const disabled = require('./disabled');
const recommend = require('./recommend');
const digestRouter = require('./digest');
const voteRouter = require('./vote');
const postRouter = new Router();

postRouter
  .get('/:pid', async (ctx, next) => {
    const {data, db, query} = ctx;
		const {token} = query;
    const {pid} = ctx.params;
    const post = await db.PostModel.findOnly({pid});
    const thread = await post.extendThread();
    await thread.extendFirstPost();
	  const forums = await thread.extendForums(['mianForums', 'minorForums']);
    const {user} = data;
    let isModerator = ctx.permission('superModerator');
    if(!isModerator) {
      for(const f of forums) {
        isModerator = await f.isModerator(data.user?data.user.uid: '');
        if(isModerator) break;
      }
    }
    // 判断用户是否具有访问该post所在文章的权限
    data.isModerator = isModerator;
    const options = {
    	roles: data.userRoles,
      grade: data.userGrade,
	    isModerator,
	    userOperationsId: data.userOperationsId,
	    user
    };
    // 权限判断		
    if(!token){
      // 权限判断
      await post.ensurePermission(options);
		}else{
			let share = await db.ShareModel.findOne({"token":token});
			if(!share) ctx.throw(403, "无效的token");
      // if(share.tokenLife === "invalid") ctx.throw(403, "链接已失效");
      if(share.tokenLife === "invalid") {
        await post.ensurePermission(options);
      }
      // 获取分享限制时间
      let allShareLimit = await db.ShareLimitModel.findOne({"shareType":"all"});
			if(!allShareLimit){
				allShareLimit = new db.ShareLimitModel({});
				await allShareLimit.save();
      }
      
      let shareLimitTime;
      for(const f of forums) {
        const timeLimit = Number(f.shareLimitTime)
        if(shareLimitTime === undefined || shareLimitTime > timeLimit) {
          shareLimitTime = timeLimit;
        }
      }

      if(shareLimitTime === undefined){
        shareLimitTime = allShareLimit.shareLimitTime;
      }
			let shareTimeStamp = parseInt(new Date(share.toc).getTime());
			let nowTimeStamp = parseInt(new Date().getTime());
			if(nowTimeStamp - shareTimeStamp > 1000*60*60*shareLimitTime){
				await db.ShareModel.update({"token": token}, {$set: {tokenLife: "invalid"}});
        await post.ensurePermission(options);
			}
			if(share.shareUrl.indexOf(ctx.path) == -1) ctx.throw(403, "无效的token")
		}
	  // await post.ensurePermissionNew(options);
		// 拓展其他信息
    await post.extendUser();
    await post.extendResources();
    const posts = await db.PostModel.extendPosts([post], {uid: data.user?data.user.uid: ''});
    data.post = posts[0];
    const voteUp = await db.PostsVoteModel.find({pid, type: 'up'}).sort({toc: 1});
    const uid = new Set();
    for(const v of voteUp) {
      uid.add(v.uid);
    }
    const users = await db.UserModel.find({uid: {$in: [...uid]}});
    const usersObj = {};
    for(const u of users) {
      usersObj[u.uid] = u;
    }
    data.voteUpUsers = [];
    for(const v of voteUp) {
      data.voteUpUsers.push(usersObj [v.uid]);
    }

    const step = await thread.getStep({
      pid,
      disabled: data.userOperationsId.includes('displayDisabledPosts')
    });
    data.step = step;
    data.postUrl = `/t/${thread.tid}?highlight=${pid}&page=${step.page}#${pid}`;
    data.post.user = await db.UserModel.findOnly({uid: post.uid});
    await db.UserModel.extendUsersInfo([data.post.user]);
    await data.post.user.extendGrade();
    data.redEnvelopeSettings = (await db.SettingModel.findOnly({_id: 'redEnvelope'})).c;
    data.kcbSettings = (await db.SettingModel.findOnly({_id: 'kcb'})).c;
    data.xsfSettings = (await db.SettingModel.findOnly({_id: 'xsf'})).c;
    data.thread = thread;
    ctx.template = 'post/post.pug';
    await next();
  })
  .patch('/:pid', async (ctx, next) => {
    const {t, c, desType, desTypeId, abstract} = ctx.body.post;
    if(c.lenght < 6) ctx.throw(400, '内容太短，至少6个字节');
    const {pid} = ctx.params;
    const {data, db, fs} = ctx;
    const {user} = data;
    const userPersonal = await db.UsersPersonalModel.findOnly({uid: user.uid});
    const authLevel = await userPersonal.getAuthLevel();
	  if(authLevel < 1) ctx.throw(403,'您的账号还未实名认证，请前往账号安全设置处绑定手机号码。');
	  if(!user.volumeA) ctx.throw(403, '您还未通过A卷考试，未通过A卷考试不能发表回复。');
    if(!c) ctx.throw(400, '参数不正确');
    const targetPost = await db.PostModel.findOnly({pid});
    const targetThread = await targetPost.extendThread();
    const targetForums = await targetThread.extendForums(['mainForums']);
    let isModerator;
    for(let targetForum of targetForums){
      isModerator = await targetForum.isModerator(user.uid);
      if(isModerator) break;
    }
    // const isModerator = await targetForum.isModerator(user.uid);
    // 权限判断
    if(!data.userOperationsId.includes('modifyOtherPosts') && !isModerator) {
    	if(user.uid !== targetPost.uid) ctx.throw(403, '您没有权限修改别人的回复');
    	if(targetPost.disabled && !targetPost.toDraft) {
    		ctx.throw(403, '回复已被屏蔽，暂不能修改');
	    }
    }
    if(targetThread.oc === pid && !t) ctx.throw(400, '标题不能为空!');
    const targetUser = await targetPost.extendUser();

    if(targetThread.type !== "product") {

      // 修改回复的时间限制
      let modifyPostTimeLimit = 0;
      for(const r of data.userRoles) {
        if(r.modifyPostTimeLimit === -1) {
          modifyPostTimeLimit = -1;
          break;
        }
        if(r.modifyPostTimeLimit > modifyPostTimeLimit) {
          modifyPostTimeLimit = r.modifyPostTimeLimit;
        }
      }
      if(modifyPostTimeLimit !== -1 && (Date.now() - targetPost.toc.getTime() > modifyPostTimeLimit*60*60*1000))
        ctx.throw(403, `您只能需改${modifyPostTimeLimit}小时前发表的内容`);

    }



    const objOfPost = Object.assign(targetPost, {}).toObject();
    objOfPost._id = undefined;
    const histories = new db.HistoriesModel(objOfPost);
    await histories.save();
    // const quote = await dbFn.getQuote(c);
    // let rpid = '';
    // if(quote && quote[2]) {
    //   rpid = quote[2];
    //   const username = quote[1];
    //   if(rpid !== targetPost.pid) {
    //     const quoteUser = await db.UserModel.findOne({username: username});
    //     const newReplies = new db.ReplyModel({
    //       fromPid: pid,
    //       toPid: rpid,
    //       toUid: quoteUser.uid
    //     });
    //     await newReplies.save();
    //   }
    // }
    targetPost.uidlm = user.uid;
    targetPost.iplm = ctx.address;
    targetPost.t = t;
    targetPost.c = c;
    targetPost.abstract = abstract;
    targetPost.tlm = Date.now();
	  if(targetThread.oc === pid) {
			await targetThread.update({hasCover: true});
			const {coverPath} = ctx.settings.upload;
			if(targetThread.tid) {
				const path = coverPath + '/' + targetThread.tid + '.jpg';
				try {
					await fs.access(path);
					await fs.unlink(path);
				} catch(e) {
					// 之前不存在封面图
				}

			}

	  }
    // targetPost.rpid = rpid;
    const q = {
      tid: targetThread.tid
    };
	  await targetPost.save();
	  if(!isModerator && !data.userOperationsId.includes('displayDisabledPosts')) {
	  	q.disabled = false;
	  }
    let {page} = await targetThread.getStep({pid, disabled: q.disabled});
    let postId = `#${pid}`;
    page = `?page=${page}`;
    data.redirect = `/t/${targetThread.tid}?&pid=${targetPost.pid}`;
    data.targetUser = targetUser;
    // 帖子再重新发表时，解除退回的封禁
    // 删除日志中modifyType改为true
    let delPostLog = await db.DelPostLogModel.find({"postId":pid,"modifyType":false})
    for(var i in delPostLog){
      await delPostLog[i].update({"modifyType":true})
    }
    await targetThread.update({"recycleMark":false})
    // 在post中找到这一条数据，并解除屏蔽
    let singlePost = await db.PostModel.findOnly({pid})
    await singlePost.update({disabled:false})
    // 帖子曾经在草稿箱中，发表时，删除草稿
    await db.DraftModel.remove({"desType":desType,"desTypeId":desTypeId})
    await targetUser.updateUserMessage();
    await next();
  })
  .use('/:pid/history', history.routes(), history.allowedMethods())
	.use('/:pid/digest', digestRouter.routes(), digestRouter.allowedMethods())
  .use('/:pid/recommend', recommend.routes(), recommend.allowedMethods())
  .use('/:pid/credit', credit.routes(), credit.allowedMethods())
  .use('/:pid/disabled', disabled.routes(), disabled.allowedMethods())
  .use('/:pid/vote', voteRouter.routes(), voteRouter.allowedMethods())
  .use('/:pid/quote', quote.routes(), quote.allowedMethods());
module.exports = postRouter;