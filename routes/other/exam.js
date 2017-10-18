const Router = require('koa-router');
const cookieSignature = require('cookie-signature');
const nkcModules = require('../../nkcModules');
const crypto = require('crypto');
const settings = require('../../settings');
const examRouter = new Router();
examRouter
  //选择考试科目页面
  .get('/subject', async (ctx, next) => {
    ctx.data.getcode = true;
    ctx.template = 'interface_user_register.pug';
    next();
  })
  //答题界面
  .get('/subject/:category', async (ctx, next) => {
    const category = ctx.params.category;
    let numberOfSubject = settings.exam.numberOfSubject;
    let numberOfCommon = settings.exam.numberOfCommon;
    if(category === 'mix') {
      numberOfSubject = settings.exam.numberOfSubjectA;
      numberOfCommon = settings.exam.numberOfCommonA;
    }
    let commonCount = await ctx.db.QuestionModel.count({category: 'common'});
    let subjectCount = await ctx.db.QuestionModel.count({category: category});
    if(subjectCount === 0) {
      throw `科目 “${category}” 不存在，请选择正确的考试科目。`;
    }
    let questions = [];

    // 生成指定元素数量的数组，且数组元素不重复
    let arrOfDifferentValue = (arrValueCount, max) => {
      // 题库中该科目的总数必须满足大于需要的题目数量,否则会陷入死循环
      if(arrValueCount > max) {
        throw `该科目下题的数量太少了，无法构成一张试卷，请更换考试科目。`;
        //arrValueCount = max;
      }
      let skipArr = [];
      let random = (num) => {
        return Math.round(Math.random()*(num-1));
      };
      for (let i = 0; i < arrValueCount; i++) {
        let repeat = true;
        while(repeat){
          let num = random(max);
          let equal = false;
          if(skipArr.indexOf(num) < 0) {
            repeat = false;
            skipArr.push(num);
          }
        }
      }
      return skipArr;
    };

    //数组元素位置随机交换
    let exchangeIndex = (arr) => {
      let arrCount = arr.length;
      let arrCopy = [];
      let arrIndex = arrOfDifferentValue(arrCount, arrCount);
      for(let j = 0; j < arrIndex.length; j++) {
        arrCopy[j] = arr[arrIndex[j]];
      }
      return arrCopy;
    };

    //判断答案类型
    let exchangeAnswer = (question) => {
      let outQustion = {
        question: question.question,
        type: question.type,
        qid: question.qid,
      };
      switch(question.type) {
        case 'ch4':
        //交换答案顺序
        outQustion.choices = exchangeIndex(question.answer);
        break;
        default:break;
      }
      return outQustion;
    };
    let skipArrOfCommon = arrOfDifferentValue(numberOfCommon, commonCount);
    let skipArrOfSubject = arrOfDifferentValue(numberOfSubject, subjectCount);
    for (let i = 0; i < skipArrOfCommon.length; i++) {
      let question = await ctx.db.QuestionModel.findOne({category: 'common'}).skip(skipArrOfCommon[i]);
      questions.push(exchangeAnswer(question));
    }
    for (let i = 0; i < skipArrOfSubject.length; i++) {
      let question = await ctx.db.QuestionModel.findOne({category: category}).skip(skipArrOfSubject[i]);
      questions.push(exchangeAnswer(question));
    }
    //交换题目顺序
    questions = exchangeIndex(questions);
    let exam = {};
    exam.toc = Date.now();
    exam.qarr = questions;
    let signature = '';
    for (let i = 0; i < questions.length; i++) {
      signature += questions[i].qid;
    }
    signature += exam.toc.toString();
    signature = cookieSignature.sign(signature,settings.cookie.secret);
    exam.signature = signature;
    ctx.data.exam = exam;
    ctx.data.category = category;
    ctx.template = 'interface_exam.pug';
    next();
  })
  //获得激活码
  .post('/subject', async (ctx, next) => {
    let ip = ctx.ip;
    let params = ctx.body;
    console.log(params);
    let exam = params.exam;
    if(!exam) {
      throw '小明！你的试卷呢？';
    }
    let signature = '';
    for (let i = 0; i < exam.qarr.length; i++) {
      signature += exam.qarr[i].qid;
    }
    signature += exam.toc.toString();
    let unsignedSignature = cookieSignature.unsign(exam.signature, settings.cookie.secret);
    if(unsignedSignature === false) {
      throw('signature invalid. consider re-attend the exam.');
    }
    if(unsignedSignature !== signature) {
      //sb's spoofing!!
      throw('signature problematic');
    }
    if(Date.now() - exam.toc > settings.exam.timeLimit) {
      throw 'overtime. please refresh';
    }
    let sheet = params.sheet;
    if(!sheet) {
      throw '小明，你怎么能交白卷！';
    }
    if(sheet.length !== exam.qarr.length) {
      throw '小明，看清楚你有多少道题再作答好吗？';
    }
    let qidList = [];
    for (let i = 0; i < exam.qarr.length; i++) {
      qidList.push({
        qid: exam.qarr[i].qid
      });
      console.log(exam.qarr[i].qid);
    }
    let questionsOfDBRandom = await ctx.db.QuestionModel.find({}).or(qidList);
    let questionsOfDB = [];
    for (let i = 0 ; i < questionsOfDBRandom.length; i++) {
      for (let j = 0; j < questionsOfDBRandom.length; j++) {
        if(questionsOfDBRandom[j].qid === qidList[i].qid) {
          questionsOfDB[i] = questionsOfDBRandom[j];
          break;
        }
      }
    }
    let score = 0;
    let isA = true;
    let records = [];
    for (let i = 0; i < questionsOfDB.length; i++) {
      let correctness = false;
      if(isA && questionsOfDB[i].category !== 'mix') {
        isA = false;
      }
      if(sheet[i] === null || sheet[i] === undefined) {
        correctness = false;
      }else{
        switch(questionsOfDB[i].type) {
          case 'ch4':
          correctness = (exam.qarr[i].choices[sheet[i]] === questionsOfDB[i].answer[0]);
          break;
          case 'ans':
          correctness = (sheet[i] === questionsOfDB[i].answer);
          break;
          default: break
        }
      }
      records.push({
        qid:qidList[i],
        correct: correctness
      });
      score += correctness? 1:0;
    }
    if(score < settings.exam.passScore) {
      throw '测试没有通过哦，别气馁，请继续努力！';
    }
    let ipLog = await ctx.db.AnswerSheetModel.find({ip: ip}).sort({toc: 1});
    if(ipLog.length > 0) {
      if(!ipLog[0].isA){
        if(Date.now() - ipLog[0].tsm < settings.exam.succeedInterval) {
          throw '您之前测试通过的次数有点多哦，不应该再进行测试了！';
        }
      }
    }
    let regCode = async () => {
      try{
        let buffer = await crypto.randomBytes(16);
        return buffer.toString('hex');
      }catch(err){
        throw `生成注册码失败。`;
      }
    };
    let key = regCode();
    let answerSheet = {
      uid: ctx.data.user?ctx.data.user.uid:null,
      records:records,
      ip: ip,
      score: score,
      toc: exam.toc,
      category: params.category,
      tsm: Date.now(),
      key: key,
      isA: isA
    };
    let saveData = async (answerSheet, user) => {
      try{
        if(user){
          await nkcModules.function.addCertToUser(user.uid, 'examinated');
        }
        await ctx.db.AnswerSheetModel.save(answerSheet);
      }catch(err) {
        throw `生成注册码出错， error: ${err}`;
      }
    };
    saveData(answerSheet, ctx.data.user);
    ctx.data.result = key;
    next();
  })
  // 获取激活码 成功/失败 页面
  .get('/', async (ctx, next) => {
    ctx.data.result = ctx.query.result;
    ctx.template = 'interface_exam.pug';
    next();
  })
  .get('/viewQuestion', async (ctx, next) => {
    ctx.data = '添加试题页面';
    next();
  })
  .post('/viewQuestion', async (ctx, next) => {
    ctx.data = '提交添加的试题';
    next();
  })
  .del('/viewQuestion', async (ctx, next) =>{
    ctx.data = '删除某题';
    next();
  })
  .put('/viewQuestion', async (ctx, next) => {
    ctx.data = '修改某题';
    next();
  });
module.exports = examRouter;