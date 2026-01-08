import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    try {
      const response = await api.get('/surveys');
      setSurveys(response.data);
    } catch (error) {
      showToast('Failed to load surveys', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this survey?')) return;

    try {
      await api.delete(`/surveys/${id}`);
      showToast('Survey deleted', 'success');
      fetchSurveys();
    } catch (error) {
      showToast('Failed to delete survey', 'error');
    }
  };

  const handlePublish = async (id) => {
    try {
      await api.patch(`/surveys/${id}/publish`);
      showToast('Survey published', 'success');
      fetchSurveys();
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to publish', 'error');
    }
  };

  const handleUnpublish = async (id) => {
    try {
      await api.patch(`/surveys/${id}/unpublish`);
      showToast('Survey unpublished', 'success');
      fetchSurveys();
    } catch (error) {
      showToast('Failed to unpublish', 'error');
    }
  };

  const copyShareLink = (link) => {
    const url = `${window.location.origin}/survey/${link}`;
    navigator.clipboard.writeText(url);
    showToast('Link copied to clipboard', 'success');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold">Insightly</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{user?.name}</span>
              <button
                onClick={logout}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">My Surveys</h2>
          <button
            onClick={() => navigate('/create')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Survey
          </button>
        </div>

        {surveys.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 mb-4">No surveys yet</p>
            <button
              onClick={() => navigate('/create')}
              className="text-blue-600 hover:underline"
            >
              Create your first survey
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {surveys.map((survey) => (
              <motion.div
                key={survey._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow p-6"
              >
                <h3 className="text-lg font-semibold mb-2">{survey.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {survey.description || 'No description'}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      survey.isPublished
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {survey.isPublished ? 'Published' : 'Draft'}
                  </span>
                  <span className="text-sm text-gray-600">
                    {survey.responseCount} responses
                  </span>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => navigate(`/edit/${survey._id}`)}
                    className="w-full text-left text-sm text-blue-600 hover:underline py-1"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => navigate(`/analytics/${survey._id}`)}
                    className="w-full text-left text-sm text-blue-600 hover:underline py-1"
                  >
                    Analytics
                  </button>
                  {survey.isPublished && survey.shareLink && (
                    <button
                      onClick={() => copyShareLink(survey.shareLink)}
                      className="w-full text-left text-sm text-green-600 hover:underline py-1"
                    >
                      Copy Share Link
                    </button>
                  )}
                  {survey.isPublished ? (
                    <button
                      onClick={() => handleUnpublish(survey._id)}
                      className="w-full text-left text-sm text-orange-600 hover:underline py-1"
                    >
                      Unpublish
                    </button>
                  ) : (
                    <button
                      onClick={() => handlePublish(survey._id)}
                      className="w-full text-left text-sm text-green-600 hover:underline py-1"
                    >
                      Publish
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(survey._id)}
                    className="w-full text-left text-sm text-red-600 hover:underline py-1"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
