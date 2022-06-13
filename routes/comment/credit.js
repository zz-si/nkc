const router = require('koa-router')();

router
  .post('/xsf', async (ctx, next) => {
    //学术分加减
    const {data, db , params, permission, body} = ctx;
    const {_id: cid} = params;
    const {user} = data;
    let {num, description} = body;
    num = Number(num);
    if(num % 1 !==0) ctx.throw(400, '学术分仅支持整数加减');
    if(!permission('creditXsf')) ctx.throw(403, '权限不足');
    const comment = await db.CommentModel.findOnly({_id: cid});
    const {normal} = await db.CommentModel.getCommentStatus();
    if(comment.status !== normal) ctx.throw(403, '无法给状态不正常的评论加减学术分');
    const targetUser = await db.UserModel.findOnly({uid: comment.uid});
    if(targetUser.uid === user.uid) ctx.throw(403, '不允许给自己加减学术分');
    const xsfSettings = await db.SettingModel.findOnly({_id: 'xsf'});
    const {addLimit, reduceLimit} = xsfSettings.c;
    if(num === 0) ctx.throw(400, '分值无效');
    if(num < 0 && -1*num > reduceLimit) ctx.throw(400, `单次扣除不能超过${reduceLimit}学术分`);
    if(num > 0 && num > addLimit) ctx.throw(400, `单次添加不能超过${addLimit}学术分`);
    if(description.length < 2) ctx.throw(400, '理由写的太少了');
    if(description.length > 500) ctx.throw(400, '理由不能超过500个字');
    const xsfsRecordTypes = await db.XsfsRecordModel.getXsfsRecordTypes();
    const _id = await db.SettingModel.operateSystemID('xsfsRecords', 1);
    const newRecord = db.XsfsRecordModel({
      _id,
      uid: targetUser.uid,
      operatorId: user.uid,
      num,
      description,
      ip: ctx.address,
      port: ctx.port,
      pid: cid,
      type: xsfsRecordTypes.comment,
    });
    targetUser.xsf += num;
    await newRecord.save();
    try{
      await targetUser.save();
    } catch(err) {
      await newRecord.deleteOne();
      throw(err);
    }
    await targetUser.calculateScore();
    const message = db.MessageModel({
      _id: await db.SettingModel.operateSystemID('messages', 1),
      r: targetUser.uid,
      ty: 'STU',
      port: ctx.port,
      ip: ctx.address,
      c: {
        type: 'xsf',
        recordId: _id,
      }
    });
    await message.save();
    await ctx.nkcModules.socket.sendMessageToUser(message._id);
    await next();
  })
  .del('/xsf/:recordId', async (ctx, next) => {
    //册小学术分
    const {data, db, params, query, permission} = ctx;
    const {reason} = query;
    const {user} = data;
    const {id: cid, recordId}  = params;
    if(!permission('cancelXsf')) cxt.throw(403, '权限不足');
    const record = await db.XsfsRecordModel.findOnly({_id: recordId, pid, recordType: 'post'});
    const comment = await db.CommentModel.findOnly({_id: cid});
    const targetUser = await db.UserModel.findOnly({uid: comment.uid});
    if(reason.length < 2) ctx.throw(400, '撤销原因写的太少啦~');
    const oldXsf = targetUser.xsf;
    targetUser.xsf -= record.num;
    await targetUser.save();
    try{
      await record.updateOne(
        {
          reason,
          tlm: Date.now(),
          lmOperatorId: user.uid,
          canceled: true,
          lmOperatorIp: ctx.address,
          lmOperatorPort: ctx.port
        }
      );
    } catch(err) {
      targetUser.xsf = oldXsf;
      await targetUser.save();
      throw err;
    }
    await next();
  })
  .post('/kcb', async (ctx, next) => {
    //鼓励评论用户
    const {db, data, params, permission, body} = ctx;
    const {user} = data;
    const {_id: cid} = params;
    let {num, description} = body;
    if(!permission('creditKcb')) ctx.throw(403, '权限不足');
    const fromUser = user;
    const creditScore = await db.SettingModel.getScoreByOperationType('creditScore');
    num = Number(num);
    if(num % 1 !== 0) ctx.throw(400, `${creditScore.name}仅支持小数点后两位`);
    const comment = await db.CommentModel.findOnly({_id: cid});
    // if(comment.anonymous) ctx.throw(400, '无法鼓励匿名用户');
    const toUser = await db.UserModel.findOnly({uid: comment.uid});
    if(targetUser.uid === user.uid) ctx.throw(400, '无法给自己鼓励');
    const {normal} = await db.CommentModel.getCommentStatus();
    if(comment.status !== normal) ctx.throw(403, '无法鼓励状态不正常的评论');
    const creditSettings = await db.SettingModel.getCreditSettings();
    await db.UserModel.updateUserScores(user.uid);
    const userScore = await db.UserModel.getUserScore(user.uid, creditScore.type);
    if(num < creditSettings.min) ctx.throw(400, `${creditScore.name}最少为${creditSettings.min/100}`);
    if(num > creditSettings.max) ctx.throw(400, `${creditScore.name}不能大于${creditSettings.max/100}`);
    // fromUser.kcb = await db.UserModel.updateUserKcb(fromUser.uid);
    if(userScore < num) ctx.throw(400, `你的${creditScore.name}不足`);
    if(description.length < 2) ctx.throw(400, '理由写的太少了');
    if(description.length > 60) ctx.throw(400, '理由不能超过60个字符');
    await db.KcbsRecordModel.insertUsersRecord({
      fromUser,
      toUser,
      comment,
      description,
      num,
      ip: ctx.address,
      port: ctx.port
    });
    await fromUser.calculateScore();
    await toUser.calculateScore();

    const updateObjForPost = {
      username: user.username,
      uid: fromUser.uid,
      pid: comment._id,
      toc: Date.now(),
      source: 'nkc',
      reason: description,
      type: 'kcb',
      q: num
    };
    await comment.updateOne({$push: {credits: updateObjForPost}});
    // 发消息
    const message = db.MessageModel({
      _id: await db.SettingModel.operateSystemID('messages', 1),
      r: toUser.uid,
      ty: 'STU',
      port: ctx.port,
      ip: ctx.address,
      c: {
        type: 'scoreTransfer',
        cid,
        // userName: user.username,
        uid: user.uid,
        // kcb: num,
        number: num,
        // scoreName: creditScore.name,
        scoreType: creditScore.type,
        // threadTitle: post.t,
        description,
      }
    });
    await message.save();
    await ctx.nkcModules.socket.sendMessageToUser(message._id);
    await next();
  })

module.exports = router;
