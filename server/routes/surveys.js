import express from 'express';
import { body, validationResult } from 'express-validator';
import Survey from '../models/Survey.js';
import Response from '../models/Response.js';
import { protect } from '../middleware/auth.js';
import { randomBytes } from 'crypto';

const router = express.Router();

router.get('/share/:link', async (req, res) => {
  try {
    const survey = await Survey.findOne({ shareLink: req.params.link });

    if (!survey || !survey.isPublished) {
      return res.status(404).json({ message: 'Survey not found' });
    }

    res.json(survey);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch survey' });
  }
});

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const surveys = await Survey.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 })
      .select('-questions');
    
    res.json(surveys);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch surveys' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const survey = await Survey.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }

    res.json(survey);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch survey' });
  }
});

router.post('/', [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('questions').isArray().withMessage('Questions must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, questions } = req.body;

    const survey = new Survey({
      title,
      description: description || '',
      createdBy: req.user._id,
      questions: questions || []
    });

    await survey.save();

    res.status(201).json(survey);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create survey' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const survey = await Survey.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }

    if (survey.isPublished) {
      return res.status(400).json({ message: 'Cannot edit published survey' });
    }

    const { title, description, questions } = req.body;

    if (title) survey.title = title;
    if (description !== undefined) survey.description = description;
    if (questions) survey.questions = questions;

    await survey.save();

    res.json(survey);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update survey' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const survey = await Survey.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }

    await Response.deleteMany({ surveyId: survey._id });
    await Survey.deleteOne({ _id: survey._id });

    res.json({ message: 'Survey deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete survey' });
  }
});

router.patch('/:id/publish', async (req, res) => {
  try {
    const survey = await Survey.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }

    if (survey.questions.length === 0) {
      return res.status(400).json({ message: 'Cannot publish survey without questions' });
    }

    survey.isPublished = true;
    if (!survey.shareLink) {
      survey.shareLink = randomBytes(16).toString('hex');
    }

    await survey.save();

    res.json(survey);
  } catch (error) {
    res.status(500).json({ message: 'Failed to publish survey' });
  }
});

router.patch('/:id/unpublish', async (req, res) => {
  try {
    const survey = await Survey.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }

    survey.isPublished = false;
    await survey.save();

    res.json(survey);
  } catch (error) {
    res.status(500).json({ message: 'Failed to unpublish survey' });
  }
});

router.get('/:id/analytics', async (req, res) => {
  try {
    const survey = await Survey.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }

    const responses = await Response.find({ surveyId: survey._id });

    const analytics = {
      totalResponses: responses.length,
      questions: survey.questions.map((question, idx) => {
        if (question.type === 'multiple_choice') {
          const counts = {};
          question.options.forEach(opt => {
            counts[opt] = 0;
          });

          responses.forEach(response => {
            const answer = response.answers.find(a => 
              a.questionId.toString() === question._id.toString()
            );
            if (answer && answer.answer) {
              counts[answer.answer] = (counts[answer.answer] || 0) + 1;
            }
          });

          return {
            questionId: question._id,
            question: question.question,
            type: question.type,
            data: {
              labels: question.options,
              values: question.options.map(opt => counts[opt] || 0)
            }
          };
        } else {
          const textAnswers = [];
          responses.forEach(response => {
            const answer = response.answers.find(a => 
              a.questionId.toString() === question._id.toString()
            );
            if (answer && answer.answer) {
              textAnswers.push(answer.answer);
            }
          });

          return {
            questionId: question._id,
            question: question.question,
            type: question.type,
            data: {
              answers: textAnswers
            }
          };
        }
      })
    };

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
});

export default router;
