import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';
import { io } from 'socket.io-client';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { motion } from 'framer-motion';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SurveyAnalytics = () => {
  const { id } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const fetchAnalytics = useCallback(async () => {
    try {
      const response = await api.get(`/surveys/${id}/analytics`);
      setAnalytics(response.data);
    } catch (error) {
      showToast('Failed to load analytics', 'error');
    } finally {
      setLoading(false);
    }
  }, [id, showToast]);

  useEffect(() => {
    fetchAnalytics();

    const socket = io('http://localhost:5000');
    socket.emit('join-survey', id);

    socket.on('new-response', (data) => {
      if (data.surveyId === id) {
        fetchAnalytics();
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [id, fetchAnalytics]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back
            </button>
            <h1 className="text-xl font-bold">Survey Analytics</h1>
            <div></div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-bold mb-2">Total Responses</h2>
          <p className="text-4xl font-bold text-blue-600">{analytics.totalResponses}</p>
        </div>

        {analytics.questions.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500">No questions in this survey</p>
          </div>
        ) : (
          <div className="space-y-8">
            {analytics.questions.map((question, index) => (
              <motion.div
                key={question.questionId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow p-6"
              >
                <h3 className="text-xl font-semibold mb-4">
                  {index + 1}. {question.question}
                </h3>

                {question.type === 'multiple_choice' ? (
                  <div className="mt-6">
                    <Bar
                      data={{
                        labels: question.data.labels,
                        datasets: [
                          {
                            label: 'Responses',
                            data: question.data.values,
                            backgroundColor: 'rgba(59, 130, 246, 0.5)',
                            borderColor: 'rgba(59, 130, 246, 1)',
                            borderWidth: 1,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            display: false,
                          },
                          title: {
                            display: false,
                          },
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            ticks: {
                              stepSize: 1,
                            },
                          },
                        },
                      }}
                    />
                  </div>
                ) : (
                  <div className="space-y-3 mt-4">
                    {question.data.answers.length === 0 ? (
                      <p className="text-gray-500 italic">No responses yet</p>
                    ) : (
                      question.data.answers.map((answer, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <p className="text-gray-800">{String(answer)}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SurveyAnalytics;
