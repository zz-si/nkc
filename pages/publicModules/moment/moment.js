import MomentComments from '../../lib/vue/zone/MomentComments';
import {momentVote} from "../../lib/js/zone/vote";
import {sweetError} from "../../lib/js/sweetAlert";

// 已创建的动态实例，{momentId: momentInstance}
const momentsInstance = {};

// 动态类
class Moment {
  constructor(props) {
    const {momentId} = props;
    // 动态ID
    this.momentId = momentId;
    // 评论列表 vue app
    this.commentApp = null;
  }
  // 获取当前动态的最外层容器
  getContainerElement() {
    const {momentId} = this;
    const momentsContainerElements = getMomentsContainerElements();
    return momentsContainerElements.find(`.single-moment-container[data-moment-id="${momentId}"]`);
  }
  // 获取评论列表最外层容器
  getCommentContainerElement() {
    const containerElement = this.getContainerElement();
    return containerElement.find('.single-moment-comment-container');
  }
  // 获取点赞外层容器
  getVoteContainerElement() {
    const commentContainerElement = this.getContainerElement();
    return commentContainerElement.find(`.single-moment-bottom-right`);
  }
  // 获取点赞数字 dom
  getVoteElement() {
    const voteContainerElement = this.getVoteContainerElement();
    return voteContainerElement.find(`span`);
  }
  // 获取引用窗口
  getQuoteContainerElement() {
    const containerElement = this.getContainerElement();
    return containerElement.find('.single-moment-center-content');
  }
  // 实例化评论列表外层 vue
  initCommentApp() {
    if(!this.commentApp) {
      const commentContainerElement = this.getCommentContainerElement();
      this.commentApp = new Vue({
        el: commentContainerElement[0],
        components: {
          'moment-comments': MomentComments
        },
        data: {
          momentId: this.momentId,
          hidden: true,
          postType: null,
          postTypes: {
            report: 'repost',
            comment: 'comment'
          }
        },
        methods: {
          show() {
            this.hidden = false;
          },
          hide() {
            this.hidden = true;
          },
          repostToggle() {
            if(this.hidden) {
              this.hidden = false;
            } else if(this.postType === 'repost') {
              this.hidden = true;
            }
            this.setAsRepost();
          },
          commentToggle() {
            if(this.hidden) {
              this.hidden = false;
            } else if(this.postType === 'comment') {
              this.hidden = true;
            }
            this.setAsComment();
          },
          setAsRepost() {
            this.postType = this.postTypes.report;
          },
          setAsComment() {
            this.postType = this.postTypes.comment;
            if(!this.hidden) {
              const self = this;
              setTimeout(() => {
                self.$refs.momentComments.init();
              }, 100);
            }

          }
        }
      })
    }
  }
  // 打开评论列表
  openCommentContainer() {
    this.initCommentApp();
    this.commentApp.commentToggle();
  }
  // 打开转发面板
  openReportContainer() {
    this.initCommentApp();
    this.commentApp.repostToggle();
  }
  // 点赞
  voteUp() {
    const self = this;
    const voteContainer = this.getVoteContainerElement();
    const voteType = voteContainer.attr('data-vote-type');
    const cancel = voteType === 'up';
    momentVote(this.momentId, 'up', cancel)
      .then(res => {
        const {voteUp} = res;
        self.modifyVoteDom(voteUp, cancel? '': 'up');
      })
      .catch(sweetError);
  }
  /*
  * 更改点赞数
  * @param {Number} number
  * @param {String} voteType 当前点赞类型 up(已点赞) 空字符串(未点赞)
  * */
  modifyVoteDom(number, voteType) {
    const voteElement = this.getVoteElement();
    const voteContainerElement = this.getVoteContainerElement();
    voteElement.text(number);
    voteContainerElement.attr('data-vote-type', voteType);
    const className = 'hidden';
    if(number === 0) {
      if(!voteElement.hasClass(className)) {
        voteElement.addClass(className);
      }
    } else {
      voteElement.removeClass(className);
    }
  }
}

// 获取所有动态列表父级容器
function getMomentsContainerElements() {
  return $('.moments-container');
}

// 给所有动态列表父级容器添加点击事件，事件委托
function momentsContainerInitEvent() {
  const momentsContainerElements = getMomentsContainerElements();
  for(let i = 0; i < momentsContainerElements.length; i++) {
    momentsContainerElementInitEvent(momentsContainerElements.eq(i));
  }
}

/*
* 给单个动态容器添加点击事件
* @param {Element} momentContainerElement 单个动态容器
* */
function momentsContainerElementInitEvent(momentContainerElement) {
  const element = momentContainerElement[0];
  element.addEventListener('click', (e) => {
    const target = $(e.target);
    // 获取事件名称，对应 momentInstance 中的函数
    let eventName = target.attr('data-event-name');
    // 当前动态ID
    let momentId = target.attr('data-moment-id');
    if(!eventName || !momentId) {
      const parent = target.parent().eq(0);
      eventName = parent.attr('data-event-name');
      momentId = parent.attr('data-moment-id');
      if(!eventName || !momentId) return;
    }
    const momentInstance = getMomentInstanceByMomentId(momentId);
    momentInstance[eventName]();
  });
}

/*
* 获取指定动态的实例，不存在则创建
* @param {String} momentId 动态ID
* @return {Moment}
* */
function getMomentInstanceByMomentId(momentId) {
  if(!momentsInstance[momentId]) {
    momentsInstance[momentId] = new Moment({momentId})
  }
  return momentsInstance[momentId];
}

$(() => {
  momentsContainerInitEvent();

  // 调试
  $('.moments-container .single-moment-bottom-left').eq(0).click();
});