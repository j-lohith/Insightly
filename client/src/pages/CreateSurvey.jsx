import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';

const CreateSurvey = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const addQuestion = (type) => {
    const newQuestion = {
      type,
      question: '',
      options: type === 'multiple_choice' ? ['', ''] : []
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const addOption = (questionIndex) => {
    const updated = [...questions];
    updated[questionIndex].options.push('');
    setQuestions(updated);
  };

  const removeOption = (questionIndex, optionIndex) => {
    const updated = [...questions];
    updated[questionIndex].options.splice(optionIndex, 1);
    setQuestions(updated);
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    const updated = [...questions];
    updated[questionIndex].options[optionIndex] = value;
    setQuestions(updated);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const validQuestions = questions.filter(q => q.question.trim() !== '');
    const hasValidMCQ = validQuestions.every(q => {
      if (q.type === 'multiple_choice') {
        return q.options.filter(opt => opt.trim() !== '').length >= 2;
      }
      return true;
    });

    if (!hasValidMCQ) {
      showToast('Multiple choice questions need at least 2 options', 'error');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/surveys', {
        title,
        description,
        questions: validQuestions.map(q => ({
          type: q.type,
          question: q.question,
          options: q.type === 'multiple_choice' ? q.options.filter(opt => opt.trim() !== '') : []
        }))
      });
      showToast('Survey created', 'success');
      navigate(`/edit/${response.data._id}`);
    } catch (error) {
      showToast('Failed to create survey', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back
            </button>
            <h1 className="text-xl font-bold">Create Survey</h1>
            <div></div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Survey title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Survey description"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Questions
              </label>
              <div className="space-x-2">
                <button
                  type="button"
                  onClick={() => addQuestion('multiple_choice')}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  + Multiple Choice
                </button>
                <button
                  type="button"
                  onClick={() => addQuestion('short_answer')}
                  className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                >
                  + Short Answer
                </button>
              </div>
            </div>

            {questions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No questions yet. Add one above.</p>
            ) : (
              <div className="space-y-6">
                {questions.map((q, qIndex) => (
                  <div key={qIndex} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs text-gray-500">
                        Question {qIndex + 1} ({q.type === 'multiple_choice' ? 'MCQ' : 'Text'})
                      </span>
                      <button
                        type="button"
                        onClick={() => removeQuestion(qIndex)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>

                    <input
                      type="text"
                      value={q.question}
                      onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                      placeholder="Enter question"
                      className="w-full px-3 py-2 border border-gray-300 rounded mb-3 focus:ring-2 focus:ring-blue-500"
                    />

                    {q.type === 'multiple_choice' && (
                      <div className="space-y-2">
                        {q.options.map((option, oIndex) => (
                          <div key={oIndex} className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                              placeholder={`Option ${oIndex + 1}`}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                            />
                            {q.options.length > 2 && (
                              <button
                                type="button"
                                onClick={() => removeOption(qIndex, oIndex)}
                                className="text-red-600 hover:text-red-800"
                              >
                                ×
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addOption(qIndex)}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          + Add Option
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !title}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Survey'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSurvey;
