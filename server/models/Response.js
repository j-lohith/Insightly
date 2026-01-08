import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  answer: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  }
});

const responseSchema = new mongoose.Schema({
  surveyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Survey',
    required: true,
    index: true
  },
  submittedBy: {
    type: String,
    default: 'anonymous'
  },
  answers: [answerSchema],
  ipAddress: {
    type: String
  }
}, {
  timestamps: true
});

responseSchema.index({ surveyId: 1, submittedBy: 1, ipAddress: 1 });

export default mongoose.model('Response', responseSchema);
