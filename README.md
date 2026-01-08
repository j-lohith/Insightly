# Insightly - Survey & Feedback Application

Insightly is a comprehensive, production-ready survey and feedback collection platform built with the MERN stack. It enables users to create, manage, and analyze surveys with real-time response tracking and detailed analytics.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Usage](#usage)
- [ScreenShots](#screenshots)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Authentication](#authentication)
- [Real-time Features](#real-time-features)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Overview

Insightly provides a complete solution for creating surveys, collecting feedback, and analyzing responses. The application features a modern, responsive user interface, real-time updates, and comprehensive analytics powered by Chart.js. All data is stored locally using MongoDB Compass, ensuring complete privacy and control.

## Features

### Authentication
- User registration and login
- JWT-based authentication
- Protected routes
- Secure password hashing with bcrypt
- Session persistence

### Survey Management
- Create surveys with custom titles and descriptions
- Add multiple question types:
  - Multiple choice questions
  - Short answer/text questions
- Dynamic option management for multiple choice questions
- Edit surveys before publishing
- Delete surveys
- Publish/unpublish surveys
- Unique shareable links for each published survey

### Feedback Collection
- Fill surveys via shareable links
- One response per user per survey (IP-based tracking)
- Form validation before submission
- Smooth submission animations
- Anonymous or identified responses

### Dashboard
- Overview of all surveys
- Response count per survey
- Survey status (Published/Draft)
- Quick actions (Edit, Analytics, Publish/Unpublish, Delete)
- Copy share link functionality

### Analytics
- Total response count per survey
- Per-question breakdown
- Bar charts for multiple choice questions
- Aggregated text responses view
- Real-time updates via Socket.io

### Real-time Features
- Live response count updates
- Live chart updates without page refresh
- Socket.io integration for instant updates

### User Experience
- Clean, modern, professional UI
- Mobile-first responsive design
- Smooth animations with Framer Motion
- Loading states
- Empty states
- Error handling
- Toast notifications
- Form validations

## Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Routing
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Chart.js** - Data visualization
- **Axios** - HTTP client
- **Socket.io Client** - Real-time communication

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (local via Compass)
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Socket.io** - Real-time communication
- **express-validator** - Input validation

## Project Structure

```
insightly/
├── client/                 # Frontend React application
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   │   ├── PrivateRoute.jsx
│   │   │   └── ToastContainer.jsx
│   │   ├── context/       # React contexts
│   │   │   ├── AuthContext.jsx
│   │   │   └── ToastContext.jsx
│   │   ├── pages/         # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── CreateSurvey.jsx
│   │   │   ├── EditSurvey.jsx
│   │   │   ├── SurveyFill.jsx
│   │   │   └── SurveyAnalytics.jsx
│   │   ├── utils/         # Utility functions
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── server/                # Backend Node.js application
│   ├── models/           # MongoDB models
│   │   ├── User.js
│   │   ├── Survey.js
│   │   └── Response.js
│   ├── routes/           # API routes
│   │   ├── auth.js
│   │   ├── surveys.js
│   │   └── responses.js
│   ├── middleware/       # Express middleware
│   │   └── auth.js
│   ├── socket.js         # Socket.io configuration
│   ├── server.js         # Entry point
│   ├── package.json
│   └── .env              # Environment variables
├── .gitignore
├── package.json
└── README.md
```

## Prerequisites

Before running the application, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB** (local installation) - [Download](https://www.mongodb.com/try/download/community)
- **MongoDB Compass** - [Download](https://www.mongodb.com/products/compass)

## Installation

1. **Clone the repository** (or extract the project folder)

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **Install server dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Install client dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

## Configuration

1. **MongoDB Setup**
   - Install MongoDB locally if not already installed
   - Start MongoDB service (usually starts automatically on installation)
   - Verify MongoDB is running on `mongodb://localhost:27017`

2. **Server Environment Variables**
   - Navigate to `server/` directory
   - Create a `.env` file if it doesn't exist
   - Configure the following variables:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/insightly
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   NODE_ENV=development
   ```

## Running the Application

### Option 1: Run Both Server and Client Separately

1. **Start the server**
   ```bash
   cd server
   npm start
   ```
   The server will run on `http://localhost:5000`

2. **Start the client** (in a new terminal)
   ```bash
   cd client
   npm run dev
   ```
   The client will run on `http://localhost:5173`

### Option 2: Run Both Together (Recommended)

From the root directory:
```bash
npm run dev
```

This will start both server and client concurrently.

## Usage

### Getting Started

1. **Register an Account**
   - Navigate to `http://localhost:5173/register`
   - Fill in name, email, and password (minimum 6 characters)
   - Click "Sign up"

2. **Login**
   - Navigate to `http://localhost:5173/login`
   - Enter your credentials
   - Click "Sign in"

### Creating a Survey

1. From the Dashboard, click "Create Survey"
2. Enter a title (required) and description (optional)
3. Add questions:
   - Click "+ Multiple Choice" for multiple choice questions
   - Click "+ Short Answer" for text questions
4. For multiple choice questions:
   - Enter the question text
   - Add at least 2 options
   - Add more options using "+ Add Option"
   - Remove options by clicking "×"
5. Click "Create Survey" to save

### Publishing a Survey

1. From the Dashboard, find your survey
2. Click "Publish" (only available for surveys with questions)
3. Once published, click "Copy Share Link"
4. Share the link with respondents

### Filling a Survey

1. Open the shareable link
2. Answer all questions
3. Click "Submit Survey"
4. See confirmation message

### Viewing Analytics

1. From the Dashboard, click "Analytics" on any survey
2. View:
   - Total response count
   - Bar charts for multiple choice questions
   - Text responses for short answer questions
3. Analytics update in real-time as new responses come in

### Managing Surveys

- **Edit**: Click "Edit" to modify survey before publishing
- **Unpublish**: Click "Unpublish" to stop accepting responses
- **Delete**: Click "Delete" to permanently remove a survey (requires confirmation)


### Screenshots

1. Login Page:
(./screenshots/login.png)
2. Register Page:
(./screenshots/register.png)
3. Dashboard:
(./screenshots/dashboard.png)
4. Create Survey:
(./screenshots/createSurvey.png)
5. Survey Form:
(./screenshots/surveyForm.png)
6. Analytics:
(./screenshots/analytics.png)



## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
  - Body: `{ name, email, password }`
  - Returns: `{ token, user }`

- `POST /api/auth/login` - Login user
  - Body: `{ email, password }`
  - Returns: `{ token, user }`

- `GET /api/auth/me` - Get current user (protected)
  - Headers: `Authorization: Bearer <token>`
  - Returns: `{ user }`

### Surveys

- `GET /api/surveys` - Get all user's surveys (protected)
  - Returns: `[survey1, survey2, ...]`

- `GET /api/surveys/:id` - Get single survey (protected)
  - Returns: `{ survey }`

- `POST /api/surveys` - Create survey (protected)
  - Body: `{ title, description, questions }`
  - Returns: `{ survey }`

- `PUT /api/surveys/:id` - Update survey (protected)
  - Body: `{ title, description, questions }`
  - Returns: `{ survey }`

- `DELETE /api/surveys/:id` - Delete survey (protected)
  - Returns: `{ message }`

- `PATCH /api/surveys/:id/publish` - Publish survey (protected)
  - Returns: `{ survey }`

- `PATCH /api/surveys/:id/unpublish` - Unpublish survey (protected)
  - Returns: `{ survey }`

- `GET /api/surveys/share/:link` - Get survey by share link (public)
  - Returns: `{ survey }`

- `GET /api/surveys/:id/analytics` - Get survey analytics (protected)
  - Returns: `{ totalResponses, questions: [...] }`

### Responses

- `POST /api/responses` - Submit survey response (public)
  - Body: `{ surveyId, answers, submittedBy }`
  - Returns: `{ message }`

## Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Survey Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  createdBy: ObjectId (ref: User),
  questions: [{
    _id: ObjectId,
    type: String (enum: ['multiple_choice', 'short_answer']),
    question: String,
    options: [String] (only for multiple_choice)
  }],
  isPublished: Boolean,
  shareLink: String (unique, generated),
  responseCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Response Collection
```javascript
{
  _id: ObjectId,
  surveyId: ObjectId (ref: Survey),
  submittedBy: String,
  answers: [{
    questionId: ObjectId,
    answer: Mixed
  }],
  ipAddress: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. User registers/logs in
2. Server returns a JWT token
3. Token is stored in localStorage
4. Token is sent in `Authorization` header for protected routes
5. Server validates token on each request
6. Token expires after 30 days

Protected routes require:
```
Authorization: Bearer <token>
```

## Real-time Features

Socket.io is used for real-time updates:

1. When a survey is published, clients can join the survey room
2. When a new response is submitted, server emits `new-response` event
3. Analytics page automatically refreshes data
4. Response counts update without page refresh

Socket events:
- `join-survey`: Join a survey room (client → server)
- `new-response`: New response received (server → client)

## Deployment

### Local Deployment

The application is configured to run locally:
- MongoDB runs on `localhost:27017`
- Server runs on `localhost:5000`
- Client runs on `localhost:5173`

### Production Deployment Considerations

1. **Environment Variables**: Change `JWT_SECRET` to a strong, random value
2. **MongoDB**: Use MongoDB Atlas or a production MongoDB instance
3. **CORS**: Update CORS settings in `server.js` for production domain
4. **Build**: Run `npm run build` in client directory for production build
5. **Static Files**: Serve client build files from server or use a CDN
6. **HTTPS**: Use HTTPS in production
7. **Error Logging**: Implement proper error logging and monitoring
8. **Rate Limiting**: Add rate limiting for API endpoints

## Troubleshooting

### MongoDB Connection Issues

**Problem**: Server fails to connect to MongoDB
- **Solution**: Ensure MongoDB service is running
- Check MongoDB is installed and running: `mongod --version`
- Verify connection string in `.env` file
- Check MongoDB Compass can connect

### Port Already in Use

**Problem**: Port 5000 or 5173 is already in use
- **Solution**: Change PORT in server `.env` file
- For client, modify `vite.config.js` port setting
- Or stop the process using the port

### CORS Errors

**Problem**: CORS errors in browser console
- **Solution**: Verify CORS settings in `server.js`
- Ensure client URL matches in server configuration
- Check proxy settings in `vite.config.js`

### JWT Token Issues

**Problem**: "Invalid token" or "Not authorized" errors
- **Solution**: Clear localStorage and login again
- Check JWT_SECRET is set in server `.env`
- Verify token hasn't expired (30 days)

### Socket.io Connection Failed

**Problem**: Real-time updates not working
- **Solution**: Verify server is running
- Check Socket.io URL in `SurveyAnalytics.jsx`
- Ensure CORS allows Socket.io connections

### Build Errors

**Problem**: npm install fails
- **Solution**: Clear node_modules and package-lock.json
- Run `npm cache clean --force`
- Reinstall dependencies
- Ensure Node.js version is compatible

## Contributing

This is a project submission. If you wish to contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is created for internship submission purposes. All rights reserved.

## Support

For issues or questions:
1. Check the Troubleshooting section
2. Review the documentation
3. Check MongoDB and Node.js versions
4. Verify all environment variables are set correctly

## Version History

- **v1.0.0** - Initial release
  - Complete MERN stack implementation
  - Authentication system
  - Survey CRUD operations
  - Feedback collection
  - Analytics with charts
  - Real-time updates
  - Responsive UI

---

**Built with ❤️ for Insightly Survey & Feedback Platform and Build by J Lohith**
