import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';
import { motion } from 'framer-motion';

const SurveyFill = () => {
  const { link } = useParams();
  const [survey, setSurvey] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSurvey();
  }, [link]);

  const fetchSurvey = async () => {
    try {
      const response = await api.get(`/surveys/share/${link}`);
      setSurvey(response.data);
      const initialAnswers = {};
      response.data.questions.forEach(q => {
        initialAnswers[q._id] = q.type === 'multiple_choice' ? '' : '';
      });
      setAnswers(initialAnswers);
    } catch (error) {
      showToast('Survey not found', 'error');
    } finally {
      setFetching(false);
    }
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const hasEmptyAnswers = survey.questions.some(q => {
      const answer = answers[q._id];
      return !answer || (typeof answer === 'string' && answer.trim() === '');
    });

    if (hasEmptyAnswers) {
      showToast('Please answer all questions', 'error');
      setLoading(false);
      return;
    }

    try {
      await api.post('/responses', {
        surveyId: survey._id,
        answers: Object.entries(answers).map(([questionId, answer]) => ({
          questionId,
          answer
        }))
      });
      setSubmitted(true);
      showToast('Thank you for your response!', 'success');
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to submit', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Survey not found</h1>
          <p className="text-gray-600">This survey may have been deleted or unpublished.</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center"
        >
          <div className="text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
          <p className="text-gray-600">Your response has been submitted successfully.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6 md:p-8"
        >
          <h1 className="text-2xl font-bold mb-2">{survey.title}</h1>
          {survey.description && (
            <p className="text-gray-600 mb-6">{survey.description}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {survey.questions.map((question, index) => (
              <div key={question._id} className="border-b border-gray-200 pb-6 last:border-0">
                <label className="block text-lg font-medium mb-3">
                  {index + 1}. {question.question}
                </label>

                {question.type === 'multiple_choice' ? (
                  <div className="space-y-2">
                    {question.options.map((option, optIndex) => (
                      <label
                        key={optIndex}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name={`question-${question._id}`}
                          value={option}
                          checked={answers[question._id] === option}
                          onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <textarea
                    value={answers[question._id] || ''}
                    onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Your answer..."
                  />
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Survey'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default SurveyFill;
