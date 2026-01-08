import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['multiple_choice', 'short_answer'],
    required: true
  },
  question: {
    type: String,
    required: true,
    trim: true
  },
  options: [{
    type: String,
    trim: true
  }]
}, { _id: true });

const surveySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  questions: [questionSchema],
  isPublished: {
    type: Boolean,
    default: false
  },
  shareLink: {
    type: String,
    unique: true,
    sparse: true
  },
  responseCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

surveySchema.index({ shareLink: 1 });

export default mongoose.model('Survey', surveySchema);
