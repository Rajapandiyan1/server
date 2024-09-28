const mongoose = require('mongoose');
const { Schema } = mongoose;
// let QandA=new Schema({
//   type:Array,
//   require:[true,'Questions answer is Required']
// })
let QandASchema=new Schema({
  question: {
    type: String,
    required: [true, 'Question is required'],
    minlength: [1, 'Question must be at least 5 characters long'],
    maxlength: [500, 'Question cannot exceed 500 characters'],
  },
  answer: {
    type: String,
    required: [true, 'Answer is required'],
    minlength: [1, 'Answer must be at least 5 characters long'],
    maxlength: [2000, 'Answer cannot exceed 1000 characters'],
  }
})
const TopicSchema = new Schema({
  topics: {
    type: String,
    required: [true, 'Topic is required'],
    trim: true,
    minlength: [1, 'Topic must be at least 3 characters long'],
    maxlength: [100, 'Topic cannot exceed 100 characters'],
  },
  QandA:{
    type:[QandASchema],
    required:[true,'QandA is required'],
  }
});

const TopicModel = mongoose.model('topic', TopicSchema);

module.exports = TopicModel;