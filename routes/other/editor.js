const Router = require('koa-router');
const editorRouter = new Router();
const nkcModules = require('../../nkcModules');
const dbFn = nkcModules.dbFunction;
editorRouter
  .get('/', async (ctx, next) => {
    const {data, db, query} = ctx;
    const {user} = data;
    const {type, id, cat, title, content} = query;
    //发新帖，回复等使用新编辑器
    //重新编辑帖子使用旧版编辑器
    ctx.template = 'interface_editor_test.pug';
    data.type = type;
    data.id = id;
    data.cat = cat;
    data.title = title;
    data.content = content;
    data.navbar = {};
    data.navbar.highlight = 'editor';
    //type=post:重新编辑回复
    //如果需要重新编辑html与语言的帖子，就使用新编辑器
    if(type === 'post') {
      ctx.template = 'interface_editor.pug';
      const targetPost = await db.PostModel.findOnly({pid: id});  //根据pid查询post表
      if(targetPost.l === "html"){
        console.log("在这里应该使用新编辑器")
      }else{
        console.log("在这里应该使用旧编辑器")
      }
      const targetThread = await db.ThreadModel.findOnly({tid: targetPost.tid});  //根据tid查询thread表
      if(targetPost.uid !== user.uid && !await targetThread.ensurePermissionOfModerators(ctx)) ctx.throw(403, '权限不足');
      data.content = targetPost.c;  //回复内容
      data.title = targetPost.t;  //回复标题
      data.targetUser = await targetPost.extendUser();  //回复对象
      return await next();
    } else if(type === 'application') {
    	const applicationForm = await db.FundApplicationFormModel.findOnly({_id: id});
    	if(cat === 'p') {
        ctx.template = 'interface_editor.pug';
    		const project = await applicationForm.extendProject();
    		data.title = project.t;
    		data.content = project.c;
	    } else if(cat === 'c') {
				if(!user) ctx.throw(401, '您还没有登陆，请先登陆。');
				if(!user.certs.includes('mobile')) ctx.throw(401, '请先绑定手机号完成实名认证。');
	    } else if(cat === 'r') {

	    }
	    return await next();
    }
    await next();
  });

module.exports = editorRouter;