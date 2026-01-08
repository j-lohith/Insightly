import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateSurvey from './pages/CreateSurvey';
import EditSurvey from './pages/EditSurvey';
import SurveyAnalytics from './pages/SurveyAnalytics';
import SurveyFill from './pages/SurveyFill';
import ToastContainer from './components/ToastContainer';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/survey/:link" element={<SurveyFill />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/create"
              element={
                <PrivateRoute>
                  <CreateSurvey />
                </PrivateRoute>
              }
            />
            <Route
              path="/edit/:id"
              element={
                <PrivateRoute>
                  <EditSurvey />
                </PrivateRoute>
              }
            />
            <Route
              path="/analytics/:id"
              element={
                <PrivateRoute>
                  <SurveyAnalytics />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
          <ToastContainer />
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
