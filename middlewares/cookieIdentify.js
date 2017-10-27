const db = require('../dataModels');

module.exports = async (ctx, next) => {
  //cookie identification
  const userInfo = ctx.cookies.get('userInfo');
  if(!userInfo) {
    await next();
  } else {
    const {username, uid} = JSON.parse(userInfo);
    const user = await db.UserModel.findOne({uid});
    if (user.username !== username) {
      ctx.cookies.set('userInfo', '');
      ctx.status = 401;
      ctx.error = new Error('缓存验证失败');
      ctx.redirect('/login')
    }
    ctx.data.user = user;
    await next();
  }
};