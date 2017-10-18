let mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/rescue', {useMongoClient: true});
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const userSchema = new Schema({
  kcb: {
    type: Number,
    default: 0
  },
  toc: {
    type: Date,
    required: true,
    default: Date.now
  },
  xsf: {
    type: Number,
    default: 0
  },
  tlv: {
    type: Number,
    default: Date.now,
    required: true
  },
  disabledPostCount: {
    type: Number,
    default: 0
  },
  disabledThreadCount: {
    type: Number,
    default: 0
  },
  postCount: {
    type: Number,
    default: 0
  },
  threadCount: {
    type: Number,
    default: 0
  },
  subs: {
    type: Number,
    default: 0
  },
  recCount: {
    type: Number,
    default: 0
  },
  toppedThreadCount: {
    type: Number,
    default: 0
  },
  digestThreadCount: {
    type: Number,
    default: 0,
  },
  score: {
    default: 0,
    type: Number
  },
  lastVisitSelf: {
    type: Date,
    default: Date.now
  },
  username: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 30,
    unique: true
  },
  usernameLowerCase: {
    type: String,
    unique: true
  },
  uid: {
    type: String,
    required: true,
    unique: true
  },
  bday: String,
  cart: [String],
  email: {
    type: String,
    match: /.*@.*/
  },
  description: String,
  color: String,
  certs: {
    type: [String],
    index: 1
  },
  intro_text: String,
  post_sign: String,
  regIP: String,
  regPort: String,
  subForums: [String]
});
userSchema.pre('save', function(next) {
  if(!this.usernameLowerCase)
    this.usernameLowerCase = this.username.toLowerCase();
  next()
});

let User = mongoose.model('users', userSchema);

User.find({}).limit(1)
.then(res => {
  console.log(res);
})
.catch(err => {
  console.log(err);
})