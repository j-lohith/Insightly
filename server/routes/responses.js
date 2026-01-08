import express from 'express';
import { body, validationResult } from 'express-validator';
import Response from '../models/Response.js';
import Survey from '../models/Survey.js';
import { getIO } from '../socket.js';

const router = express.Router();

router.post('/', [
  body('surveyId').notEmpty().withMessage('Survey ID is required'),
  body('answers').isArray().withMessage('Answers must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { surveyId, answers, submittedBy } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;

    const survey = await Survey.findById(surveyId);
    if (!survey || !survey.isPublished) {
      return res.status(404).json({ message: 'Survey not found or not published' });
    }

    const existingResponse = await Response.findOne({
      surveyId,
      $or: [
        { submittedBy: submittedBy || 'anonymous' },
        { ipAddress }
      ]
    });

    if (existingResponse) {
      return res.status(400).json({ message: 'You have already submitted this survey' });
    }

    const response = new Response({
      surveyId,
      answers,
      submittedBy: submittedBy || 'anonymous',
      ipAddress
    });

    await response.save();

    survey.responseCount += 1;
    await survey.save();

    const io = getIO();
    if (io) {
      io.to(`survey-${surveyId}`).emit('new-response', {
        surveyId,
        responseCount: survey.responseCount
      });
    }

    res.status(201).json({ message: 'Response submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit response' });
  }
});

export default router;
