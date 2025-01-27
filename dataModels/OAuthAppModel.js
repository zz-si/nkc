const mongoose = require('../settings/database');
const fsPromises = require("fs").promises;
const collectionName = 'OAuthApps';
const appStatus = {
  normal: 'normal', // 正常
  disabled: 'disabled', // 被屏蔽
  deleted: 'deleted', // 被删除
  unknown: 'unknown', // 待审核
};
const appOperations = {
  signIn: 'signIn',
};
const schema = mongoose.Schema({
  _id: String,
  name: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: ''
  },
  desc: {
    type: String,
    default: '',
  },
  toc: {
    type: Date,
    default: Date.now,
    index: 1,
  },
  secret: {
    type: String,
    required: true,
    index: 1,
  },
  uid: {
    type: String,
    required: true,
    index: 1
  },
  status: {
    type: String,
    default: appStatus.normal,
    index: 1
  },
  operations: {
    type: [String],
    default: [],
  },
  home: {
    type: String,
    required: true,
  },
  ips: {
    type: [String],
    default: [],
  }
}, {
  collection: collectionName
});

schema.statics.getAppOperations = () => {
  return {...appOperations};
}
schema.statics.getAppStatus = () => {
  return {...appStatus};
}
/*
* @return {String}
* */
schema.statics.createAppId = async () => {
  const SettingModel = mongoose.model('settings');
  return SettingModel.operateSystemID('OAuthApps', 1);
}

/*
* @return {String}
* */
schema.statics.createAppSecret = async () => {
  const {getRandomString} = require('../nkcModules/apiFunction');
  return getRandomString('a0', 64);
}
/*
* 创建应用
* @param {String} name
* @param {String} desc
* @param {String} home
* @param {String} callback
* @param {String} uid
* @return {OAuthAppDocument}
* */
schema.statics.createApp = async (props) => {
  const OAuthAppModel = mongoose.model(collectionName);
  const {name, desc, uid, home, operations, ips} = props;
  const appId = await OAuthAppModel.createAppId();
  const appSecret = await OAuthAppModel.createAppSecret();
  const client = new OAuthAppModel({
    _id: appId,
    name,
    desc,
    home,
    uid,
    secret: appSecret,
    operations,
    ips
  });
  await client.save();
  return client;
}

schema.methods.ensurePermission= async function(operation) {
  if(!this.operations.includes(operation)) {
    throwErr(403, '权限不足');
  }
}

schema.statics.getAppBySecret = async (props) => {
  const {appId, secret, ip} = props;
  const OAuthAppModel = mongoose.model('OAuthApps');
  const app = await OAuthAppModel.findOne({_id: appId, secret});
  if(!app) {
    throwErr(403, '应用ID或秘钥错误');
  }
  if(app.ips && app.ips.length !== 0 && !app.ips.includes(ip)) {
    throwErr(403, `无权调用`);
  }
  if(app.status !== appStatus.normal) {
    throwErr(403, `应用不可用 status=${app.status}`);
  }
  return app;
};

schema.statics.getAppById = async (appId) => {
  const OAuthAppModel = mongoose.model('OAuthApps');
  const app = await OAuthAppModel.findOne({_id: appId});
  if(!app) {
    throwErr(400, `appId无效`);
  }
  return app;
};

schema.methods.userAuth = async function(uid) {
  const UsersPersonalModel = mongoose.model('usersPersonal');
  const usersPersonal = await UsersPersonalModel.findOne({uid}, {uid: 1, oauthAppId: 1});
  if(!usersPersonal) {
    throwErr(404, `用户不存在(uid=${uid})`);
  }
  if(!usersPersonal.oauthAppId.includes(this._id)) {
    throwErr(403, `权限不足，用户未授权`);
  }
};

schema.statics.getUserAccountInfo = async (uid) => {
  const UserModel = mongoose.model('users');
  const UsersPersonalModel = mongoose.model('usersPersonal');
  const AttachmentModel = mongoose.model('attachments');
  const FILE = require('../nkcModules/file');
  const user = await UserModel.findOne({uid}, {
    uid: 1,
    description: 1,
    username: 1,
    avatar: 1,
  });
  const usersPersonal = await UsersPersonalModel.findOne({uid});
  const {hashType, hash, salt} = await usersPersonal.getOauthPasswordInfo();
  let avatar = '';
  if(user.avatar) {
    try {
      const attachment = await AttachmentModel.findOne({_id: user.avatar});
      if(attachment && !attachment.disabled) {
        const {url} = await attachment.getRemoteFile('lg');
        const {filePath} = await FILE.downloadFileToTmp(
          url,
          `download_user_avatar_${user.avatar}_${Date.now()}.jpg`
        );
        avatar = (await fsPromises.readFile(filePath)).toString('base64');
      }
    } catch(err) {
      console.log(`oauth 获取用户头像出错：${err.message}`);
    }
  }
  return {
    uid,
    name: user.username,
    desc: user.description,
    avatar,
    passwdHashType: hashType,
    passwdHash: hash,
    passwdSalt: salt,
  }
}

module.exports = mongoose.model(collectionName, schema);
