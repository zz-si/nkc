const PATH = require('path');
const Router = require('koa-router');
const router = new Router();
router
	.get('/', async  (ctx, next) => {
		const {data, db} = ctx;
		data.type = 'upload';
		// const homeSettings = await db.SettingModel.findOnly({type: 'home'});
		// data.homeSettings = homeSettings;
		// data.noticeThreads = [];
		// if(homeSettings.noticeThreadsId && homeSettings.noticeThreadsId.length !== 0) {
		// 	for(const oc of homeSettings.noticeThreadsId) {
		// 		const thread = await db.ThreadModel.findOne({oc});
		// 		if(thread) {
		// 			await thread.extendFirstPost();
		// 			data.noticeThreads.push(thread);
		// 		}
		// 	}
		// }
		ctx.template = 'experimental/settings/app.pug';
		await next();
  })
  .post('/', async (ctx, next) => {
    const imageExt = ['apk', 'ipa'];
    const {data, db, body, settings, tools, fs} = ctx;
    const {file} = body.files;
    const {name, size, path, hash} = file;
    const {appPlatform, appVersion, appDescription, appToc} = body.fields || {};
    let appFilePath, appPath;

    // 根据平台和版本号创建文件夹
    if(appPlatform == 'android') {
      appFilePath = settings.upload.androidSavePath + '\\' + appVersion
      try{
        await fs.mkdir(appFilePath);
      } catch (e) {
        ctx.throw(500, `${e}`);
      }
    }else{
      appFilePath = settings.upload.iosSavePath + '\\' + appVersion
      try{
        await fs.mkdir(appFilePath);
      } catch (e) {
        ctx.throw(500, `${e}`);
      }
    }

    // 获取文件，修改文件名，将文件存入对应的文件夹
    let ext = PATH.extname(name);
    if(!ext) ctx.throw(400, '不是安装包的格式');
    ext = ext.toLowerCase();
    ext = ext.replace('.', '');
    if(['exe'].includes(ext)) ctx.throw(403, '暂不支持上传该类型的文件');
    appPath = appFilePath + "\\" + name;
    await fs.rename(path, appPath);

    // 添加上传记录
    await db.AppVersionModel.update({lastest:true,appPlatForm:appPlatform}, {
      $set: {
        lastest: false
      }
    });
    let appUpLog = db.AppVersionModel({
      appPlatForm: appPlatform,
      appVersion: appVersion,
      appDescription: appDescription,
      appSize: size,
      hash: hash,
      fileName: name,
      desTypeId: body.desTypeId
    });
    await appUpLog.save();


    await next();
  });
module.exports = router;