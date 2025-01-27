export function closePage(app) {
  app.$emit('event', 'closePage');
}

export function sendNewMessageCount(app, count) {
  app.$emit('event', 'updateNewMessageCount', count);
}

export function openPage(app, pageId, data) {
  setTimeout(() => {
    app.$emit('event', 'openPage', {
      pageId,
      data
    })
  })
}

export function openChatPage(app, type, uid) {
  openPage(app, 'PageChat', {type, uid});
}

export function openUserPage(app, type, uid) {
  if(type !== 'UTU') {
    openChatPage(app, type, uid);
  } else {
    openPage(app, 'PageUser', {type, uid});
  }
}

export function openCategoryPage(app, id) {
  openPage(app, 'PageCategory', id);
}

export function openSearchPage(app) {
  openPage(app, 'PageSearch');
}

export function openSettingPage(app) {
  openPage(app, 'PageSetting');
}

export function addFriend(uid) {
  return sweetPrompt('请输入验证信息')
    .then((description) => {
      return nkcAPI('/message/friend/apply', 'POST', {
        uid,
        description
      });
    })
    .then(() => {
      screenTopAlert(`提交成功`);
    })
    .catch(sweetError);
}

export function removeChat(type, uid) {
  return sweetQuestion(`确定要从消息列表中删除当前对话？`)
    .then(() => {
      return nkcAPI(`/message/chat?type=${type}&uid=${uid}`, 'DELETE')
    })
    .then(() => {

    })
    .catch(sweetError)
}

export function withdrawn(messageId) {
  return nkcAPI('/message/withdrawn', 'PUT', {messageId});
}

export function onWithdrawn(originMessages, messageId, reEdit) {
  for(const message of originMessages) {
    if(message._id === messageId) {
      message.contentType = 'withdrawn';
      if(!reEdit) message.content = null;
      break;
    }
  }
}